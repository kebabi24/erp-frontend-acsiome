import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStdItemComponent } from './create-std-item.component';

describe('CreateStdItemComponent', () => {
  let component: CreateStdItemComponent;
  let fixture: ComponentFixture<CreateStdItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStdItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStdItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
