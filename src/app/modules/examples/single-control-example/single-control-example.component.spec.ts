import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleControlExampleComponent } from './single-control-example.component';

describe('SingleControlExampleComponent', () => {
  let component: SingleControlExampleComponent;
  let fixture: ComponentFixture<SingleControlExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SingleControlExampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleControlExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
