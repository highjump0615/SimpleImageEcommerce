import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WriteReviewPage } from './write-review';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    WriteReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(WriteReviewPage),
    ComponentsModule
  ],
})
export class WriteReviewPageModule {}
