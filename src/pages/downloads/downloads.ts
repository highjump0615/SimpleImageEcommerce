import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Product} from "../../models/product";

/**
 * Generated class for the DownloadsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-downloads',
  templateUrl: 'downloads.html',
})
export class DownloadsPage {

  products = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    for (let i = 0; i < 6; i++) {
      let p = new Product();
      p.purchased = true;

      this.products.push(p);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadsPage');
  }

  onItemDetail(index) {
    this.navCtrl.push('ProductPage', {
      data: this.products[index]
    });
  }
}
