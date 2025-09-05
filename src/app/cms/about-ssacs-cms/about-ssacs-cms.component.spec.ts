import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSsacsCmsComponent } from './about-ssacs-cms.component';

describe('AboutSsacsCmsComponent', () => {
  let component: AboutSsacsCmsComponent;
  let fixture: ComponentFixture<AboutSsacsCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSsacsCmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSsacsCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
