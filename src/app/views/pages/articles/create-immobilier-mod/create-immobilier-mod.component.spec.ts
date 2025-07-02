import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateImmobilierModComponent } from './create-immobilier-mod.component';

describe('CreateImmobilierModComponent', () => {
  let component: CreateImmobilierModComponent;
  let fixture: ComponentFixture<CreateImmobilierModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateImmobilierModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateImmobilierModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
