import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqMasterComponent } from './faq-master.component';

describe('FaqMasterComponent', () => {
  let component: FaqMasterComponent;
  let fixture: ComponentFixture<FaqMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
