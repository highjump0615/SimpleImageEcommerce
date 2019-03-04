import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {BaseProductPage} from "../base-product";
import {Product} from "../../models/product";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {
    super(toastCtrl);

    // get product info
    this.product = navParams.get('data');
  }

  isPurchased() {
    return this.product && this.product.purchased;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
  }

  onButAddCart() {
    this.addToCart();
  }

  onWriteReview() {
    // go to write review page
  }
}
