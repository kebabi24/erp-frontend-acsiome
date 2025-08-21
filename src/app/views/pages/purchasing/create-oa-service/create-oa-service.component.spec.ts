import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOaServiceComponent } from './create-oa-service.component';

describe('CreateOaServiceComponent', () => {
  let component: CreateOaServiceComponent;
  let fixture: ComponentFixture<CreateOaServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOaServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOaServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
