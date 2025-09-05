import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactsMythsCmsComponent } from './facts-myths-cms.component';

describe('FactsMythsCmsComponent', () => {
  let component: FactsMythsCmsComponent;
  let fixture: ComponentFixture<FactsMythsCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactsMythsCmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactsMythsCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
