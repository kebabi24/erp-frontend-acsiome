import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalProviderComponent } from './journal-provider.component';

describe('JournalProviderComponent', () => {
  let component: JournalProviderComponent;
  let fixture: ComponentFixture<JournalProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
