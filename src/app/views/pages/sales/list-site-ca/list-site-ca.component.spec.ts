import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSiteCaComponent } from './list-site-ca.component';

describe('ListSiteCaComponent', () => {
  let component: ListSiteCaComponent;
  let fixture: ComponentFixture<ListSiteCaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSiteCaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSiteCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
