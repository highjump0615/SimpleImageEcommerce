import {AlertController, Platform, ToastController} from "ionic-angular";
import {AuthProvider} from "../providers/auth/auth";
import {Product} from "../models/product";
import {ApiProvider} from "../providers/api/api";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";

declare let cordova: any;


export class BaseProductPage {
  constructor(
    public auth: AuthProvider,
    public api: ApiProvider,
    public toastCtrl?: ToastController,
    public transfer?: FileTransfer,
    public file?: File,
    public alertCtrl?: AlertController,
    public platform?: Platform
  ) {
  }

  /**
   * add cart is available when it is not purchased only
   * @param product
   */
  isPurchased(product: Product) {
    if (!this.auth.user.purchasedIds) {
      return false;
    }

    return !!this.auth.user.purchasedIds.find(p => p == product.id);
  }

  addToCart(product: Product) {
    // add product id to cart table
    this.api.addCart(product);

    this.auth.user.addProductToCart(product);

    this.showToast('Added to Cart successfully');
  }

  showToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  doDownload(product: Product, event) {
    event.stopPropagation();

    if (!product) {
      return;
    }

    const fileTransfer: FileTransferObject = this.transfer.create();
    let toPath = this.file.documentsDirectory + product.id + '.jpg';
    if (this.platform.is('android')) {
      toPath = this.file.dataDirectory + product.id + '.jpg';
    }

    // show toast
    this.showToast('Started Downloading ' + product.id + '.jpg ...');

    fileTransfer.download(
      product.imageUrl,
      toPath
    ).then((entry) => {
      console.log('download complete: ' + entry.toURL());

      this.showToast('Downloaded successfully');

      cordova.plugins.imagesaver.saveImageToGallery(
        toPath,
        this.onSaveImageSuccess,
        this.onSaveImageError
      );
    }, (error) => {
      // handle error
      console.log(JSON.stringify(error));

      // show error alert
      let alert = this.alertCtrl.create({
        title: 'Download Failed',
        message: error.message,
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  onSaveImageSuccess() {
    console.log('save to photos successfully');
  }

  onSaveImageError(err) {
    console.log(err);
  }
}
