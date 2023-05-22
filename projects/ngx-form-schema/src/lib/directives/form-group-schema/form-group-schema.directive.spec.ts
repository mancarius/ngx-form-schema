import { FormGroupSchemaDirective } from './form-group-schema.directive';

describe('FormGroupSchemaDirective', () => {
  it('should create an instance', () => {
    const directive = new FormGroupSchemaDirective([], []);
    expect(directive).toBeTruthy();
  });
});
