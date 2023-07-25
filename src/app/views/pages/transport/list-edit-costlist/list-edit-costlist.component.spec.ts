import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEditCostlistComponent } from './list-edit-costlist.component';

describe('ListEditCostlistComponent', () => {
  let component: ListEditCostlistComponent;
  let fixture: ComponentFixture<ListEditCostlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEditCostlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEditCostlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
