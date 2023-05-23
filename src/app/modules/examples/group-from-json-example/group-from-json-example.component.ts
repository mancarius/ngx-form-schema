import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComposerComponent } from 'src/app/components/composer/field-composer/field-composer.component';
import { FieldRefDirective, FormSchemaFieldType, GroupSchema, NgxFormSchemaBuilder, NgxFormSchemaModule } from 'ngx-form-schema';
import { FormComposerModule } from 'src/app/components/composer/form-composer/form-composer.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const FORM_GROUP_SCHEMA: GroupSchema = {
  fields: {
    name: {
      key: 'name',
      label: 'Name',
      defaultValue: '',
      type: FormSchemaFieldType.TEXT,
      size: 'md',
      dependencies: ['age'],
      conditions: {
        readonlyIf: `age < 18`
      }
    },
    age: {
      key: 'age',
      label: 'Age',
      defaultValue: 18,
      type: FormSchemaFieldType.NUMBER,
      size: 'sm'
    },
    data: {
      key: 'data',
      fields: {
        name1: {
          key: 'name1',
          label: 'Name1',
          defaultValue: '',
          type: FormSchemaFieldType.TEXT,
          size: 'md',
          dependencies: ['data.age1'],
          conditions: {
            readonlyIf: `data.age1 < 18`
          }
        },
        age1: {
          key: 'age1',
          label: 'Age1',
          defaultValue: 18,
          type: FormSchemaFieldType.NUMBER,
          size: 'sm'
        },
      }
    },
    list: {
      key: 'list',
      fields: [
        {
          key: 'item1',
          label: 'Item 1',
          type: FormSchemaFieldType.TEXT,
          defaultValue: null
        },
        {
          key: 'item2',
          label: 'Item 2',
          type: FormSchemaFieldType.TEXT,
          defaultValue: "i'm a default value",
          validators: {
            required: true
          }
        }
      ]
    }
  }
};

@Component({
  selector: 'app-group-from-json-example',
  standalone: true,
  imports: [
    CommonModule,
    FieldComposerComponent,
    NgxFormSchemaModule,
    FormComposerModule,
  ],
  templateUrl: './group-from-json-example.component.html',
  styleUrls: ['./group-from-json-example.component.css']
})
export class GroupFromJsonExampleComponent {
  group = inject(NgxFormSchemaBuilder).nonNullable.group(FORM_GROUP_SCHEMA);

  reset(): void {
    this.group.reset();
  }
}
