import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCaTypeComponent } from './list-ca-type.component';

describe('ListCaTypeComponent', () => {
  let component: ListCaTypeComponent;
  let fixture: ComponentFixture<ListCaTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCaTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCaTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
