import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReceipIdComponent } from './po-receip-id.component';

describe('PoReceipIdComponent', () => {
  let component: PoReceipIdComponent;
  let fixture: ComponentFixture<PoReceipIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReceipIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReceipIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
