import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWoBrComponent } from './list-wo-br.component';

describe('ListWoBrComponent', () => {
  let component: ListWoBrComponent;
  let fixture: ComponentFixture<ListWoBrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWoBrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWoBrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
