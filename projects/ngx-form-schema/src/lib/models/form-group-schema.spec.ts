import { FormGroupSchema } from './form-group-schema';
import { FormControlSchema } from './form-control-schema';
import { ControlSchema, FormSchemaFieldType } from 'ngx-form-schema';

type UserRole = 'admin' | 'user';

fdescribe('FormGroupSchema', () => {
  let formGroup: FormGroupSchema;
  const mockSchemas: { [key: string]: ControlSchema<UserRole> } = {
    name: { key: 'name', label: 'Name', type: FormSchemaFieldType.TEXT, defaultValue: 'foo' },
    age: { key: 'age', label: 'Age', type: FormSchemaFieldType.NUMBER, defaultValue: 18 },
    email: { key: 'email', label: 'Email', type: FormSchemaFieldType.EMAIL, defaultValue: 'example@mail.com'}
  }

  beforeEach(() => {
    formGroup = new FormGroupSchema({
      key: 'testGroup',
      fields: {
        name: new FormControlSchema<UserRole>(mockSchemas['name']),
        age: new FormControlSchema<UserRole>(mockSchemas['age']),
      },
    });
  });

  it('should create', () => {
    expect(formGroup).toBeTruthy();
  });

  it('should set user roles for all controls', () => {
    formGroup.setUserRoles(['admin', 'user']);
    expect((formGroup.get('name') as FormControlSchema)['_userRoles']).toEqual(['admin', 'user']);
    expect((formGroup.get('age') as FormControlSchema)['_userRoles']).toEqual(['admin', 'user']);
  });

  it('should add control and set user roles', () => {
    const control = new FormControlSchema<UserRole>(mockSchemas['email']);
    formGroup.addControl('email', control);
    formGroup.setUserRoles(['admin']);
    expect((formGroup.get('email') as FormControlSchema)['_userRoles']).toEqual(['admin']);
  });

  it('should set control and update value and validity by schema', () => {
    const control = new FormControlSchema<UserRole>(mockSchemas['email']);
    formGroup.addControl('email', control);
    formGroup.setUserRoles(['admin']);
    formGroup.setControl('email', new FormControlSchema<string>({ ...mockSchemas['email'], defaultValue: 'foo@bar.com' }));
    expect(formGroup.get('email')?.value).toEqual('foo@bar.com');
    expect(formGroup.get('email')?.valid).toBeTruthy();
  });
});
