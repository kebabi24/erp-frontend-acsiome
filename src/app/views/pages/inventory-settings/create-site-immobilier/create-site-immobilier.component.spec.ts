import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSiteImmobilierComponent } from './create-site-immobilier.component';

describe('CreateSiteImmobilierComponent', () => {
  let component: CreateSiteImmobilierComponent;
  let fixture: ComponentFixture<CreateSiteImmobilierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSiteImmobilierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSiteImmobilierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
