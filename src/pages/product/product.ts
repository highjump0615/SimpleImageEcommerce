import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {BaseProductPage} from "../base-product";
import {Product} from "../../models/product";
import {AuthProvider} from "../../providers/auth/auth";
import {ApiProvider} from "../../providers/api/api";
import {Review} from "../../models/review";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";

/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage extends BaseProductPage {
  product: Product;

  reviews: Array<Review> = [];
  showLoading = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public transfer: FileTransfer,
    public file: File,
    public alertCtrl: AlertController,
    public platform: Platform
  ) {
    super(auth, api, toastCtrl, transfer, file, alertCtrl, platform);

    // get product info
    this.product = navParams.get('data');
    if (!this.product) {
      return;
    }

    // fetch its reviews
    this.api.fetchReviews(this.product.id)
      .then((revs) => {
        let rvs = [];

        // fetch users
        for (let r of revs) {
          this.api.getUserWithId(r.userId)
            .then((u) => {
              const rv: Review = r;
              rv.user = u;
              rvs.push(rv);

              // fetched all
              if (rvs.length == revs.length) {
                this.showLoading = false;

                this.reviews = rvs;
              }
            });
        }
      })
      .catch((err) => {
        console.log(err);

        this.showLoading = false;
      });
  }

  isInCart(): boolean {
    if (!this.product) {
      return false;
    }

    // cart is not initialized
    if (!this.auth.user.carts) {
      return false;
    }

    return !!this.auth.user.carts.find(p => p.id == this.product.id);
  }

  isPurchased() {
    return this.product && super.isPurchased(this.product);
  }

  /**
   * any button cannot be available until
   */
  isOperationAvailable() {
    return this.auth.user && this.auth.user.purchasedIds;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
  }

  onWriteReview() {
    // go to write review page
    this.navCtrl.push('WriteReviewPage', {
      data: this.product
    });
  }
}
