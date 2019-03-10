import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {emailMask} from "text-mask-addons/dist/textMaskAddons";

/**
 * Generated class for the StripePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stripe',
  templateUrl: 'stripe.html',
})
export class StripePage {

  price: number;
  masks: any;

  cardHolderName: any;
  emailAddress: any;
  phoneNumber: any;
  zipCode: any;
  cardNumber: any;
  cardExpiry: any;
  cardCVC: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {
    this.price = navParams.get('amount');

    this.masks = {
      emailAddress: emailMask,
      phoneNumber: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      zipCode: [/\d/, /\d/, /\d/, /\d/, /\d/],
      cardNumber: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
      cardExpiry: [/[0-1]/, /\d/, '/', /[1-2]/, /\d/],
      cardCVC: [/\d/, /\d/, /\d/]
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StripePage');
  }

  fixValidation() {
    var ctx = this;

    if (ctx.cardHolderName != null) {
      var cardHolderName = ctx.cardHolderName;
      ctx.cardHolderName = cardHolderName.trim();
    }

    if (ctx.phoneNumber != null) {
      var phoneNumber = ctx.phoneNumber;
      phoneNumber = phoneNumber.substring(0, 14);
      phoneNumber = phoneNumber.replace("_", "");
      ctx.phoneNumber = phoneNumber;
    }

    if (ctx.zipCode != null) {
      var zipCode = ctx.zipCode;
      zipCode = zipCode.substring(0, 5);
      zipCode = zipCode.replace("_", "");
      ctx.zipCode = zipCode;
    }

    if (ctx.cardNumber != null) {
      var cardNumber = ctx.cardNumber;
      cardNumber = cardNumber.substring(0, 19);
      cardNumber = cardNumber.replace("_", "");
      ctx.cardNumber = cardNumber;
    }

    if (ctx.cardExpiry != null) {
      var cardExpiry = ctx.cardExpiry;
      cardExpiry = cardExpiry.substring(0, 5);
      cardExpiry = cardExpiry.replace("_", "");
      ctx.cardExpiry = cardExpiry;
    }


    if (ctx.cardCVC != null) {
      var cardCVC = ctx.cardCVC;
      cardCVC = cardCVC.substring(0, 3);
      cardCVC = cardCVC.replace("_", "");
      ctx.cardCVC = cardCVC;
    }
  }

  doPayment() {
    this.fixValidation();

    if ((this.cardHolderName == null) ||
      (this.cardNumber == null) ||
      (this.cardExpiry == null) ||
      (this.cardCVC == null)) {

      // show alert
      let alert = this.alertCtrl.create({
        title: "Missing Information",
        subTitle: "Please make sure that you have provided the necessary information required to process the payment.",
        buttons: ['OK']
      });
      alert.present();

      return;
    }

    var cardHolderName = this.cardHolderName;
    var cardNumber = this.cardNumber.split(' ').join('').substring(0, 16);
    var expiryMonth = parseInt(this.cardExpiry.substring(0, 2));
    var expiryYear = parseInt(this.cardExpiry.substring(3, 5)) + 2000;
    var cardCVC = this.cardCVC.substring(0, 3);
  }
}
