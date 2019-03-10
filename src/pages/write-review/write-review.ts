import {Component, ViewChild} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Platform,
  ToastController
} from 'ionic-angular';
import {BasePage} from "../base";
import {StarRateComponent} from "../../components/star-rate/star-rate";
import {Review} from "../../models/review";
import {ApiProvider} from "../../providers/api/api";
import {Product} from "../../models/product";

/**
 * Generated class for the WriteReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-write-review',
  templateUrl: 'write-review.html',
})
export class WriteReviewPage extends BasePage {
  product: Product;

  @ViewChild('starRate') starRate: StarRateComponent;
  review = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    super(loadingCtrl, toastCtrl);

    // get product info
    this.product = navParams.get('data');
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();

    console.log('ionViewDidLoad WriteReviewPage');
  }

  onPost() {
    // add new review
    const reviewNew = new Review();

    reviewNew.desc = this.review;
    reviewNew.rate = this.starRate.rating;

    this.showLoadingView();

    this.api.addReview(reviewNew, this.product)
      .then(() => {
        this.showLoadingView(false);

        this.showToast('Review was left successfully');

        // back to prev page
        this.navCtrl.pop();
      })
      .catch((err) => {
        this.showLoadingView(false);

        let alert = this.alertCtrl.create({
          title: 'Failed to leave review ',
          message: err.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }
}
