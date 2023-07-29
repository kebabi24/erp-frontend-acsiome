import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCostlistComponent } from './edit-costlist.component';

describe('EditCostlistComponent', () => {
  let component: EditCostlistComponent;
  let fixture: ComponentFixture<EditCostlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCostlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCostlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
