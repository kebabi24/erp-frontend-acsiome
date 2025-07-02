import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePvReceptionComponent } from './create-pv-reception.component';

describe('CreatePvReceptionComponent', () => {
  let component: CreatePvReceptionComponent;
  let fixture: ComponentFixture<CreatePvReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePvReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePvReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
