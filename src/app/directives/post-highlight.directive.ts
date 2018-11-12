import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';
import { MockNgModuleResolver } from '@angular/compiler/testing';

@Directive({
  selector: '[appPostHighlight]'
})
export class PostHighlightDirective {

  constructor(private elRef: ElementRef,
    private renderer: Renderer2) {}

  @HostListener('mouseenter') hoverOn(event: Event) {
    this.renderer.addClass(this.elRef.nativeElement, 'post-hover');

  }

  @HostListener('mouseleave') hoverOff(event: Event) {
    this.renderer.removeClass(this.elRef.nativeElement, 'post-hover');
  }

}
