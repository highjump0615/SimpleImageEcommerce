import { Component, ViewChild } from '@angular/core';
import {AlertController, MenuController, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FirebaseManager} from "../helpers/firebase-manager";
import {AuthProvider} from "../providers/auth/auth";
import {Storage} from "@ionic/storage";
import {User} from "../models/user";
import {LoginPage} from "../pages/login/login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';

  static KEY_USER = 'current_user';

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private auth: AuthProvider,
    private storage: Storage
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'GalleryPage', icon: 'home' },
      { title: 'Account', component: null, icon: 'ios-person' },
      { title: 'Cart', component: 'CartPage', icon: 'cart' },
      { title: 'Downloads', component: 'DownloadsPage', icon: 'md-cloud-download' }
    ];

  }

  initializeApp() {
    console.log('app init');

    // init firebase
    if (FirebaseManager.getInstance()) {
      console.log('firebase loaded');
    }

    this.platform.ready().then(() => {
      // set current user from session storage
      this.storage.get(MyApp.KEY_USER)
        .then((val) => {
          if (val) {
            this.auth.user = new User().deserialize(val);
          }

          this.finalizeInit();
        })
        .catch((err) => {
          console.log(err);

          this.finalizeInit();
        });
    });
  }

  finalizeInit() {
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.statusBar.styleDefault();
    this.splashScreen.hide();

    console.log('current root page: ', this.rootPage);

    // this.nav.setRoot(LoginPage.getMainPage(this.auth.user));
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component) {
      this.nav.setRoot(page.component);
    }
  }

  onLogout() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure to log out?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.doLogout();
          }
        }
      ]
    });

    alert.onWillDismiss(() => {
      // close menu
      this.menuCtrl.close();
    });
    alert.present();
  }

  private doLogout() {
    // sign out
    this.auth.signOut();

    this.nav.setRoot('LoginPage');
  }
}
