import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appInitialFocus]',
  standalone: true,
})
export class InitialFocusDirective implements AfterViewInit {
  private el = inject(ElementRef);

  ngAfterViewInit(): void {
    this.el.nativeElement.setAttribute('tabindex', '-1');
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 0);
  }
}
