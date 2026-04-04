import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appInitialFocus]',
})
export class InitialFocusDirective {
  private el = inject(ElementRef);

  constructor() {
    afterNextRender(() => {
      this.el.nativeElement.setAttribute('tabindex', '-1');
      this.el.nativeElement.focus();
    });
  }
}
