import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEpiTempsComponent } from './list-epi-temps.component';

describe('ListEpiTempsComponent', () => {
  let component: ListEpiTempsComponent;
  let fixture: ComponentFixture<ListEpiTempsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEpiTempsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEpiTempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
