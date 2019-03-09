import {BaseModel} from "./base-model";
import DataSnapshot = firebase.database.DataSnapshot;

export class Order extends BaseModel {
  //
  // table info
  //
  static TABLE_NAME = 'orders';

  static FIELD_USER_ID = 'userId';
  static FIELD_PRODUCT_ID = 'productId';
  static FIELD_PRICE = 'price';

  //
  // properties
  //
  userId = '';
  productId = '';
  price = 0;

  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.userId = info[Order.FIELD_USER_ID];
      this.productId = info[Order.FIELD_PRODUCT_ID];
      this.price = info[Order.FIELD_PRICE];
    }
  }

  tableName() {
    return Order.TABLE_NAME;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Order.FIELD_USER_ID] = this.userId;
    dict[Order.FIELD_PRODUCT_ID] = this.productId;
    dict[Order.FIELD_PRICE] = this.price;

    return dict;
  }
}
