import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModDivComponent } from './create-mod-div.component';

describe('CreateModDivComponent', () => {
  let component: CreateModDivComponent;
  let fixture: ComponentFixture<CreateModDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
