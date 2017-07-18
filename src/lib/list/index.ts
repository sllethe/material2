/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {MdLineModule, MdRippleModule, MdCommonModule, MdSelectionModule} from '../core';
import {CommonModule} from '@angular/common';
import {
  MdList,
  MdListItem,
  MdListDivider,
  MdListAvatarCssMatStyler,
  MdListIconCssMatStyler,
  MdListCssMatStyler,
  MdNavListCssMatStyler,
  MdDividerCssMatStyler,
  MdListSubheaderCssMatStyler
} from './list';
import {MdSelectionList} from './selection-list';
import {MdListOption} from './list-option';
import {MdCheckboxModule} from '../checkbox/index';


@NgModule({
  imports: [MdLineModule, MdRippleModule, MdCommonModule, MdCheckboxModule, MdSelectionModule, CommonModule],
  exports: [
    MdList,
    MdListItem,
    MdListDivider,
    MdListAvatarCssMatStyler,
    MdLineModule,
    MdCommonModule,
    MdListIconCssMatStyler,
    MdListCssMatStyler,
    MdNavListCssMatStyler,
    MdDividerCssMatStyler,
    MdListSubheaderCssMatStyler,
    MdCheckboxModule,
    MdSelectionModule,
    MdSelectionList,
    MdListOption
  ],
  declarations: [
    MdList,
    MdListItem,
    MdListDivider,
    MdListAvatarCssMatStyler,
    MdListIconCssMatStyler,
    MdListCssMatStyler,
    MdNavListCssMatStyler,
    MdDividerCssMatStyler,
    MdListSubheaderCssMatStyler,
    MdSelectionList,
    MdListOption
  ],
})
export class MdListModule {}


export * from './list';
