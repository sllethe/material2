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
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  Optional,
  QueryList,
  Renderer2,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnDestroy,
  EventEmitter,
  Output, ChangeDetectorRef
} from '@angular/core';
import {coerceBooleanProperty, MdLine, MdLineSetter, MdPseudoCheckbox, MdSelectionModule, SelectionModel} from '../core';
import {FocusKeyManager} from '../core/a11y/focus-key-manager';
import {Subscription} from 'rxjs/Subscription';
import {SPACE, LEFT_ARROW, RIGHT_ARROW, TAB, HOME, END} from '../core/keyboard/keycodes';
import {Focusable} from '../core/a11y/focus-key-manager';
import {MdListOption} from './list-option';
import {CanDisable, mixinDisabled} from '../core/common-behaviors/disabled';

export class MdSelectionListBase {}
export const _MdSelectionListMixinBase = mixinDisabled(MdSelectionListBase);


@Component({
  moduleId: module.id,
  selector: 'md-selection-list, mat-selection-list',
  inputs: ['disabled'],
  host: {'role': 'listbox',
    '[attr.tabindex]': '_tabIndex',
    'class': 'mat-selection-list',
    // Events
    '(focus)': 'focus()',
    '(keydown)': 'keydown($event)',
    '[attr.aria-disabled]': 'disabled.toString()'},
  // queries: {
  //   options: new ContentChildren(MdListOption)
  // },
  template: '<ng-content></ng-content>',
  styleUrls: ['list.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdSelectionList extends _MdSelectionListMixinBase
  implements Focusable, CanDisable, AfterContentInit, OnDestroy {
  private _disableRipple: boolean = false;

  // private _disabled: boolean = false;

  /** Tab index for the selection-list. */
  _tabIndex = 0;

  /** Track which options we're listening to for focus/destruction. */
  private _subscribed: WeakMap<MdListOption, boolean> = new WeakMap();

  /** Subscription to tabbing out from the selection-list. */
  private _tabOutSubscription: Subscription;

  private _optionsChangeSubscription: Subscription;

  /** Whether or not the option is selectable. */
  protected _selectable: boolean = true;

  /** The FocusKeyManager which handles focus. */
  _keyManager: FocusKeyManager;

  /** The option components contained within this selection-list. */
  @ContentChildren(MdListOption) options;
  // options: QueryList<MdListOption>;

  // options which are selected.
  selectedOptions: SelectionModel<MdListOption> = new SelectionModel<MdListOption>(true);

  /**
   * Whether the ripple effect should be disabled on the list-items or not.
   * This flag only has an effect for `md-nav-list` components.
   */
  @Input()
  get disableRipple() { return this._disableRipple; }
  set disableRipple(value: boolean) { this._disableRipple = coerceBooleanProperty(value); }

  // @Input()
  // get disabled() { return this._disabled; }
  // set disabled(value: any) { this._disabled = coerceBooleanProperty(value); }

  // /**
  //  * Whether or not this option is selectable. When a option is not selectable,
  //  * it's selected state is always ignored.
  //  */
  // @Input()
  // get selectable(): boolean { return this._selectable; }
  // set selectable(value: boolean) {
  //   this._selectable = coerceBooleanProperty(value);
  // }

  constructor(private _element: ElementRef) {
    super();
  }

  ngAfterContentInit(): void {
    this._keyManager = new FocusKeyManager(this.options).withWrap();

    // // Prevents the selection-list from capturing focus and redirecting
    // // it back to the first option when the user tabs out.
    // this._tabOutSubscription = this._keyManager.tabOut.subscribe(() => {
    //   this._tabIndex = -1;
    //   setTimeout(() => this._tabIndex = 0);
    // });
    if (this.disabled) {
      this._tabIndex = -1;
    }

    // Go ahead and subscribe all of the initial options
    this._subscribeOptions(this.options);

    // When the list changes, re-subscribe
    this._optionsChangeSubscription = this.options.changes.subscribe((options: QueryList<MdListOption>) => {
      this._subscribeOptions(options);
    });

    console.log(this.options);
  }

  ngOnDestroy(): void {
    if (this._tabOutSubscription) {
      this._tabOutSubscription.unsubscribe();
    }

    if (this._optionsChangeSubscription) {
      this._optionsChangeSubscription.unsubscribe();
    }
  }

  focus() {
    this._element.nativeElement.focus();
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
    // if (!this.selectable) {
    //   return;
    // }

    let focusedIndex = this._keyManager.activeItemIndex;

    if (focusedIndex != null && this._isValidIndex(focusedIndex)) {
      let focusedOption: MdListOption = this.options.toArray()[focusedIndex];

      if (focusedOption) {
        focusedOption.toggle();
      }
    }
  }


  /**
   * Iterate through the list of options and add them to our list of
   * subscribed options.
   *
   * @param options The list of options to be subscribed.
   */
  protected _subscribeOptions(options: QueryList<MdListOption>): void {
    options.forEach(option => this._addOption(option));
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
      // if (this._isValidIndex(optionIndex)) {
      //   this._keyManager.updateActiveItemIndex(optionIndex);
      // }
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
