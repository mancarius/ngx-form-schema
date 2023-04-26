import { Injectable } from '@angular/core';
import { AbstractControlOptions, FormControlOptions, ValidatorFn } from '@angular/forms';
import { FormControlSchema } from './form-control-schema';
import { FormGroupSchema } from './form-group-schema';
import { ControlSchemaTemplate, FormGroupSchemaTemplate } from './types';

@Injectable({
  providedIn: 'root'
})
export class NgxFormSchemaBuilder {

  public group<UserRole extends string>(template: FormGroupSchemaTemplate<UserRole>, validatorOrOpts?: ValidatorFn | AbstractControlOptions & { userRoles: UserRole[] } | ValidatorFn[]) {
    return new FormGroupSchema<UserRole>(template, validatorOrOpts);
  }

  public control<UserRole extends string>(template: ControlSchemaTemplate<UserRole>, opts?: FormControlOptions) {
    return new FormControlSchema<UserRole>(template, opts)
  }
}
