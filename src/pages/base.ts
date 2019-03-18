import {ViewChild} from "@angular/core";
import {LoadingController, ToastController} from "ionic-angular";
import {User} from "../models/user";

export class BasePage {
  loadingView: any;
  @ViewChild('container') container: any;

  mainHeight = 0;

  constructor(
    public loadingCtrl?: LoadingController,
    public toastCtrl?: ToastController
  ) {
  }

  ionViewDidEnter() {
    if (this.container) {
      // Get the height of the element
      const height = this.container.nativeElement.offsetHeight;

      this.mainHeight = height;
      console.log(height);
    }
  }

  showLoadingView(show = true, desc?: String) {
    if (show) {
      // show showLoading view
      this.loadingView = this.loadingCtrl.create();
      this.loadingView.present();
    }
    else {
      if (this.loadingView) {
        // hide
        this.loadingView.dismiss();
      }
    }
  }

  showToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
