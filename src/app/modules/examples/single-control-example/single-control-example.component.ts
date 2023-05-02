import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlSchemaTemplate, FormControlSchema, FormSchemaFieldType, CONTROL_SELF_REF } from 'ngx-form-schema';
import { ReactiveFormsModule } from '@angular/forms';

const FORM_CONTROL_SCHEMA: ControlSchemaTemplate = {
  key: 'counter',
  label: 'Counter',
  defaultValue: 0,
  type: FormSchemaFieldType.NUMBER,
  size: 'sm',
  dependencies: [CONTROL_SELF_REF],
  conditions: {
    readonlyIf: `${CONTROL_SELF_REF} == '1'`
  }
};

@Component({
  selector: 'app-single-control-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './single-control-example.component.html',
  styleUrls: ['./single-control-example.component.css']
})
export class SingleControlExampleComponent {

  fieldTypes = FormSchemaFieldType;
  control = new FormControlSchema(FORM_CONTROL_SCHEMA);

  get fieldTypeList() {
    return Object.values(FormSchemaFieldType);
  }

  get typeOfValue() {
    return typeof this.control.value;
  }

  protected setFieldType(type: any): void {
    this.control.setFieldType(type);
  }
}
