import { AfterViewInit, Component, input, viewChild } from '@angular/core';
import { CardBlockHeightDirective } from '../../directives/card-block-height/cardBlock-height.directive';
import { IBlock } from '../../models/card.models';
import { CardFooterComponent } from '../card-footer/card-footer.component';
import { CardHeaderComponent } from '../card-header/card-header.component';
import { CardListComponent } from '../card-list/card-list.component';

@Component({
  selector: 'trello-card-block',
  templateUrl: './card-block.component.html',
  styleUrls: ['./card-block.component.scss'],
  standalone: true,
  imports: [
    CardBlockHeightDirective,
    CardFooterComponent,
    CardHeaderComponent,
    CardListComponent,
  ],
})
export class CardBlockComponent implements AfterViewInit {
  isPreview = input<boolean>(false);
  id = input<number>(-1);
  blockCard = input.required<IBlock>();
  cardList = viewChild(CardListComponent);
  isSelectedBlock = false;

  ngAfterViewInit(): void {
    if (!this.cardList() || this.isPreview()) return;

    this.cardList()!.cardMove.subscribe(
      (event) => (this.isSelectedBlock = event),
    );
  }
}
