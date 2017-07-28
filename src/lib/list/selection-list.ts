/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  Renderer2,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import {coerceBooleanProperty, SelectionModel} from '../core';
import {FocusKeyManager} from '../core/a11y/focus-key-manager';
import {Subscription} from 'rxjs/Subscription';
import {SPACE, TAB} from '../core/keyboard/keycodes';
import {Focusable} from '../core/a11y/focus-key-manager';
import {MdListOption, MdSelectionListOptionEvent} from './list-option';
import {CanDisable, mixinDisabled} from '../core/common-behaviors/disabled';
import {RxChain, map, doOperator, filter, switchMap, startWith} from '../core/rxjs/index';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {merge} from 'rxjs/observable/merge';

export class MdSelectionListBase {}
export const _MdSelectionListMixinBase = mixinDisabled(MdSelectionListBase);


@Component({
  moduleId: module.id,
  selector: 'md-selection-list, mat-selection-list',
  inputs: ['disabled'],
  host: {'role': 'listbox',
    '[attr.tabindex]': '_tabIndex',
    'class': 'mat-selection-list',
    '(focus)': 'focus()',
    '(keydown)': 'keydown($event)',
    '[attr.aria-disabled]': 'disabled.toString()'},
  template: '<ng-content></ng-content>',
  styleUrls: ['list.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdSelectionList extends _MdSelectionListMixinBase
  implements Focusable, CanDisable, AfterContentInit, OnDestroy {
  private _disableRipple: boolean = false;

  /** Tab index for the selection-list. */
  _tabIndex = 0;

  /** Track which options we're listening to for focus/destruction. */
  private _subscribed: WeakMap<MdListOption, boolean> = new WeakMap();

  /** Subscription to tabbing out from the selection-list. */
  private _tabOutSubscription: Subscription;

  /** The FocusKeyManager which handles focus. */
  _keyManager: FocusKeyManager;

  /** The option components contained within this selection-list. */
  @ContentChildren(MdListOption) options;
  // options: QueryList<MdListOption>;

  // options which are selected.
  selectedOptions: SelectionModel<MdListOption> = new SelectionModel<MdListOption>(true);

  /** Subscription to all list options' onFocus events */
  private _optionsChangeSubscriptionOnFocus: Subscription;

  /** Subscription to all list options' destroy events  */
  private _optionsChangeSubscriptionDestroy: Subscription;


  /**
   * Whether the ripple effect should be disabled on the list-items or not.
   * This flag only has an effect for `md-nav-list` components.
   */
  @Input()
  get disableRipple() { return this._disableRipple; }
  set disableRipple(value: boolean) { this._disableRipple = coerceBooleanProperty(value); }

  constructor(private _element: ElementRef) {
    super();
  }

  ngAfterContentInit(): void {
    this._keyManager = new FocusKeyManager(this.options).withWrap();

    if (this.disabled) {
      this._tabIndex = -1;
    }

    // When the list changes, re-subscribe
    this._optionsChangeSubscriptionOnFocus = this.onFocusSubscription();
    this._optionsChangeSubscriptionDestroy = this.onDestorySubscription();
  }

  ngOnDestroy(): void {
    if (this._tabOutSubscription) {
      this._tabOutSubscription.unsubscribe();
    }

    if (this._optionsChangeSubscriptionOnFocus) {
      this._optionsChangeSubscriptionOnFocus.unsubscribe();
    }
  }

  focus() {
    this._element.nativeElement.focus();
  }

  /**
   * Map all the options' destroy event subscriptions and merge them into one stream.
   */
  onDestorySubscription(): Subscription {
    // let subscription = this.options.changes.startWith(this.options).switchMap((options) => {
    //   return merge(...options.map(option => option.destroy));
    // }).subscribe(e => {
    //   let optionIndex: number = this.options.toArray().indexOf(e.option);
    //   if (e.option._hasFocus) {
    //     // Check whether the option is the last item
    //     if (optionIndex < this.options.length - 1) {
    //       this._keyManager.setActiveItem(optionIndex);
    //     } else if (optionIndex - 1 >= 0) {
    //       this._keyManager.setActiveItem(optionIndex - 1);
    //     }
    //   }
    //   e.option.destroy.unsubscribe();
    // });

    let sub2 = RxChain.from(this.options.changes).call(startWith, this.options)
      .call(switchMap, (options: MdListOption[]) => {
        return merge(...options.map(option => option.destroy));
      }).subscribe((e: MdSelectionListOptionEvent) => {
        let optionIndex: number = this.options.toArray().indexOf(e.option);
        if (e.option._hasFocus) {
          // Check whether the option is the last item
          if (optionIndex < this.options.length - 1) {
            this._keyManager.setActiveItem(optionIndex);
          } else if (optionIndex - 1 >= 0) {
            this._keyManager.setActiveItem(optionIndex - 1);
          }
        }
        e.option.destroy.unsubscribe();
      });

    return sub2;
  }

  /**
   * Map all the options' onFocus event subscriptions and merge them into one stream.
   */
  onFocusSubscription(): Subscription {
    // let subscription =  this.options.changes.startWith(this.options).switchMap((options) => {
    //   return merge(...options.map(option => option.onFocus));
    // }).subscribe(e => {
    //   let optionIndex: number = this.options.toArray().indexOf(e.option);
    //   this._keyManager.updateActiveItemIndex(optionIndex);
    // });

    let sub2 = RxChain.from(this.options.changes).call(startWith, this.options).call(switchMap,
      (options: MdListOption[]) => {
        return merge(...options.map(option => option.onFocus));
      }).subscribe((e: MdSelectionListOptionEvent) => {
      let optionIndex: number = this.options.toArray().indexOf(e.option);
      this._keyManager.updateActiveItemIndex(optionIndex);
    });

    return sub2;
  }

  /** Passes relevant key presses to our key manager. */
  keydown(event: KeyboardEvent) {
    let target = event.target as HTMLElement;
    switch (event.keyCode) {
      case SPACE:

        this._toggleSelectOnFocusedOption();

        // Always prevent space from scrolling the page since the list has focus
        event.preventDefault();
        break;
      default:
        this._keyManager.onKeydown(event);
    }
  }

  /** Toggles the selected state of the currently focused option. */
  protected _toggleSelectOnFocusedOption(): void {
    let focusedIndex = this._keyManager.activeItemIndex;

    if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
      let focusedOption: MdListOption = this.options.toArray()[focusedIndex];

      if (focusedOption) {
        focusedOption.toggle();
      }
    }
  }

  /**
   * Add a specific option to our subscribed list. If the option has
   * already been subscribed, this ensures it is only subscribed
   * once.
   *
   * @param option The option to be subscribed (or checked for existing
   * subscription).
   */
  protected _addOption(option: MdListOption) {
    // If we've already been subscribed to a parent, do nothing
    if (this._subscribed.has(option)) {
      return;
    }

    // Watch for focus events outside of the keyboard navigation
    option.onFocus.subscribe(() => {
      let optionIndex: number = this.options.toArray().indexOf(option);

      this._keyManager.updateActiveItemIndex(optionIndex);
    });

    // On destroy, remove the item from our list, and check focus
    option.destroy.subscribe(() => {
      let optionIndex: number = this.options.toArray().indexOf(option);

      // if (this._isValidIndex(optionIndex) && option._hasFocus) {
      if (option._hasFocus) {
        // Check whether the option is the last item
        if (optionIndex < this.options.length - 1) {
          this._keyManager.setActiveItem(optionIndex);
        } else if (optionIndex - 1 >= 0) {
          this._keyManager.setActiveItem(optionIndex - 1);
        }
      }

      this._subscribed.delete(option);
      option.destroy.unsubscribe();
    });

    this._subscribed.set(option, true);
  }

  /**
   * Utility to ensure all indexes are valid.
   *
   * @param index The index to be checked.
   * @returns True if the index is valid for our list of options.
   */
  private _isValidIndex(index: number): boolean {
    return index >= 0 && index < this.options.length;
  }
}
