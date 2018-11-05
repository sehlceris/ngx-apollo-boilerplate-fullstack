import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RandomUtils } from '../../../static-utils/random-utils';

interface LoadingOverlayStackItem {
  referenceId: string;
  message: string;
}

@Injectable()
export class LoadingOverlayService {
  private onShowSubject: Subject<string> = new Subject<string>();
  private onHideSubject: Subject<void> = new Subject<void>();

  public onShow$: Observable<string> = this.onShowSubject.asObservable();
  public onHide$: Observable<void> = this.onHideSubject.asObservable();

  private loadingStack: LoadingOverlayStackItem[] = [];

  constructor() {}

  public pushLoadingScreen(message: string): string {
    const referenceId = RandomUtils.randomString();
    this.loadingStack.push({ referenceId, message });
    this.handleTopItemInLoadingStackChanged();
    return referenceId;
  }

  public pushOrEditLoadingScreen(referenceId: string, message: string, bringToTop: boolean = false): boolean {
    const itemIndex = this.getItemIndexWithReferenceId(referenceId);
    if (itemIndex >= 0) {
      const item = this.loadingStack[itemIndex];
      item.message = message;
      if (bringToTop) {
        this.loadingStack.splice(itemIndex, 1);
        this.loadingStack.push(item);
        this.handleTopItemInLoadingStackChanged();
      } else if (itemIndex === this.loadingStack.length - 1) {
        this.handleTopItemInLoadingStackChanged();
      }
      return true;
    } else {
      this.loadingStack.push({ referenceId, message });
      this.handleTopItemInLoadingStackChanged();
      return false;
    }
  }

  public removeLoadingScreen(referenceId: string): boolean {
    const itemIndex = this.getItemIndexWithReferenceId(referenceId);
    if (itemIndex >= 0) {
      const topItemInStackWasRemoved = itemIndex === this.loadingStack.length - 1;
      this.loadingStack.splice(itemIndex, 1);
      if (topItemInStackWasRemoved) {
        this.handleTopItemInLoadingStackChanged();
      }
      return true;
    }
    return false;
  }

  private handleTopItemInLoadingStackChanged() {
    if (this.topItemInStack) {
      this.onShowSubject.next(this.topItemInStack.message);
    } else {
      this.onHideSubject.next();
    }
  }

  private getItemIndexWithReferenceId(referenceId: string): number {
    return this.loadingStack.findIndex((item: LoadingOverlayStackItem) => item.referenceId === referenceId);
  }

  private getItemWithReferenceId(referenceId: string): LoadingOverlayStackItem {
    return this.loadingStack.find((item: LoadingOverlayStackItem) => item.referenceId === referenceId);
  }

  private get topItemInStack(): LoadingOverlayStackItem {
    if (!this.loadingStack.length) {
      return null;
    }
    return this.loadingStack[this.loadingStack.length - 1];
  }
}
