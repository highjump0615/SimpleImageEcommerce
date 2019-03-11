import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable, Provider} from '@angular/core';
import {AuthProvider} from "../auth/auth";
import {FirebaseManager} from "../../helpers/firebase-manager";
import {Product} from "../../models/product";
import {User} from "../../models/user";
import {Review} from "../../models/review";
import {Order} from "../../models/order";
import {config} from "../../helpers/config";

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  baseStripUrl = 'https://api.stripe.com/v1';

  constructor(
    public auth: AuthProvider,
    private  httpClient : HttpClient
  ) {
    console.log('Hello ApiProvider Provider');
  }

  //
  // Firebase operations
  //

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

  /**
   * fetch all reviews of the product
   * @param pId
   */
  fetchReviews(pId) {
    let reviews = [];

    let query = FirebaseManager.ref()
      .child(Review.TABLE_NAME)
      .child(pId);

    return query.once('value')
      .then((snapshot) => {
        console.log(snapshot);

        snapshot.forEach(function(child) {
          const r = new Review(child);

          reviews.push(r);
        });

        return Promise.resolve(reviews);
      });
  }

  /**
   * add orders & purchased products
   * @param amount
   */
  makeOrderWithCart(amount) {
    // add to order
    let o = new Order();

    o.userId = this.auth.user.id;
    o.amount = amount;

    o.saveToDatabase();

    let dbRef = FirebaseManager.ref()
      .child(Product.TABLE_NAME_PURCHASE)
      .child(this.auth.user.id);

    for (let p of this.auth.user.carts) {
      this.auth.user.addProductToPurchased(p);

      // add to purchased
      dbRef.child(p.id).set(o.id);
    }

    // clear carts
    this.auth.user.carts = [];
    FirebaseManager.ref()
      .child(Product.TABLE_NAME_CART)
      .child(this.auth.user.id)
      .remove();
  }

  fetchPurchased() {
    // fetch products
    const dbRef = FirebaseManager.ref();

    let query: any = dbRef.child(Product.TABLE_NAME_PURCHASE)
      .child(this.auth.user.id);

    return query.once('value')
      .then((snapshot) => {
        console.log(snapshot);

        // clear data
        let ids = [];

        snapshot.forEach(function(child) {
          // get product key
          ids.push(child.key);
        });

        this.auth.user.purchasedIds = ids;
        return Promise.resolve(ids);
      });
  }

  addReview(review: Review, product: Product) {
    // product error
    if (!product) {
      return Promise.reject(new Error('Product is not available'));
    }

    review.userId = this.auth.user.id;

    return review.saveToDatabase(null, product.id)
      .then(() => {
        // update product rate
        product.rating = (product.rating * product.reviewCount + review.rate) / (product.reviewCount + 1);
        product.reviewCount++;

        product.saveToDatabaseWithField(Product.FIELD_REVIEW_COUNT, product.reviewCount);
        product.saveToDatabaseWithField(Product.FIELD_RATING, product.rating);

        return Promise.resolve();
      });
  }

  //
  // Stripe operations
  //
  stripeCreateToken(card) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + config.stripeKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    let body = new URLSearchParams();
    body.set('card[number]', card.number);
    body.set('card[exp_month]', card.expMonth);
    body.set('card[exp_year]', card.expYear);
    body.set('card[cvc]', card.cvc);

    return new Promise((resolve, reject) => {
      this.httpClient.post(
        this.baseStripUrl + '/tokens',
        body.toString(),
        httpOptions
      ).subscribe(data => {
        console.log(data);

        resolve(data['id']);
      }, err => {
        console.log(err);

        reject(err.error.error);
      });
    });
  }

  stripeCreateCharge(token, amount) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + config.stripeKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    let body = new URLSearchParams();
    body.set('source', token);
    body.set('amount', (amount * 100).toString());
    body.set('currency', 'usd');
    body.set('description', 'Purchase Colors products');

    return new Promise((resolve, reject) => {
      this.httpClient.post(
        this.baseStripUrl + '/charges',
        body.toString(),
        httpOptions
      ).subscribe(data => {
        console.log(data);

        resolve();
      }, err => {
        console.log(err);

        reject(err.error.error);
      });
    });
  }
}
