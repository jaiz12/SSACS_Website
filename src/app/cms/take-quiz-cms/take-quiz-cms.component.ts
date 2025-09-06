import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchFilterPipe } from '../../shared/pipes/search-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { APIService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-take-quiz-cms',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchFilterPipe, NgxPaginationModule],
  templateUrl: './take-quiz-cms.component.html',
  styleUrls: ['./take-quiz-cms.component.css']
})
export class TakeQuizCmsComponent implements OnInit {
  searchTerm = '';
  showQuestionModal = false;
  questionModalTitle = 'Add Question';
  submitted = false;
  formDetails: any = this.getInitialFormDetails();
  editingQuestion: any = null;
  details: any[] = [];
  buttonName: any;
  locations: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  pageSizes = [5, 10, 20, 50, 100];

  constructor(private toastr: ToastrService, public api: APIService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getLocationDetails();
    this.getQuizDetails();
  }

  getInitialFormDetails() {
    return {
      ques_id: 0,
      loc_id: 0,
      loc_name: '',
      question: '',
      options: [{
        opt_id: 0,
        ques_id: 0,
        option_text: '',
        correct_flag: false
      }],
      status: true,
      created_on: "2025-09-05",
      created_by: "Admin",
      updated_on: "2025-09-05",
      updated_by: "Admin"
    };
  }

  getLocationDetails() {
    this.api.getAll('Location/GetLocation', false).subscribe({
      next: (res: any) => { this.locations = res.data; },
      error: (err) => { console.error(err); }
    });
  }

  getQuizDetails() {
    this.api.getAll('QuizQuesAns/GetAllQuizQnAConfig', false).subscribe({
      next: (res: any) => { this.details = res.data; console.log(this.details) },
      error: (err) => { console.error(err); }
    });
  }

  onSearchChange() { this.currentPage = 1; }
  onPageSizeChange(event: Event) { this.currentPage = 1; }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  setCorrectOption(selectedIndex: number) {
    // Only one correct by default, toggle others off
    this.formDetails.options.forEach((opt: any, idx: number) => {
      opt.correct_flag = idx === selectedIndex;
    });
  }

  addNew() {
    this.questionModalTitle = 'Add Question';
    this.buttonName = 'Save'
    this.reset();
    this.submitted = false;
    this.showQuestionModal = true;
  }

  editItem(item: any) {
    this.questionModalTitle = 'Edit Question';
    this.buttonName = 'Update'
    this.formDetails = JSON.parse(JSON.stringify(item));
    this.editingQuestion = item;
    this.submitted = false;
    this.showQuestionModal = true;
  }

  addOption() {
    this.formDetails.options.push({
      opt_id: 0,
      ques_id: 0,
      option_text: '',
      correct_flag: false
    });
    this.formDetails.options = [...this.formDetails.options];
    this.cdr.detectChanges(); // triggers UI refresh
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  removeOption(index: number) {
    this.formDetails.options.splice(index, 1);
  }

  hasCorrectOption(): boolean {
    return this.formDetails.options.some((opt: any) => opt.correct_flag);
  }

  reset(quizForm?: NgForm) {
    this.showQuestionModal = false;
    this.formDetails = this.getInitialFormDetails();
    this.submitted = false;
    if (quizForm) quizForm.resetForm();
  }

  saveQuestion(quizForm: NgForm) {
    this.submitted = true;
    console.log(this.formDetails);
    // Validation: check for required fields, at least one correct option, and nonempty option_texts
    const hasAllOptionTexts = this.formDetails.options.every((opt: any) => !!opt.option_text.trim());
    if (quizForm.invalid || !hasAllOptionTexts || !this.hasCorrectOption()) {
      return;
    }

    if (!this.formDetails.ques_id || this.formDetails.ques_id === 0) {
      this.api.post('QuizQuesAns/CreateQuizQnAConfig', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.toastr.success(res.message);
            this.reset();
            this.getQuizDetails();
          }
          else {
            this.toastr.error(res.message)
          }

        },
        error: (err) => {
          console.error(err);
        }
      });

    } else {
      // Update existing location
      this.api.update('QuizQuesAns/UpdateQuizQnAConfig', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.toastr.success(res.message);
            this.reset();
            this.getQuizDetails();
          }
          else {
            this.toastr.error(res.message)
          }

        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  deleteItem(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won\'t to Delete this row ${item.loc_name}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteById('QuizQuesAns', item.ques_id, false).subscribe({
          next: (res: any) => {
            if (res.isSuccessful) {
              this.toastr.success(res.message);
              this.reset();
              this.getQuizDetails();
            }
            else {
              this.toastr.error(res.message)
            }

          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });
  }

  onStatusChange(item: any) {

    this.api.updateById('QuizQuesAns/ArchiveQuizQnAConfig', item.ques_id, false).subscribe({
      next: (res: any) => {
        if (res.isSuccessful) {
          this.toastr.success(res.message);
          this.reset();
        }
        else {
          this.toastr.error(res.message)
        }

      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
