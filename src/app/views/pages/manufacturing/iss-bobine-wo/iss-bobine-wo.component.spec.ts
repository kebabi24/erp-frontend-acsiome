import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssBobineWoComponent } from './iss-bobine-wo.component';

describe('IssBobineWoComponent', () => {
  let component: IssBobineWoComponent;
  let fixture: ComponentFixture<IssBobineWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssBobineWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssBobineWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
