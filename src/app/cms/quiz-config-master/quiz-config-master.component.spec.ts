import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizConfigMasterComponent } from './quiz-config-master.component';

describe('QuizConfigMasterComponent', () => {
  let component: QuizConfigMasterComponent;
  let fixture: ComponentFixture<QuizConfigMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizConfigMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizConfigMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
