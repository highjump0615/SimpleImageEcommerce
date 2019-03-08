import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {BaseProductPage} from "../base-product";
import {AuthProvider} from "../../providers/auth/auth";
import {FirebaseManager} from "../../helpers/firebase-manager";
import {Product} from "../../models/product";
import {ImageViewerController} from "ionic-img-viewer";

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
    private auth: AuthProvider,
    public imageViewerCtrl: ImageViewerController
  ) {
    super(toastCtrl);

    this.fetchProducts(true);
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

  fetchProducts(showLoading: boolean) {
    var that = this;
    this.showLoading = showLoading;

    // fetch products
    const dbRef = FirebaseManager.ref();

    let query: any = dbRef.child(Product.TABLE_NAME);
    return query.once('value')
      .then((snapshot) => {
        console.log(snapshot);

        // clear data
        this.products = [];

        snapshot.forEach(function(child) {
          const p = new Product(child);

          that.products.push(p);
        });

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
