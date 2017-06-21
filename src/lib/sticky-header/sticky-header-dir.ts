import {
    Component,
    Directive,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ElementRef,
    Injectable,
    Renderer2,
    ViewContainerRef, Optional,
} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {ScrollDispatcher} from '../core/overlay/scroll/scroll-dispatcher';
import {Scrollable} from '../core/overlay/scroll/scrollable';
import {Subject} from 'rxjs/Subject';


@Directive({
    selector: '[md-sticky-viewport], [cdkStickyViewport], [cdkStickyRegion]',
})


@Injectable()
export class StickyParentDirective {

    constructor(private element: ElementRef) { }

    getElementRef(): ElementRef {
        return this.element;
    }
}



@Directive({
    selector: '[md-sticky], [cdkSticky], [cdkStickyHeader]',
})


@Injectable()
export class StickyHeaderDirective implements OnDestroy, AfterViewInit {

    @Input('sticky-zIndex') zIndex: number = 10;
    @Input('parent') parentFlag: boolean = true;
    @Input('parentRegion') parentRegion: any;
    @Input('scrollableRegion') scrollableRegion: any;

    private activated = new EventEmitter();
    private deactivated = new EventEmitter();

    private onScrollBind: EventListener = this.onScroll.bind(this);
    private onResizeBind: EventListener = this.onResize.bind(this);
    private onTouchMoveBind: EventListener = this.onTouchMove.bind(this);

    private stickStartClass: string = 'sticky';
    private stickEndClass: string = 'sticky-end';
    public isStuck: boolean = false;

    // the element with the 'md-sticky' tag
    public elem: any;

    // the uppercontainer element with the 'md-sticky-viewport' tag
    public stickyParent: any;

    // the upper scrollable container
    public upperScrollableContainer: any;

    // the original css of the sticky element, used to reset the sticky element when it is being unstick
    public originalCss: any;
    public stickyCss: any;

    // the height of 'stickyParent'
    private containerHeight: number;

    // the height of 'elem'
    public elemHeight: number;

    private containerStart: number;
    private scrollFinish: number;

    private _scrollingWidth: any;

    // the padding of 'elem'
    private elementPadding: any;
    private paddingNumber: any;

    // sticky element's width
    private width: string = 'auto';

