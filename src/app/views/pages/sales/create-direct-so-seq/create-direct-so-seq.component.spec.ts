import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirectSoSeqComponent } from './create-direct-so-seq.component';

describe('CreateDirectSoSeqComponent', () => {
  let component: CreateDirectSoSeqComponent;
  let fixture: ComponentFixture<CreateDirectSoSeqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDirectSoSeqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDirectSoSeqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
