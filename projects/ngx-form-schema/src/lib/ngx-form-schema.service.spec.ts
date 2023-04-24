import { TestBed } from '@angular/core/testing';

import { NgxFormSchemaService } from './ngx-form-schema.service';

describe('NgxFormSchemaService', () => {
  let service: NgxFormSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFormSchemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
