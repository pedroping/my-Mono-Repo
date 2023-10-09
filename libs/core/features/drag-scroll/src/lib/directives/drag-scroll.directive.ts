import { Directive, ElementRef, HostListener } from '@angular/core';
import {
  CardMocksService,
  DragAndDropService,
} from '@my-monorepo/core/features/trello-tools';
import { Subject, startWith, takeUntil, timer } from 'rxjs';
import { ScrollEventsService } from "@my-monorepo/core/facades"

export const BASE_BLOCK_SIZE = 320;
export const BASE_SIDENAV_SIZE = 350;
export const BASE_ADD_NEW_SIZE = 340;
export const BASE_SCROLL_AREA = 100;
export const BASE_SCROLL_MOVE_TICK = 2;
@Directive({
  selector: '[dragScroll]',
})
export class DragScrollDirective {
  constructor(
    private readonly el: ElementRef,
    private readonly dragAndDropService: DragAndDropService,
    private readonly cardMocksService: CardMocksService,
    private readonly scrollEventsService: ScrollEventsService
  ) {
    this.setSubscriptions();
  }

  mouseDown = false;
  startX = 0;
  scrollLeft = 0;

  stopLeftEvent$ = new Subject<void>();
  stopRightEvent$ = new Subject<void>();

  @HostListener('mousedown', ['$event'])
  startDragging(e: MouseEvent) {
    const el = this.el.nativeElement.parentElement;
    this.mouseDown = true;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  stopDragging() {
    this.mouseDown = false;
  }

  @HostListener('mousemove', ['$event'])
  moveEvent(e: MouseEvent) {
    const el = this.el.nativeElement;
    e.preventDefault();
    this.stopRightEvent$.next();
    this.stopLeftEvent$.next();

    const hasRightSidenav = false;
    const hasLeftSidenav = false;

    const onMove = this.dragAndDropService.onMove$.value;
    const onCardMove = this.dragAndDropService.onCardMove$.value;

    const rightCalc = hasRightSidenav ? BASE_SIDENAV_SIZE : BASE_SCROLL_AREA;
    const leftCalc = hasLeftSidenav ? BASE_SIDENAV_SIZE : BASE_SCROLL_AREA;

    if (!onMove && onCardMove) {
      if (window.innerWidth - rightCalc < e.pageX) {
        this.startRightEvent();
        return;
      }
      this.stopRightEvent$.next();

      if (leftCalc > e.pageX) {
        this.startLeftEvent();
        return;
      }
      this.stopLeftEvent$.next();

      return;
    }

    if (!this.mouseDown || onMove) {
      return;
    }

    const xPosition = e.pageX - el.offsetLeft;
    const scroll = xPosition - this.startX;
    this.el.nativeElement.parentElement.scrollLeft = this.scrollLeft - scroll;
  }

  startLeftEvent() {
    timer(0, 1)
      .pipe(takeUntil(this.stopLeftEvent$))
      .subscribe(() => {
        if (this.dragAndDropService.onCardMove$.value)
          this.el.nativeElement.parentElement.scrollLeft -= BASE_SCROLL_MOVE_TICK;

      });
  }

  startRightEvent() {
    timer(0, 1)
      .pipe(takeUntil(this.stopRightEvent$))
      .subscribe(() => {
        if (this.dragAndDropService.onCardMove$.value)
          this.el.nativeElement.parentElement.scrollLeft += BASE_SCROLL_MOVE_TICK;

      });
  }

  setSubscriptions() {
    this.cardMocksService.blocks$
      .pipe(startWith(this.cardMocksService.blocks$.value))
      .subscribe((blocks) => {
        const length = blocks.length;
        this.el.nativeElement.style.width = length * BASE_BLOCK_SIZE + BASE_ADD_NEW_SIZE + 'px';
      });

    this.scrollEventsService.scrollToEnd$.subscribe(() => {
      const length = this.cardMocksService.blocks$.value.length;
      this.el.nativeElement.parentElement.scrollLeft +=
        (length + 1) * BASE_BLOCK_SIZE + BASE_ADD_NEW_SIZE;
    });
  }
}
