import { Component, ContentChild, OnInit, Optional } from '@angular/core';
import { FieldRefDirective, FormControlOrGroupSchema, FormControlSchema, FormGroupSchema } from 'ngx-form-schema';
import { ControlContainer, FormArray, FormGroup } from '@angular/forms';
import { FormArraySchema } from 'ngx-form-schema';

@Component({
  selector: 'app-form-composer',
  templateUrl: './form-composer.component.html',
  styleUrls: ['./form-composer.component.css'],
})
export class FormComposerComponent implements OnInit {
  @ContentChild(FieldRefDirective) fieldTemplate!: FieldRefDirective;

  protected formGroup!: FormGroupSchema;

  constructor(@Optional() private controlContainer: ControlContainer) {}

  get controls() {
    return Object.values<FormControlOrGroupSchema>(this.formGroup.getControls());
  }

  /**
   * @ Init
   */
  ngOnInit(): void {
    this.formGroup = this.controlContainer?.control as FormGroupSchema ?? new FormGroupSchema({fields: {}});
    console.log('FormComposerComponent.ngOnInit', this.formGroup)
  }

  getControlType(control: any) {
    return control instanceof FormGroup ? 'group' :
      control instanceof FormArray ? 'array' :
        'control'
  }

  getControlKey(control: FormControlSchema | FormGroupSchema | FormArraySchema) {
    return control.key;
  }

  /**
   * Return a FormGroupSchema control
   * @param control
   * @returns
   */
  asFormGroupSchema(control: FormControlSchema | FormGroupSchema | FormArraySchema): FormGroupSchema {
    return control as FormGroupSchema;
  }

  /**
   * Return a FormGroupSchema control
   * @param control
   * @returns
   */
  asFormArraySchema(control: FormControlSchema | FormGroupSchema | FormArraySchema): FormArraySchema {
    return control as FormArraySchema;
  }

  getControls(control: FormControlSchema | FormGroupSchema | FormArraySchema) {
    return control instanceof FormGroupSchema ? control.getControls() :
      control instanceof FormArraySchema ? control.controls :
        []
  }
}
