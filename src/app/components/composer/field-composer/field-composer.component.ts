import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FormControlSchema, FormSchemaFieldType } from 'ngx-form-schema';

@Component({
  selector: 'app-field-composer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './field-composer.component.html',
  styleUrls: ['./field-composer.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldComposerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FieldComposerComponent),
      multi: true,
    }
  ]
})
export class FieldComposerComponent implements ControlValueAccessor {
  protected control!: FormControlSchema;

  fieldTypes = FormSchemaFieldType;

  writeValue(obj: any): void { }

  registerOnChange(fn: any): void { }

  registerOnTouched(fn: any): void { }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.control) {
      this.control = control as FormControlSchema;
    }

    return this.control.errors;
  }
}
