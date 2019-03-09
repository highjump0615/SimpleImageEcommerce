import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Product} from "../../models/product";
import {AuthProvider} from "../../providers/auth/auth";
import {ApiProvider} from "../../providers/api/api";

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
  showLoading = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    private auth: AuthProvider
  ) {
    if (!auth.user) {
      return;
    }

    if (auth.user.purchased) {
      // already initialized
      return;
    }

    // fetch carts
    const prods = [];

    for (let id of this.auth.user.purchasedIds) {
      this.api.getProductWithId(id)
        .then((p) => {
          prods.push(p);

          // fetched all
          if (prods.length == this.auth.user.purchasedIds.length) {
            this.auth.user.purchased = prods;
            this.showLoading = false;
          }
        })
        .catch((err) => {
          console.log(err);

          this.showLoading = false;
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DownloadsPage');
  }

  getData() {
    if (this.auth.user && this.auth.user.purchased) {
      return this.auth.user.purchased;
    }

    return [];
  }

  onItemDetail(index) {
    this.navCtrl.push('ProductPage', {
      data: this.getData()[index]
    });
  }
}
