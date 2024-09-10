import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBobineModComponent } from './create-bobine-mod.component';

describe('CreateBobineModComponent', () => {
  let component: CreateBobineModComponent;
  let fixture: ComponentFixture<CreateBobineModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBobineModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBobineModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
