import {async, TestBed} from '@angular/core/testing';
import {Component, QueryList, ViewChildren} from '@angular/core';
import {By} from '@angular/platform-browser';
import {MdSelectionList, MdListOption, MdListModule} from './index';
import {createKeyboardEvent} from '@angular/cdk/testing';
import {UP_ARROW, DOWN_ARROW, SPACE} from '../core/keyboard/keycodes';


describe('SelectionList and ListOption', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MdListModule],
      declarations: [
        SelectionListWithListOptions,
        SelectionListWithCheckbocPositionAfter,
        SelectionListWithListDisabled
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

  fit('should be able to dispatch selected one item', () => {
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

  fit('should be able to dispatch selected more than one items', () => {
    let fixture = TestBed.createComponent(SelectionListWithListOptions);
    fixture.detectChanges();
    let listItem = fixture.debugElement.queryAll(By.directive(MdListOption));
    let selectionList = fixture.debugElement.query(By.directive(MdSelectionList));
    let testListItem = listItem[2].injector.get<MdListOption>(MdListOption);
    let testListItem2 = listItem[1].injector.get<MdListOption>(MdListOption);

    testListItem.toggle();
    fixture.detectChanges();

    testListItem2.toggle();
    fixture.detectChanges();

    let selectList = selectionList.injector.get<MdSelectionList>(MdSelectionList).selectedOptions;

    expect(selectList.selected.length).toBe(2);
  });

  fit('test disabled items cannot be selected', () => {
    let fixture = TestBed.createComponent(SelectionListWithListOptions);
    fixture.detectChanges();
    let listItem = fixture.debugElement.queryAll(By.directive(MdListOption));
    let selectionList = fixture.debugElement.query(By.directive(MdSelectionList));
    let testListItem = listItem[0].injector.get<MdListOption>(MdListOption);

    testListItem.toggle();
    fixture.detectChanges();

    let selectList = selectionList.injector.get<MdSelectionList>(MdSelectionList).selectedOptions;

    expect(selectList.selected.length).toBe(0);
  });

  fit('test disabled selection-list cannot be selected', () => {
    let fixture = TestBed.createComponent(SelectionListWithListDisabled);
    fixture.detectChanges();
    let listItem = fixture.debugElement.queryAll(By.directive(MdListOption));
    let selectionList = fixture.debugElement.query(By.directive(MdSelectionList));
    let testListItem = listItem[2].injector.get<MdListOption>(MdListOption);

    testListItem.toggle();
    fixture.detectChanges();

    let selectList = selectionList.injector.get<MdSelectionList>(MdSelectionList).selectedOptions;

    expect(selectList.selected.length).toBe(0);
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
    let UP_EVENT: KeyboardEvent =
      createKeyboardEvent('keydown', UP_ARROW, testListItem);
    let options = selectionList.componentInstance.options;
    let array = options.toArray();
    let focusItem = array[2];
    let manager = selectionList.componentInstance._keyManager;

    focusItem.focus();
    expect(manager.activeItemIndex).toEqual(2);

    selectionList.componentInstance.keydown(UP_EVENT);

    fixture.detectChanges();

    expect(manager.activeItemIndex).toEqual(1);
  });

  fit('should focus next item when press DOWN ARROW', () => {
    let fixture = TestBed.createComponent(SelectionListWithListOptions);
    fixture.detectChanges();
    let listItem = fixture.debugElement.queryAll(By.directive(MdListOption));
    let selectionList = fixture.debugElement.query(By.directive(MdSelectionList));
    let testListItem = listItem[2].nativeElement as HTMLElement;
    let DOWN_EVENT: KeyboardEvent =
      createKeyboardEvent('keydown', DOWN_ARROW, testListItem);
    let options = selectionList.componentInstance.options;
    let array = options.toArray();
    let focusItem = array[2];
    let manager = selectionList.componentInstance._keyManager;

    focusItem.focus();
    expect(manager.activeItemIndex).toEqual(2);

    selectionList.componentInstance.keydown(DOWN_EVENT);

    fixture.detectChanges();

    expect(manager.activeItemIndex).toEqual(3);
  });

  fit('can customize checkbox position', () => {
    let fixture = TestBed.createComponent(SelectionListWithCheckbocPositionAfter);
    fixture.detectChanges();

    let listItemEl = fixture.debugElement.query(By.css('.mat-list-item-content'));
    expect(listItemEl.nativeElement.classList).toContain('mat-list-item-content-reverse');
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
  @ViewChildren(MdListOption) listOptions: QueryList<MdListOption>;
}

@Component({template: `
  <mat-selection-list id="selection-list-2">
    <md-list-option checkboxPosition="after">
      Inbox (disabled selection-option)
    </md-list-option>
    <md-list-option id = "testSelect" checkboxPosition="after">
      Starred
    </md-list-option>
    <md-list-option checkboxPosition="after">
      Sent Mail
    </md-list-option>
    <md-list-option checkboxPosition="after">
      Drafts
    </md-list-option>
  </mat-selection-list>`})
class SelectionListWithCheckbocPositionAfter {
  @ViewChildren(MdListOption) listOptions: QueryList<MdListOption>;
}

@Component({template: `
  <mat-selection-list id="selection-list-3" [disabled] = true>
    <md-list-option checkboxPosition="after">
      Inbox (disabled selection-option)
    </md-list-option>
    <md-list-option id = "testSelect" checkboxPosition="after">
      Starred
    </md-list-option>
    <md-list-option checkboxPosition="after">
      Sent Mail
    </md-list-option>
    <md-list-option checkboxPosition="after">
      Drafts
    </md-list-option>
  </mat-selection-list>`})
class SelectionListWithListDisabled {
  @ViewChildren(MdListOption) listOptions: QueryList<MdListOption>;
}
