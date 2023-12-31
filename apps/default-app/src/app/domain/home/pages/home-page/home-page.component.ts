import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CoreFeaturesDarkModeModule } from '@my-monorepo/core/features/dark-mode';
import { CoreUiSidenavModule } from '@my-monorepo/core/ui/sidenav';
import { CoreUiToolbarModule } from '@my-monorepo/core/ui/toolbar';
import { SideNavComponent } from '../../../../core/components/sideNav/sideNav.component';
import { ToolBarComponent } from '../../../../core/components/toolBar/toolBar.component';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  standalone: true,
  imports: [
    CoreUiToolbarModule,
    MatIconModule,
    CoreUiSidenavModule,
    MatButtonModule,
    RouterModule,
    SideNavComponent,
    ToolBarComponent,
    CoreFeaturesDarkModeModule,
  ],
})
export class HomePageComponent {
  constructor() {}
}
