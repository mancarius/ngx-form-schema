import { ComponentFixture } from '@angular/core/testing';
import { Component, TemplateRef } from '@angular/core';
import { FieldRefDirective } from './ngx-field-ref.directive';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

@Component({
  template: `
    <ng-template ngxFieldRef></ng-template>
  `
})
class TestComponent { }

describe('FieldRefDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directive: FieldRefDirective;

  beforeEach(() => MockBuilder(FieldRefDirective).keep(TemplateRef));

  beforeEach(() => {
    fixture = MockRender(TestComponent);
    directive = ngMocks.findInstance(FieldRefDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should have the correct selector', () => {
    // @ts-ignore
    expect(FieldRefDirective['ɵdir'].selectors).toEqual([['', 'ngxFieldRef', '']]);
  });

  it('should have a templateRef property', () => {
    expect(directive.templateRef).toBeDefined();
  });

  it('should have templateRef of type TemplateRef<unknown>', () => {
    expect(directive.templateRef instanceof TemplateRef).toBeTrue();
    expect(directive.templateRef?.constructor.name).toBe('TemplateRef');
    // @ts-ignore
    expect(directive.templateRef?.elementType).toBeFalsy();
  });

  it('should inject TemplateRef<unknown> into templateRef property', () => {
    expect(directive.templateRef).toEqual(jasmine.any(Object));
  });
});
