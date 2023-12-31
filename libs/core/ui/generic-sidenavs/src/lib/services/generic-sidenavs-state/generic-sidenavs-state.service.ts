import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, startWith } from 'rxjs';
import {
  LEFT_SIDENAV_CLASS,
  ONE_SIDENAV_CLASS,
  RIGHT_SIDENAV_CLASS,
  TWO_SIDENAV_CLASS,
} from '../../models/generic-sidenavs-models';

@Injectable({ providedIn: 'root' })
export class GenericSidenavsStateService {
  rightSidenav$ = new BehaviorSubject<boolean>(false);
  leftSidenav$ = new BehaviorSubject<boolean>(false);

  toggleClass(element: HTMLElement) {
    const rightSidenav$$ = this.rightSidenav$.asObservable();
    const leftSidenav$$ = this.leftSidenav$.asObservable();

    merge(rightSidenav$$, leftSidenav$$)
      .pipe(startWith(this.rightSidenav$.value, this.leftSidenav$.value))
      .subscribe(() => {
        const rightSidenav = this.rightSidenav$.value;
        const leftSidenav = this.leftSidenav$.value;
        const bothSidenavs = rightSidenav && leftSidenav;

        element.classList[rightSidenav ? 'add' : 'remove'](RIGHT_SIDENAV_CLASS);
        element.classList[leftSidenav ? 'add' : 'remove'](LEFT_SIDENAV_CLASS);

        if (bothSidenavs) {
          element.classList.add(TWO_SIDENAV_CLASS);
          element.classList.remove(ONE_SIDENAV_CLASS);
          return;
        }

        if (rightSidenav || leftSidenav)
          element.classList.add(ONE_SIDENAV_CLASS);
      });
  }
}
