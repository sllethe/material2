/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, Directive, Input, Output,
    OnDestroy, AfterViewInit, ElementRef, Injectable, Optional} from '@angular/core';
import {Scrollable} from '../core/overlay/scroll/scrollable';
import {extendObject} from '../core/util/object-extend';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import {Subscription} from 'rxjs/Subscription';
// import {createElement} from '@angular/core';

@Directive({
    selector: '[cdkStickyRegion]',
})
export class CdkStickyRegion {
    constructor(private _element: ElementRef) { }

    getElementRef(): ElementRef {
        return this._element;
    }
}


/**
 * The 'cdkStickyHeader' is the header which user wants to be stick at top of the
 * scrollable container. The main logic is in the 'sticker()' function.
 */
const STICK_START_CLASS = 'stick';
const STICK_END_CLASS = 'sticky-end';
const DEBOUNCE_TIME: number = 5;
@Directive({
    selector: '[cdkStickyHeader]',
})

export class CdkStickyHeader implements OnDestroy, AfterViewInit {

    @Input('cdkStickyHeaderZIndex') zIndex: number = 10;
    @Input('cdkStickyParentRegion') parentRegion: HTMLElement;
    @Input('cdkStickyScrollableRegion') scrollableRegion: HTMLElement;

    private _onScrollBind: EventListener = this.onScroll.bind(this);
    private _onResizeBind: EventListener = this.onResize.bind(this);
    private _onTouchMoveBind: EventListener = this.onTouchMove.bind(this);
    public isStuck: boolean = true;

    // the element with the 'md-sticky' tag
    public element: HTMLElement;

    // the uppercontainer element with the 'md-sticky-viewport' tag
    public stickyParent: HTMLElement;

    // the upper scrollable container
    public upperScrollableContainer: HTMLElement;

    isStickyPositionSupported: boolean = true;

    /**
     * the original css of the sticky element, used to reset the sticky element
     * when it is being unstuck
     */
    public originalCss: any;

    private _containerStart: number;
    private _scrollFinish: number;

    private _onScrollSubscription: Subscription;

    private _onTouchSubscription: Subscription;

    private _onResizeSubscription: Subscription;


  constructor(private _element: ElementRef,
                public scrollable: Scrollable,
                @Optional() public parentReg: CdkStickyRegion) {
        this.element = _element.nativeElement;
        this.upperScrollableContainer = scrollable.getElementRef().nativeElement;
        this.scrollableRegion = scrollable.getElementRef().nativeElement;
        if (parentReg != null) {
            this.parentRegion = parentReg.getElementRef().nativeElement;
        }

        this.setStrategyAccordingToCompatibility();
    }

    // checkSupport(): boolean {
    //   let prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
    //   let stickyText = '';
    //   for (let i = 0; i < prefixTestList.length; i++ ) {
    //     stickyText += 'position:' + prefixTestList[i] + 'sticky;';
    //   }
    //   // 创建一个dom来检查
    //   let div = document.createElement('div');
    //   let body = document.body;
    //   div.style.cssText = 'display:none;' + stickyText;
    //   body.appendChild(div);
    //   let isSupport = /sticky/i.test(window.getComputedStyle(div).position);
    //   body.removeChild(div);
    //   div = null;
    //   return isSupport;
    //
    // }

  getSupportList(): string[] {
    let prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
    let supportList: Array<string> = new Array<string>();
    let stickyText = '';
    for (let i = 0; i < prefixTestList.length; i++ ) {
      stickyText = 'position:' + prefixTestList[i] + 'sticky;';
      // Create a DOM to check if the browser support current prefix for sticky-position.
      let div = document.createElement('div');
      let body = document.body;
      div.style.cssText = 'display:none;' + stickyText;
      body.appendChild(div);
      let isSupport = /sticky/i.test(window.getComputedStyle(div).position);
      body.removeChild(div);
      div = null;
      if(isSupport == true) {
        supportList.push(prefixTestList[i]);
      }
    }
    return supportList;
  }

  setStrategyAccordingToCompatibility(): void {
    let supportList = this.getSupportList();
    console.log(supportList);
    if(supportList.length == 0) {
      this.isStickyPositionSupported = false;
    }else {
      let prefix: string = supportList[0];
      console.log('========' + prefix + 'sticky');

      this._element.nativeElement.style.top = '0px';
      this._element.nativeElement.style.position = prefix + 'sticky';
    }
  }

