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
  ViewEncapsulation
} from '@angular/core';
import {coerceBooleanProperty, MdLine, MdLineSetter, MdPseudoCheckbox} from '../core';
import {MdCheckbox} from '../checkbox';
import {MdCheckboxModule} from '../checkbox';



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
  selector: 'md-list, mat-list, md-nav-list, mat-nav-list, md-selection-list, mat-selection-list, md-action-list, mat-action-list',
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

/////////////////////////////////////////////////////////////
@Directive({
  selector: 'md-selection-list, mat-selection-list',
  host: {'class': 'mat-selection-list'}
})
export class MdSelectionListCssMatStyler {}
///////////////////////////////////////////////////////////////

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
  private _isSelectionList: boolean = false;

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
              @Optional() navList: MdNavListCssMatStyler,
              @Optional() selectionList: MdSelectionListCssMatStyler) {
    this._isNavList = !!navList;
    this._isSelectionList = !!selectionList;
  }

  // ngOnInit() {
  //   if(this._isSelectionList == true) {
  //     console.log('need to be appended : ' + this._element.nativeElement.firstChild);
  //     this._element.nativeElement.firstChild.insertAdjacentHTML('beforeEnd', '<md-checkbox class="mat-selection-list-checkbox" [aria-label]="ingredient"> </md-checkbox>');
  //     // this._element.nativeElement.getElementsByClassName('mat-list-item-content')[0].nativeElement.insertAdjacentHTML('beforeEnd',
  //     //   '<md-checkbox [aria-label]="ingredient"> </md-checkbox>');
  //   }
  // }

  ngAfterContentInit() {
    this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
  }

  /** Whether this list item should show a ripple effect when clicked.  */
  isRippleEnabled() {
    return !this.disableRipple && (this._isNavList || this._isSelectionList)
      && !this._list.disableRipple;
  }

  isAddCheckbox() {
    return this._isSelectionList;
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

@Directive({
  selector: 'md-selection-list, mat-selection-list',
})
export class MdSelectionListCheckboxer {

  checkedItemList: Array<HTMLElement> = new Array();

  constructor(public _element: ElementRef,
              @Optional() private _list: MdList) { }
}

@Directive({
  selector:'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
})
export class MdListItemWithCheckbox implements AfterContentInit {

  private onChangeBind: EventListener = this.onchange.bind(this);
  private onKeyDownBind: EventListener = this.onKeydown.bind(this);


  @ContentChild(MdPseudoCheckbox) pp: MdPseudoCheckbox;
  @ContentChild(MdCheckbox) lala: MdCheckbox;
  constructor(private _element: ElementRef,
              @Optional() public checkbox: MdCheckbox,
              @Optional() public selectionList: MdSelectionListCheckboxer,
              @Optional() private _list: MdList,
              @Optional() public pCheckbox: MdPseudoCheckbox) { }


  ngAfterContentInit() {
    if(this.pp != null) {
      console.log(this.pp);
      this.pp._elementRef.nativeElement.addEventListener('click', this.onChangeBind, false);
      this.pp._elementRef.nativeElement.addEventListener('keydown', this.onKeyDownBind, false);
      this.pp._elementRef.nativeElement.setAttribute('tabindex', '0');
      //console.log(this.lala._elementRef.nativeElement.getAttribute('_checked'));
    }

    if(this.selectionList != null) {
      console.log('this.selectionList: ' + this.selectionList._element.nativeElement.getAttribute('id'));
    }
  }

  onchange(): void {
    console.log('who changed: ' + this.pp);
    console.log('checked or not: ' + this.pp.state);

    if(this.pp.state == 'unchecked') {
      this.pp.state = 'checked';
      this.selectionList.checkedItemList.push(this._element.nativeElement);
    }else {
      this.pp.state = 'unchecked';
      let index: number = this.selectionList.checkedItemList.indexOf(this._element.nativeElement);
      if(index != -1) {
        this.selectionList.checkedItemList.splice(index, 1);
      }
    }
    console.log('current ListItems: ' + this.selectionList.checkedItemList);
  }

  onKeydown(e: KeyboardEvent): void {
    console.log('who onkeyDown: ' + this.pp);
    if(e.keyCode === 32) {
      let focusedElement = document.activeElement;
      console.log(focusedElement === this.pp._elementRef.nativeElement);
      if(focusedElement === this.pp._elementRef.nativeElement) {
        if (this.pp.state == 'unchecked') {
          this.pp.state = 'checked';
          this.selectionList.checkedItemList.push(this._element.nativeElement);
        }else {
          this.pp.state = 'unchecked';
          let index: number = this.selectionList.checkedItemList.indexOf(this._element.nativeElement);
          if(index != -1) {
            this.selectionList.checkedItemList.splice(index, 1);
          }
        }
        console.log('current ListItems: ' + this.selectionList.checkedItemList);
      }
    }
  }

}

