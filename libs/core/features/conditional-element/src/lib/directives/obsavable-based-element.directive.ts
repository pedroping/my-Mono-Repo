import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CallSetValueChanges } from '@my-monorepo/core/features/set-value-changes-decorator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
@Directive({
  selector: '[obsavableBasedElement]',
})
@UntilDestroy()
@CallSetValueChanges()
export class ObsavableBasedElementDirective implements OnInit {
  @Input('obsavableBasedElement')
  creatEvent$: Observable<void> = new Observable<void>();
  @Input('obsavableBasedElementDelete')
  deleteEvent$: Observable<void> = new Observable<void>();

  private readonly vcr = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<unknown>);

  ngOnInit(): void {
    this.vcr.clear();
  }

  setValueChanges() {
    this.creatEvent$.pipe(untilDestroyed(this)).subscribe(() => {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this.templateRef);
    });

    this.deleteEvent$.pipe(untilDestroyed(this)).subscribe(() => {
      this.vcr.clear();
    });
  }
}
