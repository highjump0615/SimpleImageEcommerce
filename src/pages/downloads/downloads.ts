import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {Product} from "../../models/product";
import {AuthProvider} from "../../providers/auth/auth";
import {ApiProvider} from "../../providers/api/api";
import {BaseProductPage} from "../base-product";
import {FileTransfer} from '@ionic-native/file-transfer';
import {File} from "@ionic-native/file";


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
export class DownloadsPage extends BaseProductPage {
  showLoading = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public platform: Platform,
    public api: ApiProvider,
    public auth: AuthProvider,
    public transfer: FileTransfer,
    public file: File,
    public alertCtrl: AlertController
  ) {
    super(auth, api, toastCtrl, transfer, file, alertCtrl, platform);

    if (!auth.user) {
      return;
    }

    if (auth.user.purchased) {
      // already initialized
      return;
    }

    if (!auth.user.purchasedIds) {
      // not initialized
      return;
    }

    // fetch carts
    const prods = [];

    for (let id of auth.user.purchasedIds) {
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
