import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFcComponent } from './update-fc.component';

describe('UpdateFcComponent', () => {
  let component: UpdateFcComponent;
  let fixture: ComponentFixture<UpdateFcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
