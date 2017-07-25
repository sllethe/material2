import {TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {Component} from '@angular/core';

import { StickyHeaderModule, CdkStickyRegion, CdkStickyHeader } from './index';
import { Scrollable } from '../core/overlay/scroll/scrollable';
import {CommonModule} from '@angular/common';
import {OverlayModule, MdCommonModule} from '../core';
import {extendObject} from '../core/util/object-extend';
import {Subscription} from 'rxjs/Subscription';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {RxChain, debounceTime} from '../core/rxjs/index';
import {isPositionStickySupported} from '@angular/cdk';



describe('my test for sticky-header', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StickyHeaderModule, OverlayModule, MdCommonModule, CommonModule],
      declarations: [
        TestApp
      ],
    });

    TestBed.compileComponents();
  }));

  fit('test run corrrectly', () => {
    expect(true).toBe(true);
  });

});

@Component({
  selector: 'app',
  template: `
    <div cdk-scrollable style="text-align: center;
        -webkit-appearance: none;
        -moz-appearance: none;
        height: 300px;
        overflow: auto;">
      <p>test test test</p>
      <p>test test test</p>
      <p>test test test</p>
      <p>test test test</p>
      <p>test test test</p>
      <p>test test test</p>
      <div cdkStickyViewport id="theStickyHeaderLalala">
        <div cdkSticky style="background: whitesmoke; padding: 5px;">
          <h2>Heading 1</h2>
        </div>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
        <p>test test test</p>
      </div>
    </div>
  `})
class TestApp {
}

