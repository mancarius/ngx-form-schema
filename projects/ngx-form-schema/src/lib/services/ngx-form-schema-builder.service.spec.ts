import { TestBed } from '@angular/core/testing';
import { NgxFormSchemaBuilder } from './ngx-form-schema-builder.service';
import { MockService } from 'ng-mocks';
import { FormControlSchema, FormGroupSchema, FormSchemaFieldType } from 'ngx-form-schema';

fdescribe('NgxFormSchemaBuilder', () => {
  let service: NgxFormSchemaBuilder;
  const FormControlSchemaMock = MockService(FormControlSchema);
  const FormGroupSchemaMock = MockService(FormGroupSchema);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFormSchemaBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#control', () => {
    it('should return an instance of FormControlSchema', () => {
      const control = service.control({
        key: 'test',
        label: 'Test',
        type: FormSchemaFieldType.TEXT,
        defaultValue: null,
      });

      expect(control).toBeInstanceOf(FormControlSchema);
    });
  });

  describe('#group', () => {
    it('should return an instance of FormGroupSchema', () => {
      const group = service.group({
        fields: {
          bar: {
            key: 'bar',
            label: 'Bar',
            type: FormSchemaFieldType.TEXT,
            defaultValue: '',
          },
          foo: {
            key: 'foo',
            label: 'Foo',
            type: FormSchemaFieldType.NUMBER,
            defaultValue: ''
          },
          nestedGroup: {
            key: 'nestedGroup',
            fields: {
              rose: {
                key: 'rose',
                label: 'Rose',
                type: FormSchemaFieldType.CHECKBOX,
                defaultValue: ''
              },
              nestedGroup: {
                key: 'nestedGroup',
                fields: {
                  jack: {
                    key: 'jack',
                    label: 'Jack',
                    type: FormSchemaFieldType.CHECKBOX,
                    defaultValue: ''
                  }
                }
              }
            }
          }
        }
      });

      expect(group).toBeInstanceOf(FormGroupSchema);
    });
  });
});
