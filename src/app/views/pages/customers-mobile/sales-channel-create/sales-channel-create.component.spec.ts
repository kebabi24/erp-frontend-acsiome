import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesChannelCreateComponent } from './sales-channel-create.component';

describe('SalesChannelCreateComponent', () => {
  let component: SalesChannelCreateComponent;
  let fixture: ComponentFixture<SalesChannelCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesChannelCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesChannelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
