import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayDaliogComponent } from './replay-daliog.component';

describe('ReplayDaliogComponent', () => {
  let component: ReplayDaliogComponent;
  let fixture: ComponentFixture<ReplayDaliogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplayDaliogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplayDaliogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
