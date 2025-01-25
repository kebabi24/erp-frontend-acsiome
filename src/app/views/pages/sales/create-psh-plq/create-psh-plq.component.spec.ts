import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePshPlqComponent } from './create-psh-plq.component';

describe('CreatePshPlqComponent', () => {
  let component: CreatePshPlqComponent;
  let fixture: ComponentFixture<CreatePshPlqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePshPlqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePshPlqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
