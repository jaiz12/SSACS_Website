import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CmsNavMenuComponent } from '../cms-nav-menu/cms-nav-menu.component';

@Component({
  selector: 'app-cms-layout',
  imports: [RouterOutlet, CmsNavMenuComponent],
  templateUrl: './cms-layout.component.html',
  styleUrl: './cms-layout.component.css'
})
export class CmsLayoutComponent {

}
