import {ViewChild} from "@angular/core";

export class BasePage {
  @ViewChild('container') container: any;

  mainHeight = 0;

  ionViewDidEnter() {
    // Get the height of the element
    const height = this.container.nativeElement.offsetHeight;

    this.mainHeight = height;
    console.log(height);
  }
}
