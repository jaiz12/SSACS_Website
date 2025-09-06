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
  selector: 'app-coupons-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchFilterPipe,
    NgxPaginationModule
  ],
  templateUrl: './coupons-master.component.html',
  styleUrl: './coupons-master.component.css'
})
export class CouponsMasterComponent implements OnInit {
  searchTerm = '';
  showModal = false;
  modalTitle = "Add Coupon";
  submitted = false;

  // ✅ Correct property used in template
  formDetails = {
    coup_id: 0,
    bm_id: 0,
    bm_name: "",
    coupon_name: "",
    description: "",
    qty: 0,
    expiry_date: "",
    status: true,
    created_on: "2025-09-05",
    created_by: "Admin",
    updated_on: "2025-09-05",
    updated_by: "Admin"
};
  details: any[] = [];
  buttonName: any;
  businessData: any[] = [];

  currentPage = 1;  // to track current page
itemsPerPage = 5;  // items per page
  pageSizes = [5, 10, 20, 50, 100]; // options

  constructor(private api: APIService, private toastr: ToastrService,
    private configService: ConfigService) {

  }
  ngOnInit() {
    //this.details = Array.from({ length: 100 }, (_, i) => ({
    //  coup_id: i + 1,
    //  bm_id: `BM${1000 + i}`,
    //  coupon_name: `Coupon ${i + 1}`,
    //  description: `Description for coupon ${i + 1}`,
    //  qty: Math.floor(Math.random() * 100) + 1, // random qty between 1-100
    //  expiry_date: new Date(
    //    2025,
    //    Math.floor(Math.random() * 12),
    //    Math.floor(Math.random() * 28) + 1
    //  ).toISOString().split("T")[0], // random date in 2025
    //  status: Math.random() > 0.5 // random true/false
    //}));
    this.getBusinessDetails();
    this.getCouponDetails();
  }
  getBusinessDetails() {
    this.api.getAll('Business/GetBusiness', false).subscribe({
      next: (res: any) => {

        this.businessData = res.data;
        console.log(this.businessData)
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  getCouponDetails() {
    this.api.getAll('Coupon/GetCoupon', false).subscribe({
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
    this.modalTitle = "Add Coupon";
    this.buttonName = 'Save'
    this.reset();
    this.showModal = true;
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) return;
    var rawDate = this.formDetails.expiry_date;
    let formattedDate = rawDate;

    if (typeof rawDate === 'string' && rawDate.includes('-')) {
      const parts = rawDate.split('-');
      if (parts[2].length === 4) {
        // Format is probably DD-MM-YYYY, make it YYYY-MM-DD
        formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    this.formDetails.expiry_date = formattedDate;
    console.log(this.formDetails)
    if (!this.formDetails.coup_id || this.formDetails.coup_id === 0) {
      // Add new Coupon
      var business_name = this.businessData.filter((a: any) => a.bm_id == this.formDetails.bm_id);
      this.formDetails.bm_name = business_name[0].bm_name;
      this.api.post('Coupon/CreateCoupon', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.getCouponDetails();
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

      this.api.update('Coupon/UpdateCoupon', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.getCouponDetails();
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
      coup_id: 0,
      bm_id: 0,
      bm_name: "",
      coupon_name: "",
      description: "",
      qty: 0,
      expiry_date: "",
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
    this.modalTitle = "Edit Coupon";
     this.buttonName = 'Update'
    this.showModal = true;
  }

  deleteItem(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won\'t to Delete this row "${item.coupon_name}" !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteById('Coupon', item.coup_id, false).subscribe({
          next: (res: any) => {
            if (res.isSuccessful) {
              this.toastr.success(res.message);
              this.reset();
              this.getCouponDetails();
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

    this.api.updateById('Coupon/ArchiveCoupon', item.coup_id, false).subscribe({
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

