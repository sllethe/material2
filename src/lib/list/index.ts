/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {MdLineModule, MdRippleModule, MdCommonModule, MdSelectionModule} from '../core';
import {
  MdList,
  MdListItem,
  MdListDivider,
  MdListAvatarCssMatStyler,
  MdListIconCssMatStyler,
  MdListCssMatStyler,
  MdNavListCssMatStyler,
  MdDividerCssMatStyler,
  MdListSubheaderCssMatStyler,
  MdSelectionListCssMatStyler,
  MdListItemWithCheckbox,
  MdSelectionListCheckboxer,
  MdSelectionList,
  MdListOption,
} from './list';
import {MdCheckboxModule} from '../checkbox/index';


@NgModule({
  imports: [MdLineModule, MdRippleModule, MdCommonModule, MdCheckboxModule, MdSelectionModule],
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
    MdSelectionListCssMatStyler,
    MdListItemWithCheckbox,
    MdSelectionListCheckboxer,
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
    MdSelectionListCssMatStyler,
    MdListItemWithCheckbox,
    MdSelectionListCheckboxer,
    MdSelectionList,
    MdListOption
  ],
})
export class MdListModule {}


export * from './list';
