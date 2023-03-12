import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingVansComponent } from './loading-vans.component';

describe('InventoryOfDateComponent', () => {
  let component: LoadingVansComponent;
  let fixture: ComponentFixture<LoadingVansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingVansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingVansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
