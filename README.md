Simple Image Ecommerce App
======

> Ionic App; Simple image transaction App

## Overview
Working with [Admin panel](https://github.com/highjump0615/SimpleImageEcommerce_Admin) and [Firebase cloud functions](https://github.com/highjump0615/SimpleImageEcommerce_Cloud)

### 1. Main Features
- List images for purchase  
- Add images to cart  
- Buy image & Download to Photos or phone storage  
  - Purchase image using Stripe Payment  
 
### 2. Techniques 
Ionic Framework v3.9.2  
AngularJS v5.2.11  
#### 2.1 UI Implementation  
##### 2.1.1 Implement UI pages based on Flexbox layout
##### 2.1.2 UI layout when keyboard appears  
In default, the whole view content shrinks when keyboard appears. To solve this problem:  

- Set ``min-height`` style to prevent shrink  
```html
<div
    #container
    class="container"
    [style.min-height]="this.mainHeight + 'px'">
</div>
```  
- Set main height value  
```typescript
ionViewDidEnter() {
  // Get the height of the element
  this.mainHeight = this.container.nativeElement.offsetHeight;
}
```  

##### 2.1.3 Virtual scroll for lazy loading list items  
Using ``<ion-img>`` instead of ``<img>`` to get better user experience and performance  

- Gallery page; *gallery.html*  
- Download page; *downloads.html*
  
#### 2.2 Function Implementation
##### 2.2.1 Auth module
``AuthProvider`` in *providers/auth/auth.ts*  
User signup, login, signout, ...  
- Save user data in [Ionic Storage](https://ionicframework.com/docs/v3/storage/)  

##### 2.2.2 Api module
``ApiProvider`` in *providers/api/api.ts*  
Main interfaces for fetching and writing data to database  

- Google Firebase for backend  

##### 2.2.3 Payment with [Stripe](https://stripe.com)
Card Payments  

- Tokenize card information  
Stripe API: [https://stripe.com/docs/api/tokens](https://stripe.com/docs/api/tokens)  
``ApiProvider.stripeCreateToken(card)``

- Creating a charge to complete the payment  
Stripe API: [https://stripe.com/docs/api/charges](https://stripe.com/docs/api/charges)  
``ApiProvider.stripeCreateCreateCharge(token, amount)``

#### 2.3 Code tricks  
- Using alias to import classes with same name  
```typescript  
import {User} from '../../models/user';
import {User as FUser} from 'firebase';
```  

#### 2.4 Third-Party Libraries
##### 2.4.1 [Firebase JS SDK](https://github.com/firebase/firebase-js-sdk) v5.8.6  
Main backend & database for the app

##### 2.4.2 [Ionic image viewer](https://github.com/Riron/ionic-img-viewer#readme) v2.9.0
Preview images by showing it full screen  
- Preview image of products in Gallery page

##### 2.4.3 [Moment.js](https://github.com/moment/moment/) v2.24.0 
- Showing date in download list page  
- Showing date in review list page

##### 2.4.4 Cordova plugins
- [File](https://github.com/apache/cordova-plugin-file) v6.0.1  
- [File Transfer](https://github.com/apache/cordova-plugin-file-transfer) v1.7.1  
Download files  
- [SaveImage](https://github.com/quiply/SaveImage#readme) v0.3  
Save downloaded image files to Gallery  
- ~~[Stripe](https://github.com/zyra/cordova-plugin-stripe) v1.5.3~~  
- [Google Plus](https://github.com/EddyVerbruggen/cordova-plugin-googleplus) v7.0.0  
Google Signin
- [Facebook4](https://github.com/jeduan/cordova-plugin-facebook4#readme) v4.2.1  
Facebook Signin


## Need to Improve
#### Image list in Gallery page is not perfect  
- Images are not loading or showing in some cases  
It seems that ``virtualScroll`` and ``<ion-img>`` have some problems...