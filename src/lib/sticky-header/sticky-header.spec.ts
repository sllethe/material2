import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {AnimationEvent} from '@angular/animations';
import {StickyHeaderModule, CdkStickyRegion, CdkStickyHeader} from './index';
import {OverlayModule, Scrollable, OverlayContainer} from '../core/overlay/index';
//import {Platform} from '../core/platform/platform';
import {Platform} from '@angular/cdk/platform';


describe('sticky-header', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StickyHeaderModule, OverlayModule],
      declarations: [StickyHeaderTest],
      providers: [
        {provide: Platform, useValue: {IOS: false, isBrowser: true}},
      ],
    });
    TestBed.compileComponents();
  }));

  it('test test', () => {
    expect(true).toBe(true);
  });



});

@Component({
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
class StickyHeaderTest {
}

