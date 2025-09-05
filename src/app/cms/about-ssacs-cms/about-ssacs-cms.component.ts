import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SearchFilterPipe } from '../../shared/pipes/search-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { APIService } from '../../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../shared/services/config.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-about-ssacs-cms',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchFilterPipe, NgxPaginationModule],
  templateUrl: './about-ssacs-cms.component.html',
  styleUrl: './about-ssacs-cms.component.css'
})
export class AboutSsacsCmsComponent implements OnInit {
  searchTerm = '';
  selectedImage: string | ArrayBuffer | null = null;
  showModal = false;
  modalTitle = 'Add Banner';
  submitted = false;

  // ✅ Correct property used in template
  formDetails = { news_id: 0, loc_id: '', loc_name: '', title: '', description: '', news_date: '', image_path: [] as string[], remove_image_path: []  as string[], status: true, created_on: '2025-08-20', created_by: 'Admin', updated_on: '2025-08-20', updated_by: 'Admin' };
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
    this.getOurUpdatesDetails();
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

  getOurUpdatesDetails() {
    this.api.getAll('OurUpdates/GetOurUpdates', false).subscribe({
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
    this.modalTitle = 'Add Updates';
    this.buttonName = 'Save'
    this.reset();
    this.showModal = true;
  }


  onImagesSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formDetails.image_path.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) this.addFiles(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  addFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formDetails.image_path.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  removeImage(index: number) {
    // Ensure arrays exist
    if (!this.formDetails) return;
    if (!this.formDetails.image_path) this.formDetails.image_path = [];
    if (!this.formDetails.remove_image_path) this.formDetails.remove_image_path = [];

    // Push removed image to remove_image_path
    if (this.formDetails.image_path[index]) {
      const cleanedImage = this.formDetails.image_path[index].replace(this.imageApiUrl, '');
      this.formDetails.remove_image_path.push(cleanedImage);
    }

    this.formDetails.image_path.splice(index, 1);
  }

  // Save banner
  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) return;
    var rawDate = this.formDetails.news_date;
    let formattedDate = rawDate;

    if (typeof rawDate === 'string' && rawDate.includes('-')) {
      const parts = rawDate.split('-');
      if (parts[2].length === 4) {
        // Format is probably DD-MM-YYYY, make it YYYY-MM-DD
        formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    this.formDetails.news_date = formattedDate; 
    console.log(this.formDetails)
    if (!this.formDetails.news_id || this.formDetails.news_id === 0) {
      // Add new location
      var location_name = this.locations.filter((a: any) => a.loc_id == this.formDetails.loc_id);
      this.formDetails.loc_name = location_name[0].name;
      this.api.post('OurUpdates/CreateOurUpdates', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.getOurUpdatesDetails();
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

      this.formDetails.image_path = this.formDetails.image_path || [];
      this.formDetails.remove_image_path = this.formDetails.remove_image_path || [];


      // Clean remove_image_path before sending to API
      this.formDetails.remove_image_path = this.formDetails.remove_image_path.map(img =>
        typeof img === 'string' && img.startsWith(this.imageApiUrl) ? img.replace(this.imageApiUrl, '') : img
      );

      // Optional: also clean image_path before sending
      this.formDetails.image_path = this.formDetails.image_path.map(img =>
        typeof img === 'string' && img.startsWith(this.imageApiUrl) ? img.replace(this.imageApiUrl, '') : img
      );
      this.api.update('OurUpdates/UpdateOurUpdates', this.formDetails, false).subscribe({
        next: (res: any) => {
          if (res.isSuccessful) {
            this.getOurUpdatesDetails();
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

  // Reset form

  reset(form?: NgForm) {
    this.formDetails = { news_id: 0, loc_id: '', loc_name: '', title: '', description: '', news_date: '', image_path: [] as string[], remove_image_path: [] as string[], status: true, created_on: '2025-08-20', created_by: 'Admin', updated_on: '2025-08-20', updated_by: 'Admin' };
    this.submitted = false;
    this.showModal = false;
    if (form) form.resetForm();
  }

  editItem(item: any) {
    // Pre-fill form with item data
    // Pre-fill form with item data
    this.formDetails = { ...item };
    if (typeof this.formDetails.image_path === 'string') {
      try {
        const parsed = JSON.parse(this.formDetails.image_path as unknown as string);
        if (typeof parsed === 'string') {
          this.formDetails.image_path = [this.imageApiUrl + parsed];
        } else if (Array.isArray(parsed)) {
          this.formDetails.image_path = parsed.map((path: string) => this.imageApiUrl + path);
        } else {
          this.formDetails.image_path = [];
        }
        console.log(this.formDetails.image_path)
      } catch (error) {
        this.formDetails.image_path = [];
      }
    }
    this.modalTitle = 'Edit Updates';
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
        this.api.deleteById('OurUpdates', item.news_id, false).subscribe({
          next: (res: any) => {
            if (res.isSuccessful) {
              this.toastr.success(res.message);
              this.reset();
              this.getOurUpdatesDetails();
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

    this.api.updateById('OurUpdates/ArchiveOurUpdates', item.news_id, false).subscribe({
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
