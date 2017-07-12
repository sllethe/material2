/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentInit, AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  Input, OnInit,
  Optional,
  QueryList,
  Renderer2, ViewChild, ViewChildren,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnDestroy,
  EventEmitter,
  Output
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {coerceBooleanProperty, MdLine, MdLineSetter, MdPseudoCheckbox, MdSelectionModule, SelectionModel} from '../core';
import {FocusKeyManager} from '../core/a11y/focus-key-manager';
import {MdCheckbox} from '../checkbox';
import {MdCheckboxModule} from '../checkbox';
import {Subscription} from 'rxjs/Subscription';
import {SPACE, LEFT_ARROW, RIGHT_ARROW, TAB, HOME, END} from '../core/keyboard/keycodes';
import {Focusable} from '../core/a11y/focus-key-manager';



@Directive({
  selector: 'md-divider, mat-divider',
  host: {
    'role': 'separator',
    'aria-orientation': 'horizontal'
  }
})
export class MdListDivider {}

@Component({
  moduleId: module.id,
  selector: 'md-list, mat-list, md-nav-list, mat-nav-list',
  host: {'role': 'list'},
  template: '<ng-content></ng-content>',
  styleUrls: ['list.css'],
  encapsulation: ViewEncapsulation.None
})
export class MdList {
  private _disableRipple: boolean = false;

  /**
   * Whether the ripple effect should be disabled on the list-items or not.
   * This flag only has an effect for `md-nav-list` components.
   */
  @Input()
  get disableRipple() { return this._disableRipple; }
  set disableRipple(value: boolean) { this._disableRipple = coerceBooleanProperty(value); }
}



export interface MdSelectionListOptionEvent {
  option: MdListOption;
}

/**
 * Component for list-options of selection-list. Each list-option can automatically
 * generate a checkbox and can put current item into the selectionModel of selection-list
 * if the current item is checked.
 */
@Component({
  moduleId: module.id,
  selector: 'md-list-option, mat-list-option',
  host: {
    'role': 'option',
    'class': 'mat-list-item, mat-list-option',
    '(focus)': '_handleFocus()',
    '(blur)': '_handleBlur()',
    '(click)': 'toggle()',
    // '(keydown)':'onKeydown($event)',
    //'[tabIndex]': 'disabled ? -1 : 0',
    'tabindex': '-1',
    '[attr.aria-selected]': 'selected.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
  },
  templateUrl: 'list-option.html',
  encapsulation: ViewEncapsulation.None
})
export class MdListOption implements AfterContentInit, OnDestroy, Focusable {
  private _lineSetter: MdLineSetter;
  private _disableRipple: boolean = false;
  private _selected: boolean = false;
  /** Whether the checkbox is disabled. */
  private _disabled: boolean = false;
  private _value: any;

  /** Whether the option has focus. */
  _hasFocus: boolean = false;

  /**
   * Whether the ripple effect on click should be disabled. This applies only to list items that are
   * part of a nav list. The value of `disableRipple` on the `md-nav-list` overrides this flag.
   */
  @Input()
  get disableRipple() { return this._disableRipple; }
  set disableRipple(value: boolean) { this._disableRipple = coerceBooleanProperty(value); }

  @ContentChildren(MdLine) _lines: QueryList<MdLine>;

  /** Whether the label should appear after or before the checkbox. Defaults to 'after' */

  @Input() checkboxPosition: 'before' | 'after' = 'after';

  /** Whether the checkbox is disabled. */

  @Input()
  get disabled() { return (this.selectionList && this.selectionList.disabled) || this._disabled; }
  set disabled(value: any) { this._disabled = coerceBooleanProperty(value); }

  @Input()
  get value() { return this._value; }
  set value( val: any) { this._value = coerceBooleanProperty(val); }

  @Input()
  get selected() { return this._selected; }
  set selected( val: boolean) { this._selected = coerceBooleanProperty(val); }

  /** Emitted when the option is focused. */
  onFocus = new EventEmitter<MdSelectionListOptionEvent>();

  /** Emitted when the option is selected. */
  @Output() select = new EventEmitter<MdSelectionListOptionEvent>();

  /** Emitted when the option is deselected. */
  @Output() deselect = new EventEmitter<MdSelectionListOptionEvent>();

  /** Emitted when the option is destroyed. */
  @Output() destroy = new EventEmitter<MdSelectionListOptionEvent>();

  constructor(private _renderer: Renderer2,
              private _element: ElementRef,
              @Optional() public selectionList: MdSelectionList,) { }


  ngAfterContentInit() {
    this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
  }

