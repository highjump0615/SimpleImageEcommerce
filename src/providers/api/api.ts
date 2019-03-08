import { HttpClient } from '@angular/common/http';
import {Injectable, Provider} from '@angular/core';
import {AuthProvider} from "../auth/auth";
import {FirebaseManager} from "../../helpers/firebase-manager";
import {Product} from "../../models/product";
import {User} from "../../models/user";

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  constructor(
    public auth: AuthProvider
  ) {
    console.log('Hello ApiProvider Provider');
  }

  /**
   * get all products
   */
  fetchAllProducts() {
    let products = [];

    // fetch products
    const dbRef = FirebaseManager.ref();

    let query: any = dbRef.child(Product.TABLE_NAME);
    return query.once('value')
      .then((snapshot) => {
        console.log(snapshot);

        snapshot.forEach(function(child) {
          const p = new Product(child);

          products.push(p);
        });

        return Promise.resolve(products);
      });
  }

  /**
   * get cart products of the user
   */
  fetchCarts() {
    // fetch products
    const dbRef = FirebaseManager.ref();

    let query: any = dbRef.child(Product.TABLE_NAME_CART)
      .child(this.auth.user.id);

    let nCount = 0;
    let nFetched = 0;

    return query.once('value')
      .then((snapshot) => {
        console.log(snapshot);

        // clear data
        let ids = [];

        snapshot.forEach(function(child) {
          // get product key
          ids.push(child.key);
        });

        return Promise.resolve(ids);
      });
  }

  /**
   * fetch user with id
   * @param id
   */
  getUserWithId(id): Promise<User> {
    const userRef = FirebaseManager.ref()
      .child(User.TABLE_NAME)
      .child(id);

    return userRef.once('value')
      .then((snapshot) => {
        if (!snapshot.exists()) {
          return Promise.reject('User not found');
        }

        const user = new User(null, snapshot);
        return Promise.resolve(user);
      });
  }

  /**
   * fetch product with id
   * @param id
   */
  getProductWithId(id): Promise<Product> {
    const userRef = FirebaseManager.ref()
      .child(Product.TABLE_NAME)
      .child(id);

    return userRef.once('value')
      .then((snapshot) => {
        if (!snapshot.exists()) {
          return Promise.reject(new Error('Product not found'));
        }

        const product = new Product(snapshot);
        return Promise.resolve(product);
      });
  }

  /**
   * remove cart product to user
   * @param product
   */
  addCart(product) {
    let dbRef = FirebaseManager.ref()
      .child(Product.TABLE_NAME_CART)
      .child(this.auth.user.id)
      .child(product.id);

    dbRef.set(true);
  }

  /**
   * remove cart product from user
   * @param product
   */
  removeCart(product) {
    let dbRef = FirebaseManager.ref()
      .child(Product.TABLE_NAME_CART)
      .child(this.auth.user.id)
      .child(product.id);

    dbRef.remove();
  }
}
