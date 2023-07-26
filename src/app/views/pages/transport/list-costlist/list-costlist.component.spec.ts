import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCostlistComponent } from './list-costlist.component';

describe('ListCostlistComponent', () => {
  let component: ListCostlistComponent;
  let fixture: ComponentFixture<ListCostlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCostlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCostlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
