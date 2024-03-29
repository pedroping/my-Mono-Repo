import { Injectable } from '@angular/core';
import { SidebarPageStateService } from '../services/sidebar-page-state/sidebar-page-state.service';

@Injectable({ providedIn: 'root' })
export class RightSidebarFacade {
  constructor(
    private readonly sidebarPageStateService: SidebarPageStateService,
  ) {}

  get pageChange$() {
    return this.sidebarPageStateService.actualPage$.asObservable();
  }

  get actualPage() {
    return this.sidebarPageStateService.actualPage$.value;
  }

  get lastPageOpened() {
    return this.sidebarPageStateService.lastPageOpened;
  }

  setPage(page: number | null) {
    this.sidebarPageStateService.actualPage$.next(page);
  }

  setLastPage(page: number) {
    this.sidebarPageStateService.lastPageOpened = page;
  }
}
