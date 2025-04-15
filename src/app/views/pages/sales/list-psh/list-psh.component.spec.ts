import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPshComponent } from './list-psh.component';

describe('ListPshComponent', () => {
  let component: ListPshComponent;
  let fixture: ComponentFixture<ListPshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
