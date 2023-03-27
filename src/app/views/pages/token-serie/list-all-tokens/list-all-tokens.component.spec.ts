import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllTokensComponent } from './list-all-tokens.component';

describe('ListAllTokensComponent', () => {
  let component: ListAllTokensComponent;
  let fixture: ComponentFixture<ListAllTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllTokensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
