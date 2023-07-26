import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoadRequestComponent } from './create-load-request.component';

describe('CreateNewServiceComponent', () => {
  let component: CreateLoadRequestComponent;
  let fixture: ComponentFixture<CreateLoadRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLoadRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLoadRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
