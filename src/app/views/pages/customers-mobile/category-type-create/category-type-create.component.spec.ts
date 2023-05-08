import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTypeCreateComponent } from './category-type-create.component';

describe('CategoryTypeCreateComponent', () => {
  let component: CategoryTypeCreateComponent;
  let fixture: ComponentFixture<CategoryTypeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryTypeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
