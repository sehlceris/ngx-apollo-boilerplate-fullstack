import { animate, style, transition, trigger } from '@angular/animations';

/**
 * @example
 * <!-- template -->
 * <task-card
 *   ngFor="let task of (tasks | async), let i = index"
 *   [task]="task"
 *   (done)="removeTask(task, i)"
 *   [@animatedListItemIn]
 *   [@animatedListItemOut]
 *   (@animatedListItemOut.done)="handleTaskRemovalComplete($event)
 *   [@animatedListItemBelowRemovedSibling]="(deletedSiblingIndex <= i).toString()"
 * ></task-card>
 * // component
 * ...
 * animations: [
 *   ...createAnimatedListItemTriggers('1em') // input double the margin of your list items
 * ]
 * ...
 * handleTaskRemovalComplete(event) {
 *   this.deletedSiblingIndex = Infinity;
 * }
 * ...
 * removeTask(task, index) {
 *   this.deletedSiblingIndex = index;
 * }
 */
export const AnimatedListItems = {

  buildTriggers(listItemMargin = '0px') {
    return [
      trigger('animatedListItemIn', [
        transition('void => *', [
          style({
            opacity: 0,
            transform: 'translateX(-5%) scale(0.92)',
          }),
          animate(
            300,
            style({
              opacity: 1,
              transform: 'translateX(0) scale(1.0)',
            })
          ),
        ]),
      ]),
      trigger('animatedListItemOut', [
        transition('* => void', [
          style({
            zIndex: -1,
            transform: 'translateX(0) scale(1.0)',
            boxShadow: 'none',
          }),
          animate(
            300,
            style({
              opacity: 0,
              transform: 'translateX(50%) scale(0.5)',
            })
          ),
        ]),
      ]),
      trigger('animatedListItemBelowRemovedSibling', [
        transition('false => true', [
          style({
            transform: 'translateY(0px)',
          }),
          animate(
            300,
            style({
              transform: `translateY(calc(-100% - ${listItemMargin})`,
            })
          ),
        ]),
        transition('true => false', [
          style({
            transform: 'translateY(0px)',
          }),
        ]),
      ]),
    ]
  }
};
