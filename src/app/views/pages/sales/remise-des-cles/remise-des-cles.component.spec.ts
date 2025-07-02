import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemiseDesClesComponent } from './remise-des-cles.component';

describe('RemiseDesClesComponent', () => {
  let component: RemiseDesClesComponent;
  let fixture: ComponentFixture<RemiseDesClesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemiseDesClesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemiseDesClesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
