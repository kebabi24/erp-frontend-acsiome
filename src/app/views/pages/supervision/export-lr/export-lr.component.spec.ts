import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLrComponent } from './export-lr.component';

describe('ExportLrComponent', () => {
  let component: ExportLrComponent;
  let fixture: ComponentFixture<ExportLrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportLrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
