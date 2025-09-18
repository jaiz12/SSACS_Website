import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactsMythsComponent } from '../facts-myths.component';

describe('FactsMythsComponent', () => {
  let component: FactsMythsComponent;
  let fixture: ComponentFixture<FactsMythsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactsMythsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactsMythsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
