import {BaseModel} from "./base-model";
import DataSnapshot = firebase.database.DataSnapshot;
import {User} from "./user";

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

  user: User;

  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.userId = info[Review.FIELD_USER_ID];
      this.rate = info[Review.FIELD_RATE];
      this.desc = info[Review.FIELD_DESC];
    }
  }

  tableName() {
    return Review.TABLE_NAME;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Review.FIELD_USER_ID] = this.userId;
    dict[Review.FIELD_RATE] = this.rate;
    dict[Review.FIELD_DESC] = this.desc;

    return dict;
  }
}
