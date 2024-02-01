import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { IBlock, Icard } from '../models/card.models';
import { CardMocksService } from '../services/card-mocks/card-mocks.service';
import { DragAndDropService } from '../services/drag-and-drop/drag-and-drop.service';

@Injectable({ providedIn: 'root' })
export class CardEventsFacadeService {
  readonly blocks$$ = this.cardMocksService.blocks$.asObservable();
  readonly onMove$$ = this.dragAndDropService.onMove$.asObservable();
  readonly onCardMove$$ = this.dragAndDropService.onCardMove$.asObservable();

  constructor(
    private readonly cardMocksService: CardMocksService,
    private readonly dragAndDropService: DragAndDropService
  ) {}

  startDomain() {
    this.dragAndDropService.startDomain();
  }

  addNew(name: string) {
    this.cardMocksService.addNew(name);
  }

  setCardMove(value: boolean) {
    this.dragAndDropService.onCardMove$.next(value);
  }

  setBlockMove(value: boolean) {
    this.dragAndDropService.onMove$.next(value);
  }

  drop(event: CdkDragDrop<Icard[]>) {
    this.dragAndDropService.drop(event);
  }

  onEvent(value: boolean) {
    this.dragAndDropService.onEvent(value);
  }

  blockDrop(event: CdkDragDrop<IBlock[]>) {
    this.dragAndDropService.blockDrop(event);
  }

  setLastToBeHovered(value: number) {
    this.dragAndDropService.lastToBeHovered = value;
  }

  getAllCards(value = false) {
    this.cardMocksService.getAllCards(value);
  }

  moveToBlock(blockToRemove: Icard[], blockToAdd: Icard[], card: Icard) {
    this.dragAndDropService.moveToBlock(blockToRemove, blockToAdd, card);
  }

  get lastToBeHovered() {
    return this.dragAndDropService.lastToBeHovered;
  }

  get onCardMove() {
    return this.dragAndDropService.onCardMove$.value;
  }

  get onMove() {
    return this.dragAndDropService.onMove$.value;
  }

  get blocks() {
    return this.cardMocksService.blocks$.value;
  }
}
