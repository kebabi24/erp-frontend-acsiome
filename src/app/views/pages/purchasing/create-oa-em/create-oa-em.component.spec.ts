import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOaEmComponent } from './create-oa-em.component';

describe('CreateOaEmComponent', () => {
  let component: CreateOaEmComponent;
  let fixture: ComponentFixture<CreateOaEmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOaEmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOaEmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
