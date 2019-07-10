import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNavHighlighter]'
})
export class NavHighlighterDirective {

  constructor(el: ElementRef) {
    // el.nativeElement.style.backgroundColor = 'yellow';
 }

}
