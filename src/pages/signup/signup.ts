import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Utils} from "../../helpers/utils";
import {BasePage} from "../base";
import {User} from "../../models/user";
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage extends BasePage {

  username = '';
  email = '';
  password = '';
  repassword = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private auth: AuthProvider
  ) {
    super(loadingCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signupForm() {
    //
    // check input validity
    //
    if (!this.username) {
      let alert = this.alertCtrl.create({
        title: 'Username Invalid',
        message: 'Please enter your username',
        buttons: ['Ok']
      });
      alert.present();

      return;
    }

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

    if (this.password !== this.repassword) {
      let alert = this.alertCtrl.create({
        title: 'Password Mismatch',
        message: 'Password should be equal to confirm password',
        buttons: ['Ok']
      });
      alert.present();

      return;
    }

    //
    // do signup
    //
    this.showLoadingView();

    this.auth.signUp(
      this.email,
      this.password
    ).then((u) => {

      this.showLoadingView(false);

      // set user
      let userNew = new User(u.uid);

      // save user info
      userNew.email = this.email;
      userNew.username = this.username;
      userNew.purchasedIds = [];
      userNew.saveToDatabase();

      this.auth.user = userNew;
      this.auth.updateCurrentUser();

      // go to main page
      this.navCtrl.setRoot('AboutPage');
    }).catch((err) => {
      console.log(err);

      this.showLoadingView(false);

      // show error alert
      let alert = this.alertCtrl.create({
        title: 'Signup Failed',
        message: err.message,
        buttons: ['Ok']
      });
      alert.present();
    });
  }
}
