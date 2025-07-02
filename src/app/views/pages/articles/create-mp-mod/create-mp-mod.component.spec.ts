import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMpModComponent } from './create-mp-mod.component';

describe('CreateMpModComponent', () => {
  let component: CreateMpModComponent;
  let fixture: ComponentFixture<CreateMpModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMpModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMpModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
