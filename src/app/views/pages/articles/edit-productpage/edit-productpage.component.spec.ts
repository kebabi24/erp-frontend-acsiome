import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductpageComponent } from './edit-productpage.component';

describe('EditProductpageComponent', () => {
  let component: EditProductpageComponent;
  let fixture: ComponentFixture<EditProductpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProductpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
