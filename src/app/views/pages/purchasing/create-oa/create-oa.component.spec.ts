import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOaComponent } from './create-oa.component';

describe('CreateOaComponent', () => {
  let component: CreateOaComponent;
  let fixture: ComponentFixture<CreateOaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
