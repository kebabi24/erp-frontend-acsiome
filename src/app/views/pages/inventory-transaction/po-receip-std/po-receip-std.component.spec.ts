import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReceipStdComponent } from './po-receip-std.component';

describe('PoReceipStdComponent', () => {
  let component: PoReceipStdComponent;
  let fixture: ComponentFixture<PoReceipStdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoReceipStdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoReceipStdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
