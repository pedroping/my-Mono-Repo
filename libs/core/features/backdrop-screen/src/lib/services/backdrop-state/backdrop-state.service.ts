import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackdropStateService {
  showBackDrop$ = new BehaviorSubject<boolean>(false);
  private showBackDrop$$ = this.showBackDrop$.asObservable();

  get backDropSubscription$() {
    return this.showBackDrop$$;
  }
}
