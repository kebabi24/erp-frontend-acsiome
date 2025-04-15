import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSoBcComponent } from './create-so-bc.component';

describe('CreateSoBcComponent', () => {
  let component: CreateSoBcComponent;
  let fixture: ComponentFixture<CreateSoBcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSoBcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSoBcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
