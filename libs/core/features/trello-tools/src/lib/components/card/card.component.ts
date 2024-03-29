import {
  Component,
  ElementRef,
  EnvironmentInjector,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  BackDropEvent,
  BackdropContentDirective,
  BackdropStateService,
} from '@my-monorepo/core/features/backdrop-screen';
import { OutsideClickDirective } from '@my-monorepo/core/features/outside-element-click';
import { CallSetValueChanges } from '@my-monorepo/core/features/set-value-changes-decorator';
import { DbFacadeService } from '@my-monorepo/core/features/trello-db';
import {
  IBlock,
  Icard,
  OutsideClickEventsService,
} from '@my-monorepo/core/utlis';
import { merge, skip } from 'rxjs';
import { CardEventsFacadeService } from '../../facades/card-events-facade.service';
import { CardEditComponent } from '../card-edit/card-edit.component';

@Component({
  selector: 'trello-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    CardEditComponent,
    ReactiveFormsModule,
    OutsideClickDirective,
    BackdropContentDirective,
  ],
})
@CallSetValueChanges()
export class CardComponent {
  card = input<Icard>();
  isPreview = input<boolean>();
  onAddNew = input<boolean>(false);
  blockCard = input.required<IBlock>();
  nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  editTemplate = viewChild<BackDropEvent>(BackdropContentDirective);

  cardNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  injector = inject(EnvironmentInjector);

  constructor(
    private readonly backdropStateService: BackdropStateService,
    private readonly cardEventsFacadeService: CardEventsFacadeService,
    private readonly outsideClickEventsService: OutsideClickEventsService,
    private readonly dbFacadeService: DbFacadeService,
  ) {}

  setValueChanges() {
    effect(() => {
      this.nameInput()?.nativeElement.focus({ preventScroll: true });
    });

    if (this.isPreview()) return;
    this.outsideClickEvents();
  }

  outsideClickEvents() {
    const outSideClick$$ = this.outsideClickEventsService.outSideClick$$;
    const editClick$$ = this.outsideClickEventsService.editClick$$;

    merge(
      editClick$$,
      outSideClick$$,
      this.cardEventsFacadeService.onMove$$,
      this.cardEventsFacadeService.onCardMove$$,
    )
      .pipe(skip(2))
      .subscribe(() => {
        this.addCard(true);
        this.cancelEvent();
      });
  }

  addCard(onOutside?: boolean) {
    if (this.cardNameControl.invalid) return;

    const cards = this.blockCard().cards$.value;

    this.dbFacadeService
      .createCard({
        name: this.cardNameControl.value,
        blockId: this.blockCard().id,
        cardIndex: cards.length,
      })
      .subscribe((resp) => {
        cards.push({
          id: resp.id,
          name: this.cardNameControl.value,
          cardIndex: cards.length,
          blockId: this.blockCard().id,
        });
        this.cardNameControl.reset();
        if (onOutside) return this.cancelEvent();
        this.blockCard().addNewEvent$.next(true);
      });
  }

  cancelEvent() {
    this.blockCard().addNewEvent$.next(false);
  }

  editclick() {
    this.outsideClickEventsService.editClick$.next();
    this.backdropStateService.setBackDropState(this.editTemplate());
  }
}
