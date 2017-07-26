import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {AnimationEvent} from '@angular/animations';
import {StickyHeaderModule, CdkStickyRegion, CdkStickyHeader, STICKY_HEADER_SUPPORT_STRATEGY_PROVIDER} from './index';
import {OverlayModule, Scrollable, OverlayContainer} from '../core/overlay/index';
import {PlatformModule} from '../core/platform/index';
import {Platform} from '@angular/cdk/platform';
import {By} from '@angular/platform-browser';



describe('sticky-header', () => {
  let fixture: ComponentFixture<StickyHeaderTest>;
  let testComponent: StickyHeaderTest;
  let stickyElement: DebugElement;
  let stickyParentElement: DebugElement;
  let scrollableElement: HTMLElement;
  let stickyHeaderDir: CdkStickyHeader;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ OverlayModule, PlatformModule, StickyHeaderModule ],
      declarations: [StickyHeaderTest],
      providers: [
        {provide: STICKY_HEADER_SUPPORT_STRATEGY_PROVIDER, useFactory: mockStickyHeaderCheckFail()},
      ],
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyHeaderTest);
    fixture.detectChanges();
    testComponent = fixture.debugElement.componentInstance;
    stickyElement = fixture.debugElement.query(By.directive(CdkStickyHeader));
    stickyParentElement = fixture.debugElement.query(By.directive(CdkStickyRegion));
    // stickyHeaderDir = stickyElement.injector.get<CdkStickyHeader>(CdkStickyHeader);
    // stickyHeaderDir = fixture.debugElement.query(By.directive(StickyHeaderDirective)).componentInstance;
  });

  fit('test test', () => {
    expect(true).toBe(true);
  });

  fit('stickyParent not null', () => {
    fixture.detectChanges();
    expect(stickyElement.nativeElement.stickyParent).not.toBe(null);
  });

  function mockStickyHeaderCheckSuccess() {
    return true;
  }

  function mockStickyHeaderCheckFail() {
    return false;
  }



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
      <div cdkStickyRegion id="theStickyHeaderLalala">
        <div cdkStickyHeader style="background: whitesmoke; padding: 5px;">
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


