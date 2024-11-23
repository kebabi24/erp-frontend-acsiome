import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopieArticleComponent } from './copie-article.component';

describe('CopieArticleComponent', () => {
  let component: CopieArticleComponent;
  let fixture: ComponentFixture<CopieArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopieArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopieArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