    constructor(private element: ElementRef,
                public findScroll: Scrollable,
                @Optional() public parentReg: StickyParentDirective) {
        this.elem = element.nativeElement;
        this.upperScrollableContainer = findScroll.getElementRef().nativeElement;
        if(parentReg != null) {
            this.parentRegion = parentReg.getElementRef().nativeElement;
        }
        this.scrollableRegion = findScroll.getElementRef().nativeElement;
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {

        //console.log('parentNode from StickyParentDirective: ' + this.parentRegion);

        if(this.parentRegion != null) {
            this.stickyParent = this.parentRegion;
        }else {
            this.stickyParent = this.elem.parentNode;
        }

        this.originalCss = {
            zIndex: this.getCssValue(this.elem, 'zIndex'),
            position: this.getCssValue(this.elem, 'position'),
            top: this.getCssValue(this.elem, 'top'),
            right: this.getCssValue(this.elem, 'right'),
            left: this.getCssValue(this.elem, 'left'),
            bottom: this.getCssValue(this.elem, 'bottom'),
            width: this.getCssValue(this.elem, 'width'),
        };

        this._scrollingWidth = this.upperScrollableContainer.scrollWidth;

        this.attach();

        if (this.width == 'auto') {
            this.width = this.originalCss.width;
        }

        this.defineRestrictions();
        this.sticker();
    }

    ngOnDestroy(): void {
        this.detach();
    }

    attach() {
        this.upperScrollableContainer.addEventListener('scroll', this.onScrollBind, false);
        this.upperScrollableContainer.addEventListener('resize', this.onResizeBind, false);

        // Have to add a 'onTouchMove' listener to make sticky header work on mobile phones
        this.upperScrollableContainer.addEventListener('touchmove', this.onTouchMoveBind, false);

         Observable.fromEvent(this.upperScrollableContainer, 'scroll')
             .subscribe(() => this.onScroll());

         Observable.fromEvent(this.upperScrollableContainer, 'touchmove')
             .subscribe(() => this.onTouchMove());
    }

    detach() {
        this.upperScrollableContainer.removeEventListener('scroll', this.onScrollBind);
        this.upperScrollableContainer.removeEventListener('resize', this.onResizeBind);
        this.upperScrollableContainer.removeEventListener('touchmove', this.onTouchMoveBind);
    }

    onScroll(): void {
        this.defineRestrictions();
        this.sticker();
    }

    onTouchMove(): void {
        this.defineRestrictions();
        this.sticker();
    }

    onResize(): void {
        this.defineRestrictions();
        this.sticker();

        if (this.isStuck) {
            this.unstickElement();
            this.stickElement();
        }
    }

    // define the restrictions of the sticky header(including stickyWidth, when to start, when to finish)
    defineRestrictions(): void {
        let containerTop: any = this.stickyParent.getBoundingClientRect();
        this.elemHeight = this.elem.offsetHeight;
        this.containerHeight = this.getCssNumber(this.stickyParent, 'height');
        // this.containerStart = containerTop['top'];
        this.containerStart = containerTop.top;

        // the padding of the element being sticked
        this.elementPadding = this.getCssValue(this.elem, 'padding');

        this.paddingNumber = Number(this.elementPadding.slice(0,-2));
        this._scrollingWidth = this.upperScrollableContainer.clientWidth - this.paddingNumber - this.paddingNumber;

        this.scrollFinish = this.containerStart + (this.containerHeight - this.elemHeight);
    }

    // reset element to its original CSS
    resetElement(): void {
        this.elem.classList.remove(this.stickStartClass);
        Object.assign(this.elem.style, this.originalCss);
    }

    // stuck element, make the element stick to the top of the scrollable container.
    stickElement(): void {
        this.isStuck = true;

        this.elem.classList.remove(this.stickEndClass);
        this.elem.classList.add(this.stickStartClass);

        /** Have to add the translate3d function for the sticky element's css style.
         * Because iPhone and iPad's browser is using its owning rendering engine. And
         * even if you are using Chrome on an iPhone, you are just using Safari with
         * a Chrome skin around it.
         *
         * Safari on iPad and Safari on iPhone do not have resizable windows.
         * In Safari on iPhone and iPad, the window size is set to the size of
         * the screen (minus Safari user interface controls), and cannot be changed
         * by the user. To move around a webpage, the user changes the zoom level and position
         * of the viewport as they double tap or pinch to zoom in or out, or by touching
         * and dragging to pan the page. As a user changes the zoom level and position of the
         * viewport they are doing so within a viewable content area of fixed size
         * (that is, the window). This means that webpage elements that have their position
         * "fixed" to the viewport can end up outside the viewable content area, offscreen.
         *
         * So the 'position: fixed' does not work on iPhone and iPad. To make it work,
         * I need to use translate3d(0,0,0) to force Safari rerendering the sticky element.
        **/
        this.elem.style.transform = 'translate3d(0,0,0)';

        // this._scrollingRight = this.upperScrollableContainer.offsetLeft +
        //     this.upperScrollableContainer.offsetWidth;
        let stuckRight: any = this.upperScrollableContainer.getBoundingClientRect().right;
        this.stickyCss = {
            zIndex: this.zIndex,
            position: 'fixed',
            top: this.upperScrollableContainer.offsetTop + 'px',
            right: stuckRight + 'px',
            left: this.upperScrollableContainer.offsetLeft + 'px',
            bottom: 'auto',
            width: this._scrollingWidth + 'px',
        };
        Object.assign(this.elem.style, this.stickyCss);
    }

    // unstuck element
    unstickElement(): void {
        this.isStuck = false;

        this.elem.classList.add(this.stickEndClass);

        this.stickyParent.style.position = 'relative';
        this.elem.style.position = 'absolute';
        this.elem.style.top = 'auto';
        this.elem.style.right = 0;
        this.elem.style.left = 'auto';
        this.elem.style.bottom = 0;
        this.elem.style.width = this.width;
    }


    sticker(): void {

        let currentPosition: number = this.upperScrollableContainer.offsetTop;

        // unstick when the element is scrolled out of the sticky region
        if (this.isStuck && (currentPosition < this.containerStart || currentPosition > this.scrollFinish) || currentPosition >= this.scrollFinish) {
            this.resetElement();
            if (currentPosition >= this.scrollFinish) this.unstickElement();
            this.isStuck = false;
        }
        // stick when the element is within the sticky region
            // this.isStuck === false &&
        else if ( this.isStuck === false && currentPosition > this.containerStart && currentPosition < this.scrollFinish) {
            this.stickElement();
            console.log('stick');
        }
    }


    private getCssValue(element: any, property: string): any {
        let result: any = '';
        if (typeof window.getComputedStyle !== 'undefined') {
            result = window.getComputedStyle(element, null).getPropertyValue(property);
        }
        else if (typeof element.currentStyle !== 'undefined')  {
            // result = element.currentStyle[property];
            result = element.currentStyle.property;
        }
        return result;
    }

    private getCssNumber(element: any, property: string): number {
        return parseInt(this.getCssValue(element, property), 10) || 0;
    }
}
