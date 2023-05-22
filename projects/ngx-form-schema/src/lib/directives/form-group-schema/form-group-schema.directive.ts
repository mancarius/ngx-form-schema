import { Directive, Inject, Input, Optional, Provider, Self, forwardRef } from '@angular/core';
import { AsyncValidator, AsyncValidatorFn, ControlContainer, FormGroupDirective, NG_ASYNC_VALIDATORS, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';
import { FormGroupSchema } from 'ngx-form-schema';


const formDirectiveProvider: Provider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormGroupSchemaDirective)
};


@Directive({
  selector: '[formGroupSchema]',
  providers: [formDirectiveProvider],
})
export class FormGroupSchemaDirective extends FormGroupDirective {

  @Input('formGroupSchema') set _(form: FormGroupSchema) {
    this.form = form;
  }

  constructor(
    @Optional() @Self() @Inject(NG_VALIDATORS) validators: (Validator | ValidatorFn)[],
    @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: (AsyncValidator | AsyncValidatorFn)[]
  ) { super(validators, asyncValidators); }

}
