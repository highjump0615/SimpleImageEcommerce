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
import {GooglePlus} from "@ionic-native/google-plus";
import {config} from "../../helpers/config";

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
    this.signinMethod = this.SIGNIN_GOOGLE;
    const that = this;

    this.showLoadingView();

    this.auth.googleSignin()
      .then((data) => {
        // fetch user
        this.fetchUserInfo(
          data['userInfo'],
          data['givenName'],
          data['familyName'],
          data['imageUrl']
        ).then((user) => {
          this.setUser(user);
        }).catch((err) => {
          this.onError(err);
        });
      })
      .catch((err) => {
        this.onError(err);
      });
  }

  onButFb(event) {
    this.signinMethod = this.SIGNIN_FACEBOOK;
    const that = this;

    this.showLoadingView();

    this.auth.facebookSignin()
      .then((data) => {
        // fetch user
        this.fetchUserInfo(
          data['userInfo'],
          data['givenName'],
          data['familyName'],
          data['imageUrl']
        ).then((user) => {
          this.setUser(user);
        }).catch((err) => {
          this.onError(err);
        });
      })
      .catch((err) => {
        this.onError(err);
      });
  }

  fetchUserInfo(
    userInfo: firebase.User,
    firstName: string,
    lastName: string,
    photoURL: string
  ): Promise<User> {
    return new Promise((resolve, reject) => {
      const userId = FirebaseManager.auth().currentUser.uid;
      if (!userId) {
        reject(new Error('Social signin failed'));
      }

      this.api.getUserWithId(userId)
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          if (err.name == 'notfound') {
            if (userInfo) {
              let newUser = new User(userId);

              newUser.email = userInfo.email;
              newUser.username = firstName + ' ' + lastName;
              newUser.photoUrl = photoURL;
              newUser.purchasedIds = [];

              // save to db
              newUser.saveToDatabase();

              resolve(newUser);
              return;
            }
          }

          reject(err);
        });
    });

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

          this.setUser(u);
        })
        .catch((err) => {
          this.onError(err);
        });

    }).catch((err) => {
      console.log(err);

      this.onError(err);
    });
  }

  setUser(u) {
    this.auth.user = u;
    this.auth.updateCurrentUser();
    this.api.fetchPurchased();

    // go to main page
    this.navCtrl.setRoot(LoginPage.getMainPage(this.auth.user));
    this.showLoadingView(false);
  }

  onError(err) {
    console.log(JSON.stringify(err));

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
