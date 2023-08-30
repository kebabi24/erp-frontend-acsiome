import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWoSoComponent } from './create-wo-so.component';

describe('CreateWoSoComponent', () => {
  let component: CreateWoSoComponent;
  let fixture: ComponentFixture<CreateWoSoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWoSoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWoSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
