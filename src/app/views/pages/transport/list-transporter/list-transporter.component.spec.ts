import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTransporterComponent } from './list-transporter.component';

describe('ListTransporterComponent', () => {
  let component: ListTransporterComponent;
  let fixture: ComponentFixture<ListTransporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTransporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
