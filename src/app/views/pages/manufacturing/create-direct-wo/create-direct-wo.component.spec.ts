import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectWoComponent } from './create-direct-wo.component';

describe('CreateDirectWoComponent', () => {
  let component: CreateDirectWoComponent;
  let fixture: ComponentFixture<CreateDirectWoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDirectWoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDirectWoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
