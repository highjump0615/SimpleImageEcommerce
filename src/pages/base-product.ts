import {ToastController} from "ionic-angular";

export class BaseProductPage {
  constructor(
    public toastCtrl?: ToastController
  ) {
  }

  addToCart() {
    const toast = this.toastCtrl.create({
      message: 'Added to Cart successfully',
      duration: 3000
    });

    toast.present();
  }

}
