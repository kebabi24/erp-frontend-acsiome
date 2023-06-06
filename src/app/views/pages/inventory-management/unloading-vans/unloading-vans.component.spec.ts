import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloadingVansComponent } from './unloading-vans.component';

describe('UnloadingVansComponent', () => {
  let component: UnloadingVansComponent;
  let fixture: ComponentFixture<UnloadingVansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnloadingVansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnloadingVansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
