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
  Optional,
  QueryList,
  Renderer2,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import {MdLine, MdLineSetter} from '../core';
import {CanDisableRipple, mixinDisableRipple} from '../core/common-behaviors/disable-ripple';

// Boilerplate for applying mixins to MdList.
/** @docs-private */
export class MdListBase {}
export const _MdListMixinBase = mixinDisableRipple(MdListBase);

// Boilerplate for applying mixins to MdListItem.
/** @docs-private */
export class MdListItemBase {}
export const _MdListItemMixinBase = mixinDisableRipple(MdListItemBase);

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
  inputs: ['disableRipple'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdList extends _MdListMixinBase implements CanDisableRipple {}

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
  inputs: ['disableRipple'],
  templateUrl: 'list-item.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdListItem extends _MdListItemMixinBase implements AfterContentInit, CanDisableRipple {
  private _lineSetter: MdLineSetter;
  private _isNavList: boolean = false;
  private _isSelectionList: boolean = false;

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
    super();
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
              //public checkbox: MdCheckbox,
              @Optional() private _list: MdList) { }
}

@Directive({
  selector:'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
})
export class MdListItemWithCheckbox implements AfterContentInit {
  private checkb: any;
  private pcheckb: any;

  private onChangeBind: EventListener = this.onchange.bind(this);


  @ContentChild(MdPseudoCheckbox) pp: MdPseudoCheckbox;
  constructor(private _element: ElementRef,
              @Optional() public checkbox: MdCheckbox,
              @Optional() public selectionList: MdSelectionListCheckboxer,
              @Optional() private _list: MdList,
              @Optional() public pCheckbox: MdPseudoCheckbox) { }


  ngAfterContentInit() {
    // console.log('this.pcheckbox : ' + this._element.nativeElement.querySelector('md-pseudo-checkbox'));

    // console.log('this.checkbox : ' + this._element.nativeElement.querySelector('md-checkbox'));
    if(this._element.nativeElement.querySelector('md-checkbox') != null) {
      this.checkb = this._element.nativeElement.querySelector('md-checkbox');
      console.log(this.checkb.getAttribute('id'));
      this._element.nativeElement.querySelector('md-checkbox').addEventListener('click', this.onChangeBind, false);
      //console.log('this.pcheckbox : ' + this._element.nativeElement.querySelector('md-pseudo-checkbox'));
      // this.checkbox._elementRef.nativeElement.addEventListener('change', onchange);
    }

    if(this._element.nativeElement.querySelector('md-pseudo-checkbox') != null) {
      this.pcheckb = this._element.nativeElement.querySelector('md-pseudo-checkbox');
      this.pcheckb.addEventListener('change', this.onchange());

      //console.log('this.checkbox : ' + this._element.nativeElement.querySelector('md-checkbox'));
      // this.checkbox._elementRef.nativeElement.addEventListener('change', onchange);
    }

    if(this.selectionList != null) {
      console.log('this.selectionList: ' + this.selectionList._element.nativeElement.getAttribute('id'));
    }
  }

  onchange(): void {
    console.log('change ot not: ' + this._element.nativeElement.querySelector('md-checkbox'));
    // if(this._element.nativeElement.querySelector('md-checkbox').checked) {
    //   this.selectionList.checkedItemList.push(this._element.nativeElement);
    //   console.log(this.selectionList.checkedItemList);
    // }else {
    //   let index: number = this.selectionList.checkedItemList.indexOf(this._element.nativeElement);
    //   if(index != -1) {
    //     this.selectionList.checkedItemList.splice(index, 1);
    //   }
    // }
  }

}

