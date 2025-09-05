import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

@Component({
  selector: 'app-toast-tailwind',
  standalone: true,
  imports: [CommonModule],
  template: `
<div id="toast" role="alert"
     class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-700 bg-white rounded-lg shadow-sm dark:text-gray-300 dark:bg-gray-800"
     style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);">

  <div [ngClass]="iconBgClass"
       class="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg">
    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
         viewBox="0 0 20 20"><path *ngIf="iconSvg" [attr.d]="iconSvg"></path></svg>
    <span class="sr-only">Icon</span>
  </div>

  <div class="ms-3 text-sm font-normal">{{ toastPackage.message }}</div>

 
</div>
`
})
export class ToastTailwindComponent extends Toast {
  iconSvg = '';
  iconBgClass = '';

  constructor(
    protected override toastrService: ToastrService,
    public override toastPackage: ToastPackage
  ) {
    super(toastrService, toastPackage);
    this.setIconAndColor(toastPackage.toastType);
  }

  private setIconAndColor(type: string) {
    switch (type) {
      case 'toast-success':
        this.iconBgClass = 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200';
        this.iconSvg = 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z';
        break;
      case 'toast-info':
        this.iconBgClass = 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200';
        this.iconSvg = 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm.75 13.75h-1.5v-1.5h1.5v1.5Zm0-3h-1.5v-5h1.5v5Z';
        break;
      case 'toast-warning':
        this.iconBgClass = 'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200';
        this.iconSvg = 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z';
        break;
      case 'toast-error':
        this.iconBgClass = 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200';
        this.iconSvg = 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z';
        break;
    }
  }
}
