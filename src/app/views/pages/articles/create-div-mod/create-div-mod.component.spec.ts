import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDivModComponent } from './create-div-mod.component';

describe('CreateDivModComponent', () => {
  let component: CreateDivModComponent;
  let fixture: ComponentFixture<CreateDivModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDivModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDivModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
