import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemModComponent } from './create-item-mod.component';

describe('CreateItemModComponent', () => {
  let component: CreateItemModComponent;
  let fixture: ComponentFixture<CreateItemModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateItemModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
