import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterPartComponent } from './alter-part.component';

describe('AlterPartComponent', () => {
  let component: AlterPartComponent;
  let fixture: ComponentFixture<AlterPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlterPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
