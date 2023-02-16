import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyInventoryComponent } from './weekly-inventory.component';

describe('WeeklyInventoryComponent', () => {
  let component: WeeklyInventoryComponent;
  let fixture: ComponentFixture<WeeklyInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
