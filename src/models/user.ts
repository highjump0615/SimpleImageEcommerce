import {FirebaseManager} from "../helpers/firebase-manager";
import {BaseModel, Deserializable} from "./base-model";
import DataSnapshot = firebase.database.DataSnapshot;

export class User extends BaseModel implements Deserializable {

  //
  // table info
  //
  static TABLE_NAME = 'users';
  static FIELD_EMAIL = 'email';
  static FIELD_TYPE = 'type';
  static FIELD_INITED = 'inited';

  static USER_TYPE_NORMAL = 'normal';
  static USER_TYPE_ADMIN = 'admin';

  //
  // properties
  //
  email = '';
  inited = false;

  type = User.USER_TYPE_NORMAL;

  constructor(withId?: string, snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.email = info[User.FIELD_EMAIL];

      if (User.FIELD_TYPE in info) {
        this.type = info[User.FIELD_TYPE];
      }
      if (User.FIELD_INITED in info) {
        this.inited = info[User.FIELD_INITED];
      }
    }

    if (withId) {
      this.id = withId;
    }
  }

  static readFromDatabase(withId: string): Promise<User> {
    const userRef = FirebaseManager.ref()
      .child(User.TABLE_NAME)
      .child(withId);

    return userRef.once('value')
      .then((snapshot) => {
        if (!snapshot.exists()) {
          return Promise.reject('User not found');
        }

        const user = new User(null, snapshot);
        return Promise.resolve(user);
      });
  }

}
