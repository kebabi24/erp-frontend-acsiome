import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewServiceComponent } from './create-new-service.component';

describe('CreateNewServiceComponent', () => {
  let component: CreateNewServiceComponent;
  let fixture: ComponentFixture<CreateNewServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
