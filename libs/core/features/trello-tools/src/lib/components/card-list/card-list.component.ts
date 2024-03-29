import {
  CdkDragDrop,
  CdkDragMove,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CallSetValueChanges } from '@my-monorepo/core/features/set-value-changes-decorator';
import { IBlock, Icard } from '@my-monorepo/core/utlis';
import { Observable, map } from 'rxjs';
import { ScrollToEndDirective } from '../../directives/scroll-to-end/scroll-to-end.directive';
import { CardEventsFacadeService } from '../../facades/card-events-facade.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  standalone: true,
  imports: [DragDropModule, ScrollToEndDirective, CardComponent, AsyncPipe],
})
@CallSetValueChanges()
export class CardListComponent {
  id = input<number>(-1);
  blockCard = input.required<IBlock>();
  isSelected = input<boolean>();

  customZIndex$!: Observable<number>;
  scrollMoveTick = 5;

  cardMove = output<boolean>();

  constructor(
    private readonly cardEventsFacadeService: CardEventsFacadeService,
  ) {}

  setValueChanges() {
    this.cardEventsFacadeService.onCardMove$$.subscribe((val) => {
      if (!val) this.cardMove.emit(false);
    });

    this.customZIndex$ = this.cardEventsFacadeService.onCardMove$$.pipe(
      map((val) => (val ? 1000 : 0)),
    );
  }

  onMove(item: Icard, event: CdkDragMove<Icard>) {
    this.cardEventsFacadeService.setCardMove(true, item);
    this.cardEventsFacadeService.objectMove(event.pointerPosition.x);
    this.cardMove.emit(true);
  }

  drop(event: CdkDragDrop<Icard[]>) {
    this.cardEventsFacadeService.setCardMove(false, undefined);
    this.cardEventsFacadeService.setLastToBeHovered(-1);
    this.cardMove.emit(false);
    this.cardEventsFacadeService.drop(event);
  }

  setEntered() {
    if (!this.isSelected())
      this.cardEventsFacadeService.setLastToBeHovered(this.id());
  }

  setExited() {
    if (this.cardEventsFacadeService.lastToBeHovered === this.id())
      this.cardEventsFacadeService.setLastToBeHovered(-1);
  }
}
