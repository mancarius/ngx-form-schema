import { TestBed } from '@angular/core/testing';
import { NgxFormSchemaBuilder } from './ngx-form-schema-builder.service';
import { MockService } from 'ng-mocks';
import { FormControlSchema, FormGroupSchema, FormSchemaFieldType } from 'ngx-form-schema';
import { FormArraySchema } from '../models/form-array-schema';

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
          nestedGroup: {
            key: 'nestedGroup',
            fields: {
              foo: {
                key: 'foo',
                label: 'Foo',
                type: FormSchemaFieldType.NUMBER,
                defaultValue: ''
              },
            }
          }
        }
      });

      expect(group).toBeInstanceOf(FormGroupSchema);
      expect(group.get('bar')).toBeInstanceOf(FormControlSchema);
      expect(group.get('nestedGroup')).toBeInstanceOf(FormGroupSchema);
      expect(group.get('nestedGroup.foo')).toBeInstanceOf(FormControlSchema);
    });
  });

  describe('#array', () => {
    it('should return an instance of FormArraySchema', () => {
      const array = service.array({
        fields: [
          {
            key: 'bar',
            label: 'Bar',
            type: FormSchemaFieldType.TEXT,
            defaultValue: '',
          },
          {
            key: 'nestedGroup',
            fields: {
              foo: {
                key: 'foo',
                label: 'Foo',
                type: FormSchemaFieldType.NUMBER,
                defaultValue: 2
              },

            }
          }]
      });

      expect(array).toBeInstanceOf(FormArraySchema);
      expect(array.at(0)).toBeInstanceOf(FormControlSchema);
      expect(array.at(1)).toBeInstanceOf(FormGroupSchema);
      expect((array.at(1) as FormGroupSchema).get('foo')).toBeInstanceOf(FormControlSchema);
      expect((array.at(1) as FormGroupSchema).get('foo').value).toBe(2);
    });
  });
});
