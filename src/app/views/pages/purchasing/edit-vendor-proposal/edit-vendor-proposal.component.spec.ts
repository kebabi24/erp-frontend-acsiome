import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVendorProposalComponent } from './edit-vendor-proposal.component';

describe('EditVendorProposalComponent', () => {
  let component: EditVendorProposalComponent;
  let fixture: ComponentFixture<EditVendorProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVendorProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVendorProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
