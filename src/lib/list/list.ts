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



<<<<<<< HEAD
=======
export interface MdSelectionListOptionEvent {
  option: MdListOption;
}

const FOCUS_STYLE: string = 'mat-list-item-focus';

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
    //'(focus)': 'focus()',
    '(blur)': '_handleBlur()',
    //'(focus)': '_hasFocus = true',
    '(click)': 'toggle()',
    // '(keydown)':'onKeydown($event)',
    //'[tabIndex]': 'disabled ? -1 : 0',
    'tabindex': '-1',
    '[attr.aria-selected]': 'selected.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
  },
  templateUrl: 'list-option.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdListOption implements AfterContentInit, OnDestroy, Focusable {
  private _lineSetter: MdLineSetter;
  private _disableRipple: boolean = false;
  public _selected: boolean = false;
  /** Whether the checkbox is disabled. */
  private _disabled: boolean = false;
  private _value: any;

  /** Whether the option has focus. */
  @Input()
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
  get selected() {
    return this._selected;
  }
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
              private _changeDetector: ChangeDetectorRef,
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

    if(this._disabled == false) {
      this.selected = !this.selected;
      console.log('===================' + this.selected);
      this.selectionList.selectedOptions.toggle(this);
      this._changeDetector.markForCheck();
    }
    console.log(this.selectionList.selectedOptions);
    console.log('current selectionModule length: ' + this.selectionList.selectedOptions.selected.length);
  }

  // onKeydown(e: KeyboardEvent): void {
  //   // console.log('who onkeyDown: ' + this.pCheckbox);
  //   if(e.keyCode === 32 && this._disabled == false) {
  //     let focusedElement = document.activeElement;
  //     console.log(focusedElement === this._element.nativeElement);
  //     if(focusedElement === this._element.nativeElement) {
  //       this.toggle();
  //     }
  //   }
  // }

  /** Allows for programmatic focusing of the option. */
  focus(): void {
    this._element.nativeElement.focus();
    //this._handleFocus();
    this.onFocus.emit({option: this});
  }

  /** Whether this list item should show a ripple effect when clicked.  */
  isRippleEnabled() {
    return !this.disableRipple && !this.selectionList.disableRipple;
  }

  _handleFocus() {
    this._hasFocus = true;
    this._renderer.addClass(this._element.nativeElement, FOCUS_STYLE);
    this.onFocus.emit({option: this});
  }

  _handleBlur() {
    this._hasFocus = false;
    this._renderer.removeClass(this._element.nativeElement, FOCUS_STYLE);
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

  private _optionSubscription: Subscription;

  /** Whether or not the option is selectable. */
  protected _selectable: boolean = true;
>>>>>>> b8b209a7... refined toggle()


/**
 git branch
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





  @Input() checkboxPosition: 'before' | 'after' = 'after';

  /** Whether the checkbox is disabled. */
  get disabled() {
    return this._disabled;
  }
  @Input('disabled')
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }

  @Input('value')
  get value() { return this._value; }
  set value( val: any) { this._value = coerceBooleanProperty(val); }

  @Input('selected')
  get selected() { return this._selected; }
  set selected( val: boolean) { this._selected = coerceBooleanProperty(val); }

  // @ViewChild('autocheckbox1') pCheckbox1;
  // @ViewChild('autocheckbox2') pCheckbox2;
  // pCheckbox: any;
 // @ViewChild('autocheckbox') pCheckbox;

  constructor(private _renderer: Renderer2,
              private _element: ElementRef,
              @Optional() public selectionList: MdSelectionList,) {
    this._isSelectionList = !!selectionList;
  }


  ngAfterContentInit() {
    this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);

  /** Whether this list item should show a ripple effect when clicked.  */
  isRippleEnabled() {
    return !this.disableRipple && this._isSelectionList
      && !this.selectionList.disableRipple;
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


