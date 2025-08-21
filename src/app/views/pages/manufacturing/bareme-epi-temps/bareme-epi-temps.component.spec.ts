import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaremeEpiTempsComponent } from './bareme-epi-temps.component';

describe('BaremeEpiTempsComponent', () => {
  let component: BaremeEpiTempsComponent;
  let fixture: ComponentFixture<BaremeEpiTempsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaremeEpiTempsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaremeEpiTempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
