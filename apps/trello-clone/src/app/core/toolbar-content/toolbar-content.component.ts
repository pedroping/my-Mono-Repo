import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkMenuModule, CdkMenuTrigger } from '@angular/cdk/menu';
import { CoreFeaturesCustomBackgroundModule } from '@my-monorepo/core/features/custom-background';
import { CoreFeaturesOutsideElementClickModule } from '@my-monorepo/core/features/outside-element-click';
import { OutsideClickEventsService } from '@my-monorepo/core/utlis';
import { CoreFeaturesTrelloToolsModule } from '@my-monorepo/core/features/trello-tools';
import { CallSetValueChanges } from '@my-monorepo/core/features/set-value-changes-decorator';

@Component({
  selector: 'trello-toolbar-content',
  templateUrl: './toolbar-content.component.html',
  styleUrls: ['./toolbar-content.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    CdkMenuModule,
    MatButtonModule,
    CoreFeaturesTrelloToolsModule,
    CoreFeaturesCustomBackgroundModule,
    CoreFeaturesOutsideElementClickModule,
  ],
})
@CallSetValueChanges()
export class ToolbarContentComponent {
  @ViewChild(CdkMenuTrigger) menuTrigger?: CdkMenuTrigger;

  constructor(
    private readonly outsideClickEventsService: OutsideClickEventsService
  ) {}

  setValueChanges() {
    this.outsideClickEventsService.outSideClick$.subscribe(() =>
      this.menuTrigger?.close()
    );
  }
}
