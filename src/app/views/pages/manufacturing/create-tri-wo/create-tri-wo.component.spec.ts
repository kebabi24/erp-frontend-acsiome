import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTriWoComponent } from './create-tri-wo.component';

describe('CreateTriWoComponent', () => {
  let component: CreateTriWoComponent;
  let fixture: ComponentFixture<CreateTriWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTriWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTriWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