  ngOnDestroy(): void {
    this.destroy.emit({option: this});
  }

  toggle(): void {
    // console.log('checked or not: ' + this.pCheckbox.state + ', isSelected or not: ' + this._selected);
    // if(this._disabled == false) {
    //   this._selected = !this._selected;
    //   if(this._selected == true) {
    //     this.selectionList.selectedOptions.select(this);
    //   }else {
    //     this.selectionList.selectedOptions.deselect(this);
    //   }
    // }

    this.selected = !this.selected;
    this.selectionList.selectedOptions.toggle(this);

    console.log(this.selectionList.selectedOptions);
    console.log('current selectionModule: ' + this.selectionList.selectedOptions.selected.length);
  }

  onKeydown(e: KeyboardEvent): void {
    // console.log('who onkeyDown: ' + this.pCheckbox);
    if(e.keyCode === 32 && this._disabled == false) {
      let focusedElement = document.activeElement;
      console.log(focusedElement === this._element.nativeElement);
      if(focusedElement === this._element.nativeElement) {
        this.toggle();
      }
    }
  }

  /** Allows for programmatic focusing of the option. */
  focus(): void {
    this._element.nativeElement.focus();
    this.onFocus.emit({option: this});
  }

  /** Whether this list item should show a ripple effect when clicked.  */
  isRippleEnabled() {
    return !this.disableRipple && !this.selectionList.disableRipple;
  }

  _handleFocus() {
    this._hasFocus = true;
    this._renderer.addClass(this._element.nativeElement, 'mat-list-item-focus');
  }

  _handleBlur() {
    this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-focus');
  }

  /** Retrieves the DOM element of the component host. */
  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }
}


@Component({
  moduleId: module.id,
  selector: 'md-selection-list, mat-selection-list',
  host: {'role': 'listbox',
    '[attr.tabindex]': '_tabIndex',
    'class': 'mat-selection-list',
    // Events
    '(focus)': 'focus()',
    '(keydown)': 'keydown($event)'},
  queries: {
    options: new ContentChildren(MdListOption)
  },
  template: '<ng-content></ng-content>',
  styleUrls: ['list.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdSelectionList implements AfterContentInit, OnDestroy {
  private _disableRipple: boolean = false;

  private _disabled: boolean = false;

  /** Tab index for the selection-list. */
  _tabIndex = 0;

  /** Track which options we're listening to for focus/destruction. */
  private _subscribed: WeakMap<MdListOption, boolean> = new WeakMap();

  /** Subscription to tabbing out from the selection-list. */
  private _tabOutSubscription: Subscription;

  /** Whether or not the option is selectable. */
  protected _selectable: boolean = true;

  /** The FocusKeyManager which handles focus. */
  _keyManager: FocusKeyManager;

  /** The option components contained within this selection-list. */
  options: QueryList<MdListOption>;

  // options which are selected.
  selectedOptions: SelectionModel<MdListOption> = new SelectionModel<MdListOption>(true);

  /**
   * Whether the ripple effect should be disabled on the list-items or not.
   * This flag only has an effect for `md-nav-list` components.
   */
  @Input()
  get disableRipple() { return this._disableRipple; }
  set disableRipple(value: boolean) { this._disableRipple = coerceBooleanProperty(value); }

  @Input()
  get disabled() { return this._disabled; }
  set disabled(value: any) { this._disabled = coerceBooleanProperty(value); }

  constructor(private _element: ElementRef) { }

  ngAfterContentInit(): void {
    this._keyManager = new FocusKeyManager(this.options).withWrap();

    // Prevents the selection-list from capturing focus and redirecting
    // it back to the first option when the user tabs out.
    this._tabOutSubscription = this._keyManager.tabOut.subscribe(() => {
      this._tabIndex = -1;
      setTimeout(() => this._tabIndex = 0);
    });

    // Go ahead and subscribe all of the initial options
    this._subscribeOptions(this.options);

    // When the list changes, re-subscribe
    this.options.changes.subscribe((options: QueryList<MdListOption>) => {
      this._subscribeOptions(options);
    });

    console.log(this.options);
  }

  ngOnDestroy(): void {
    if (this._tabOutSubscription) {
      this._tabOutSubscription.unsubscribe();
    }
  }

  /**
   * Whether or not this option is selectable. When a option is not selectable,
   * it's selected state is always ignored.
   */
  @Input()
  get selectable(): boolean { return this._selectable; }
  set selectable(value: boolean) {
    this._selectable = coerceBooleanProperty(value);
  }

  focus() {
    this._element.nativeElement.focus();
  }

  /** Passes relevant key presses to our key manager. */
  keydown(event: KeyboardEvent) {
    let target = event.target as HTMLElement;

    // If they are on a option ot a selection-list, check for space/left/right, otherwise pass to our key manager  mat-selection-list  mat-list-item
    if (target && (target.classList.contains('mat-selection-list') || target.classList.contains('mat-list-item') || target.classList.contains('mat-list-option'))) {
      switch (event.keyCode) {
        case SPACE:
          // If we are selectable, toggle the focused option
          if (this.selectable) {
            this._toggleSelectOnFocusedOption();
          }

          // Always prevent space from scrolling the page since the list has focus
          event.preventDefault();
          break;
        case LEFT_ARROW:
          this._keyManager.setPreviousItemActive();
          event.preventDefault();
          break;
        case RIGHT_ARROW:
          this._keyManager.setNextItemActive();
          event.preventDefault();
          break;
        default:
          this._keyManager.onKeydown(event);
      }
    }
  }

  /** Toggles the selected state of the currently focused option. */
  protected _toggleSelectOnFocusedOption(): void {
    // Allow disabling of option selection
    if (!this.selectable) {
      return;
    }

    let focusedIndex = this._keyManager.activeItemIndex;

    if (typeof focusedIndex === 'number' && this._isValidIndex(focusedIndex)) {
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

      if (this._isValidIndex(optionIndex)) {
        this._keyManager.updateActiveItemIndex(optionIndex);
      }
    });

    // On destroy, remove the item from our list, and check focus
    option.destroy.subscribe(() => {
      let optionIndex: number = this.options.toArray().indexOf(option);

      if (this._isValidIndex(optionIndex) && option._hasFocus) {
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

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: 'md-list, mat-list',
  host: {'class': 'mat-list'}
})
export class MdListCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: 'md-nav-list, mat-nav-list',
  host: {'class': 'mat-nav-list'}
})
export class MdNavListCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: 'md-divider, mat-divider',
  host: {'class': 'mat-divider'}
})
export class MdDividerCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: '[md-list-avatar], [mat-list-avatar], [mdListAvatar], [matListAvatar]',
  host: {'class': 'mat-list-avatar'}
})
export class MdListAvatarCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: '[md-list-icon], [mat-list-icon], [mdListIcon], [matListIcon]',
  host: {'class': 'mat-list-icon'}
})
export class MdListIconCssMatStyler {}

