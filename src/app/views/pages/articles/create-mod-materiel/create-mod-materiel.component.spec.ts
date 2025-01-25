import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModMaterielComponent } from './create-mod-materiel.component';

describe('CreateModMaterielComponent', () => {
  let component: CreateModMaterielComponent;
  let fixture: ComponentFixture<CreateModMaterielComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateModMaterielComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModMaterielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
