import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDownComponent } from './asset-down.component';

describe('AssetDownComponent', () => {
  let component: AssetDownComponent;
  let fixture: ComponentFixture<AssetDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
