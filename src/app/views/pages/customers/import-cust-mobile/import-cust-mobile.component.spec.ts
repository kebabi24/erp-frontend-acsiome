import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCustMobileComponent } from './import-cust-mobile.component';

describe('ImportCustMobileComponent', () => {
  let component: ImportCustMobileComponent;
  let fixture: ComponentFixture<ImportCustMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportCustMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCustMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
