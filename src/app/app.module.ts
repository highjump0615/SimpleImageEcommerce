import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import {IonicStorageModule} from "@ionic/storage";
import {IonicImageViewerModule} from "ionic-img-viewer";
import { ApiProvider } from '../providers/api/api';
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {HttpClientModule} from "@angular/common/http";
import {GooglePlus} from "@ionic-native/google-plus";
import {Facebook} from "@ionic-native/facebook";


const COMPONENTS = [
  MyApp,
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    IonicImageViewerModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ...COMPONENTS
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ApiProvider,
    File,
    FileTransfer,
    GooglePlus,
    Facebook
  ]
})
export class AppModule {}
