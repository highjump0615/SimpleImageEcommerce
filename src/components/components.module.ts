import { NgModule } from '@angular/core';
import { StarRateComponent } from './star-rate/star-rate';
import {IonicModule} from "ionic-angular";
@NgModule({
	declarations: [StarRateComponent],
	imports: [
	  IonicModule
  ],
	exports: [StarRateComponent]
})
export class ComponentsModule {}
