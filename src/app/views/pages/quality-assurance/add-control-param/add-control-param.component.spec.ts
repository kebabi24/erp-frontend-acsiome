import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddControlParamaterComponent } from './add-control-param.component';

describe('AddControlParamaterComponent', () => {
  let component: AddControlParamaterComponent;
  let fixture: ComponentFixture<AddControlParamaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddControlParamaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddControlParamaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
