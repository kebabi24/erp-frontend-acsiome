import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStatusProjectComponent } from './update-status-project.component';

describe('UpdateStatusProjectComponent', () => {
  let component: UpdateStatusProjectComponent;
  let fixture: ComponentFixture<UpdateStatusProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateStatusProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStatusProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
