import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvMobComponent } from './create-inv-mob.component';

describe('CreateInvMobComponent', () => {
  let component: CreateInvMobComponent;
  let fixture: ComponentFixture<CreateInvMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInvMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
