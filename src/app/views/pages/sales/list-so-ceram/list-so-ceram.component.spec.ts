import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSoCeramComponent } from './list-so-ceram.component';

describe('ListSoCeramComponent', () => {
  let component: ListSoCeramComponent;
  let fixture: ComponentFixture<ListSoCeramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSoCeramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSoCeramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
