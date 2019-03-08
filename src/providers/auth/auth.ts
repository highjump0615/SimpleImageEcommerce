import { Injectable } from '@angular/core';
import {User} from "../../models/user";
import {FirebaseManager} from "../../helpers/firebase-manager";
import {Storage} from "@ionic/storage";
import {MyApp} from "../../app/app.component";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  user: User;

  constructor(
    private storage: Storage
  ) {
    console.log('Hello AuthProvider Provider');
  }

  signIn(email: string, password: string) {
    // do login
    return FirebaseManager.auth().signInWithEmailAndPassword(
      email,
      password
    ).then((res) => {
      console.log(res);

      if (!res.user) {
        return Promise.reject(new Error('User not found'));
      }

      return User.readFromDatabase(res.user.uid)
        .then((u) => {
          if (u.type == User.USER_TYPE_ADMIN) {
            return Promise.reject(new Error('Admin user cannot be used in the app'));
          }

          this.user = u;
          this.updateCurrentUser();
        });
    });
  }

  signOut() {
    // clear current user
    FirebaseManager.getInstance().signOut();

    // clear storage
    this.storage.remove(MyApp.KEY_USER);

    this.user = null;
  }

  updateCurrentUser() {
    // save user to session storage
    this.storage.set(MyApp.KEY_USER, this.user);
  }

}
