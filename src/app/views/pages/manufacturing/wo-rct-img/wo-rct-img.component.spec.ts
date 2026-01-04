import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoRctImgComponent } from './wo-rct-img.component';

describe('WoRctImgComponent', () => {
  let component: WoRctImgComponent;
  let fixture: ComponentFixture<WoRctImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoRctImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoRctImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
