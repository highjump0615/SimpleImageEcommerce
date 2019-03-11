import {Injectable, Provider} from '@angular/core';
import {FirebaseManager} from "../../helpers/firebase-manager";
import {Storage} from "@ionic/storage";
import {MyApp} from "../../app/app.component";
import {User} from "../../models/user";
import {User as FUser} from "firebase";
import {GooglePlus} from "@ionic-native/google-plus";
import {config} from "../../helpers/config";
import {Facebook} from "@ionic-native/facebook";


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  user: User;

  constructor(
    private storage: Storage,
    private googlePlus: GooglePlus,
    private facebook: Facebook
  ) {
    console.log('Hello AuthProvider Provider');
  }

  signUp(email: string, password: string): Promise<FUser> {
    // do signup
    return FirebaseManager.auth().createUserWithEmailAndPassword(
      email,
      password
    ).then((res) => {
      console.log(res);

      if (!res.user) {
        return Promise.reject(new Error('User not created'));
      }

      return Promise.resolve(res.user);
    });
  }

  signIn(email: string, password: string): Promise<FUser> {
    // do login
    return FirebaseManager.auth().signInWithEmailAndPassword(
      email,
      password
    ).then((res) => {
      console.log(res);

      if (!res.user) {
        return Promise.reject(new Error('User not found'));
      }

      return Promise.resolve(res.user);
    });
  }

  googleSignin() {
    let that = this;

    return new Promise((resolve, reject) => {
      this.googlePlus.login({
        'webClientId': config.webClientId,
        'offline': true
      }).then((res) => {
        console.log(JSON.stringify(res));

        const googleCredential = FirebaseManager.getGoogleAuthCredential(res['idToken']);

        that.continueSocialSignIn(googleCredential)
          .then((user) => {
            resolve({
              userInfo: user,
              givenName: res['givenName'],
              familyName: res['familyName'],
              imageUrl: res['imageUrl']
            })
          })
          .catch((err) => {
            reject(err);
          });
      }).catch((err) => {
        reject(err);
      });
    });

  }

  facebookSignin() {
    let that = this;

    return new Promise((resolve, reject) => {
      this.facebook.login(['email', 'public_profile'])
        .then((res) => {
          console.log(JSON.stringify(res));

          const facebookCredential = FirebaseManager.getFbAuthCredential(res.authResponse.accessToken);

          // get user profile info
          this.facebook.api('me?fields=first_name,last_name,picture.width(360).height(360).as(picture_large)', [])
            .then((profile) => {
              console.log(JSON.stringify(profile));

              that.continueSocialSignIn(facebookCredential)
                .then((user) => {
                  resolve({
                    userInfo: user,
                    givenName: profile['first_name'],
                    familyName: profile['last_name'],
                    imageUrl: profile['picture_large']['data']['url']
                  })
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });

        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  continueSocialSignIn(credential): Promise<FUser> {
    return FirebaseManager.auth().signInAndRetrieveDataWithCredential(credential)
      .then((res) => {
        return Promise.resolve(res.user);
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
