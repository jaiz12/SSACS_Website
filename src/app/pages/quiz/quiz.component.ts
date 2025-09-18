import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { ConfigService } from '../../shared/services/config.service';
import { APIService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { UrlParserService } from '../../shared/services/url-parser.service';

interface Option {
  option_text: string;
  correct_flag: boolean;
}

interface Question {
  loc_name: string;
  question: string;
  options: Option[];
}

interface Coupon {
  coup_code: string;
  rest_name: string;
  desc: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  sponsors: any = [];
  allCoupons: Coupon[] = [];
  availableCoupons: Coupon[] = [];
  currentQuestionIndex = 0;
  score = 0;
  timeLeft: any;
  timerInterval: any;
  quizOver = false;
  winMessage = '';
  messageColor = '';

  selectedChoiceIndex: number | null = null;
  correctChoiceIndex: number | null = null;
  isOptionDisabled = false;
  showForm = true;
  quizConfigDetails: any = {}
    ;
  url: any = '';
  quizdetails: any[] = [];
  business: any = [];
  couponDetails: any = {};
  imageApiUrl: any;
  private refreshInterval: any;
  formDetails = { contact_no: '', age: '', gender: '', created_on: '' };
  constructor(private http: HttpClient, private appComponent: AppComponent, private api: APIService, private configService: ConfigService,
    private toastr: ToastrService, private urlParser: UrlParserService,
    @Inject(DOCUMENT) private document: Document) {

  }

  ngOnInit() {
    this.imageApiUrl = this.configService.get("imageApiUrl");
    // Set to 500ms or 1000ms to avoid performance issues
    // 🔹 Keep checking until location is available
    this.url = this.urlParser.getDomainFromUrl(this.document.location.href);
    if (this.url) {
      this.getBusiness();
      this.refreshInterval = setInterval(() => {
        this.getBusiness();
      }, 5000);
    }
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

  }





  startTimer() {
    console.log(this.quizConfigDetails.time_per_ques_in_sec)
    this.timeLeft = this.quizConfigDetails.time_per_ques_in_sec;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft === 0) {
        this.nextQuestion();
      }
    }, 1000);
  }

  selectAnswer(choiceIndex: number) {
    if (this.isOptionDisabled || this.quizOver) return;

    this.selectedChoiceIndex = choiceIndex;
    const currentQuestion = this.questions[this.currentQuestionIndex];

    // Find correct option index
    this.correctChoiceIndex = currentQuestion.options.findIndex(opt => opt.correct_flag === true);
    this.isOptionDisabled = true;

    const selectedOption = currentQuestion.options[choiceIndex];
    if (selectedOption.correct_flag === true) {
      const score = 100 / this.questions.length;
      this.score += Number(score.toFixed(1));
    }

    setTimeout(() => {
      this.selectedChoiceIndex = null;
      this.correctChoiceIndex = null;
      this.isOptionDisabled = false;
      this.nextQuestion();
    }, 1000);
  }


  resetUsedCoupons() {
    localStorage.removeItem('usedCoupons');
    // this.restartQuiz();
  }

  nextQuestion() {
    clearInterval(this.timerInterval);
    console.log(this.currentQuestionIndex)
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.startTimer();
    } else {
      this.quizOver = true;
      if (this.score >= this.quizConfigDetails.passing_score) {
        var json = {
          "session_id": 0,
          "participant_id": localStorage.getItem('quiz_participant_id'),
          "url": this.url,
          "score": this.score,
          "pass_flag": true,
          "played_on": "2025-09-09T10:39:12.765Z"
        }

        this.api.post('QuizSession/SaveSessionAndIssueCoupon', json, false).subscribe({
          next: (res: any) => {
            if (res.isSuccessful) {
              var couponDetails = res.data;
              this.winMessage = `
    <strong><p class="text-3xl text-green-600 mb-3">Congratulations! </p></strong>
    <p class="text-1xl text-green-600 mb-3">You did great — Your awareness makes a difference!</p>
    <p class="text-2xl text-yellow-600 mb-3">You have won a coupon</p>
    <strong><p class="text-2xl text-yellow-600 mb-3">Take a picture of this Coupon</p></strong>
    <p class="text-1xl text-green-600 mb-3">Coupon Code:<strong> ${couponDetails.coup_code}</strong></p>
    <p lass="text-1xl text-green-600 mb-3">Visit: <strong><em>${couponDetails.rest_name}</em></strong></p>
    <p lass="text-1xl text-green-600 mb-3">And Enjoy: <strong> ${couponDetails.desc}</strong></p>
  `;
              this.messageColor = 'green';
            }
            else {
              this.toastr.error(res.message)
            }

          },
          error: (err) => {
            console.error(err);
          }
        });       // show success message
      } else {
        this.winMessage = 'Almost there! Our FAQ section can help fill the gaps.';
        this.messageColor = 'red';
      }
    }
  }


  reset(form?: NgForm) {
    this.formDetails = { contact_no: '', age: '', gender: '', created_on: '' };
    if (form) form.resetForm();
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return; // Don't hide the form
    }
    this.api.post('QuizSession/CreateParticipant', this.formDetails, false).subscribe({
      next: (res: any) => {
        if (res.isSuccessful) {
          localStorage.setItem('quiz_participant_id', res.data)
          this.toastr.success(res.message)
          this.showForm = false;
          this.reset();
          this.getQuestions();
        }
        else {
          this.toastr.error(res.message)
        }

      },
      error: (err) => {
        console.error(err);
      }
    });
    // If form is valid, proceed

  }

  getQuestions() {
    this.api.getAll('Website/GetWebsiteContent', this.url, 'quiz', false).subscribe({
      next: (res: any) => {
        this.showForm = false;
        console.log(res.data)
        this.quizConfigDetails = {
          time_per_ques_in_sec: res.data.time_per_ques_in_sec,
          passing_score: res.data.passing_score
        }
        this.questions = res.data.questions
        this.startTimer();
        console.log(this.quizConfigDetails, this.quizdetails)
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getBusiness() {
    this.api.getAll('Website/GetWebsiteContent', this.url, 'business', false).subscribe({
      next: (res: any) => {

        this.business = res.data;
        console.log(this.business)
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
