import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorctEntryPalComponent } from './worct-entry-pal.component';

describe('WorctEntryPalComponent', () => {
  let component: WorctEntryPalComponent;
  let fixture: ComponentFixture<WorctEntryPalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorctEntryPalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorctEntryPalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
