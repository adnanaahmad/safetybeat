/// <reference types='@types/googlemaps' />
import {Directive, OnInit, Output, EventEmitter, ElementRef} from '@angular/core';

@Directive({
  selector: '[appGooglePlaces]'
})
export class GooglePlacesDirective implements OnInit {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  private readonly element: HTMLInputElement;

  constructor(elRef: ElementRef) {
    this.element = elRef.nativeElement;
  }

  /**
   * this function is used for emitting the formatted address where we have to use this google based search.
   */

  ngOnInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.element);
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      this.onSelect.emit(this.element.value);
    });
  }

}
