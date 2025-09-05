import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchFilterPipe } from '../../shared/pipes/search-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

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
  formDetails = {coup_id : 0, bm_id: '', coupon_name: '', description: '', qty : '', expiry_date: '', status: true };
  details: any[] = [];
  buttonName: any;
  businessData = [
    { bm_id: 1, bm_name: 'Mumbai' },
    { bm_id: 2, bm_name: 'Delhi' },
    { bm_id: 3, bm_name: 'Bengaluru' },
    { bm_id: 4, bm_name: 'Chennai' },
    { bm_id: 5, bm_name: 'Kolkata' }
  ];

  currentPage = 1;  // to track current page
itemsPerPage = 5;  // items per page
pageSizes = [5, 10, 20, 50, 100]; // options
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

    if (!this.formDetails.coup_id || this.formDetails.coup_id === 0) {
      // Add new location
      this.formDetails.coup_id = this.details.length + 1;
      this.details.push({ ...this.formDetails });
    } else {
      // Update existing location
      const index = this.details.findIndex(
        loc => loc.bm_id === this.formDetails.coup_id
      );

      if (index !== -1) {
        this.details[index] = { ...this.formDetails };
      }
    }
    this.reset();
  }

  reset(form?: NgForm) {
    this.formDetails = {coup_id : 0, bm_id: '', coupon_name: '', description: '', qty : '', expiry_date: '', status: true };
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

  deleteItem(index: number) {
    this.details.splice(index, 1);
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

