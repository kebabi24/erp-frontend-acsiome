import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvantageAddComponent } from './advantage-add.component';

describe('AdvantageAddComponent', () => {
  let component: AdvantageAddComponent;
  let fixture: ComponentFixture<AdvantageAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvantageAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvantageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
