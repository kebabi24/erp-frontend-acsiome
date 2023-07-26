import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCostlistComponent } from './create-costlist.component';

describe('CreateCostlistComponent', () => {
  let component: CreateCostlistComponent;
  let fixture: ComponentFixture<CreateCostlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCostlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCostlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
