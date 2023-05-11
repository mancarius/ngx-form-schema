import { Injectable, inject } from '@angular/core';
import { AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { FormControlSchema } from '../models/form-control-schema';
import { FormGroupSchema } from '../models/form-group-schema';
import { ControlSchema, FormSchemaElement, GroupSchemaControls, GroupSchema } from '../types';

@Injectable({
  providedIn: 'root'
})
export class NgxFormSchemaBuilder {
  private useNonNullable: boolean = false;

  get nonNullable(): NgxNonNullableFormSchemaBuilder {
    const nnfb = new NgxFormSchemaBuilder();
    nnfb.useNonNullable = true;
    return nnfb as NgxNonNullableFormSchemaBuilder;
  }

  public group<UserRole extends string = string, T extends Record<string, any> = Record<string, any>>(
    schema: GroupSchema<UserRole, T>,
    options?: (AbstractControlOptions | { [key: string]: any }) & { userRoles?: UserRole[] },
  ): FormGroupSchema<UserRole, { [K in keyof T]: FormSchemaElement<T[K], UserRole> }> {

    const { fields, conditions } = schema;
    const formGroup = new FormGroupSchema<UserRole>({ key: schema.key, fields: [], conditions }, options);

    Object.entries(fields).forEach(([key, value]) => {
      const isObj = typeof value === "object";
      const isArray = isObj && Array.isArray(value);
      const isControlSchema = isObj && !isArray && value?.hasOwnProperty('key') && !value.hasOwnProperty('fields');
      const isGroupSchema = isObj && !isArray && value?.hasOwnProperty('fields');
      const isGroupSchemaInstance = value instanceof FormGroupSchema;
      const isControlSchemaInstance = value instanceof FormControlSchema;
      const isFormSchemaInstance = isGroupSchemaInstance || isControlSchemaInstance;

      if (isFormSchemaInstance) {
        formGroup.addControl(key, value);
      } else if (isObj) {
        if (isGroupSchema) {
          const childOptions: { userRoles?: UserRole[]; } | undefined = !!options && typeof options === 'object' && options.hasOwnProperty('userRoles')
            ? { userRoles: options.userRoles }
            : undefined;

          const newFormBuilder = this.useNonNullable
            ? new NgxFormSchemaBuilder().nonNullable
            : new NgxFormSchemaBuilder();

          formGroup.addControl(key, newFormBuilder.group<UserRole>(value as GroupSchema<UserRole, T>, childOptions));
        }
        else if (isControlSchema) {
          formGroup.addControl(key, new FormControlSchema<UserRole>(value as ControlSchema<UserRole>, { nonNullable: this.useNonNullable }));
        }
      }
    });

    return formGroup;
  }

  public control<UserRole extends string = string, T extends ControlSchema<UserRole> = any>(
    template: ControlSchema<UserRole>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions & { userRoles?: UserRole[] } | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControlSchema<UserRole> {
    return new FormControlSchema<UserRole>(template, validatorOrOpts, asyncValidator)
  }
}




@Injectable({
  providedIn: 'root',
  useFactory: () => inject(NgxFormSchemaBuilder).nonNullable,
})
export abstract class NgxNonNullableFormSchemaBuilder {
  abstract group<UserRole extends string = string, T extends Record<string, any> = Record<string, any>>(
    template: T,
    options?: (AbstractControlOptions | { [key: string]: any }) & { userRoles?: UserRole[] } | null,
  ): FormGroupSchema<UserRole, { [K in keyof T]: FormSchemaElement<T[K], UserRole> }>;

  /*abstract array<T>(
    controls: Array<T>, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormArray<ɵElement<T, never>>;*/

  abstract control<UserRole extends string = string, T extends ControlSchema<UserRole> = any>(
    template: ControlSchema<UserRole>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions & { userRoles?: UserRole[] } | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControlSchema<UserRole>;
}
