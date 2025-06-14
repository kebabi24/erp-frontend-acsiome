import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInventoryRoleComponent } from './print-inventory-role.component';

describe('PrintInventoryRoleComponent', () => {
  let component: PrintInventoryRoleComponent;
  let fixture: ComponentFixture<PrintInventoryRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintInventoryRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintInventoryRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
