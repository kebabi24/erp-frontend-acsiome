import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMaterielModComponent } from './create-materiel-mod.component';

describe('CreateMaterielModComponent', () => {
  let component: CreateMaterielModComponent;
  let fixture: ComponentFixture<CreateMaterielModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMaterielModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMaterielModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
