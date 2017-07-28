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
import {coerceBooleanProperty, MdLine, MdLineSetter, SelectionModel} from '../core';
import {FocusKeyManager} from '../core/a11y/focus-key-manager';
import {Subscription} from 'rxjs/Subscription';
import {SPACE, LEFT_ARROW, RIGHT_ARROW, TAB, HOME, END} from '../core/keyboard/keycodes';
import {Focusable} from '../core/a11y/focus-key-manager';
import {MdSelectionList} from './selection-list';


// export interface MdSelectionListOptionEvent {
//   option: MdListOption;
// }
export class MdSelectionListOptionEvent {
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
    //'class': 'mat-list-item, mat-list-option',
    'class': 'mat-list-item mat-list-option',
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
    if (this.selectionList.disabled) {
      this._disabled = true;
    }
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
