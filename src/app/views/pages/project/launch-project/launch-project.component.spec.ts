import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchProjectComponent } from './launch-project.component';

describe('LaunchProjectComponent', () => {
  let component: LaunchProjectComponent;
  let fixture: ComponentFixture<LaunchProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
