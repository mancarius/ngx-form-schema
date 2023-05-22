import { NgModule } from '@angular/core';
import { NgxFormSchemaBuilder } from './services/ngx-form-schema-builder.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroupSchemaDirective } from './directives/form-group-schema/form-group-schema.directive';
import { FieldRefDirective } from 'ngx-form-schema';


@NgModule({
  declarations: [FormGroupSchemaDirective, FieldRefDirective],
  imports: [ReactiveFormsModule, FormsModule],
  providers: [NgxFormSchemaBuilder],
  exports: [ReactiveFormsModule, FormsModule, FormGroupSchemaDirective, FieldRefDirective]
})
export class NgxFormSchemaModule { }
