import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingVansScanComponent } from './loading-vans-scan.component';

describe('LoadingVansScanComponent', () => {
  let component: LoadingVansScanComponent;
  let fixture: ComponentFixture<LoadingVansScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingVansScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingVansScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
