import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWoSfComponent } from './create-wo-sf.component';

describe('CreateWoSfComponent', () => {
  let component: CreateWoSfComponent;
  let fixture: ComponentFixture<CreateWoSfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWoSfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWoSfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
