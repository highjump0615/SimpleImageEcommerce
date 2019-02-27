import {Component, Input} from '@angular/core';

/**
 * Generated class for the StarRateComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'star-rate',
  templateUrl: 'star-rate.html'
})
export class StarRateComponent {

  @Input() starSize = 11;
  @Input() readOnly = true;

  @Input() rating: number;

  constructor() {
    console.log('Hello StarRateComponent Component');
  }

  /**
   * function used to change the value of our rating
   * triggered when user, clicks a star to change the rating
   *
   * @param {number} index
   * @memberof StarRateComponent
   */
  rate(index: number) {
    if (this.readOnly) {
      return;
    }

    this.rating = index;
  }

  /**
   * returns whether or not the selected index is above ,the current rating
   * function is called from the getColor function.
   *
   * @param {number} index
   * @returns {boolean}
   * @memberof StarRateComponent
   */
  isAboveRating(index: number): boolean {
    return index > this.rating;
  }

}
