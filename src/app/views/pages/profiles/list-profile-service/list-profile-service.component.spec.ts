import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProfileServiceComponent } from './list-profile-service.component';

describe('ListProfileServiceComponent', () => {
  let component: ListProfileServiceComponent;
  let fixture: ComponentFixture<ListProfileServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProfileServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProfileServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
