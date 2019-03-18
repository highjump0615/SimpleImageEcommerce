import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StripePage } from './stripe';
import {TextMaskModule} from "angular2-text-mask";

@NgModule({
  declarations: [
    StripePage,
  ],
  imports: [
    IonicPageModule.forChild(StripePage),
    TextMaskModule
  ],
})
export class StripePageModule {}
