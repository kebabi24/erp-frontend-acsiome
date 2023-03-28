import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewTokenComponent } from './create-new-token.component';

describe('CreateNewTokenComponent', () => {
  let component: CreateNewTokenComponent;
  let fixture: ComponentFixture<CreateNewTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
