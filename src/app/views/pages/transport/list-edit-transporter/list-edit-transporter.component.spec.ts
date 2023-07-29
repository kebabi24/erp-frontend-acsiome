import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEditTransporterComponent } from './list-edit-transporter.component';

describe('ListEditTransporterComponent', () => {
  let component: ListEditTransporterComponent;
  let fixture: ComponentFixture<ListEditTransporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEditTransporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEditTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
