import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModMpComponent } from './create-mod-mp.component';

describe('CreateModMpComponent', () => {
  let component: CreateModMpComponent;
  let fixture: ComponentFixture<CreateModMpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModMpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModMpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
