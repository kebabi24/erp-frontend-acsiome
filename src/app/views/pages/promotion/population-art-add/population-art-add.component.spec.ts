import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulationArticleAddComponent } from './population-art-add.component';

describe('PopulationArticleAddComponent', () => {
  let component: PopulationArticleAddComponent;
  let fixture: ComponentFixture<PopulationArticleAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopulationArticleAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopulationArticleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