    ngAfterViewInit(): void {
      if(this.isStickyPositionSupported === false) {
        if (this.parentRegion != null) {
          this.stickyParent = this.parentRegion;
        }else {
          this.stickyParent = this.element.parentElement;
        }

        // this.originalCss = {
        //     zIndex: this.getCssValue(this.element, 'zIndex'),
        //     position: this.getCssValue(this.element, 'position'),
        //     top: this.getCssValue(this.element, 'top'),
        //     right: this.getCssValue(this.element, 'right'),
        //     left: this.getCssValue(this.element, 'left'),
        //     bottom: this.getCssValue(this.element, 'bottom'),
        //     width: this.getCssValue(this.element, 'width'),
        // };
        let boundingClientRecVal = this.element.getBoundingClientRect();
        console.log('boundingClientRecVal : ' + boundingClientRecVal.top);
        console.log('getCssValue: ' + this.getCssValue(this.element, 'top'));
        this.originalCss = this.generateCssStyle(
          this.getCssValue(this.element, 'zIndex'),
          this.getCssValue(this.element, 'position'),
          this.getCssValue(this.element, 'top'),
          this.getCssValue(this.element, 'right'),
          this.getCssValue(this.element, 'left'),
          this.getCssValue(this.element, 'bottom'),
          this.getCssValue(this.element, 'width'));
        // this.originalCss = this.generateCssStyle(
        //   this.getCssValue(this.element, 'zIndex'),
        //   this.getCssValue(this.element, 'position'),
        //   boundingClientRecVal.top + '',
        //   boundingClientRecVal.right + '',
        //   boundingClientRecVal.left + '',
        //   boundingClientRecVal.bottom + '',
        //   boundingClientRecVal.width + '') ;

        this.attach();

        this.defineRestrictionsAndStick();
      }
    }

    ngOnDestroy(): void {
        // this.upperScrollableContainer.removeEventListener('scroll', this._onScrollBind);
        // this.upperScrollableContainer.removeEventListener('resize', this._onResizeBind);
        // this.upperScrollableContainer.removeEventListener('touchmove', this._onTouchMoveBind);

      if (this._onScrollSubscription) {
        this._onScrollSubscription.unsubscribe();
      }

      if (this._onResizeSubscription) {
        this._onResizeSubscription.unsubscribe();
      }

      if (this._onTouchSubscription) {
        this._onTouchSubscription.unsubscribe();
      }
    }

    attach() {
      // this.upperScrollableContainer.addEventListener('scroll', this._onScrollBind, false);

      // this.upperScrollableContainer.addEventListener('resize', this._onResizeBind, false);

      // Have to add a 'onTouchMove' listener to make sticky header work on mobile phones
      // this.upperScrollableContainer.addEventListener('touchmove',this._onTouchMoveBind, false);

      // Observable.fromEvent(this.upperScrollableContainer, 'scroll').debounceTime(5)
      //   .subscribe(() => this.defineRestrictionsAndStick());
      this._onScrollSubscription = Observable.fromEvent(this.upperScrollableContainer, 'scroll')
        .subscribe(() => this.defineRestrictionsAndStick());

      this._onTouchSubscription = Observable.fromEvent(this.upperScrollableContainer, 'touchmove')
        .subscribe(() => this.defineRestrictionsAndStick());

      this._onResizeSubscription = Observable.fromEvent(this.upperScrollableContainer, 'resize')
        .subscribe(() => this.onResize());
    }

    onScroll(): void {
        this.defineRestrictionsAndStick();
    }

    onTouchMove(): void {
        this.defineRestrictionsAndStick();
    }
    onResize(): void {
        this.defineRestrictionsAndStick();

        /**
         * If there's already a header being stick when the page is
         * resized. The CSS style of the sticky-header may be not fit
         * the resized window. So we need to unstuck it then re-stick it.
         */
        if (this.isStuck) {
            this.unstuckElement();
            this.stickElement();
        }
    }

    /**
     * define the restrictions of the sticky header(including stickyWidth,
     * when to start, when to finish)
     */
    defineRestrictions(): void {
        let clientRect: any = this.stickyParent.getBoundingClientRect();
        let elemHeight: number = this.element.offsetHeight;
        this._containerStart = clientRect.top;

      //this.stickyHeaderPadding = this.getCssValue(this.element, 'padding');
      //this.stickyRegionHeight = this.getCssNumber(this.stickyParent, 'height');
      // console.log('------------' + this.stickyRegionHeight);
      // console.log('----===--------' + clientRect.height);

        // the padding of the element being sticked
        //let paddingNumber: any = Number(this.stickyHeaderPadding.slice(0, -2));
        //this._scrollingWidth = this.upperScrollableContainer.clientWidth -
        //    paddingNumber - paddingNumber;

        this._scrollFinish = this._containerStart + (clientRect.height - elemHeight);
    }

