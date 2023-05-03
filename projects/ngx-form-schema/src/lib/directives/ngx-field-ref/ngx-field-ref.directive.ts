import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[ngxFieldRef]',
  standalone: true
})
export class FieldRefDirective {
  public templateRef = inject(TemplateRef<unknown>);
}

