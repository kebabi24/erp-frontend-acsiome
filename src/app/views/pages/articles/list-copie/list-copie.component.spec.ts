import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCopieComponent } from './list-copie.component';

describe('ListCopieComponent', () => {
  let component: ListCopieComponent;
  let fixture: ComponentFixture<ListCopieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCopieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCopieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
