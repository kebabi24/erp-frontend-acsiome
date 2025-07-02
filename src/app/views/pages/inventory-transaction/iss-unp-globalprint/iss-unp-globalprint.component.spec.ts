import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssUnpGlobalprintComponent } from './iss-unp-globalprint.component';

describe('IssUnpGlobalprintComponent', () => {
  let component: IssUnpGlobalprintComponent;
  let fixture: ComponentFixture<IssUnpGlobalprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssUnpGlobalprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssUnpGlobalprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
