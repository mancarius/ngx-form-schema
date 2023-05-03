import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { FormControlSchema } from "./form-control-schema";
import { FormSchemaFieldOptions, FormSchemaFieldType } from "./types";

describe('FormControlSchema', () => {

  it('should call checkConditionsAndUpdateState on root value changes', () => {
    const fieldSchema = new FormControlSchema({
      defaultValue: '',
      key: 'foo',
      label: 'Foo',
      type: FormSchemaFieldType.SELECT
    });
    const mockFormGroup = new FormGroup({
      foo: fieldSchema,
      bar: new FormControl('')
    });
    spyOn(fieldSchema, 'checkConditionsAndUpdateState').and.stub();

    expect(mockFormGroup.get('foo')).toBeInstanceOf(FormControlSchema);

    mockFormGroup.get('bar')?.setValue('test');

    expect(fieldSchema.checkConditionsAndUpdateState).toHaveBeenCalledTimes(1);
  });

  describe('setParent', () => {

    it('should call FormControlSchema#_root$.next', () => {
      const fieldSchema = new FormControlSchema({
        defaultValue: '',
        key: 'testField',
        label: 'Test Field',
        type: FormSchemaFieldType.SELECT
      });
      spyOn(fieldSchema['_root$'], 'next').and.stub();
      spyOn(fieldSchema, 'setParent').and.callThrough();

      const mockFormGroup = new FormGroup({ testField: fieldSchema });

      expect(fieldSchema.setParent).toHaveBeenCalledTimes(1);
      expect(fieldSchema['_root$'].next).toHaveBeenCalledTimes(1);
    });

  });

  describe('setUserRoles', () => {

    it('should set _userRoles property to provided roles', () => {
      const fieldSchema = new FormControlSchema({
        defaultValue: '',
        key: 'testField',
        label: 'Test Field',
        validators: {
          required: true
        },
        type: FormSchemaFieldType.SELECT
      });
      const roles = ['admin', 'editor'];

      fieldSchema.setUserRoles?.(roles);

      expect(fieldSchema['_userRoles']).toEqual(roles);
    });

  });

  describe('setOptions', () => {

    it('should set _options$ property to provided options list', () => {
      const fieldSchema = new FormControlSchema({
        defaultValue: '',
        key: 'testField',
        label: 'Test Field',
        validators: {
          required: true
        },
        type: FormSchemaFieldType.SELECT,
        options: [
          { label: 'Option 1', value: 1 },
          { label: 'Option 2', value: 2 }
        ]
      });
      const options = [
        { label: 'Option 3', value: 3 },
        { label: 'Option 4', value: 4 }
      ];

      fieldSchema.setOptions?.(options);

      expect(fieldSchema['_options$'].value).toEqual(options);
    });

    it('should subscribe to provided options observable and update _options$ property accordingly', () => {
      const fieldSchema = new FormControlSchema({
        defaultValue: '',
        key: 'testField',
        label: 'Test Field',
        validators: {
          required: true
        },
        type: FormSchemaFieldType.SELECT,
        options: []
      });
      const options$ = new BehaviorSubject<FormSchemaFieldOptions[]>([
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 }
      ]);

      fieldSchema.setOptions?.(options$);

      expect(fieldSchema['_options$'].value).toEqual(options$.value);

      const newOptions = [
        { label: 'Option 3', value: 3 },
        { label: 'Option 4', value: 4 }
      ];
      options$.next(newOptions);

      expect(fieldSchema['_options$'].value).toEqual(newOptions);
    });

  });

});
