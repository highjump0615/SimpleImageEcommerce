import {BaseModel} from "./base-model";
import DataSnapshot = firebase.database.DataSnapshot;

export class Review extends BaseModel {
  //
  // table info
  //
  static TABLE_NAME = 'reviews';
  static FIELD_USER_ID = 'userId';
  static FIELD_RATE = 'rate';
  static FIELD_DESC = 'desc';

  //
  // properties
  //
  userId = '';
  rate = 0;
  desc = '';

  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.userId = info[Review.FIELD_USER_ID];
      this.rate = info[Review.FIELD_RATE];
      this.desc = info[Review.FIELD_DESC];
    }
  }
}
