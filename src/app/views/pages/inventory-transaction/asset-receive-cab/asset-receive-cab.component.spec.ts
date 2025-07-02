import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetReceiveCabComponent } from './asset-receive-cab.component';

describe('AssetReceiveCabComponent', () => {
  let component: AssetReceiveCabComponent;
  let fixture: ComponentFixture<AssetReceiveCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetReceiveCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetReceiveCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
