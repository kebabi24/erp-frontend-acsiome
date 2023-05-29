import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrintersComponent } from './list-printers.component';

describe('ListPrintersComponent', () => {
  let component: ListPrintersComponent;
  let fixture: ComponentFixture<ListPrintersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPrintersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPrintersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
