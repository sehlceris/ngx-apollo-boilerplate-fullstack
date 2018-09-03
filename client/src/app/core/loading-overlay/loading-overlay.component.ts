import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingOverlayService } from './loading-overlay.service';

@Component({
  selector: 'loading-overlay',
  templateUrl: './loading-overlay.template.html',
  styleUrls: ['./loading-overlay.style.scss'],
})
export class LoadingOverlayComponent implements OnInit, OnDestroy {
  public message: string = 'Hello, World!';
  public show: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(private overlayService: LoadingOverlayService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.overlayService.onShow$.subscribe((message) => {
        this.message = message;
        this.show = true;
      })
    );

    this.subscriptions.push(
      this.overlayService.onHide$.subscribe(() => {
        // this.message = '';
        this.show = false;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }
}
