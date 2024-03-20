import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStdProviderComponent } from './create-std-provider.component';

describe('CreateStdProviderComponent', () => {
  let component: CreateStdProviderComponent;
  let fixture: ComponentFixture<CreateStdProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStdProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStdProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
