import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoPlqComponent } from './create-so-plq.component';

describe('CreateSoPlqComponent', () => {
  let component: CreateSoPlqComponent;
  let fixture: ComponentFixture<CreateSoPlqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSoPlqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSoPlqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
