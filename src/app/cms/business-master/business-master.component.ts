import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchFilterPipe } from '../../shared/pipes/search-filter.pipe';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { APIService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../shared/services/config.service';
import Swal from 'sweetalert2';

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
  formDetails = {
    bm_id: 0,
    bm_name: "",
    address: "",
    loc_id: 0,
    loc_name: "",
    image_path: "",
    remove_image_path: "",
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
    this.getBusinessDetails();
    this.imageApiUrl = this.configService.get("imageApiUrl");
  }

  getLocationDetails() {
    this.api.getAll('Location/GetLocation', false).subscribe({
      next: (res: any) => {

        this.locations = res.data;

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getBusinessDetails() {
    this.api.getAll('Business/GetBusiness', false).subscribe({
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
      var location_name = this.locations.filter((a: any) => a.loc_id == this.formDetails.loc_id);
      this.formDetails.loc_name = location_name[0].name;
      console.log(this.formDetails, location_name)
      this.api.post('Business/CreateBusiness', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.getBusinessDetails();
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

      this.formDetails.image_path = this.formDetails.image_path || '';
      this.formDetails.remove_image_path = this.formDetails.remove_image_path || '';


      // Clean remove_image_path before sending to API
      this.formDetails.remove_image_path = this.formDetails.remove_image_path.startsWith(this.imageApiUrl) ? this.formDetails.remove_image_path.replace(this.imageApiUrl, '') : this.formDetails.remove_image_path
      

      // Optional: also clean image_path before sending
      this.formDetails.image_path = this.formDetails.image_path.startsWith(this.imageApiUrl) ? this.formDetails.image_path.replace(this.imageApiUrl, '') : this.formDetails.image_path

      this.api.update('Business/UpdateBusiness', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.getBusinessDetails();
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
      bm_id: 0,
      bm_name: "",
      address: "",
      loc_id: 0,
      loc_name: "",
      image_path: "",
      remove_image_path: "",
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
    if (typeof this.formDetails.image_path === 'string') {
      try {
        const parsed = this.formDetails.image_path;
        if (typeof parsed === 'string') {
          this.formDetails.image_path = this.imageApiUrl + parsed;
        }
        else {
          this.formDetails.image_path = '';
        }
        console.log(this.formDetails.image_path)
      } catch (error) {
        this.formDetails.image_path = '';
      }
      this.modalTitle = "Edit Bussiness";
      this.buttonName = 'Update'
      this.showModal = true;
    }
  }

    deleteItem(item: any) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You won\'t to Delete this row "${item.bm_name}" !`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.deleteById('Business', item.bm_id, false).subscribe({
            next: (res: any) => {
              if (res.isSuccessful) {
                this.toastr.success(res.message);
                this.reset();
                this.getBusinessDetails();
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
      this.api.updateById('Business/ArchiveBusiness', item.bm_id, false).subscribe({
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

    onImageSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.formDetails.image_path = e.target.result; // Store single image
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
        this.formDetails.image_path = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    removeImage() {
      // Ensure arrays exist
      if (!this.formDetails) return;
      if (!this.formDetails.image_path) this.formDetails.image_path = "";
      if (!this.formDetails.remove_image_path) this.formDetails.remove_image_path = "[]";

      const cleanedImage = this.formDetails.image_path.replace(this.imageApiUrl, '');
      this.formDetails.remove_image_path = cleanedImage;
      this.formDetails.image_path = '';
    }
  }