    /**
     * Reset element to its original CSS
     */
    resetElement(): void {
        this.element.classList.remove(STICK_START_CLASS);
        extendObject(this.element.style, this.originalCss);
    }

    /**
     * Stuck element, make the element stick to the top of the scrollable container.
     */
    stickElement(): void {
        this.isStuck = true;

        this.element.classList.remove(STICK_END_CLASS);
        this.element.classList.add(STICK_START_CLASS);

        this.element.style.transform = 'translate3d(0px,0px,0px)';

        // let stuckRight: any = this.upperScrollableContainer.getBoundingClientRect().right;
      let stuckRight: any = this.upperScrollableContainer.offsetLeft
        + this.upperScrollableContainer.clientWidth;
      // console.log('stuckRight1: ' + this.upperScrollableContainer.getBoundingClientRect().right);
      // console.log('stuckRight2: ' + stuckRight);
      // console.log('original width : ' + this.originalCss.width);
      // console.log('this._scrollingWidth : ' + this._scrollingWidth);

        // let stickyCss:any = {
        //     zIndex: this.zIndex,
        //     position: 'fixed',
        //     top: this.upperScrollableContainer.offsetTop + 'px',
        //     right: stuckRight + 'px',
        //     left: this.upperScrollableContainer.offsetLeft + 'px',
        //     bottom: 'auto',
        //     width: this.originalCss.width,
        // };
        // let stickyCss2:any = this.generateCssStyle(this.zIndex, 'fixed',
        //   this.upperScrollableContainer.offsetTop + 'px', stuckRight + 'px',
        //   this.upperScrollableContainer.offsetLeft + 'px', 'auto',
        //   this._scrollingWidth + 'px');

      let stickyCss2:any = this.generateCssStyle(this.zIndex + '', 'fixed',
        this.upperScrollableContainer.offsetTop + 'px', stuckRight + 'px',
        this.upperScrollableContainer.offsetLeft + 'px', 'auto',
        this.originalCss.width);
        // Object.assign(this.element.style, stickyCss);
        extendObject(this.element.style, stickyCss2);
    }

    unstuckElement(): void {
        this.isStuck = false;

        this.element.classList.add(STICK_END_CLASS);
        this.stickyParent.style.position = 'relative';
        let unstuckCss: any = {
            position: 'absolute',
            top: 'auto',
            right: '0',
            left: 'auto',
            bottom: '0',
            width: this.originalCss.width,
        };
        let unstuckCss2: any = this.generateCssStyle(this.originalCss.zIndex,
          'absolute', 'auto', '0', 'auto', '0', this.originalCss.width);
        extendObject(this.element.style, unstuckCss);
        // Object.assign(this.element.style, unstuckCss);
    }


    sticker(): void {
        let currentPosition: number = this.upperScrollableContainer.offsetTop;

        // unstuck when the element is scrolled out of the sticky region
        if (this.isStuck &&
            (currentPosition < this._containerStart || currentPosition > this._scrollFinish) ||
            currentPosition >= this._scrollFinish) {
            this.resetElement();
            if (currentPosition >= this._scrollFinish) {
                this.unstuckElement();
            }
            this.isStuck = false;
        }else if ( this.isStuck === false &&
            currentPosition > this._containerStart && currentPosition < this._scrollFinish) {
            this.stickElement();
            console.log('stick');
        }
    }

    defineRestrictionsAndStick(): void {
        this.defineRestrictions();
        this.sticker();
    }

  generateCssStyle(zIndex:string, position:string, top:string, right:string,
                   left:string, bottom:string, width:string): any {
    let curCSS = {
      zIndex: zIndex,
      position: position,
      top: top,
      right: right,
      left: left,
      bottom: bottom,
      width: width,
    };
    return curCSS;
  }


    private getCssValue(element: any, property: string): any {
        let result: any = '';
        if (typeof window.getComputedStyle !== 'undefined') {
            result = window.getComputedStyle(element, '').getPropertyValue(property);
        }else if (typeof element.currentStyle !== 'undefined')  {
            result = element.currentStyle.property;
        }
        return result;
    }

    private getCssNumber(element: any, property: string): number {
        return parseInt(this.getCssValue(element, property), 10) || 0;
    }
}
