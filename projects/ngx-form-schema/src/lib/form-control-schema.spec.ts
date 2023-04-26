import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { FormControlSchema } from "./form-control-schema";
import { FormSchemaFieldOptions, FormSchemaFieldType } from "./types";

describe('FormControlSchema', () => {

  describe('setParent', () => {

    it('should subscribe to value changes of the parent form group and call checkConditionsAndUpdateState method', () => {
      const mockFormGroup = new FormGroup({
        testField: new FormControl('')
      });
      spyOn(mockFormGroup.valueChanges, 'subscribe').and.callThrough();
      spyOn(FormControlSchema.prototype, 'checkConditionsAndUpdateState');

      const fieldSchema = new FormControlSchema({
        defaultValue: '',
        key: 'testField',
        label: 'Test Field',
        validators: {
          required: true
        },
        type: FormSchemaFieldType.SELECT
      });

      fieldSchema.setParent(mockFormGroup);

      expect(mockFormGroup.valueChanges.subscribe).toHaveBeenCalled();
      expect(FormControlSchema.prototype.checkConditionsAndUpdateState).toHaveBeenCalled();
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
