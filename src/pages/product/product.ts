import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {BaseProductPage} from "../base-product";
import {Product} from "../../models/product";
import {AuthProvider} from "../../providers/auth/auth";
import {ApiProvider} from "../../providers/api/api";
import {Review} from "../../models/review";

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
    public toastCtrl: ToastController
  ) {
    super(auth, api, toastCtrl);

    // get product info
    this.product = navParams.get('data');
    if (!this.product) {
      return;
    }

    // fetch its reviews
    this.api.fetchReviews(this.product.id)
      .then((revs) => {
        this.reviews = revs;

        this.showLoading = false;
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

  onButAddCart() {
    // this.addToCart();
  }

  onWriteReview() {
    // go to write review page
    this.navCtrl.push('WriteReviewPage');
  }
}
