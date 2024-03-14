import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBobineWoComponent } from './create-bobine-wo.component';

describe('CreateBobineWoComponent', () => {
  let component: CreateBobineWoComponent;
  let fixture: ComponentFixture<CreateBobineWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBobineWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBobineWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
