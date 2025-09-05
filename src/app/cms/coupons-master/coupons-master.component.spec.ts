import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponsMasterComponent } from './coupons-master.component';

describe('CouponsMasterComponent', () => {
  let component: CouponsMasterComponent;
  let fixture: ComponentFixture<CouponsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponsMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
