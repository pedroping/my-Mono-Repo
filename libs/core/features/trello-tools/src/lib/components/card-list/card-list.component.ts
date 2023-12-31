import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CallSetValueChanges } from '@my-monorepo/core/features/set-value-changes-decorator';
import { Observable, map } from 'rxjs';
import { CardEventsFacadeService } from '../../facades/card-events-facade.service';
import { IBlock, Icard } from '../../models/card.models';

@Component({
  selector: 'card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
@CallSetValueChanges()
export class CardListComponent {
  @Input({ required: true }) id = -1;
  @Input({ required: true }) blockCard!: IBlock;
  @Output() cardMove = new EventEmitter<boolean>();

  customZIndex$!: Observable<number>;

  constructor(
    private readonly cardEventsFacadeService: CardEventsFacadeService
  ) {}

  setValueChanges() {
    this.cardEventsFacadeService.onCardMove$$.subscribe((val) => {
      if (!val) this.cardMove.emit(false);
    });

    this.customZIndex$ = this.cardEventsFacadeService.onCardMove$$.pipe(
      map((val) => (val ? 1000 : 0))
    );
  }

  onMove() {
    this.cardEventsFacadeService.setCardMove(true);
    this.cardMove.emit(true);
  }

  onDrop() {
    this.cardEventsFacadeService.setCardMove(false);
    this.cardEventsFacadeService.setLastToBeHovered(-1);
    this.cardMove.emit(false);
  }

  drop(event: CdkDragDrop<Icard[]>) {
    this.cardEventsFacadeService.drop(event);
  }
}
