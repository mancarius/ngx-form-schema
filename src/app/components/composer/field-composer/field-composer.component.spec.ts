import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldComposerComponent } from './field-composer.component';

describe('FieldComposerComponent', () => {
  let component: FieldComposerComponent;
  let fixture: ComponentFixture<FieldComposerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FieldComposerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
