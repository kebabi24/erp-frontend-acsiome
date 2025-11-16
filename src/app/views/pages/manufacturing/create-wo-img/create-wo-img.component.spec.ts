import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWoImgComponent } from './create-wo-img.component';

describe('CreateWoImgComponent', () => {
  let component: CreateWoImgComponent;
  let fixture: ComponentFixture<CreateWoImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWoImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWoImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
