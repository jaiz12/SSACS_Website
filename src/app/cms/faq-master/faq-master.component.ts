import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchFilterPipe } from '../../shared/pipes/search-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { APIService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../shared/services/config.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-faq-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchFilterPipe,
    NgxPaginationModule
  ],
  templateUrl: './faq-master.component.html',
  styleUrl: './faq-master.component.css'
})
export class FaqMasterComponent implements OnInit {
  searchTerm = '';
  showModal = false;
  modalTitle = "Add FAQ's";
  submitted = false;

  // ✅ Correct property used in template
  formDetails = {
    faq_id: 0,
    loc_id: 0,
    question: '',
    answer: '',
    status: true,
    created_on: "2025-09-05",
    created_by: "Admin",
    updated_on: "2025-09-05",
    updated_by: "Admin"
  };
  details: any[] = [];
  buttonName: any;
  imageApiUrl: any;
  locations: any[] = [];

  currentPage = 1;  // to track current page
  itemsPerPage = 5;  // items per page
  pageSizes = [5, 10, 20, 50, 100]; // options
  constructor(private api: APIService, private toastr: ToastrService,
    private configService: ConfigService) {

  }
  ngOnInit() {
    this.getLocationDetails();
    this.getFAQDetails();
    this.imageApiUrl = this.configService.get("imageApiUrl");
  }

  getLocationDetails() {
    this.api.getAll('Location/GetLocation', false).subscribe({
      next: (res: any) => {

        console.log(res)
        this.locations = res.data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getFAQDetails() {
    this.api.getAll('Faq/GetFAQ', false).subscribe({
      next: (res: any) => {

        this.details = res.data;
        console.log(this.details)
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
    this.modalTitle = "Add FAQ's";
    this.buttonName = 'Save'
    this.reset();
    this.showModal = true;
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) return;
    if (!this.formDetails.faq_id || this.formDetails.faq_id === 0) {
      this.api.post('Faq/CreateFAQ', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.getFAQDetails();
            this.reset(form);
            this.toastr.success(res.message);
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
      this.api.update('Faq/UpdateFAQ', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.getFAQDetails();
            this.reset(form);
            this.toastr.success(res.message);
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
    // TODO: Call your API service to save banner
  }

  reset(form?: NgForm) {
    this.formDetails = {
      faq_id: 0,
      loc_id: 0,
      question: '',
      answer: '',
      status: true,
      created_on: "2025-09-05",
      created_by: "Admin",
      updated_on: "2025-09-05",
      updated_by: "Admin"
}
    this.submitted = false;
    this.showModal = false;
    if (form) form.resetForm();
  }

  editItem(item: any) {
    // Pre-fill form with item data
    this.formDetails = { ...item };
    this.modalTitle = "Edit FAQ's";
    this.buttonName = 'Update'
    this.showModal = true;
  }

  deleteItem(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won\'t to Delete this row ${item.title}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteById('Faq', item.faq_id, false).subscribe({
          next: (res: any) => {
            if (res.isSuccessful) {
              this.toastr.success(res.message);
              this.reset();
              this.getFAQDetails();
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

    this.api.updateById('Faq/ArchiveFAQ', item.faq_id, false).subscribe({
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
