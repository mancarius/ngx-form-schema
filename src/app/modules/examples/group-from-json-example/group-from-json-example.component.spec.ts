import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFromJsonExampleComponent } from './group-from-json-example.component';

describe('GroupFromJsonExampleComponent', () => {
  let component: GroupFromJsonExampleComponent;
  let fixture: ComponentFixture<GroupFromJsonExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GroupFromJsonExampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupFromJsonExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
