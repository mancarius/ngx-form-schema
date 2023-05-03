import { Directive, Input, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[ngxFieldRef]',
  standalone: true
})
export class FieldRefDirective {
  @Input() ngxFieldRef!: TemplateRef<unknown> | string;
  public templateRef = inject(TemplateRef<unknown>);

  getTemplate() {
    return this.ngxFieldRef instanceof TemplateRef ? this.ngxFieldRef : this.templateRef;
  }
}

