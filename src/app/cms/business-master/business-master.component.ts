import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchFilterPipe } from '../../shared/pipes/search-filter.pipe';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-business-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SearchFilterPipe,
    NgxPaginationModule
  ],
  templateUrl: './business-master.component.html',
  styleUrl: './business-master.component.css'
})
export class BusinessMasterComponent implements OnInit {
  searchTerm = '';
  showModal = false;
  modalTitle = "Add Bussiness";
  submitted = false;

  // ✅ Correct property used in template
  formDetails = {bm_id : 0, loc_id: '', bm_name: '', address: '', logo_path : '', status: true };
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

  addNew() {
    this.modalTitle = "Add Bussiness";
    this.buttonName = 'Save'
    this.reset();
    this.showModal = true;
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) return;

    if (!this.formDetails.bm_id || this.formDetails.bm_id === 0) {
      // Add new location
      this.formDetails.bm_id = this.details.length + 1;
      this.details.push({ ...this.formDetails });
    } else {
      // Update existing location
      const index = this.details.findIndex(
        loc => loc.bm_id === this.formDetails.bm_id
      );

      if (index !== -1) {
        this.details[index] = { ...this.formDetails };
      }
    }
    this.reset();
  }

  reset(form?: NgForm) {
    this.formDetails = {bm_id : 0, loc_id: '', bm_name: '', address: '', logo_path : '', status: true };
    this.submitted = false;
    this.showModal = false;
    if (form) form.resetForm();
  }

  editItem(item: any) {
    // Pre-fill form with item data
    this.formDetails = { ...item };
    this.modalTitle = "Edit Bussiness";
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

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formDetails.logo_path = e.target.result; // Store single image
      };
      reader.readAsDataURL(file);
    }
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.addFile(files[0]);
    }
  }
  
  addFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.formDetails.logo_path = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  removeImage() {
    this.formDetails.logo_path = '';
  }
}