/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
@Directive({
  selector: '[md-subheader], [mat-subheader]',
  host: {'class': 'mat-subheader'}
})
export class MdListSubheaderCssMatStyler {}

@Component({
  moduleId: module.id,
  selector: 'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
  host: {
    'role': 'listitem',
    'class': 'mat-list-item',
    '(focus)': '_handleFocus()',
    '(blur)': '_handleBlur()',
  },
  templateUrl: 'list-item.html',
  encapsulation: ViewEncapsulation.None
})
export class MdListItem implements AfterContentInit {
  private _lineSetter: MdLineSetter;
  private _disableRipple: boolean = false;
  private _isNavList: boolean = false;

  /**
   * Whether the ripple effect on click should be disabled. This applies only to list items that are
   * part of a nav list. The value of `disableRipple` on the `md-nav-list` overrides this flag.
   */
  @Input()
  get disableRipple() { return this._disableRipple; }
  set disableRipple(value: boolean) { this._disableRipple = coerceBooleanProperty(value); }

  @ContentChildren(MdLine) _lines: QueryList<MdLine>;

  @ContentChild(MdListAvatarCssMatStyler)
  set _hasAvatar(avatar: MdListAvatarCssMatStyler) {
    if (avatar != null) {
      this._renderer.addClass(this._element.nativeElement, 'mat-list-item-avatar');
    } else {
      this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-avatar');
    }
  }

  constructor(private _renderer: Renderer2,
              private _element: ElementRef,
              @Optional() private _list: MdList,
              @Optional() navList: MdNavListCssMatStyler) {
    this._isNavList = !!navList;
  }

  ngAfterContentInit() {
    this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
  }

  /** Whether this list item should show a ripple effect when clicked.  */
  isRippleEnabled() {
    return !this.disableRipple && (this._isNavList)
      && !this._list.disableRipple;
  }

  _handleFocus() {
    this._renderer.addClass(this._element.nativeElement, 'mat-list-item-focus');
  }

  _handleBlur() {
    this._renderer.removeClass(this._element.nativeElement, 'mat-list-item-focus');
  }

  /** Retrieves the DOM element of the component host. */
  _getHostElement(): HTMLElement {
    return this._element.nativeElement;
  }
}




