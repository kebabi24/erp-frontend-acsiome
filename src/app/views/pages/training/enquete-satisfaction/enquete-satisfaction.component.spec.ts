import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteSatisfactionComponent } from './enquete-satisfaction.component';

describe('EnqueteSatisfactionComponent', () => {
  let component: EnqueteSatisfactionComponent;
  let fixture: ComponentFixture<EnqueteSatisfactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnqueteSatisfactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnqueteSatisfactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
