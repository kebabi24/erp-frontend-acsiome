import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubClusterCreateComponent } from './cluster-sub-create.component';

describe('ClusterCreateComponent', () => {
  let component: SubClusterCreateComponent;
  let fixture: ComponentFixture<SubClusterCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubClusterCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubClusterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
