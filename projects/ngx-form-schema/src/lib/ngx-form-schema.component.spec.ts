import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFormSchemaComponent } from './ngx-form-schema.component';

describe('NgxFormSchemaComponent', () => {
  let component: NgxFormSchemaComponent;
  let fixture: ComponentFixture<NgxFormSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxFormSchemaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxFormSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
