import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModPfComponent } from './create-mod-pf.component';

describe('CreateModPfComponent', () => {
  let component: CreateModPfComponent;
  let fixture: ComponentFixture<CreateModPfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModPfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModPfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
