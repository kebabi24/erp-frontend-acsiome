import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModComponent } from './list-mod.component';

describe('ListModComponent', () => {
  let component: ListModComponent;
  let fixture: ComponentFixture<ListModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
