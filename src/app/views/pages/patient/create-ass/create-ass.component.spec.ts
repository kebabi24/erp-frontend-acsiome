import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssComponent } from './create-ass.component';

describe('CreateAssComponent', () => {
  let component: CreateAssComponent;
  let fixture: ComponentFixture<CreateAssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
