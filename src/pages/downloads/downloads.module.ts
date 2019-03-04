import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DownloadsPage } from './downloads';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    DownloadsPage,
  ],
  imports: [
    IonicPageModule.forChild(DownloadsPage),
    ComponentsModule
  ],
})
export class DownloadsPageModule {}
