import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {BasePage} from "../base";
import {Utils} from "../../helpers/utils";
import {AuthProvider} from "../../providers/auth/auth";
import {Storage} from "@ionic/storage";
import {FirebaseManager} from "../../helpers/firebase-manager";
import {User} from "../../models/user";
import {MyApp} from "../../app/app.component";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BasePage {

  email = '';
  password = '';

  SIGNIN_EMAIL = 0;
  SIGNIN_FACEBOOK = 1;
  SIGNIN_GOOGLE = 2;

  signinMethod = this.SIGNIN_EMAIL;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private auth: AuthProvider,
    private api: ApiProvider
  ) {
    super(loadingCtrl);
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();

    console.log('ionViewDidLoad LoginPage');
  }

  onButGoogle(event) {
    
  }

  onButFb(event) {
    
  }

  onButSignup(event) {
    this.navCtrl.push('SignupPage');
  }

  signinForm() {
    this.signinMethod = this.SIGNIN_EMAIL;

    //
    // check input validity
    //
    if (!this.email) {
      let alert = this.alertCtrl.create({
        title: 'Email Invalid',
        message: 'Please enter your email',
        buttons: ['Ok']
      });
      alert.present();

      return;
    }

    if (!this.password) {
      let alert = this.alertCtrl.create({
        title: 'Password Invalid',
        message: 'Please enter your password',
        buttons: ['Ok']
      });
      alert.present();

      return;
    }

    if (!Utils.isEmailValid(this.email)) {
      let alert = this.alertCtrl.create({
        title: 'Email Invalid',
        message: 'Please enter valid email address',
        buttons: ['Ok']
      });
      alert.present();

      return;
    }

    this.showLoadingView();

    // log in
    this.auth.signIn(
      this.email,
      this.password
    ).then( (user) => {

      // fetch user info from db
      this.api.getUserWithId(user.uid)
        .then((u) => {
          if (u.type == User.USER_TYPE_ADMIN) {
            this.onError(new Error('Admin user cannot be used in the app'));
          }

          this.auth.user = u;
          this.auth.updateCurrentUser();

          // go to main page
          this.navCtrl.setRoot(LoginPage.getMainPage(this.auth.user));
          this.showLoadingView(false);
        })
        .catch((err) => {
          this.onError(err);
        });

    }).catch((err) => {
      console.log(err);

      this.onError(err);
    });
  }

  onError(err) {
    this.showLoadingView(false);

    // show error alert
    let alert = this.alertCtrl.create({
      title: 'Login Failed',
      message: err.message,
      buttons: ['Ok']
    });
    alert.present();
  }

  static getMainPage(user: User) {
    // not logged in
    if (!user) {
      return 'LoginPage';
    }

    if (user.inited) {
      return 'GalleryPage';
    }

    return 'AboutPage';
  }
}
