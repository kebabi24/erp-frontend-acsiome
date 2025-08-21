import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEpiArticleComponent } from './list-epi-article.component';

describe('ListEpiArticleComponent', () => {
  let component: ListEpiArticleComponent;
  let fixture: ComponentFixture<ListEpiArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEpiArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEpiArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
