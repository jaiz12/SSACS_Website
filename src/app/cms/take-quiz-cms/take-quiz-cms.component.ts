import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchFilterPipe } from '../../shared/pipes/search-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-take-quiz-cms',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchFilterPipe,
    NgxPaginationModule
  ],
  templateUrl: './take-quiz-cms.component.html',
  styleUrls: ['./take-quiz-cms.component.css']
})
export class TakeQuizCmsComponent implements OnInit{
  searchTerm = '';
  showQuestionModal = false;
  questionModalTitle = 'Add Question';
  submitted = false;

  formDetails: any = {
    ques_id: 0,
    loc_id: '',
    status: true,
    question: '',
    options: []
  };

  options: any[] = [{ opt_id: 0, ques_id : 0, option_text: '', correct_flag: false }];
  editingQuestion: any = null;

  details: any[] = [];
  buttonName: any;

  locations = [
    { loc_id: 1, name: 'Mumbai' },
    { loc_id: 2, name: 'Delhi' },
    { loc_id: 3, name: 'Bengaluru' },
    { loc_id: 4, name: 'Chennai' },
    { loc_id: 5, name: 'Kolkata' }
  ];

  currentPage = 1;  // to track current page
itemsPerPage = 5;  // items per page
pageSizes = [5, 10, 20, 50, 100]; // options

  ngOnInit() {
   
  }

  onSearchChange() {
    this.currentPage = 1; // reset page when searching
  }

  onPageSizeChange(event: Event) {
    this.currentPage = 1;
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  setCorrectOption(selectedIndex: number) {
    this.options.forEach((opt, idx) => {
      opt.correct_flag = idx === selectedIndex; // Only one option is true
    });
  }

  addNew() {
    this.questionModalTitle = 'Add Question';
    this.buttonName = 'Save'
    this.formDetails = { ques_id: 0, loc_id: '', status: true, question: '', options: [] };
    this.options = [{ option_text: '', correct_flag: false }];
    this.editingQuestion = null;
    this.submitted = false;
    this.showQuestionModal = true;
  }

  editItem(item: any) {
    this.questionModalTitle = 'Edit Question';
    this.buttonName = 'Update'
    this.formDetails = { ...item };
    this.options = item.options.length ? [...item.options] : [{ option_text: '', correct_flag: false }];
    this.editingQuestion = item;
    this.submitted = false;
    this.showQuestionModal = true;
  }

  deleteItem(item: any) {
    this.details = this.details.filter(d => d !== item);
  }

  addOption() {
    this.options.push({ option_text: '', correct_flag: false });
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  hasCorrectOption(): boolean {
    return this.options.some(opt => opt.correct_flag);
  }

  closeQuestionModal() {
    this.showQuestionModal = false;
    this.formDetails = { ques_id: 0, loc_id: 0, status: true, question: '', options: [] };
    this.options = [{ option_text: '', correct_flag: false }];
    this.editingQuestion = null;
    this.submitted = false;
  }

  saveQuestion(form: NgForm) {
    this.submitted = true;

    // Check if form is valid
    if (form.invalid || this.options.some(opt => !opt.option_text.trim())) return;

    this.formDetails.options = [...this.options];

    if (this.editingQuestion) {
      Object.assign(this.editingQuestion, this.formDetails);
    } else {
      this.formDetails.ques = this.details.length + 1;
      this.details.push({ ...this.formDetails });
    }

    this.closeQuestionModal();
  }

  onStatusChange(item: any) {
    // Ensure status is 1 (active) or 0 (inactive)
    item.status = item.status ? 1 : 0;
  
    // Call your API or update logic here
    console.log('Updated row:', item);
  
    // Example: call update api with id
    console.log('Row status updated in backend:', item);
  }
}
