import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchFilterPipe } from '../../shared/pipes/search-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { APIService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quiz-config-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchFilterPipe,
    NgxPaginationModule
  ],
  templateUrl: './quiz-config-master.component.html',
  styleUrl: './quiz-config-master.component.css'
})
export class QuizConfigMasterComponent implements OnInit {
  searchTerm = '';
  showModal = false;
  modalTitle = "Add Quiz Config";
  submitted = false;

  // ✅ Correct property used in template
  formDetails = {
    quiz_config_id: 0,
    loc_id: 0,
    total_ques: 0,
    time_per_ques_in_sec: 0,
    passing_score: 0,
    status: true,
    created_on: "2025-09-05",
    created_by: "Admin",
    updated_on: "2025-09-05",
    updated_by: "Admin"
  };
  details: any[] = [];
  buttonName: any;
  locations: any[] = [];

  currentPage = 1;  // to track current page
  itemsPerPage = 5;  // items per page
  pageSizes = [5, 10, 20, 50, 100]; // options

  constructor(private toastr: ToastrService, public api: APIService) { }

  ngOnInit() {
    this.getLocationDetails();
    this.getQuizConfigDetails();
  }

  getLocationDetails() {
    this.api.getAll('Location/GetLocation', false).subscribe({
      next: (res: any) => {
        this.locations = res.data;
        console.log(res.data)
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getQuizConfigDetails() {
    this.api.getAll('QuizConfig/GetQuizConfig', false).subscribe({
      next: (res: any) => {

        this.details = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSearchChange() {
    this.currentPage = 1; // reset page when searching
  }

  onPageSizeChange(event: Event) {
    this.currentPage = 1;
  }

  addNew() {
    this.modalTitle = "Add Quiz Config";
    this.buttonName = 'Save'
    this.reset();
    this.showModal = true;
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) return;
    this.formDetails.total_ques = Number(this.formDetails.total_ques);
    this.formDetails.time_per_ques_in_sec = Number(this.formDetails.time_per_ques_in_sec);
    this.formDetails.passing_score = Number(this.formDetails.passing_score);

    if (!this.formDetails.loc_id || this.formDetails.loc_id === 0) {
      this.api.post('QuizConfig/CreateQuizConfig', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.toastr.success(res.message);
            this.reset();
            this.getQuizConfigDetails();
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
      this.api.update('QuizConfig/UpdateQuizConfig', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.toastr.success(res.message);
            this.reset();
            this.getQuizConfigDetails();
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

  reset(form?: NgForm) {
    this.formDetails = {
      quiz_config_id: 0,
      loc_id: 0,
      total_ques: 0,
      time_per_ques_in_sec: 0,
      passing_score: 0,
      status: true,
      created_on: "2025-09-05",
      created_by: "Admin",
      updated_on: "2025-09-05",
      updated_by: "Admin"
    };
    this.submitted = false;
    this.showModal = false;
    if (form) form.resetForm();
  }

  editItem(item: any) {
    // Pre-fill form with item data
    this.formDetails = { ...item };
    this.modalTitle = "Edit Quiz Config";
    this.buttonName = 'Update'
    this.showModal = true;
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
        this.api.deleteById('QuizConfig', item.quiz_config_id, false).subscribe({
          next: (res: any) => {
            if (res.isSuccessful) {
              this.toastr.success(res.message);
              this.reset();
              this.getQuizConfigDetails();
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

    this.api.updateById('QuizConfig/ArchiveQuizConfig', item.quiz_config_id, false).subscribe({
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

