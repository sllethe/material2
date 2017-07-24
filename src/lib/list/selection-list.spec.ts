import {async, TestBed} from '@angular/core/testing';
import {Component, QueryList, ViewChildren} from '@angular/core';
import {By} from '@angular/platform-browser';
import {MdSelectionList, MdListOption, MdListModule} from './index';
import {createKeyboardEvent} from '@angular/cdk/testing';
import {LEFT_ARROW, RIGHT_ARROW, SPACE, DELETE, TAB} from '../core/keyboard/keycodes';
import {UP_ARROW} from "@angular/cdk";


describe('SelectionList and ListOption', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MdListModule],
      declarations: [
        SelectionListWithListOptions
      ],
    });

    TestBed.compileComponents();
  }));

  fit('should add and remove focus class on focus/blur', () => {
    let fixture = TestBed.createComponent(SelectionListWithListOptions);
    fixture.detectChanges();
    let listItem = fixture.debugElement.query(By.directive(MdListOption));
    let listItemEl = fixture.debugElement.query(By.css('.mat-list-item'));

    expect(listItemEl.nativeElement.classList).not.toContain('mat-list-item-focus');

    listItem.componentInstance._handleFocus();
    fixture.detectChanges();
    expect(listItemEl.nativeElement.classList).toContain('mat-list-item-focus');

    listItem.componentInstance._handleBlur();
    fixture.detectChanges();
    expect(listItemEl.nativeElement.classList).not.toContain('mat-list-item-focus');
  });

  fit('should be able to dispatch selected items', () => {
    let fixture = TestBed.createComponent(SelectionListWithListOptions);
    fixture.detectChanges();
    let listItem = fixture.debugElement.queryAll(By.directive(MdListOption));
    let selectionList = fixture.debugElement.query(By.directive(MdSelectionList));
    let testListItem = listItem[2].injector.get<MdListOption>(MdListOption);

    testListItem.toggle();
    fixture.detectChanges();

    let selectList = selectionList.injector.get<MdSelectionList>(MdSelectionList).selectedOptions;

    expect(selectList.selected.length).toBe(1);
  });

  fit('test keyboard select with SPACE', () => {
    let fixture = TestBed.createComponent(SelectionListWithListOptions);
    fixture.detectChanges();
    let listItem = fixture.debugElement.queryAll(By.directive(MdListOption));
    let selectionList = fixture.debugElement.query(By.directive(MdSelectionList));
    let testListItem = listItem[1].nativeElement as HTMLElement;
    let SPACE_EVENT: KeyboardEvent =
      createKeyboardEvent('keydown', SPACE, testListItem);
    let options = selectionList.componentInstance.options;
    let array = options.toArray();
    let focusItem = array[1];
    focusItem.focus();
    selectionList.componentInstance.keydown(SPACE_EVENT);

    fixture.detectChanges();

    let selectList = selectionList.injector.get<MdSelectionList>(MdSelectionList).selectedOptions;

    expect(selectList.selected.length).toBe(1);
  });

  fit('should focus previous item when press UP ARROW', () => {
    let fixture = TestBed.createComponent(SelectionListWithListOptions);
    fixture.detectChanges();
    let listItem = fixture.debugElement.queryAll(By.directive(MdListOption));
    let selectionList = fixture.debugElement.query(By.directive(MdSelectionList));
    let testListItem = listItem[2].nativeElement as HTMLElement;
    let SPACE_EVENT: KeyboardEvent =
      createKeyboardEvent('keydown', UP_ARROW, testListItem);
    let options = selectionList.componentInstance.options;
    let array = options.toArray();
    let focusItem = array[2];
    let manager = selectionList.componentInstance._keyManager;

    focusItem.focus();
    selectionList.componentInstance.keydown(SPACE_EVENT);

    fixture.detectChanges();

    let selectList = selectionList.injector.get<MdSelectionList>(MdSelectionList).selectedOptions;

    expect(selectList.selected.length).toBe(1);
  });


});

@Component({template: `
  <mat-selection-list id="selection-list-1">
    <md-list-option checkboxPosition="before" disabled="true">
      Inbox (disabled selection-option)
    </md-list-option>
    <md-list-option id = "testSelect" checkboxPosition="before">
      Starred
    </md-list-option>
    <md-list-option checkboxPosition="before">
      Sent Mail
    </md-list-option>
    <md-list-option checkboxPosition="before">
      Drafts
    </md-list-option>
  </mat-selection-list>`})
class SelectionListWithListOptions {
  // This needs to be declared directly on the class; if declared on the BaseTestList superclass,
  // it doesn't get populated.
  @ViewChildren(MdListOption) listOptions: QueryList<MdListOption>;
}
