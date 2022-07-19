import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewMenuComponent } from './create-new-menu.component';

describe('CreateNewMenuComponent', () => {
  let component: CreateNewMenuComponent;
  let fixture: ComponentFixture<CreateNewMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
