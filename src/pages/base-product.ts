import {ToastController} from "ionic-angular";
import {AuthProvider} from "../providers/auth/auth";
import {Product} from "../models/product";
import {ApiProvider} from "../providers/api/api";

export class BaseProductPage {
  constructor(
    public auth: AuthProvider,
    public api: ApiProvider,
    public toastCtrl?: ToastController
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

    const toast = this.toastCtrl.create({
      message: 'Added to Cart successfully',
      duration: 3000
    });

    toast.present();
  }

}
