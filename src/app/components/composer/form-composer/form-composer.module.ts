import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FieldRefDirective, NgxFormSchemaModule } from 'ngx-form-schema';
import { FormComposerComponent } from './form-composer.component';



@NgModule({
  declarations: [FormComposerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxFormSchemaModule
  ],
  exports: [FormComposerComponent]
})
export class FormComposerModule { }
