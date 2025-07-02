import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpiCreateOaComponent } from './epi-create-oa.component';

describe('EpiCreateOaComponent', () => {
  let component: EpiCreateOaComponent;
  let fixture: ComponentFixture<EpiCreateOaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpiCreateOaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpiCreateOaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
