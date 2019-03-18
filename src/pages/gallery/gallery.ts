import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {BaseProductPage} from "../base-product";
import {AuthProvider} from "../../providers/auth/auth";
import {Product} from "../../models/product";
import {ImageViewerController} from "ionic-img-viewer";
import {ApiProvider} from "../../providers/api/api";

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
  showLoading = true;

  products: Array<Product> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public auth: AuthProvider,
    public api: ApiProvider,
    public imageViewerCtrl: ImageViewerController
  ) {
    super(auth, api, toastCtrl);

    this.fetchProducts(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GalleryPage');
  }

  onButComment(index) {
    this.navCtrl.push('ProductPage', {
      data: this.products[index]
    });
  }


  fetchProducts(showLoading: boolean) {
    this.showLoading = showLoading;

    return this.api.fetchAllProducts()
      .then((prods) => {
        this.products = prods;

        this.showLoading = false;
      })
      .catch((err) => {
        console.log(err);

        this.showLoading = false;
      });
  }

  doRefresh(refresher) {
    this.fetchProducts(false)
      .then(() => {
        refresher.complete();
      })
      .catch((err) => {
        refresher.complete();
      });
  }

  onImage(view, index) {
    //
    // full screen image view
    //
    const imageViewer = this.imageViewerCtrl.create(view, {
      fullResImage: this.products[index].imageUrl
    });
    imageViewer.present();
  }
}
