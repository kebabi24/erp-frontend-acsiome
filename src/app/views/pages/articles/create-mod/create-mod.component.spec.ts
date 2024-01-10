import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModComponent } from './create-mod.component';

describe('CreateModComponent', () => {
  let component: CreateModComponent;
  let fixture: ComponentFixture<CreateModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
