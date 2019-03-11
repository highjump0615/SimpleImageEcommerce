import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Product} from "../../models/product";
import {AuthProvider} from "../../providers/auth/auth";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  showLoading = false;

  tax = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public api: ApiProvider,
    private auth: AuthProvider
  ) {
    if (!auth.user) {
      return;
    }

    if (auth.user.carts) {
      // already initialized
      return;
    }

    this.showLoading = true;

    // fetch carts
    this.api.fetchCarts()
      .then((ids) => {
        const prods = [];

        if (ids.length == 0) {
          this.auth.user.carts = prods;
          this.showLoading = false;
        }

        for (let id of ids) {
          this.api.getProductWithId(id)
            .then((p) => {
              prods.push(p);

              // fetched all
              if (prods.length == ids.length) {
                this.auth.user.carts = prods;
                this.showLoading = false;
              }
            });
        }
      })
      .catch((err) => {
        console.log(err);

        this.showLoading = false;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }

  onButRemove(index, event) {
    // disable item click below
    event.stopPropagation();

    let alert = this.alertCtrl.create({
      title: 'Remove this item?',
      message: 'Are you sure that you remove this product from the list?',
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
            this.removeItem(index);
          }
        }
      ]
    });
    alert.present();
  }

  getData() {
    if (this.auth.user && this.auth.user.carts) {
      return this.auth.user.carts;
    }

    return [];
  }

  getSubTotal() {
    let sum = 0;

    for (let p of this.getData()) {
      sum += p.price;
    }

    return sum;
  }

  getTotal() {
    return this.getSubTotal() + this.tax;
  }

  /**
   * remove item from carts
   * @param index
   */
  private removeItem(index) {
    // remove from db
    this.api.removeCart(this.getData()[index]);

    // remove from user object
    this.getData().splice(index, 1);
  }

  onItem(index) {
    this.navCtrl.push('ProductPage', {
      data: this.getData()[index]
    });
  }

  onButPay() {
    // go to payment page
    this.navCtrl.push('StripePage', {
      amount: this.getTotal(),
      products: this.getData()
    });

    // make orders
    // this.api.makeOrderWithCart();
  }
}
