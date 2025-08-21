import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStdProviderComponent } from './list-std-provider.component';

describe('ListStdProviderComponent', () => {
  let component: ListStdProviderComponent;
  let fixture: ComponentFixture<ListStdProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListStdProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStdProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
