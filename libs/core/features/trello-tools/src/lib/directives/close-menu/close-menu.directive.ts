import { CdkMenuTrigger } from '@angular/cdk/menu';
import { Directive, Input } from '@angular/core';
import { CallSetValueChanges } from '@my-monorepo/core/features/set-value-changes-decorator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { merge } from 'rxjs';
import { CardEventsFacadeService } from '../../facades/card-events-facade.service';

@Directive({
  selector: '[autoCloseMenu]',
})
@UntilDestroy()
@CallSetValueChanges()
export class CloseMenuDirective {
  @Input({ alias: 'autoCloseMenu', required: true })
  menuTriger!: CdkMenuTrigger;

  constructor(
    private readonly cardEventsFacadeService: CardEventsFacadeService
  ) {}

  setValueChanges() {
    const moveEvent$ = merge(
      this.cardEventsFacadeService.onCardMove$$,
      this.cardEventsFacadeService.onMove$$
    );

    moveEvent$.pipe(untilDestroyed(this)).subscribe(() => {
      this.menuTriger?.close();
    });
  }
}
