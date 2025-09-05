import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsNavMenuComponent } from './cms-nav-menu.component';

describe('CmsNavMenuComponent', () => {
  let component: CmsNavMenuComponent;
  let fixture: ComponentFixture<CmsNavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsNavMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
