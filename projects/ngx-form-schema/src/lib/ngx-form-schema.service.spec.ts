import { TestBed } from '@angular/core/testing';

import { NgxFormSchemaBuilder } from './ngx-form-schema.service';

describe('NgxFormSchemaService', () => {
  let service: NgxFormSchemaBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFormSchemaBuilder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
