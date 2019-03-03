import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {BaseProductPage} from "../base-product";

/**
 * Generated class for the GalleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html',
})
export class GalleryPage extends BaseProductPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {
    super(toastCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GalleryPage');
  }

  onButComment() {
    this.navCtrl.push('ProductPage');
  }

  onButAddCart() {
    this.addToCart();
  }
}
