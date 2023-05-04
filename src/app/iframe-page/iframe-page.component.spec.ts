import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframePageComponent } from './iframe-page.component';

describe('BoardPageComponent', () => {
  let component: IframePageComponent;
  let fixture: ComponentFixture<IframePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IframePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IframePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
