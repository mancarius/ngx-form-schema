import { Injectable, inject } from '@angular/core';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { FormControlSchema } from '../models/form-control-schema';
import { FormGroupSchema } from '../models/form-group-schema';
import { ControlSchema, FormSchemaElement, GroupSchema, ArraySchema } from '../types';
import { FormArraySchema } from '../models/form-array-schema';

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
    const formGroup = new FormGroupSchema<UserRole>({ key: schema.key, fields: {}, conditions }, options);

    Object.entries(fields).forEach(([key, value]) => {
      formGroup.addControl(key, value instanceof AbstractControl ? value : this._createControl(value, options));
    });

    return formGroup;
  }

  public array<UserRole extends string = string>(
    schema: ArraySchema<UserRole>,
    options?: (AbstractControlOptions | { [key: string]: any }) & { userRoles?: UserRole[] },
  ): FormArraySchema<UserRole, FormSchemaElement<any, UserRole>> {
    const { fields, conditions } = schema;
    const formArray = new FormArraySchema<UserRole>({ key: schema.key, fields: [], conditions }, options);

    fields.forEach((value) => {
      formArray.push(value instanceof AbstractControl ? value : this._createControl(value, options));
    });

    return formArray;
  }

  public control<UserRole extends string = string, T extends ControlSchema<UserRole> = any>(
    template: ControlSchema<UserRole>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions & { userRoles?: UserRole[] } | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControlSchema<UserRole> {
    return new FormControlSchema<UserRole>(template, validatorOrOpts, asyncValidator)
  }






  private _createControl<UserRole extends string = string>(value: AbstractControl | ControlSchema | GroupSchema | ArraySchema, options?: (AbstractControlOptions | { [key: string]: any }) & { userRoles?: UserRole[] }) {
    const isObj = typeof value === "object";
    const isControlSchema = isObj && value?.hasOwnProperty('key') && !value.hasOwnProperty('fields');
    const isGroupSchema = isObj && 'fields' in value && !Array.isArray(value.fields);
    const isArraySchema = isObj && 'fields' in value && Array.isArray(value.fields);
    const newFormBuilder = this.useNonNullable
      ? new NgxFormSchemaBuilder().nonNullable
      : new NgxFormSchemaBuilder();
    const childOptions: { userRoles?: UserRole[]; } | undefined = !!options && typeof options === 'object' && options.hasOwnProperty('userRoles')
      ? { userRoles: options.userRoles }
      : undefined;

    if (isGroupSchema) {
      return newFormBuilder.group<UserRole>(value as GroupSchema<UserRole>, childOptions);
    }
    else if (isArraySchema) {
      return newFormBuilder.array<UserRole>(value as ArraySchema<UserRole>, childOptions);
    }
    else if (isControlSchema) {
      return new FormControlSchema<UserRole>(value as ControlSchema<UserRole>, { nonNullable: this.useNonNullable });
    }

    return null;
  }
}




@Injectable({
  providedIn: 'root',
  useFactory: () => inject(NgxFormSchemaBuilder).nonNullable,
})
export abstract class NgxNonNullableFormSchemaBuilder {
  abstract group<UserRole extends string = string, T extends Record<string, any> = Record<string, any>>(
    schema: T,
    options?: (AbstractControlOptions | { [key: string]: any }) & { userRoles?: UserRole[] } | null,
  ): FormGroupSchema<UserRole, { [K in keyof T]: FormSchemaElement<T[K], UserRole> }>;

  abstract array<UserRole extends string = string>(
    schema: ArraySchema<UserRole>,
    options?: (AbstractControlOptions | { [key: string]: any }) & { userRoles?: UserRole[] } | null
  ): FormArraySchema<UserRole>;

  abstract control<UserRole extends string = string, T extends ControlSchema<UserRole> = any>(
    template: ControlSchema<UserRole>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions & { userRoles?: UserRole[] } | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControlSchema<UserRole>;
}
