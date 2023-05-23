import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlSchema, FormSchemaFieldType, CONTROL_SELF_REF, ControlSchema } from 'ngx-form-schema';
import { ReactiveFormsModule, Validators } from '@angular/forms';

const FORM_CONTROL_SCHEMA: ControlSchema = {
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
export class SingleControlExampleComponent implements OnInit {

  fieldTypes = FormSchemaFieldType;
  control!: FormControlSchema;

  get fieldTypeList() {
    return Object.values(FormSchemaFieldType);
  }

  get typeOfValue() {
    return typeof this.control.value;
  }

  ngOnInit(): void {
    this.reset();
  }

  protected setFieldType(type: any): void {
    this.control.setFieldType(type);
  }

  protected reset(): void {
    this.control = new FormControlSchema(FORM_CONTROL_SCHEMA, Validators.required);
  }
}
