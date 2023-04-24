import { Injectable } from '@angular/core';
import { AbstractControlOptions, FormControlOptions, ValidatorFn } from '@angular/forms';
import { FormFieldSchema } from './form-field-schema';
import { FormGroupSchema } from './form-group-schema';
import { FieldSchemaTemplate, FormGroupSchemaTemplate } from './types';

@Injectable({
  providedIn: 'root'
})
export class NgxFormSchemaService {

  public group<UserRole extends string>(template: FormGroupSchemaTemplate<UserRole>, validatorOrOpts?: ValidatorFn | AbstractControlOptions & { userRoles: UserRole[] } | ValidatorFn[]) {
    return new FormGroupSchema<UserRole>(template, validatorOrOpts);
  }

  public control<UserRole extends string>(template: FieldSchemaTemplate<UserRole>, opts?: FormControlOptions) {
    return new FormFieldSchema<UserRole>(template, opts)
  }
}
