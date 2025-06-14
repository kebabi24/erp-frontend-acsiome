import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAuComponent } from './list-au.component';

describe('ListAuComponent', () => {
  let component: ListAuComponent;
  let fixture: ComponentFixture<ListAuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
