import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchFilterPipe } from '../../shared/pipes/search-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchFilterPipe,
    NgxPaginationModule
  ],
  templateUrl: './location-master.component.html',
  styleUrls: ['./location-master.component.css']
})
export class LocationMasterComponent implements OnInit {

  constructor(private toastr: ToastrService, public api: APIService) { }

  searchTerm = '';
  showModal = false;
  modalTitle = 'Add Location';
  submitted = false;

  // ✅ Correct property used in template
  formDetails = { loc_id: 0, name: '', lat: 0.00, lon: 0.00, status: true, created_on: '2025-08-20', created_by: 'Admin', updated_on: '2025-08-20', updated_by: 'Admin' };
  details: any[] = [];
  buttonName: any;

  currentPage = 1;  // to track current page
  itemsPerPage = 5;  // items per page
  pageSizes = [5, 10, 20, 50, 100]; // options

  ngOnInit() {
    this.getLocationDetails();
  }

  onSearchChange() {
    this.currentPage = 1; // reset page when searching
  }

  onPageSizeChange(event: Event) {
    this.currentPage = 1;
  }

  addNew() {
    this.modalTitle = 'Add Location';
    this.buttonName = 'Save'
    this.reset();
    this.showModal = true;
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) return;
    this.formDetails.lat = Number(this.formDetails.lat);
    this.formDetails.lon = Number(this.formDetails.lon);

    if (!this.formDetails.loc_id || this.formDetails.loc_id === 0) {
      this.api.post('Location/CreateLocation', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.toastr.success(res.message);
            this.reset();
            this.getLocationDetails();
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
      this.api.update('Location/UpdateLocation', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.toastr.success(res.message);
            this.reset();
            this.getLocationDetails();
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

  getLocationDetails() {
    this.api.getAll('Location/GetLocation', false).subscribe({
      next: (res: any) => {

        this.details = res.data;

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  reset(form?: NgForm) {
    this.formDetails = { loc_id: 0, name: '', lat: 0.00, lon: 0.00, status: true, created_on: '2025-08-20', created_by: 'Admin', updated_on: '2025-08-20', updated_by: 'Admin' };
    this.submitted = false;
    this.showModal = false;
    if (form) form.resetForm();
  }

  editItem(item: any) {
    // Pre-fill form with item data
    this.formDetails = { ...item };
    this.modalTitle = 'Edit Location';
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
        this.api.deleteById('Location', item.loc_id, false).subscribe({
          next: (res: any) => {
            if (res.isSuccessful) {
              this.toastr.success(res.message);
              this.reset();
              this.getLocationDetails();
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

    this.api.updateById('Location/ArchiveLocation', item.loc_id, false).subscribe({
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
