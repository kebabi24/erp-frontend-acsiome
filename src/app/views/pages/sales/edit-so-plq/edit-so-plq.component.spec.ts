import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSoPlqComponent } from './edit-so-plq.component';

describe('EditSoPlqComponent', () => {
  let component: EditSoPlqComponent;
  let fixture: ComponentFixture<EditSoPlqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSoPlqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSoPlqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
