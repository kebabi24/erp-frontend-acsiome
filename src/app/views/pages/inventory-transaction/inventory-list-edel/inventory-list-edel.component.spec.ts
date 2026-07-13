import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryListEdelComponent } from './inventory-list-edel.component';

describe('InventoryListEdelComponent', () => {
  let component: InventoryListEdelComponent;
  let fixture: ComponentFixture<InventoryListEdelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryListEdelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryListEdelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
