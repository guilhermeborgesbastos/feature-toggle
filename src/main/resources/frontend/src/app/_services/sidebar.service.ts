import { Injectable } from '@angular/core';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

@Injectable()
export class SidebarService {
  private drawer: MatDrawer;
  public isOpened$: Subject<boolean>;

  constructor() {
    this.isOpened$ = new Subject<boolean>();
  }

  /**
   * Setter for mat drawer.
   *
   * @param {MatSidnav} drawer
   */
  public setMatDrawer(drawer: MatDrawer, isOpened?: boolean) {
    this.drawer = drawer;
  }

  /**
   * Open this mat drawer, and return a Promise that will resolve when it's fully opened (or get rejected if it didn't).
   *
   * @returns Promise<MatSidnavToggleResult>
   */
  public open(): Promise<MatDrawerToggleResult> {
    this.drawer.open();
    return;
  }

  /**
   * Close this mat drawer, and return a Promise that will resolve when it's fully closed (or get rejected if it didn't).
   *
   * @returns Promise<MatSidnavToggleResult>
   */
  public close(): Promise<MatDrawerToggleResult> {
    this.drawer.close();
    return;
  }

  /**
   * Toggle this mat drawer. This is equivalent to calling open() when it's already opened, or close() when it's closed.
   *
   * @param {boolean} isOpen  Whether the mat drawer should be open.
   *
   * @returns {Promise<MatSidnavToggleResult>}
   */
  public toggle(isOpen?: boolean): Promise<MatDrawerToggleResult> {
    this.drawer.toggle(isOpen);
    this.isOpened$.next(this.drawer.opened);
    return;
  }
}
