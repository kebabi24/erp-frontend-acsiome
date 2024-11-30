import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCaDdComponent } from './list-ca-dd.component';

describe('ListCaDdComponent', () => {
  let component: ListCaDdComponent;
  let fixture: ComponentFixture<ListCaDdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCaDdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCaDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
