import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  showLoading = true;
  aboutApp = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');

    this.api.updateUserInit(true);

    // fetch about app
    this.api.fetchAboutApp()
      .then((data) => {
        this.aboutApp = data;

        this.showLoading = false;
      })
      .catch((err) => {
        console.log(err);

        this.showLoading = false;
      });
  }

}
