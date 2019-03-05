import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {BasePage} from "../base";

/**
 * Generated class for the WriteReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-write-review',
  templateUrl: 'write-review.html',
})
export class WriteReviewPage extends BasePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    super();
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();

    console.log('ionViewDidLoad WriteReviewPage');
  }

}
