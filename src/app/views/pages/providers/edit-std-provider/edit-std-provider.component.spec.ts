import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStdProviderComponent } from './edit-std-provider.component';

describe('EditStdProviderComponent', () => {
  let component: EditStdProviderComponent;
  let fixture: ComponentFixture<EditStdProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStdProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStdProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
