import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeQuizCmsComponent } from './take-quiz-cms.component';

describe('TakeQuizCmsComponent', () => {
  let component: TakeQuizCmsComponent;
  let fixture: ComponentFixture<TakeQuizCmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeQuizCmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeQuizCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
