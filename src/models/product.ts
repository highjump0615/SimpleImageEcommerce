import DataSnapshot = firebase.database.DataSnapshot;
import {BaseModel} from "./base-model";

export class Product extends BaseModel {

  //
  // table info
  //
  static TABLE_NAME = 'products';
  static FIELD_TITLE = 'title';
  static FIELD_PRICE = 'price';
  static FIELD_DESC = 'desc';
  static FIELD_IMAGE = 'imageUrl';
  static FIELD_RATING = 'rating';
  static FIELD_REVIEW_COUNT = 'reviewCount';

  static TABLE_NAME_CART = 'carts';

  //
  // properties
  //
  title = '';
  price = 0;
  desc = '';
  imageUrl = '';

  rating = 0;
  reviewCount = 0;

  purchased = false;

  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.title = info[Product.FIELD_TITLE];
      this.price = info[Product.FIELD_PRICE];
      this.desc = info[Product.FIELD_DESC];
      this.imageUrl = info[Product.FIELD_IMAGE];

      if (Product.FIELD_RATING in info) {
        this.rating = info[Product.FIELD_RATING];
      }
      if (Product.FIELD_REVIEW_COUNT in info) {
        this.reviewCount = info[Product.FIELD_REVIEW_COUNT];
      }
    }
  }

  tableName() {
    return Product.TABLE_NAME;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Product.FIELD_TITLE] = this.title;
    dict[Product.FIELD_PRICE] = this.price;
    dict[Product.FIELD_DESC] = this.desc;
    dict[Product.FIELD_IMAGE] = this.imageUrl;
    dict[Product.FIELD_RATING] = this.rating;
    dict[Product.FIELD_REVIEW_COUNT] = this.reviewCount;

    return dict;
  }
}
