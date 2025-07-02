import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PshListComponent } from './psh-list.component';

describe('PshListComponent', () => {
  let component: PshListComponent;
  let fixture: ComponentFixture<PshListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PshListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PshListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
