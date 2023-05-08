import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmpTempComponent } from './list-emp-temp.component';

describe('ListEmpTempComponent', () => {
  let component: ListEmpTempComponent;
  let fixture: ComponentFixture<ListEmpTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmpTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmpTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
