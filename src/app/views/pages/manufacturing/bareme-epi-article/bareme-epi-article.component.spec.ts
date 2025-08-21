import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaremeEpiArticleComponent } from './bareme-epi-article.component';

describe('BaremeEpiArticleComponent', () => {
  let component: BaremeEpiArticleComponent;
  let fixture: ComponentFixture<BaremeEpiArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaremeEpiArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaremeEpiArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
