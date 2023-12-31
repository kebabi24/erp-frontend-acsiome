import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseWoComponent } from './release-wo.component';

describe('ReleaseWoComponent', () => {
  let component: ReleaseWoComponent;
  let fixture: ComponentFixture<ReleaseWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
