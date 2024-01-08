import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapBroyageComponent } from './recap-broyage.component';

describe('RecapBroyageComponent', () => {
  let component: RecapBroyageComponent;
  let fixture: ComponentFixture<RecapBroyageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecapBroyageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapBroyageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
