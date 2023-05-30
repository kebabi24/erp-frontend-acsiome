import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPrintersComponent } from './setting-printers.component';

describe('SettingPrintersComponent', () => {
  let component: SettingPrintersComponent;
  let fixture: ComponentFixture<SettingPrintersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingPrintersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPrintersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
