import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequestGroupComponent } from './create-request-group.component';

describe('CreateRequestGroupComponent', () => {
  let component: CreateRequestGroupComponent;
  let fixture: ComponentFixture<CreateRequestGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRequestGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRequestGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
