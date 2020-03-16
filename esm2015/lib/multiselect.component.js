/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, HostListener, NgModule, ChangeDetectorRef, ViewEncapsulation, ContentChild, ViewChild, forwardRef, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyException } from './multiselect.model';
import { ClickOutsideDirective, ScrollDirective, styleDirective, setPosition } from './clickOutside';
import { ListFilterPipe } from './list-filter';
import { Item, Badge, Search, TemplateRenderer, CIcon } from './menu-item';
import { DataService } from './multiselect.service';
import { Subject } from 'rxjs';
import { VirtualScrollerModule, VirtualScrollerComponent } from './virtual-scroll/virtual-scroll';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
/** @type {?} */
export const DROPDOWN_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => AngularMultiSelect)),
    multi: true
};
/** @type {?} */
export const DROPDOWN_CONTROL_VALIDATION = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => AngularMultiSelect)),
    multi: true,
};
/** @type {?} */
const noop = (/**
 * @return {?}
 */
() => {
});
const ɵ0 = noop;
export class AngularMultiSelect {
    /**
     * @param {?} _elementRef
     * @param {?} cdr
     * @param {?} ds
     */
    constructor(_elementRef, cdr, ds) {
        this._elementRef = _elementRef;
        this.cdr = cdr;
        this.ds = ds;
        this.onSelect = new EventEmitter();
        this.onDeSelect = new EventEmitter();
        this.onSelectAll = new EventEmitter();
        this.onDeSelectAll = new EventEmitter();
        this.onOpen = new EventEmitter();
        this.onClose = new EventEmitter();
        this.onScrollToEnd = new EventEmitter();
        this.onFilterSelectAll = new EventEmitter();
        this.onFilterDeSelectAll = new EventEmitter();
        this.onAddFilterNewItem = new EventEmitter();
        this.onGroupSelect = new EventEmitter();
        this.onGroupDeSelect = new EventEmitter();
        this.virtualdata = [];
        this.searchTerm$ = new Subject();
        this.isActive = false;
        this.isSelectAll = false;
        this.isFilterSelectAll = false;
        this.isInfiniteFilterSelectAll = false;
        this.chunkIndex = [];
        this.cachedItems = [];
        this.groupCachedItems = [];
        this.itemHeight = 41.6;
        this.filterLength = 0;
        this.infiniteFilterLength = 0;
        this.dropdownListYOffset = 0;
        this.defaultSettings = {
            singleSelection: false,
            text: 'Select',
            enableCheckAll: true,
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            filterSelectAllText: 'Select all filtered results',
            filterUnSelectAllText: 'UnSelect all filtered results',
            enableSearchFilter: false,
            searchBy: [],
            maxHeight: 300,
            badgeShowLimit: 999999999999,
            classes: '',
            disabled: false,
            searchPlaceholderText: 'Search',
            showCheckbox: true,
            noDataLabel: 'No Data Available',
            searchAutofocus: true,
            lazyLoading: false,
            labelKey: 'itemName',
            primaryKey: 'id',
            position: 'bottom',
            autoPosition: true,
            enableFilterSelectAll: true,
            selectGroup: false,
            addNewItemOnFilter: false,
            addNewButtonText: "Add",
            escapeToClose: true,
            clearAll: true
        };
        this.randomSize = true;
        this.filteredList = [];
        this.virtualScroollInit = false;
        this.isDisabledItemPresent = false;
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
        this.searchTerm$.asObservable().pipe(debounceTime(1000), distinctUntilChanged(), tap((/**
         * @param {?} term
         * @return {?}
         */
        term => term))).subscribe((/**
         * @param {?} val
         * @return {?}
         */
        val => {
            this.filterInfiniteList(val);
        }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onEscapeDown(event) {
        if (this.settings.escapeToClose) {
            this.closeDropdown();
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.settings = Object.assign(this.defaultSettings, this.settings);
        this.cachedItems = this.cloneArray(this.data);
        if (this.settings.position == 'top') {
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.selectedListHeight = { val: 0 };
                this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            }));
        }
        this.subscription = this.ds.getData().subscribe((/**
         * @param {?} data
         * @return {?}
         */
        data => {
            if (data) {
                /** @type {?} */
                let len = 0;
                data.forEach((/**
                 * @param {?} obj
                 * @param {?} i
                 * @return {?}
                 */
                (obj, i) => {
                    if (obj.disabled) {
                        this.isDisabledItemPresent = true;
                    }
                    if (!obj.hasOwnProperty('grpTitle')) {
                        len++;
                    }
                }));
                this.filterLength = len;
                this.onFilterChange(data);
            }
        }));
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.calculateDropdownDirection();
        }));
        this.virtualScroollInit = false;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.data && !changes.data.firstChange) {
            if (this.settings.groupBy) {
                this.groupedData = this.transformData(this.data, this.settings.groupBy);
                if (this.data.length == 0) {
                    this.selectedItems = [];
                }
                this.groupCachedItems = this.cloneArray(this.groupedData);
            }
            this.cachedItems = this.cloneArray(this.data);
        }
        if (changes.settings && !changes.settings.firstChange) {
            this.settings = Object.assign(this.defaultSettings, this.settings);
        }
        if (changes.loading) {
        }
        if (this.settings.lazyLoading && this.virtualScroollInit && changes.data) {
            this.virtualdata = changes.data.currentValue;
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (this.selectedItems) {
            if (this.selectedItems.length == 0 || this.data.length == 0 || this.selectedItems.length < this.data.length) {
                this.isSelectAll = false;
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (this.settings.lazyLoading) {
            // this._elementRef.nativeElement.getElementsByClassName("lazyContainer")[0].addEventListener('scroll', this.onScroll.bind(this));
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewChecked() {
        if (this.selectedListElem.nativeElement.clientHeight && this.settings.position == 'top' && this.selectedListHeight) {
            this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            this.cdr.detectChanges();
        }
    }
    /**
     * @param {?} item
     * @param {?} index
     * @param {?} evt
     * @return {?}
     */
    onItemClick(item, index, evt) {
        if (item.disabled) {
            return false;
        }
        if (this.settings.disabled) {
            return false;
        }
        /** @type {?} */
        let found = this.isSelected(item);
        /** @type {?} */
        let limit = this.selectedItems.length < this.settings.limitSelection ? true : false;
        if (!found) {
            if (this.settings.limitSelection) {
                if (limit) {
                    this.addSelected(item);
                    this.onSelect.emit(item);
                }
            }
            else {
                this.addSelected(item);
                this.onSelect.emit(item);
            }
        }
        else {
            this.removeSelected(item);
            this.onDeSelect.emit(item);
        }
        if (this.isSelectAll || this.data.length > this.selectedItems.length) {
            this.isSelectAll = false;
        }
        if (this.data.length == this.selectedItems.length) {
            this.isSelectAll = true;
        }
        if (this.settings.groupBy) {
            this.updateGroupInfo(item);
        }
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        return null;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        if (value !== undefined && value !== null && value !== '') {
            if (this.settings.singleSelection) {
                if (this.settings.groupBy) {
                    this.groupedData = this.transformData(this.data, this.settings.groupBy);
                    this.groupCachedItems = this.cloneArray(this.groupedData);
                    this.selectedItems = [value[0]];
                }
                else {
                    try {
                        if (value.length > 1) {
                            this.selectedItems = [value[0]];
                            throw new MyException(404, { "msg": "Single Selection Mode, Selected Items cannot have more than one item." });
                        }
                        else {
                            this.selectedItems = value;
                        }
                    }
                    catch (e) {
                        console.error(e.body.msg);
                    }
                }
            }
            else {
                if (this.settings.limitSelection) {
                    this.selectedItems = value.slice(0, this.settings.limitSelection);
                }
                else {
                    this.selectedItems = value;
                }
                if (this.selectedItems.length === this.data.length && this.data.length > 0) {
                    this.isSelectAll = true;
                }
                if (this.settings.groupBy) {
                    this.groupedData = this.transformData(this.data, this.settings.groupBy);
                    this.groupCachedItems = this.cloneArray(this.groupedData);
                }
            }
        }
        else {
            this.selectedItems = [];
        }
    }
    //From ControlValueAccessor interface
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    //From ControlValueAccessor interface
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onTouchedCallback = fn;
    }
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    trackByFn(index, item) {
        return item[this.settings.primaryKey];
    }
    /**
     * @param {?} clickedItem
     * @return {?}
     */
    isSelected(clickedItem) {
        if (clickedItem.disabled) {
            return false;
        }
        /** @type {?} */
        let found = false;
        this.selectedItems && this.selectedItems.forEach((/**
         * @param {?} item
         * @return {?}
         */
        item => {
            if (clickedItem[this.settings.primaryKey] === item[this.settings.primaryKey]) {
                found = true;
            }
        }));
        return found;
    }
    /**
     * @param {?} item
     * @return {?}
     */
    addSelected(item) {
        if (item.disabled) {
            return;
        }
        if (this.settings.singleSelection) {
            this.selectedItems = [];
            this.selectedItems.push(item);
            this.closeDropdown();
        }
        else
            this.selectedItems.push(item);
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    }
    /**
     * @param {?} clickedItem
     * @return {?}
     */
    removeSelected(clickedItem) {
        this.selectedItems && this.selectedItems.forEach((/**
         * @param {?} item
         * @return {?}
         */
        item => {
            if (clickedItem[this.settings.primaryKey] === item[this.settings.primaryKey]) {
                this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
            }
        }));
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    toggleDropdown(evt) {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = !this.isActive;
        if (this.isActive) {
            if (this.settings.searchAutofocus && this.searchInput && this.settings.enableSearchFilter && !this.searchTempl) {
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    this.searchInput.nativeElement.focus();
                }), 0);
            }
            if (this.settings.searchAutofocus && !this.searchInput && this.settings.enableSearchFilter && this.searchTempl) {
                setTimeout((/**
                 * @return {?}
                 */
                () => {
                    this._elementRef.nativeElement.getElementsByClassName("list-filter")[0].getElementsByTagName("input")[0].focus();
                }), 0);
            }
            this.onOpen.emit(true);
        }
        else {
            this.onClose.emit(false);
        }
        setTimeout((/**
         * @return {?}
         */
        () => {
            this.calculateDropdownDirection();
        }), 0);
        if (this.settings.lazyLoading) {
            this.virtualdata = this.data;
            this.virtualScroollInit = true;
        }
        evt.preventDefault();
    }
    /**
     * @return {?}
     */
    openDropdown() {
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = true;
        if (this.settings.searchAutofocus && this.searchInput && this.settings.enableSearchFilter && !this.searchTempl) {
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.searchInput.nativeElement.focus();
            }), 0);
        }
        this.onOpen.emit(true);
    }
    /**
     * @return {?}
     */
    closeDropdown() {
        if (this.searchInput && this.settings.lazyLoading) {
            this.searchInput.nativeElement.value = "";
        }
        if (this.searchInput) {
            this.searchInput.nativeElement.value = "";
        }
        this.filter = "";
        this.isActive = false;
        this.onClose.emit(false);
    }
    /**
     * @return {?}
     */
    closeDropdownOnClickOut() {
        if (this.isActive) {
            if (this.searchInput && this.settings.lazyLoading) {
                this.searchInput.nativeElement.value = "";
            }
            if (this.searchInput) {
                this.searchInput.nativeElement.value = "";
            }
            this.filter = "";
            this.isActive = false;
            this.clearSearch();
            this.onClose.emit(false);
        }
    }
    /**
     * @return {?}
     */
    toggleSelectAll() {
        if (!this.isSelectAll) {
            this.selectedItems = [];
            if (this.settings.groupBy) {
                this.groupedData.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                (obj) => {
                    obj.selected = !obj.disabled;
                }));
                this.groupCachedItems.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                (obj) => {
                    obj.selected = !obj.disabled;
                }));
            }
            // this.selectedItems = this.data.slice();
            this.selectedItems = this.data.filter((/**
             * @param {?} individualData
             * @return {?}
             */
            (individualData) => !individualData.disabled));
            this.isSelectAll = true;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);
            this.onSelectAll.emit(this.selectedItems);
        }
        else {
            if (this.settings.groupBy) {
                this.groupedData.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                (obj) => {
                    obj.selected = false;
                }));
                this.groupCachedItems.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                (obj) => {
                    obj.selected = false;
                }));
            }
            this.selectedItems = [];
            this.isSelectAll = false;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);
            this.onDeSelectAll.emit(this.selectedItems);
        }
    }
    /**
     * @return {?}
     */
    filterGroupedList() {
        if (this.filter == "" || this.filter == null) {
            this.clearSearch();
            return;
        }
        this.groupedData = this.cloneArray(this.groupCachedItems);
        this.groupedData = this.groupedData.filter((/**
         * @param {?} obj
         * @return {?}
         */
        obj => {
            /** @type {?} */
            let arr = [];
            if (obj[this.settings.labelKey].toLowerCase().indexOf(this.filter.toLowerCase()) > -1) {
                arr = obj.list;
            }
            else {
                arr = obj.list.filter((/**
                 * @param {?} t
                 * @return {?}
                 */
                t => {
                    return t[this.settings.labelKey].toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
                }));
            }
            obj.list = arr;
            if (obj[this.settings.labelKey].toLowerCase().indexOf(this.filter.toLowerCase()) > -1) {
                return arr;
            }
            else {
                return arr.some((/**
                 * @param {?} cat
                 * @return {?}
                 */
                cat => {
                    return cat[this.settings.labelKey].toLowerCase().indexOf(this.filter.toLowerCase()) > -1;
                }));
            }
        }));
    }
    /**
     * @return {?}
     */
    toggleFilterSelectAll() {
        if (!this.isFilterSelectAll) {
            /** @type {?} */
            let added = [];
            if (this.settings.groupBy) {
                /*                 this.groupedData.forEach((item: any) => {
                                    if (item.list) {
                                        item.list.forEach((el: any) => {
                                            if (!this.isSelected(el)) {
                                                this.addSelected(el);
                                                added.push(el);
                                            }
                                        });
                                    }
                                    this.updateGroupInfo(item);
                
                                }); */
                this.ds.getFilteredData().forEach((/**
                 * @param {?} el
                 * @return {?}
                 */
                (el) => {
                    if (!this.isSelected(el) && !el.hasOwnProperty('grpTitle')) {
                        this.addSelected(el);
                        added.push(el);
                    }
                }));
            }
            else {
                this.ds.getFilteredData().forEach((/**
                 * @param {?} item
                 * @return {?}
                 */
                (item) => {
                    if (!this.isSelected(item)) {
                        this.addSelected(item);
                        added.push(item);
                    }
                }));
            }
            this.isFilterSelectAll = true;
            this.onFilterSelectAll.emit(added);
        }
        else {
            /** @type {?} */
            let removed = [];
            if (this.settings.groupBy) {
                /*                 this.groupedData.forEach((item: any) => {
                                    if (item.list) {
                                        item.list.forEach((el: any) => {
                                            if (this.isSelected(el)) {
                                                this.removeSelected(el);
                                                removed.push(el);
                                            }
                                        });
                                    }
                                }); */
                this.ds.getFilteredData().forEach((/**
                 * @param {?} el
                 * @return {?}
                 */
                (el) => {
                    if (this.isSelected(el)) {
                        this.removeSelected(el);
                        removed.push(el);
                    }
                }));
            }
            else {
                this.ds.getFilteredData().forEach((/**
                 * @param {?} item
                 * @return {?}
                 */
                (item) => {
                    if (this.isSelected(item)) {
                        this.removeSelected(item);
                        removed.push(item);
                    }
                }));
            }
            this.isFilterSelectAll = false;
            this.onFilterDeSelectAll.emit(removed);
        }
    }
    /**
     * @return {?}
     */
    toggleInfiniteFilterSelectAll() {
        if (!this.isInfiniteFilterSelectAll) {
            this.virtualdata.forEach((/**
             * @param {?} item
             * @return {?}
             */
            (item) => {
                if (!this.isSelected(item)) {
                    this.addSelected(item);
                }
            }));
            this.isInfiniteFilterSelectAll = true;
        }
        else {
            this.virtualdata.forEach((/**
             * @param {?} item
             * @return {?}
             */
            (item) => {
                if (this.isSelected(item)) {
                    this.removeSelected(item);
                }
            }));
            this.isInfiniteFilterSelectAll = false;
        }
    }
    /**
     * @return {?}
     */
    clearSearch() {
        if (this.settings.groupBy) {
            this.groupedData = [];
            this.groupedData = this.cloneArray(this.groupCachedItems);
        }
        this.filter = "";
        this.isFilterSelectAll = false;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    onFilterChange(data) {
        if (this.filter && this.filter == "" || data.length == 0) {
            this.isFilterSelectAll = false;
        }
        /** @type {?} */
        let cnt = 0;
        data.forEach((/**
         * @param {?} item
         * @return {?}
         */
        (item) => {
            if (!item.hasOwnProperty('grpTitle') && this.isSelected(item)) {
                cnt++;
            }
        }));
        if (cnt > 0 && this.filterLength == cnt) {
            this.isFilterSelectAll = true;
        }
        else if (cnt > 0 && this.filterLength != cnt) {
            this.isFilterSelectAll = false;
        }
        this.cdr.detectChanges();
    }
    /**
     * @param {?} arr
     * @return {?}
     */
    cloneArray(arr) {
        /** @type {?} */
        let i;
        /** @type {?} */
        let copy;
        if (Array.isArray(arr)) {
            return JSON.parse(JSON.stringify(arr));
        }
        else if (typeof arr === 'object') {
            throw 'Cannot clone array containing an object!';
        }
        else {
            return arr;
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    updateGroupInfo(item) {
        if (item.disabled) {
            return false;
        }
        /** @type {?} */
        let key = this.settings.groupBy;
        this.groupedData.forEach((/**
         * @param {?} obj
         * @return {?}
         */
        (obj) => {
            /** @type {?} */
            let cnt = 0;
            if (obj.grpTitle && (item[key] == obj[key])) {
                if (obj.list) {
                    obj.list.forEach((/**
                     * @param {?} el
                     * @return {?}
                     */
                    (el) => {
                        if (this.isSelected(el)) {
                            cnt++;
                        }
                    }));
                }
            }
            if (obj.list && (cnt === obj.list.length) && (item[key] == obj[key])) {
                obj.selected = true;
            }
            else if (obj.list && (cnt != obj.list.length) && (item[key] == obj[key])) {
                obj.selected = false;
            }
        }));
        this.groupCachedItems.forEach((/**
         * @param {?} obj
         * @return {?}
         */
        (obj) => {
            /** @type {?} */
            let cnt = 0;
            if (obj.grpTitle && (item[key] == obj[key])) {
                if (obj.list) {
                    obj.list.forEach((/**
                     * @param {?} el
                     * @return {?}
                     */
                    (el) => {
                        if (this.isSelected(el)) {
                            cnt++;
                        }
                    }));
                }
            }
            if (obj.list && (cnt === obj.list.length) && (item[key] == obj[key])) {
                obj.selected = true;
            }
            else if (obj.list && (cnt != obj.list.length) && (item[key] == obj[key])) {
                obj.selected = false;
            }
        }));
    }
    /**
     * @param {?} arr
     * @param {?} field
     * @return {?}
     */
    transformData(arr, field) {
        /** @type {?} */
        const groupedObj = arr.reduce((/**
         * @param {?} prev
         * @param {?} cur
         * @return {?}
         */
        (prev, cur) => {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            }
            else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }), {});
        /** @type {?} */
        const tempArr = [];
        Object.keys(groupedObj).map((/**
         * @param {?} x
         * @return {?}
         */
        (x) => {
            /** @type {?} */
            let obj = {};
            /** @type {?} */
            let disabledChildrens = [];
            obj["grpTitle"] = true;
            obj[this.settings.labelKey] = x;
            obj[this.settings.groupBy] = x;
            obj['selected'] = false;
            obj['list'] = [];
            /** @type {?} */
            let cnt = 0;
            groupedObj[x].forEach((/**
             * @param {?} item
             * @return {?}
             */
            (item) => {
                item['list'] = [];
                if (item.disabled) {
                    this.isDisabledItemPresent = true;
                    disabledChildrens.push(item);
                }
                obj.list.push(item);
                if (this.isSelected(item)) {
                    cnt++;
                }
            }));
            if (cnt == obj.list.length) {
                obj.selected = true;
            }
            else {
                obj.selected = false;
            }
            // Check if current group item's all childrens are disabled or not
            obj['disabled'] = disabledChildrens.length === groupedObj[x].length;
            tempArr.push(obj);
            // obj.list.forEach((item: any) => {
            //     tempArr.push(item);
            // });
        }));
        return tempArr;
    }
    /**
     * @param {?} evt
     * @return {?}
     */
    filterInfiniteList(evt) {
        /** @type {?} */
        let filteredElems = [];
        if (this.settings.groupBy) {
            this.groupedData = this.groupCachedItems.slice();
        }
        else {
            this.data = this.cachedItems.slice();
            this.virtualdata = this.cachedItems.slice();
        }
        if ((evt != null || evt != '') && !this.settings.groupBy) {
            if (this.settings.searchBy.length > 0) {
                for (let t = 0; t < this.settings.searchBy.length; t++) {
                    this.virtualdata.filter((/**
                     * @param {?} el
                     * @return {?}
                     */
                    (el) => {
                        if (el[this.settings.searchBy[t].toString()].toString().toLowerCase().indexOf(evt.toString().toLowerCase()) >= 0) {
                            filteredElems.push(el);
                        }
                    }));
                }
            }
            else {
                this.virtualdata.filter((/**
                 * @param {?} el
                 * @return {?}
                 */
                function (el) {
                    for (let prop in el) {
                        if (el[prop].toString().toLowerCase().indexOf(evt.toString().toLowerCase()) >= 0) {
                            filteredElems.push(el);
                            break;
                        }
                    }
                }));
            }
            this.virtualdata = [];
            this.virtualdata = filteredElems;
            this.infiniteFilterLength = this.virtualdata.length;
        }
        if (evt.toString() != '' && this.settings.groupBy) {
            this.groupedData.filter((/**
             * @param {?} el
             * @return {?}
             */
            function (el) {
                if (el.hasOwnProperty('grpTitle')) {
                    filteredElems.push(el);
                }
                else {
                    for (let prop in el) {
                        if (el[prop].toString().toLowerCase().indexOf(evt.toString().toLowerCase()) >= 0) {
                            filteredElems.push(el);
                            break;
                        }
                    }
                }
            }));
            this.groupedData = [];
            this.groupedData = filteredElems;
            this.infiniteFilterLength = this.groupedData.length;
        }
        else if (evt.toString() == '' && this.cachedItems.length > 0) {
            this.virtualdata = [];
            this.virtualdata = this.cachedItems;
            this.infiniteFilterLength = 0;
        }
        this.virtualScroller.refresh();
    }
    /**
     * @return {?}
     */
    resetInfiniteSearch() {
        this.filter = "";
        this.isInfiniteFilterSelectAll = false;
        this.virtualdata = [];
        this.virtualdata = this.cachedItems;
        this.groupedData = this.groupCachedItems;
        this.infiniteFilterLength = 0;
    }
    /**
     * @param {?} e
     * @return {?}
     */
    onScrollEnd(e) {
        if (e.endIndex === this.data.length - 1 || e.startIndex === 0) {
        }
        this.onScrollToEnd.emit(e);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    selectGroup(item) {
        if (item.disabled) {
            return false;
        }
        if (item.selected) {
            item.selected = false;
            item.list.forEach((/**
             * @param {?} obj
             * @return {?}
             */
            (obj) => {
                this.removeSelected(obj);
            }));
            this.updateGroupInfo(item);
            this.onGroupSelect.emit(item);
        }
        else {
            item.selected = true;
            item.list.forEach((/**
             * @param {?} obj
             * @return {?}
             */
            (obj) => {
                if (!this.isSelected(obj)) {
                    this.addSelected(obj);
                }
            }));
            this.updateGroupInfo(item);
            this.onGroupDeSelect.emit(item);
        }
    }
    /**
     * @return {?}
     */
    addFilterNewItem() {
        this.onAddFilterNewItem.emit(this.filter);
        this.filterPipe = new ListFilterPipe(this.ds);
        this.filterPipe.transform(this.data, this.filter, this.settings.searchBy);
    }
    /**
     * @return {?}
     */
    calculateDropdownDirection() {
        /** @type {?} */
        let shouldOpenTowardsTop = this.settings.position == 'top';
        if (this.settings.autoPosition) {
            /** @type {?} */
            const dropdownHeight = this.dropdownListElem.nativeElement.clientHeight;
            /** @type {?} */
            const viewportHeight = document.documentElement.clientHeight;
            /** @type {?} */
            const selectedListBounds = this.selectedListElem.nativeElement.getBoundingClientRect();
            /** @type {?} */
            const spaceOnTop = selectedListBounds.top;
            /** @type {?} */
            const spaceOnBottom = viewportHeight - selectedListBounds.top;
            if (spaceOnBottom < spaceOnTop && dropdownHeight < spaceOnTop) {
                this.openTowardsTop(true);
            }
            else {
                this.openTowardsTop(false);
            }
            // Keep preference if there is not enough space on either the top or bottom
            /* 			if (spaceOnTop || spaceOnBottom) {
                            if (shouldOpenTowardsTop) {
                                shouldOpenTowardsTop = spaceOnTop;
                            } else {
                                shouldOpenTowardsTop = !spaceOnBottom;
                            }
                        } */
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    openTowardsTop(value) {
        if (value && this.selectedListElem.nativeElement.clientHeight) {
            this.dropdownListYOffset = 15 + this.selectedListElem.nativeElement.clientHeight;
        }
        else {
            this.dropdownListYOffset = 0;
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    clearSelection(e) {
        if (this.settings.groupBy) {
            this.groupCachedItems.forEach((/**
             * @param {?} obj
             * @return {?}
             */
            (obj) => {
                obj.selected = false;
            }));
        }
        this.clearSearch();
        this.selectedItems = [];
        this.onDeSelectAll.emit(this.selectedItems);
    }
}
AngularMultiSelect.decorators = [
    { type: Component, args: [{
                selector: 'angular2-multiselect',
                template: "<div class=\"cuppa-dropdown\" (clickOutside)=\"closeDropdownOnClickOut()\">\r\n    <div class=\"selected-list\" #selectedList>\r\n        <div class=\"c-btn\" (click)=\"toggleDropdown($event)\" [ngClass]=\"{'disabled': settings.disabled}\" [attr.tabindex]=\"0\">\r\n\r\n            <span *ngIf=\"selectedItems?.length == 0 && !settings.fixedPlaceholder\">{{settings.text}}</span>\r\n            <span *ngIf=\"settings.singleSelection && !badgeTempl\">\r\n                <span *ngFor=\"let item of selectedItems;trackBy: trackByFn.bind(this);\">\r\n                    {{item[settings.labelKey]}}\r\n                </span>\r\n            </span>\r\n            <span class=\"c-list\" *ngIf=\"selectedItems?.length > 0 && settings.singleSelection && badgeTempl && !settings.fixedPlaceholder\">\r\n                <div class=\"c-token\" *ngFor=\"let item of selectedItems;trackBy: trackByFn.bind(this);let k = index\">\r\n                    <span *ngIf=\"!badgeTempl\" class=\"c-label\">{{item[settings.labelKey]}}</span>\r\n\r\n                    <span *ngIf=\"badgeTempl\" class=\"c-label\">\r\n                        <c-templateRenderer [data]=\"badgeTempl\" [item]=\"item\"></c-templateRenderer>\r\n                    </span>\r\n                    <span class=\"c-remove\" (click)=\"onItemClick(item,k,$event);$event.stopPropagation()\">\r\n                        <c-icon [name]=\"'remove'\"></c-icon>\r\n                    </span>\r\n                </div>\r\n            </span>\r\n            <div class=\"c-list\" *ngIf=\"selectedItems?.length > 0 && !settings.singleSelection && !settings.fixedPlaceholder\">\r\n                <div class=\"c-token\" *ngFor=\"let item of selectedItems;trackBy: trackByFn.bind(this);let k = index\" [hidden]=\"k > settings.badgeShowLimit-1\">\r\n                    <span *ngIf=\"!badgeTempl\" class=\"c-label\">{{item[settings.labelKey]}}</span>\r\n                    <span *ngIf=\"badgeTempl\" class=\"c-label\">\r\n                        <c-templateRenderer [data]=\"badgeTempl\" [item]=\"item\"></c-templateRenderer>\r\n                    </span>\r\n                    <span class=\"c-remove\" (click)=\"onItemClick(item,k,$event);$event.stopPropagation()\">\r\n                        <c-icon [name]=\"'remove'\"></c-icon>\r\n                    </span>\r\n                </div>\r\n            </div>\r\n            <div class=\"c-list\" *ngIf=\"settings.fixedPlaceholder\">\r\n                <div class=\"c-token\">\r\n                     <span class=\"c-label\">\r\n                          <div class=\"fixedPlaceholder\">{{settings.fixedPlaceholder}}</div>\r\n                     </span>\r\n                 </div>\r\n            </div>\r\n            <span class=\"countplaceholder\" *ngIf=\"selectedItems?.length > settings.badgeShowLimit\">+{{selectedItems?.length - settings.badgeShowLimit }}</span>\r\n            <span class=\"c-remove clear-all\" *ngIf=\"settings.clearAll && selectedItems?.length > 0 && !settings.disabled\" (click)=\"clearSelection($event);$event.stopPropagation()\">\r\n                <c-icon [name]=\"'remove'\"></c-icon>\r\n            </span>\r\n            <span *ngIf=\"!isActive\" class=\"c-angle-down\">\r\n                <c-icon [name]=\"'angle-down'\"></c-icon>\r\n            </span>\r\n            <span *ngIf=\"isActive\" class=\"c-angle-up\">\r\n                <c-icon [name]=\"'angle-up'\"></c-icon>\r\n\r\n            </span>\r\n        </div>\r\n    </div>\r\n    <div #dropdownList class=\"dropdown-list animated fadeIn\" [ngClass]=\"{'dropdown-list-top': dropdownListYOffset}\" [style.bottom.px]=\"dropdownListYOffset ? dropdownListYOffset : null\"\r\n        [hidden]=\"!isActive\">\r\n        <div [ngClass]=\"{'arrow-up': !dropdownListYOffset, 'arrow-down': dropdownListYOffset}\" class=\"arrow-2\"></div>\r\n        <div [ngClass]=\"{'arrow-up': !dropdownListYOffset, 'arrow-down': dropdownListYOffset}\"></div>\r\n        <div class=\"list-area\" [ngClass]=\"{'single-select-mode': settings.singleSelection }\">\r\n            <div class=\"pure-checkbox select-all\" *ngIf=\"settings.enableCheckAll && !settings.singleSelection && !settings.limitSelection && data?.length > 0 && !isDisabledItemPresent\"\r\n                (click)=\"toggleSelectAll()\">\r\n                <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelectAll\" [disabled]=\"settings.limitSelection == selectedItems?.length\"\r\n                />\r\n                <label>\r\n                    <span [hidden]=\"isSelectAll\">{{settings.selectAllText}}</span>\r\n                    <span [hidden]=\"!isSelectAll\">{{settings.unSelectAllText}}</span>\r\n                </label>\r\n            </div>\r\n            <img class=\"loading-icon\" *ngIf=\"loading\" src=\"assets/img/loading.gif\" />\r\n            <div class=\"list-filter\" *ngIf=\"settings.enableSearchFilter\">\r\n                <span class=\"c-search\">\r\n                    <c-icon [name]=\"'search'\"></c-icon>\r\n                </span>\r\n                <span *ngIf=\"!settings.lazyLoading\" [hidden]=\"filter == undefined || filter?.length == 0\" class=\"c-clear\" (click)=\"clearSearch()\">\r\n                    <c-icon [name]=\"'clear'\"></c-icon>\r\n                </span>\r\n                <span *ngIf=\"settings.lazyLoading\" [hidden]=\"filter == undefined || filter?.length == 0\" class=\"c-clear\" (click)=\"resetInfiniteSearch()\">\r\n                    <c-icon [name]=\"'clear'\"></c-icon>\r\n                </span>\r\n\r\n                <input class=\"c-input\" *ngIf=\"settings.groupBy && !settings.lazyLoading && !searchTempl\" #searchInput type=\"text\" [placeholder]=\"settings.searchPlaceholderText\"\r\n                    [(ngModel)]=\"filter\" (keyup)=\"filterGroupedList()\">\r\n                <input class=\"c-input\" *ngIf=\"!settings.groupBy && !settings.lazyLoading && !searchTempl\" #searchInput type=\"text\" [placeholder]=\"settings.searchPlaceholderText\"\r\n                    [(ngModel)]=\"filter\">\r\n                <input class=\"c-input\" *ngIf=\"settings.lazyLoading && !searchTempl\" #searchInput type=\"text\" [placeholder]=\"settings.searchPlaceholderText\"\r\n                    [(ngModel)]=\"filter\" (keyup)=\"searchTerm$.next($event.target.value)\">\r\n                <!--            <input class=\"c-input\" *ngIf=\"!settings.lazyLoading && !searchTempl && settings.groupBy\" #searchInput type=\"text\" [placeholder]=\"settings.searchPlaceholderText\"\r\n                [(ngModel)]=\"filter\" (keyup)=\"filterGroupList($event)\">-->\r\n                <c-templateRenderer *ngIf=\"searchTempl\" [data]=\"searchTempl\" [item]=\"item\"></c-templateRenderer>\r\n            </div>\r\n            <div class=\"filter-select-all\" *ngIf=\"!settings.lazyLoading && settings.enableFilterSelectAll && !isDisabledItemPresent\">\r\n                <div class=\"pure-checkbox select-all\" *ngIf=\"!settings.groupBy && filter?.length > 0 && filterLength > 0\" (click)=\"toggleFilterSelectAll()\">\r\n                    <input type=\"checkbox\" [checked]=\"isFilterSelectAll\" [disabled]=\"settings.limitSelection == selectedItems?.length\" />\r\n                    <label>\r\n                        <span [hidden]=\"isFilterSelectAll\">{{settings.filterSelectAllText}}</span>\r\n                        <span [hidden]=\"!isFilterSelectAll\">{{settings.filterUnSelectAllText}}</span>\r\n                    </label>\r\n                </div>\r\n                <div class=\"pure-checkbox select-all\" *ngIf=\"settings.groupBy && filter?.length > 0 && groupedData?.length > 0\" (click)=\"toggleFilterSelectAll()\">\r\n                    <input type=\"checkbox\" [checked]=\"isFilterSelectAll && filter?.length > 0\" [disabled]=\"settings.limitSelection == selectedItems?.length\"\r\n                    />\r\n                    <label>\r\n                        <span [hidden]=\"isFilterSelectAll\">{{settings.filterSelectAllText}}</span>\r\n                        <span [hidden]=\"!isFilterSelectAll\">{{settings.filterUnSelectAllText}}</span>\r\n                    </label>\r\n                </div>\r\n                <label class=\"nodata-label\" *ngIf=\"!settings.groupBy && filterLength == 0\" [hidden]=\"filter == undefined || filter?.length == 0\">{{settings.noDataLabel}}</label>\r\n                <label class=\"nodata-label\" *ngIf=\"settings.groupBy && groupedData?.length == 0\" [hidden]=\"filter == undefined || filter?.length == 0\">{{settings.noDataLabel}}</label>\r\n\r\n                <div class=\"btn-container\" *ngIf=\"settings.addNewItemOnFilter && filterLength == 0\" [hidden]=\"filter == undefined || filter?.length == 0\">\r\n                    <button class=\"c-btn btn-iceblue\" (click)=\"addFilterNewItem()\">{{settings.addNewButtonText}}</button>\r\n                </div>\r\n            </div>\r\n            <div class=\"filter-select-all\" *ngIf=\"settings.lazyLoading && settings.enableFilterSelectAll && !isDisabledItemPresent\">\r\n                <div class=\"pure-checkbox select-all\" *ngIf=\"filter?.length > 0 && infiniteFilterLength > 0\" (click)=\"toggleInfiniteFilterSelectAll()\">\r\n                    <input type=\"checkbox\" [checked]=\"isInfiniteFilterSelectAll\" [disabled]=\"settings.limitSelection == selectedItems?.length\"\r\n                    />\r\n                    <label>\r\n                        <span [hidden]=\"isInfiniteFilterSelectAll\">{{settings.filterSelectAllText}}</span>\r\n                        <span [hidden]=\"!isInfiniteFilterSelectAll\">{{settings.filterUnSelectAllText}}</span>\r\n                    </label>\r\n                </div>\r\n            </div>\r\n\r\n            <div *ngIf=\"!settings.groupBy && !settings.lazyLoading && itemTempl == undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\"\r\n                style=\"overflow: auto;\">\r\n                <ul class=\"lazyContainer\">\r\n                    <li *ngFor=\"let item of data | listFilter:filter : settings.searchBy; let i = index;\" (click)=\"onItemClick(item,i,$event)\"\r\n                        class=\"pure-checkbox\" [ngClass]=\"{'selected-item': isSelected(item) == true }\">\r\n                        <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(item)) || item.disabled\"\r\n                        />\r\n                        <label>{{item[settings.labelKey]}}</label>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n            <div *ngIf=\"!settings.groupBy && settings.lazyLoading && itemTempl == undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\"\r\n                style=\"overflow: auto;\">\r\n                <ul virtualScroller #scroll [enableUnequalChildrenSizes]=\"randomSize\" [items]=\"virtualdata\" (vsStart)=\"onScrollEnd($event)\"\r\n                    (vsEnd)=\"onScrollEnd($event)\" [ngStyle]=\"{'height': settings.maxHeight+'px'}\" class=\"lazyContainer\">\r\n                    <li *ngFor=\"let item of scroll.viewPortItems; let i = index;\" (click)=\"onItemClick(item,i,$event)\" class=\"pure-checkbox\"\r\n                        [ngClass]=\"{'selected-item': isSelected(item) == true }\">\r\n                        <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(item)) || item.disabled\"\r\n                        />\r\n                        <label>{{item[settings.labelKey]}}</label>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n            <div *ngIf=\"!settings.groupBy && !settings.lazyLoading && itemTempl != undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\"\r\n                style=\"overflow: auto;\">\r\n                <ul class=\"lazyContainer\">\r\n                    <li *ngFor=\"let item of data | listFilter:filter : settings.searchBy; let i = index;\" (click)=\"onItemClick(item,i,$event)\"\r\n                        class=\"pure-checkbox\" [ngClass]=\"{'selected-item': isSelected(item) == true }\">\r\n                        <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(item)) || item.disabled\"\r\n                        />\r\n                        <label></label>\r\n                        <c-templateRenderer [data]=\"itemTempl\" [item]=\"item\"></c-templateRenderer>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n            <div *ngIf=\"!settings.groupBy && settings.lazyLoading && itemTempl != undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\"\r\n                style=\"overflow: auto;\">\r\n                <ul virtualScroller #scroll2 [enableUnequalChildrenSizes]=\"randomSize\" [items]=\"virtualdata\" (vsStart)=\"onScrollEnd($event)\"\r\n                    (vsEnd)=\"onScrollEnd($event)\" class=\"lazyContainer\" [ngStyle]=\"{'height': settings.maxHeight+'px'}\">\r\n                    <li *ngFor=\"let item of scroll2.viewPortItems; let i = index;\" (click)=\"onItemClick(item,i,$event)\" class=\"pure-checkbox\"\r\n                        [ngClass]=\"{'selected-item': isSelected(item) == true }\">\r\n                        <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(item)) || item.disabled\"\r\n                        />\r\n                        <label></label>\r\n                        <c-templateRenderer [data]=\"itemTempl\" [item]=\"item\"></c-templateRenderer>\r\n                    </li>\r\n                </ul>\r\n            </div>\r\n            <div *ngIf=\"settings.groupBy && settings.lazyLoading && itemTempl != undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\"\r\n                style=\"overflow: auto;\">\r\n                <ul virtualScroller #scroll3 [enableUnequalChildrenSizes]=\"randomSize\" [items]=\"virtualdata\" (vsStart)=\"onScrollEnd($event)\"\r\n                    (vsEnd)=\"onScrollEnd($event)\" [ngStyle]=\"{'height': settings.maxHeight+'px'}\" class=\"lazyContainer\">\r\n                    <span *ngFor=\"let item of scroll3.viewPortItems; let i = index;\">\r\n                        <li (click)=\"onItemClick(item,i,$event)\" *ngIf=\"!item.grpTitle\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection}\"\r\n                            class=\"pure-checkbox\">\r\n                            <input *ngIf=\"settings.showCheckbox && !settings.singleSelection\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(item)) || item.disabled\"\r\n                            />\r\n                            <label></label>\r\n                            <c-templateRenderer [data]=\"itemTempl\" [item]=\"item\"></c-templateRenderer>\r\n                        </li>\r\n                        <li *ngIf=\"item.grpTitle\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection}\"\r\n                            class=\"pure-checkbox\">\r\n                            <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(item)) || item.disabled\"\r\n                            />\r\n                            <label></label>\r\n                            <c-templateRenderer [data]=\"itemTempl\" [item]=\"item\"></c-templateRenderer>\r\n                        </li>\r\n                    </span>\r\n                </ul>\r\n            </div>\r\n            <div *ngIf=\"settings.groupBy && !settings.lazyLoading && itemTempl != undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\"\r\n                style=\"overflow: auto;\">\r\n                <ul class=\"lazyContainer\">\r\n                    <span *ngFor=\"let item of groupedData; let i = index;\">\r\n                        <li (click)=\"selectGroup(item)\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection}\"\r\n                            class=\"pure-checkbox\">\r\n                            <input *ngIf=\"settings.showCheckbox && !settings.singleSelection\" type=\"checkbox\" [checked]=\"item.selected\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(item)) || item.disabled\"\r\n                            />\r\n                            <label>{{item[settings.labelKey]}}</label>\r\n                            <ul class=\"lazyContainer\">\r\n                                <span *ngFor=\"let val of item.list ; let j = index;\">\r\n                                    <li (click)=\"onItemClick(val,j,$event); $event.stopPropagation()\" [ngClass]=\"{'grp-title': val.grpTitle,'grp-item': !val.grpTitle && !settings.singleSelection}\"\r\n                                        class=\"pure-checkbox\">\r\n                                        <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(val)\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(val)) || val.disabled\"\r\n                                        />\r\n                                        <label></label>\r\n                                        <c-templateRenderer [data]=\"itemTempl\" [item]=\"val\"></c-templateRenderer>\r\n                                    </li>\r\n                                </span>\r\n                            </ul>\r\n\r\n                        </li>\r\n                    </span>\r\n                </ul>\r\n            </div>\r\n            <div *ngIf=\"settings.groupBy && settings.lazyLoading && itemTempl == undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\"\r\n                style=\"overflow: auto;\">\r\n                <virtual-scroller [items]=\"groupedData\" (vsUpdate)=\"viewPortItems = $event\" (vsEnd)=\"onScrollEnd($event)\" [ngStyle]=\"{'height': settings.maxHeight+'px'}\">\r\n                    <ul virtualScroller #scroll4 [enableUnequalChildrenSizes]=\"randomSize\" [items]=\"virtualdata\" (vsStart)=\"onScrollEnd($event)\"\r\n                        (vsEnd)=\"onScrollEnd($event)\" [ngStyle]=\"{'height': settings.maxHeight+'px'}\" class=\"lazyContainer\">\r\n                        <span *ngFor=\"let item of scroll4.viewPortItems; let i = index;\">\r\n                            <li *ngIf=\"item.grpTitle\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection, 'selected-item': isSelected(item) == true }\"\r\n                                class=\"pure-checkbox\">\r\n                                <input *ngIf=\"settings.showCheckbox && !item.grpTitle && !settings.singleSelection\" type=\"checkbox\" [checked]=\"isSelected(item)\"\r\n                                    [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(item)) || item.disabled\"\r\n                                />\r\n                                <label>{{item[settings.labelKey]}}</label>\r\n                            </li>\r\n                            <li (click)=\"onItemClick(item,i,$event)\" *ngIf=\"!item.grpTitle\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection, 'selected-item': isSelected(item) == true }\"\r\n                                class=\"pure-checkbox\">\r\n                                <input *ngIf=\"settings.showCheckbox && !item.grpTitle\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(item)) || item.disabled\"\r\n                                />\r\n                                <label>{{item[settings.labelKey]}}</label>\r\n                            </li>\r\n                        </span>\r\n                    </ul>\r\n                </virtual-scroller>\r\n            </div>\r\n            <div *ngIf=\"settings.groupBy && !settings.lazyLoading && itemTempl == undefined\" [style.maxHeight]=\"settings.maxHeight+'px'\"\r\n                style=\"overflow: auto;\">\r\n                <ul class=\"lazyContainer\">\r\n                    <span *ngFor=\"let item of groupedData ; let i = index;\">\r\n                        <li (click)=\"selectGroup(item)\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle && !settings.singleSelection}\"\r\n                            class=\"pure-checkbox\">\r\n                            <input *ngIf=\"settings.showCheckbox && !settings.singleSelection\" type=\"checkbox\" [checked]=\"item.selected\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(item)) || item.disabled\"\r\n                            />\r\n                            <label>{{item[settings.labelKey]}}</label>\r\n                            <ul class=\"lazyContainer\">\r\n                                <span *ngFor=\"let val of item.list ; let j = index;\">\r\n                                    <li (click)=\"onItemClick(val,j,$event); $event.stopPropagation()\" [ngClass]=\"{'selected-item': isSelected(val) == true,'grp-title': val.grpTitle,'grp-item': !val.grpTitle && !settings.singleSelection}\"\r\n                                        class=\"pure-checkbox\">\r\n                                        <input *ngIf=\"settings.showCheckbox\" type=\"checkbox\" [checked]=\"isSelected(val)\" [disabled]=\"(settings.limitSelection == selectedItems?.length && !isSelected(val)) || val.disabled\"\r\n                                        />\r\n                                        <label>{{val[settings.labelKey]}}</label>\r\n                                    </li>\r\n                                </span>\r\n                            </ul>\r\n                        </li>\r\n                    </span>\r\n                    <!-- <span *ngFor=\"let item of groupedData ; let i = index;\">\r\n                    <li (click)=\"onItemClick(item,i,$event)\" *ngIf=\"!item.grpTitle\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle}\" class=\"pure-checkbox\">\r\n                    <input *ngIf=\"settings.showCheckbox && !item.grpTitle\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\r\n                    />\r\n                    <label>{{item[settings.labelKey]}}</label>\r\n                </li>\r\n                <li *ngIf=\"item.grpTitle && !settings.selectGroup\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle}\" class=\"pure-checkbox\">\r\n                    <input *ngIf=\"settings.showCheckbox && settings.selectGroup\" type=\"checkbox\" [checked]=\"isSelected(item)\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\r\n                    />\r\n                    <label>{{item[settings.labelKey]}}</label>\r\n                </li>\r\n                 <li  (click)=\"selectGroup(item)\" *ngIf=\"item.grpTitle && settings.selectGroup\" [ngClass]=\"{'grp-title': item.grpTitle,'grp-item': !item.grpTitle}\" class=\"pure-checkbox\">\r\n                    <input *ngIf=\"settings.showCheckbox && settings.selectGroup\" type=\"checkbox\" [checked]=\"item.selected\" [disabled]=\"settings.limitSelection == selectedItems?.length && !isSelected(item)\"\r\n                    />\r\n                    <label>{{item[settings.labelKey]}}</label>\r\n                </li>\r\n                </span> -->\r\n                </ul>\r\n            </div>\r\n            <h5 class=\"list-message\" *ngIf=\"data?.length == 0\">{{settings.noDataLabel}}</h5>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
                host: { '[class]': 'defaultSettings.classes' },
                providers: [DROPDOWN_CONTROL_VALUE_ACCESSOR, DROPDOWN_CONTROL_VALIDATION],
                encapsulation: ViewEncapsulation.None,
                styles: ["virtual-scroll{display:block;width:100%}.cuppa-dropdown{position:relative}.c-btn{display:inline-block;border-width:1px;line-height:1.25;border-radius:3px;font-size:.85rem;padding:5px 10px;cursor:pointer;align-items:center;min-height:38px}.c-btn.disabled{background:#ccc}.selected-list .c-list{float:left;padding:0;margin:0;width:calc(100% - 20px)}.selected-list .c-list .c-token{list-style:none;padding:4px 22px 4px 8px;border-radius:2px;margin-right:4px;margin-top:2px;float:left;position:relative}.selected-list .c-list .c-token .c-label{display:block;float:left}.selected-list .c-list .c-token .c-remove{position:absolute;right:8px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);width:8px}.selected-list .c-list .c-token .c-remove svg{fill:#fff}.selected-list .fa-angle-down,.selected-list .fa-angle-up{font-size:15pt;position:absolute;right:10px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.selected-list .c-angle-down,.selected-list .c-angle-up{width:12px;height:12px;position:absolute;right:10px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);pointer-events:none}.selected-list .c-angle-down svg,.selected-list .c-angle-up svg{fill:#333}.selected-list .countplaceholder{position:absolute;right:45px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.selected-list .c-btn{width:100%;padding:5px 10px;cursor:pointer;display:flex;position:relative}.selected-list .c-btn .c-icon{position:absolute;right:5px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.dropdown-list{position:absolute;padding-top:14px;width:100%;z-index:99999}.dropdown-list ul{padding:0;list-style:none;overflow:auto;margin:0}.dropdown-list ul li{padding:10px;cursor:pointer;text-align:left}.dropdown-list ul li:first-child{padding-top:10px}.dropdown-list ul li:last-child{padding-bottom:10px}.dropdown-list ::-webkit-scrollbar{width:8px}.dropdown-list ::-webkit-scrollbar-thumb{background:#ccc;border-radius:5px}.dropdown-list ::-webkit-scrollbar-track{background:#f2f2f2}.arrow-down,.arrow-up{width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-bottom:15px solid #fff;margin-left:15px;position:absolute;top:0}.arrow-down{bottom:-14px;top:unset;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.arrow-2{border-bottom:15px solid #ccc;top:-1px}.arrow-down.arrow-2{top:unset;bottom:-16px}.list-area{border:1px solid #ccc;border-radius:3px;background:#fff;margin:0}.select-all{padding:10px;border-bottom:1px solid #ccc;text-align:left}.list-filter{border-bottom:1px solid #ccc;position:relative;padding-left:35px;height:35px}.list-filter input{border:0;width:100%;height:100%;padding:0}.list-filter input:focus{outline:0}.list-filter .c-search{position:absolute;top:9px;left:10px;width:15px;height:15px}.list-filter .c-search svg{fill:#888}.list-filter .c-clear{position:absolute;top:10px;right:10px;width:15px;height:15px}.list-filter .c-clear svg{fill:#888}.pure-checkbox input[type=checkbox]{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.pure-checkbox input[type=checkbox]:focus+label:before,.pure-checkbox input[type=checkbox]:hover+label:before{background-color:#f2f2f2}.pure-checkbox input[type=checkbox]:active+label:before{transition-duration:0s}.pure-checkbox input[type=checkbox]:disabled+label{color:#ccc}.pure-checkbox input[type=checkbox]+label{position:relative;padding-left:2em;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;margin:0;font-weight:300}.pure-checkbox input[type=checkbox]+label:before{box-sizing:content-box;content:'';position:absolute;top:50%;left:0;width:15px;height:15px;margin-top:-9px;text-align:center;transition:.4s;border-radius:3px}.pure-checkbox input[type=checkbox]+label:after{box-sizing:content-box;content:'';position:absolute;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:50%;transform-origin:50%;transition:transform .2s ease-out,-webkit-transform .2s ease-out;background-color:transparent;top:50%;left:3px;width:9px;height:4px;margin-top:-5px;border-style:solid;border-width:0 0 2px 2px;-o-border-image:none;border-image:none;-webkit-transform:rotate(-45deg) scale(0);transform:rotate(-45deg) scale(0)}.pure-checkbox input[type=checkbox]:disabled+label:before{border-color:#ccc}.pure-checkbox input[type=checkbox]:disabled:focus+label:before .pure-checkbox input[type=checkbox]:disabled:hover+label:before{background-color:inherit}.pure-checkbox input[type=checkbox]:disabled:checked+label:before{background-color:#ccc}.pure-checkbox input[type=radio]:checked+label:before{background-color:#fff}.pure-checkbox input[type=radio]:checked+label:after{-webkit-transform:scale(1);transform:scale(1)}.pure-checkbox input[type=radio]+label:before{border-radius:50%}.pure-checkbox input[type=checkbox]:checked+label:after{content:'';transition:transform .2s ease-out,-webkit-transform .2s ease-out;-webkit-transform:rotate(-45deg) scale(1);transform:rotate(-45deg) scale(1)}.list-message{text-align:center;margin:0;padding:15px 0;font-size:initial}.list-grp{padding:0 15px!important}.list-grp h4{text-transform:capitalize;margin:15px 0 0;font-size:14px;font-weight:700}.list-grp>li{padding-left:15px!important}.grp-item{padding-left:30px!important}.grp-title{padding-bottom:0!important}.grp-title label{margin-bottom:0!important;font-weight:800;text-transform:capitalize}.grp-title:hover{background:0 0!important}.loading-icon{width:20px;position:absolute;right:10px;top:23px;z-index:1}.nodata-label{width:100%;text-align:center;padding:10px 0 0}.btn-container{text-align:center;padding:0 5px 10px}.clear-all{width:8px;position:absolute;top:50%;right:30px;-webkit-transform:translateY(-50%);transform:translateY(-50%)}"]
            }] }
];
/** @nocollapse */
AngularMultiSelect.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: DataService }
];
AngularMultiSelect.propDecorators = {
    data: [{ type: Input }],
    settings: [{ type: Input }],
    loading: [{ type: Input }],
    onSelect: [{ type: Output, args: ['onSelect',] }],
    onDeSelect: [{ type: Output, args: ['onDeSelect',] }],
    onSelectAll: [{ type: Output, args: ['onSelectAll',] }],
    onDeSelectAll: [{ type: Output, args: ['onDeSelectAll',] }],
    onOpen: [{ type: Output, args: ['onOpen',] }],
    onClose: [{ type: Output, args: ['onClose',] }],
    onScrollToEnd: [{ type: Output, args: ['onScrollToEnd',] }],
    onFilterSelectAll: [{ type: Output, args: ['onFilterSelectAll',] }],
    onFilterDeSelectAll: [{ type: Output, args: ['onFilterDeSelectAll',] }],
    onAddFilterNewItem: [{ type: Output, args: ['onAddFilterNewItem',] }],
    onGroupSelect: [{ type: Output, args: ['onGroupSelect',] }],
    onGroupDeSelect: [{ type: Output, args: ['onGroupDeSelect',] }],
    itemTempl: [{ type: ContentChild, args: [Item, { static: false },] }],
    badgeTempl: [{ type: ContentChild, args: [Badge, { static: false },] }],
    searchTempl: [{ type: ContentChild, args: [Search, { static: false },] }],
    searchInput: [{ type: ViewChild, args: ['searchInput', { static: false },] }],
    selectedListElem: [{ type: ViewChild, args: ['selectedList', { static: false },] }],
    dropdownListElem: [{ type: ViewChild, args: ['dropdownList', { static: false },] }],
    onEscapeDown: [{ type: HostListener, args: ['document:keyup.escape', ['$event'],] }],
    virtualScroller: [{ type: ViewChild, args: [VirtualScrollerComponent, { static: false },] }]
};
if (false) {
    /** @type {?} */
    AngularMultiSelect.prototype.data;
    /** @type {?} */
    AngularMultiSelect.prototype.settings;
    /** @type {?} */
    AngularMultiSelect.prototype.loading;
    /** @type {?} */
    AngularMultiSelect.prototype.onSelect;
    /** @type {?} */
    AngularMultiSelect.prototype.onDeSelect;
    /** @type {?} */
    AngularMultiSelect.prototype.onSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.onDeSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.onOpen;
    /** @type {?} */
    AngularMultiSelect.prototype.onClose;
    /** @type {?} */
    AngularMultiSelect.prototype.onScrollToEnd;
    /** @type {?} */
    AngularMultiSelect.prototype.onFilterSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.onFilterDeSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.onAddFilterNewItem;
    /** @type {?} */
    AngularMultiSelect.prototype.onGroupSelect;
    /** @type {?} */
    AngularMultiSelect.prototype.onGroupDeSelect;
    /** @type {?} */
    AngularMultiSelect.prototype.itemTempl;
    /** @type {?} */
    AngularMultiSelect.prototype.badgeTempl;
    /** @type {?} */
    AngularMultiSelect.prototype.searchTempl;
    /** @type {?} */
    AngularMultiSelect.prototype.searchInput;
    /** @type {?} */
    AngularMultiSelect.prototype.selectedListElem;
    /** @type {?} */
    AngularMultiSelect.prototype.dropdownListElem;
    /** @type {?} */
    AngularMultiSelect.prototype.virtualdata;
    /** @type {?} */
    AngularMultiSelect.prototype.searchTerm$;
    /** @type {?} */
    AngularMultiSelect.prototype.filterPipe;
    /** @type {?} */
    AngularMultiSelect.prototype.selectedItems;
    /** @type {?} */
    AngularMultiSelect.prototype.isActive;
    /** @type {?} */
    AngularMultiSelect.prototype.isSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.isFilterSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.isInfiniteFilterSelectAll;
    /** @type {?} */
    AngularMultiSelect.prototype.groupedData;
    /** @type {?} */
    AngularMultiSelect.prototype.filter;
    /** @type {?} */
    AngularMultiSelect.prototype.chunkArray;
    /** @type {?} */
    AngularMultiSelect.prototype.scrollTop;
    /** @type {?} */
    AngularMultiSelect.prototype.chunkIndex;
    /** @type {?} */
    AngularMultiSelect.prototype.cachedItems;
    /** @type {?} */
    AngularMultiSelect.prototype.groupCachedItems;
    /** @type {?} */
    AngularMultiSelect.prototype.totalRows;
    /** @type {?} */
    AngularMultiSelect.prototype.itemHeight;
    /** @type {?} */
    AngularMultiSelect.prototype.screenItemsLen;
    /** @type {?} */
    AngularMultiSelect.prototype.cachedItemsLen;
    /** @type {?} */
    AngularMultiSelect.prototype.totalHeight;
    /** @type {?} */
    AngularMultiSelect.prototype.scroller;
    /** @type {?} */
    AngularMultiSelect.prototype.maxBuffer;
    /** @type {?} */
    AngularMultiSelect.prototype.lastScrolled;
    /** @type {?} */
    AngularMultiSelect.prototype.lastRepaintY;
    /** @type {?} */
    AngularMultiSelect.prototype.selectedListHeight;
    /** @type {?} */
    AngularMultiSelect.prototype.filterLength;
    /** @type {?} */
    AngularMultiSelect.prototype.infiniteFilterLength;
    /** @type {?} */
    AngularMultiSelect.prototype.viewPortItems;
    /** @type {?} */
    AngularMultiSelect.prototype.item;
    /** @type {?} */
    AngularMultiSelect.prototype.dropdownListYOffset;
    /** @type {?} */
    AngularMultiSelect.prototype.subscription;
    /** @type {?} */
    AngularMultiSelect.prototype.defaultSettings;
    /** @type {?} */
    AngularMultiSelect.prototype.randomSize;
    /** @type {?} */
    AngularMultiSelect.prototype.parseError;
    /** @type {?} */
    AngularMultiSelect.prototype.filteredList;
    /** @type {?} */
    AngularMultiSelect.prototype.virtualScroollInit;
    /**
     * @type {?}
     * @private
     */
    AngularMultiSelect.prototype.virtualScroller;
    /** @type {?} */
    AngularMultiSelect.prototype.isDisabledItemPresent;
    /**
     * @type {?}
     * @private
     */
    AngularMultiSelect.prototype.onTouchedCallback;
    /**
     * @type {?}
     * @private
     */
    AngularMultiSelect.prototype.onChangeCallback;
    /** @type {?} */
    AngularMultiSelect.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    AngularMultiSelect.prototype.cdr;
    /**
     * @type {?}
     * @private
     */
    AngularMultiSelect.prototype.ds;
}
export class AngularMultiSelectModule {
}
AngularMultiSelectModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule, VirtualScrollerModule],
                declarations: [AngularMultiSelect, ClickOutsideDirective, ScrollDirective, styleDirective, ListFilterPipe, Item, TemplateRenderer, Badge, Search, setPosition, CIcon],
                exports: [AngularMultiSelect, ClickOutsideDirective, ScrollDirective, styleDirective, ListFilterPipe, Item, TemplateRenderer, Badge, Search, setPosition, CIcon],
                providers: [DataService]
            },] }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlzZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItbXVsdGlzZWxlY3QtZHJvcGRvd24vIiwic291cmNlcyI6WyJsaWIvbXVsdGlzZWxlY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLFlBQVksRUFBc0MsUUFBUSxFQUE0QixpQkFBaUIsRUFBb0IsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFzQyxNQUFNLGVBQWUsQ0FBQztBQUNsVCxPQUFPLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUF3QixhQUFhLEVBQTBCLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0gsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVsRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDM0UsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBZ0IsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2xHLE9BQU8sRUFBTyxZQUFZLEVBQUUsb0JBQW9CLEVBQWEsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBR3pGLE1BQU0sT0FB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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSG9zdExpc3RlbmVyLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgT25EZXN0cm95LCBOZ01vZHVsZSwgU2ltcGxlQ2hhbmdlcywgT25DaGFuZ2VzLCBDaGFuZ2VEZXRlY3RvclJlZiwgQWZ0ZXJWaWV3Q2hlY2tlZCwgVmlld0VuY2Fwc3VsYXRpb24sIENvbnRlbnRDaGlsZCwgVmlld0NoaWxkLCBmb3J3YXJkUmVmLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMSURBVE9SUywgVmFsaWRhdG9yLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgTXlFeGNlcHRpb24gfSBmcm9tICcuL211bHRpc2VsZWN0Lm1vZGVsJztcclxuaW1wb3J0IHsgRHJvcGRvd25TZXR0aW5ncyB9IGZyb20gJy4vbXVsdGlzZWxlY3QuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLCBTY3JvbGxEaXJlY3RpdmUsIHN0eWxlRGlyZWN0aXZlLCBzZXRQb3NpdGlvbiB9IGZyb20gJy4vY2xpY2tPdXRzaWRlJztcclxuaW1wb3J0IHsgTGlzdEZpbHRlclBpcGUgfSBmcm9tICcuL2xpc3QtZmlsdGVyJztcclxuaW1wb3J0IHsgSXRlbSwgQmFkZ2UsIFNlYXJjaCwgVGVtcGxhdGVSZW5kZXJlciwgQ0ljb24gfSBmcm9tICcuL21lbnUtaXRlbSc7XHJcbmltcG9ydCB7IERhdGFTZXJ2aWNlIH0gZnJvbSAnLi9tdWx0aXNlbGVjdC5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFZpcnR1YWxTY3JvbGxlck1vZHVsZSwgVmlydHVhbFNjcm9sbGVyQ29tcG9uZW50IH0gZnJvbSAnLi92aXJ0dWFsLXNjcm9sbC92aXJ0dWFsLXNjcm9sbCc7XHJcbmltcG9ydCB7IG1hcCwgZGVib3VuY2VUaW1lLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgc3dpdGNoTWFwLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IFRocm93U3RtdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcclxuXHJcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XHJcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFuZ3VsYXJNdWx0aVNlbGVjdCksXHJcbiAgICBtdWx0aTogdHJ1ZVxyXG59O1xyXG5leHBvcnQgY29uc3QgRFJPUERPV05fQ09OVFJPTF9WQUxJREFUSU9OOiBhbnkgPSB7XHJcbiAgICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxyXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQW5ndWxhck11bHRpU2VsZWN0KSxcclxuICAgIG11bHRpOiB0cnVlLFxyXG59XHJcbmNvbnN0IG5vb3AgPSAoKSA9PiB7XHJcbn07XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYW5ndWxhcjItbXVsdGlzZWxlY3QnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL211bHRpc2VsZWN0LmNvbXBvbmVudC5odG1sJyxcclxuICAgIGhvc3Q6IHsgJ1tjbGFzc10nOiAnZGVmYXVsdFNldHRpbmdzLmNsYXNzZXMnIH0sXHJcbiAgICBzdHlsZVVybHM6IFsnLi9tdWx0aXNlbGVjdC5jb21wb25lbnQuc2NzcyddLFxyXG4gICAgcHJvdmlkZXJzOiBbRFJPUERPV05fQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUiwgRFJPUERPV05fQ09OVFJPTF9WQUxJREFUSU9OXSxcclxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgQW5ndWxhck11bHRpU2VsZWN0IGltcGxlbWVudHMgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzLCBWYWxpZGF0b3IsIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSB7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIGRhdGE6IEFycmF5PGFueT47XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHNldHRpbmdzOiBEcm9wZG93blNldHRpbmdzO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBsb2FkaW5nOiBib29sZWFuO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uU2VsZWN0JylcclxuICAgIG9uU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uRGVTZWxlY3QnKVxyXG4gICAgb25EZVNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvblNlbGVjdEFsbCcpXHJcbiAgICBvblNlbGVjdEFsbDogRXZlbnRFbWl0dGVyPEFycmF5PGFueT4+ID0gbmV3IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uRGVTZWxlY3RBbGwnKVxyXG4gICAgb25EZVNlbGVjdEFsbDogRXZlbnRFbWl0dGVyPEFycmF5PGFueT4+ID0gbmV3IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uT3BlbicpXHJcbiAgICBvbk9wZW46IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25DbG9zZScpXHJcbiAgICBvbkNsb3NlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uU2Nyb2xsVG9FbmQnKVxyXG4gICAgb25TY3JvbGxUb0VuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvbkZpbHRlclNlbGVjdEFsbCcpXHJcbiAgICBvbkZpbHRlclNlbGVjdEFsbDogRXZlbnRFbWl0dGVyPEFycmF5PGFueT4+ID0gbmV3IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uRmlsdGVyRGVTZWxlY3RBbGwnKVxyXG4gICAgb25GaWx0ZXJEZVNlbGVjdEFsbDogRXZlbnRFbWl0dGVyPEFycmF5PGFueT4+ID0gbmV3IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uQWRkRmlsdGVyTmV3SXRlbScpXHJcbiAgICBvbkFkZEZpbHRlck5ld0l0ZW06IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25Hcm91cFNlbGVjdCcpXHJcbiAgICBvbkdyb3VwU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uR3JvdXBEZVNlbGVjdCcpXHJcbiAgICBvbkdyb3VwRGVTZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgQENvbnRlbnRDaGlsZChJdGVtLCB7IHN0YXRpYzogZmFsc2UgfSkgaXRlbVRlbXBsOiBJdGVtO1xyXG4gICAgQENvbnRlbnRDaGlsZChCYWRnZSwgeyBzdGF0aWM6IGZhbHNlIH0pIGJhZGdlVGVtcGw6IEJhZGdlO1xyXG4gICAgQENvbnRlbnRDaGlsZChTZWFyY2gsIHsgc3RhdGljOiBmYWxzZSB9KSBzZWFyY2hUZW1wbDogU2VhcmNoO1xyXG5cclxuXHJcbiAgICBAVmlld0NoaWxkKCdzZWFyY2hJbnB1dCcsIHsgc3RhdGljOiBmYWxzZSB9KSBzZWFyY2hJbnB1dDogRWxlbWVudFJlZjtcclxuICAgIEBWaWV3Q2hpbGQoJ3NlbGVjdGVkTGlzdCcsIHsgc3RhdGljOiBmYWxzZSB9KSBzZWxlY3RlZExpc3RFbGVtOiBFbGVtZW50UmVmO1xyXG4gICAgQFZpZXdDaGlsZCgnZHJvcGRvd25MaXN0JywgeyBzdGF0aWM6IGZhbHNlIH0pIGRyb3Bkb3duTGlzdEVsZW06IEVsZW1lbnRSZWY7XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5dXAuZXNjYXBlJywgWyckZXZlbnQnXSlcclxuICAgIG9uRXNjYXBlRG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmVzY2FwZVRvQ2xvc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZURyb3Bkb3duKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmlydHVhbGRhdGE6IGFueSA9IFtdO1xyXG4gICAgc2VhcmNoVGVybSQgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcblxyXG4gICAgZmlsdGVyUGlwZTogTGlzdEZpbHRlclBpcGU7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWRJdGVtczogQXJyYXk8YW55PjtcclxuICAgIHB1YmxpYyBpc0FjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzU2VsZWN0QWxsOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNGaWx0ZXJTZWxlY3RBbGw6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0luZmluaXRlRmlsdGVyU2VsZWN0QWxsOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgZ3JvdXBlZERhdGE6IEFycmF5PGFueT47XHJcbiAgICBmaWx0ZXI6IGFueTtcclxuICAgIHB1YmxpYyBjaHVua0FycmF5OiBhbnlbXTtcclxuICAgIHB1YmxpYyBzY3JvbGxUb3A6IGFueTtcclxuICAgIHB1YmxpYyBjaHVua0luZGV4OiBhbnlbXSA9IFtdO1xyXG4gICAgcHVibGljIGNhY2hlZEl0ZW1zOiBhbnlbXSA9IFtdO1xyXG4gICAgcHVibGljIGdyb3VwQ2FjaGVkSXRlbXM6IGFueVtdID0gW107XHJcbiAgICBwdWJsaWMgdG90YWxSb3dzOiBhbnk7XHJcbiAgICBwdWJsaWMgaXRlbUhlaWdodDogYW55ID0gNDEuNjtcclxuICAgIHB1YmxpYyBzY3JlZW5JdGVtc0xlbjogYW55O1xyXG4gICAgcHVibGljIGNhY2hlZEl0ZW1zTGVuOiBhbnk7XHJcbiAgICBwdWJsaWMgdG90YWxIZWlnaHQ6IGFueTtcclxuICAgIHB1YmxpYyBzY3JvbGxlcjogYW55O1xyXG4gICAgcHVibGljIG1heEJ1ZmZlcjogYW55O1xyXG4gICAgcHVibGljIGxhc3RTY3JvbGxlZDogYW55O1xyXG4gICAgcHVibGljIGxhc3RSZXBhaW50WTogYW55O1xyXG4gICAgcHVibGljIHNlbGVjdGVkTGlzdEhlaWdodDogYW55O1xyXG4gICAgcHVibGljIGZpbHRlckxlbmd0aDogYW55ID0gMDtcclxuICAgIHB1YmxpYyBpbmZpbml0ZUZpbHRlckxlbmd0aDogYW55ID0gMDtcclxuICAgIHB1YmxpYyB2aWV3UG9ydEl0ZW1zOiBhbnk7XHJcbiAgICBwdWJsaWMgaXRlbTogYW55O1xyXG4gICAgcHVibGljIGRyb3Bkb3duTGlzdFlPZmZzZXQ6IG51bWJlciA9IDA7XHJcbiAgICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICAgIGRlZmF1bHRTZXR0aW5nczogRHJvcGRvd25TZXR0aW5ncyA9IHtcclxuICAgICAgICBzaW5nbGVTZWxlY3Rpb246IGZhbHNlLFxyXG4gICAgICAgIHRleHQ6ICdTZWxlY3QnLFxyXG4gICAgICAgIGVuYWJsZUNoZWNrQWxsOiB0cnVlLFxyXG4gICAgICAgIHNlbGVjdEFsbFRleHQ6ICdTZWxlY3QgQWxsJyxcclxuICAgICAgICB1blNlbGVjdEFsbFRleHQ6ICdVblNlbGVjdCBBbGwnLFxyXG4gICAgICAgIGZpbHRlclNlbGVjdEFsbFRleHQ6ICdTZWxlY3QgYWxsIGZpbHRlcmVkIHJlc3VsdHMnLFxyXG4gICAgICAgIGZpbHRlclVuU2VsZWN0QWxsVGV4dDogJ1VuU2VsZWN0IGFsbCBmaWx0ZXJlZCByZXN1bHRzJyxcclxuICAgICAgICBlbmFibGVTZWFyY2hGaWx0ZXI6IGZhbHNlLFxyXG4gICAgICAgIHNlYXJjaEJ5OiBbXSxcclxuICAgICAgICBtYXhIZWlnaHQ6IDMwMCxcclxuICAgICAgICBiYWRnZVNob3dMaW1pdDogOTk5OTk5OTk5OTk5LFxyXG4gICAgICAgIGNsYXNzZXM6ICcnLFxyXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcclxuICAgICAgICBzZWFyY2hQbGFjZWhvbGRlclRleHQ6ICdTZWFyY2gnLFxyXG4gICAgICAgIHNob3dDaGVja2JveDogdHJ1ZSxcclxuICAgICAgICBub0RhdGFMYWJlbDogJ05vIERhdGEgQXZhaWxhYmxlJyxcclxuICAgICAgICBzZWFyY2hBdXRvZm9jdXM6IHRydWUsXHJcbiAgICAgICAgbGF6eUxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIGxhYmVsS2V5OiAnaXRlbU5hbWUnLFxyXG4gICAgICAgIHByaW1hcnlLZXk6ICdpZCcsXHJcbiAgICAgICAgcG9zaXRpb246ICdib3R0b20nLFxyXG4gICAgICAgIGF1dG9Qb3NpdGlvbjogdHJ1ZSxcclxuICAgICAgICBlbmFibGVGaWx0ZXJTZWxlY3RBbGw6IHRydWUsXHJcbiAgICAgICAgc2VsZWN0R3JvdXA6IGZhbHNlLFxyXG4gICAgICAgIGFkZE5ld0l0ZW1PbkZpbHRlcjogZmFsc2UsXHJcbiAgICAgICAgYWRkTmV3QnV0dG9uVGV4dDogXCJBZGRcIixcclxuICAgICAgICBlc2NhcGVUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgIGNsZWFyQWxsOiB0cnVlXHJcbiAgICB9XHJcbiAgICByYW5kb21TaXplOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBwYXJzZUVycm9yOiBib29sZWFuO1xyXG4gICAgcHVibGljIGZpbHRlcmVkTGlzdDogYW55ID0gW107XHJcbiAgICB2aXJ0dWFsU2Nyb29sbEluaXQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBWaWV3Q2hpbGQoVmlydHVhbFNjcm9sbGVyQ29tcG9uZW50LCB7IHN0YXRpYzogZmFsc2UgfSlcclxuICAgIHByaXZhdGUgdmlydHVhbFNjcm9sbGVyOiBWaXJ0dWFsU2Nyb2xsZXJDb21wb25lbnQ7XHJcbiAgICBwdWJsaWMgaXNEaXNhYmxlZEl0ZW1QcmVzZW50ID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgZHM6IERhdGFTZXJ2aWNlKSB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hUZXJtJC5hc09ic2VydmFibGUoKS5waXBlKFxyXG4gICAgICAgICAgICBkZWJvdW5jZVRpbWUoMTAwMCksXHJcbiAgICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXHJcbiAgICAgICAgICAgIHRhcCh0ZXJtID0+IHRlcm0pXHJcbiAgICAgICAgKS5zdWJzY3JpYmUodmFsID0+IHtcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJJbmZpbml0ZUxpc3QodmFsKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcclxuXHJcbiAgICAgICAgdGhpcy5jYWNoZWRJdGVtcyA9IHRoaXMuY2xvbmVBcnJheSh0aGlzLmRhdGEpO1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnBvc2l0aW9uID09ICd0b3AnKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZExpc3RIZWlnaHQgPSB7IHZhbDogMCB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZExpc3RIZWlnaHQudmFsID0gdGhpcy5zZWxlY3RlZExpc3RFbGVtLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmRzLmdldERhdGEoKS5zdWJzY3JpYmUoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGVuID0gMDtcclxuICAgICAgICAgICAgICAgIGRhdGEuZm9yRWFjaCgob2JqOiBhbnksIGk6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmouZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0Rpc2FibGVkSXRlbVByZXNlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eSgnZ3JwVGl0bGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZW4rKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyTGVuZ3RoID0gbGVuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkZpbHRlckNoYW5nZShkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVEcm9wZG93bkRpcmVjdGlvbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudmlydHVhbFNjcm9vbGxJbml0ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICAgICAgaWYgKGNoYW5nZXMuZGF0YSAmJiAhY2hhbmdlcy5kYXRhLmZpcnN0Q2hhbmdlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLnRyYW5zZm9ybURhdGEodGhpcy5kYXRhLCB0aGlzLnNldHRpbmdzLmdyb3VwQnkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cENhY2hlZEl0ZW1zID0gdGhpcy5jbG9uZUFycmF5KHRoaXMuZ3JvdXBlZERhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGVkSXRlbXMgPSB0aGlzLmNsb25lQXJyYXkodGhpcy5kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNoYW5nZXMuc2V0dGluZ3MgJiYgIWNoYW5nZXMuc2V0dGluZ3MuZmlyc3RDaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24odGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2hhbmdlcy5sb2FkaW5nKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmxhenlMb2FkaW5nICYmIHRoaXMudmlydHVhbFNjcm9vbGxJbml0ICYmIGNoYW5nZXMuZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhID0gY2hhbmdlcy5kYXRhLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuZ0RvQ2hlY2soKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJdGVtcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA9PSAwIHx8IHRoaXMuZGF0YS5sZW5ndGggPT0gMCB8fCB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoIDwgdGhpcy5kYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc1NlbGVjdEFsbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmxhenlMb2FkaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibGF6eUNvbnRhaW5lclwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLm9uU2Nyb2xsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZExpc3RFbGVtLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0ICYmIHRoaXMuc2V0dGluZ3MucG9zaXRpb24gPT0gJ3RvcCcgJiYgdGhpcy5zZWxlY3RlZExpc3RIZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZExpc3RIZWlnaHQudmFsID0gdGhpcy5zZWxlY3RlZExpc3RFbGVtLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25JdGVtQ2xpY2soaXRlbTogYW55LCBpbmRleDogbnVtYmVyLCBldnQ6IEV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZvdW5kID0gdGhpcy5pc1NlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICAgIGxldCBsaW1pdCA9IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPCB0aGlzLnNldHRpbmdzLmxpbWl0U2VsZWN0aW9uID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIWZvdW5kKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmxpbWl0U2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGltaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25TZWxlY3QuZW1pdChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2VsZWN0LmVtaXQoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLm9uRGVTZWxlY3QuZW1pdChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RBbGwgfHwgdGhpcy5kYXRhLmxlbmd0aCA+IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1NlbGVjdEFsbCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPT0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzU2VsZWN0QWxsID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdyb3VwSW5mbyhpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmFsaWRhdGUoYzogRm9ybUNvbnRyb2wpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvblRvdWNoZWRDYWxsYmFjazogKF86IGFueSkgPT4gdm9pZCA9IG5vb3A7XHJcbiAgICBwcml2YXRlIG9uQ2hhbmdlQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xyXG5cclxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSAnJykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zaW5nbGVTZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy50cmFuc2Zvcm1EYXRhKHRoaXMuZGF0YSwgdGhpcy5zZXR0aW5ncy5ncm91cEJ5KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMgPSB0aGlzLmNsb25lQXJyYXkodGhpcy5ncm91cGVkRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW3ZhbHVlWzBdXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbdmFsdWVbMF1dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE15RXhjZXB0aW9uKDQwNCwgeyBcIm1zZ1wiOiBcIlNpbmdsZSBTZWxlY3Rpb24gTW9kZSwgU2VsZWN0ZWQgSXRlbXMgY2Fubm90IGhhdmUgbW9yZSB0aGFuIG9uZSBpdGVtLlwiIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLmJvZHkubXNnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubGltaXRTZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB2YWx1ZS5zbGljZSgwLCB0aGlzLnNldHRpbmdzLmxpbWl0U2VsZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPT09IHRoaXMuZGF0YS5sZW5ndGggJiYgdGhpcy5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU2VsZWN0QWxsID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy50cmFuc2Zvcm1EYXRhKHRoaXMuZGF0YSwgdGhpcy5zZXR0aW5ncy5ncm91cEJ5KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMgPSB0aGlzLmNsb25lQXJyYXkodGhpcy5ncm91cGVkRGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9Gcm9tIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxyXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgLy9Gcm9tIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxyXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xyXG4gICAgICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sgPSBmbjtcclxuICAgIH1cclxuICAgIHRyYWNrQnlGbihpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gaXRlbVt0aGlzLnNldHRpbmdzLnByaW1hcnlLZXldO1xyXG4gICAgfVxyXG4gICAgaXNTZWxlY3RlZChjbGlja2VkSXRlbTogYW55KSB7XHJcbiAgICAgICAgaWYgKGNsaWNrZWRJdGVtLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zICYmIHRoaXMuc2VsZWN0ZWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2xpY2tlZEl0ZW1bdGhpcy5zZXR0aW5ncy5wcmltYXJ5S2V5XSA9PT0gaXRlbVt0aGlzLnNldHRpbmdzLnByaW1hcnlLZXldKSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZm91bmQ7XHJcbiAgICB9XHJcbiAgICBhZGRTZWxlY3RlZChpdGVtOiBhbnkpIHtcclxuICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNpbmdsZVNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2VEcm9wZG93bigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG4gICAgICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sodGhpcy5zZWxlY3RlZEl0ZW1zKTtcclxuICAgIH1cclxuICAgIHJlbW92ZVNlbGVjdGVkKGNsaWNrZWRJdGVtOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgJiYgdGhpcy5zZWxlY3RlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjbGlja2VkSXRlbVt0aGlzLnNldHRpbmdzLnByaW1hcnlLZXldID09PSBpdGVtW3RoaXMuc2V0dGluZ3MucHJpbWFyeUtleV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5zcGxpY2UodGhpcy5zZWxlY3RlZEl0ZW1zLmluZGV4T2YoaXRlbSksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG4gICAgfVxyXG4gICAgdG9nZ2xlRHJvcGRvd24oZXZ0OiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSAhdGhpcy5pc0FjdGl2ZTtcclxuICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zZWFyY2hBdXRvZm9jdXMgJiYgdGhpcy5zZWFyY2hJbnB1dCAmJiB0aGlzLnNldHRpbmdzLmVuYWJsZVNlYXJjaEZpbHRlciAmJiAhdGhpcy5zZWFyY2hUZW1wbCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zZWFyY2hBdXRvZm9jdXMgJiYgIXRoaXMuc2VhcmNoSW5wdXQgJiYgdGhpcy5zZXR0aW5ncy5lbmFibGVTZWFyY2hGaWx0ZXIgJiYgdGhpcy5zZWFyY2hUZW1wbCkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsaXN0LWZpbHRlclwiKVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm9uT3Blbi5lbWl0KHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNsb3NlLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVEcm9wZG93bkRpcmVjdGlvbigpO1xyXG4gICAgICAgIH0sIDApO1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmxhenlMb2FkaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMudmlydHVhbFNjcm9vbGxJbml0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgb3BlbkRyb3Bkb3duKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc2VhcmNoQXV0b2ZvY3VzICYmIHRoaXMuc2VhcmNoSW5wdXQgJiYgdGhpcy5zZXR0aW5ncy5lbmFibGVTZWFyY2hGaWx0ZXIgJiYgIXRoaXMuc2VhcmNoVGVtcGwpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub25PcGVuLmVtaXQodHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xvc2VEcm9wZG93bigpIHtcclxuICAgICAgICBpZiAodGhpcy5zZWFyY2hJbnB1dCAmJiB0aGlzLnNldHRpbmdzLmxhenlMb2FkaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnNlYXJjaElucHV0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmlsdGVyID0gXCJcIjtcclxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vbkNsb3NlLmVtaXQoZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsb3NlRHJvcGRvd25PbkNsaWNrT3V0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlYXJjaElucHV0ICYmIHRoaXMuc2V0dGluZ3MubGF6eUxvYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VhcmNoSW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5maWx0ZXIgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJTZWFyY2goKTtcclxuICAgICAgICAgICAgdGhpcy5vbkNsb3NlLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRvZ2dsZVNlbGVjdEFsbCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RBbGwpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEuZm9yRWFjaCgob2JqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gIW9iai5kaXNhYmxlZDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMuZm9yRWFjaCgob2JqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gIW9iai5kaXNhYmxlZDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdGhpcy5zZWxlY3RlZEl0ZW1zID0gdGhpcy5kYXRhLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHRoaXMuZGF0YS5maWx0ZXIoKGluZGl2aWR1YWxEYXRhKSA9PiAhaW5kaXZpZHVhbERhdGEuZGlzYWJsZWQpO1xyXG4gICAgICAgICAgICB0aGlzLmlzU2VsZWN0QWxsID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sodGhpcy5zZWxlY3RlZEl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub25TZWxlY3RBbGwuZW1pdCh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YS5mb3JFYWNoKChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cENhY2hlZEl0ZW1zLmZvckVhY2goKG9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5pc1NlbGVjdEFsbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZEl0ZW1zKTtcclxuICAgICAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vbkRlU2VsZWN0QWxsLmVtaXQodGhpcy5zZWxlY3RlZEl0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmaWx0ZXJHcm91cGVkTGlzdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5maWx0ZXIgPT0gXCJcIiB8fCB0aGlzLmZpbHRlciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJTZWFyY2goKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy5jbG9uZUFycmF5KHRoaXMuZ3JvdXBDYWNoZWRJdGVtcyk7XHJcbiAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IHRoaXMuZ3JvdXBlZERhdGEuZmlsdGVyKG9iaiA9PiB7XHJcbiAgICAgICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICAgICAgaWYgKG9ialt0aGlzLnNldHRpbmdzLmxhYmVsS2V5XS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5maWx0ZXIudG9Mb3dlckNhc2UoKSkgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgYXJyID0gb2JqLmxpc3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhcnIgPSBvYmoubGlzdC5maWx0ZXIodCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRbdGhpcy5zZXR0aW5ncy5sYWJlbEtleV0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMuZmlsdGVyLnRvTG93ZXJDYXNlKCkpID4gLTE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgb2JqLmxpc3QgPSBhcnI7XHJcbiAgICAgICAgICAgIGlmIChvYmpbdGhpcy5zZXR0aW5ncy5sYWJlbEtleV0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMuZmlsdGVyLnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyLnNvbWUoY2F0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2F0W3RoaXMuc2V0dGluZ3MubGFiZWxLZXldLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLmZpbHRlci50b0xvd2VyQ2FzZSgpKSA+IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdG9nZ2xlRmlsdGVyU2VsZWN0QWxsKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0ZpbHRlclNlbGVjdEFsbCkge1xyXG4gICAgICAgICAgICBsZXQgYWRkZWQgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICAgICAgLyogICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubGlzdC5mb3JFYWNoKChlbDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0ZWQoZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRlZC5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUdyb3VwSW5mbyhpdGVtKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAqL1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZHMuZ2V0RmlsdGVyZWREYXRhKCkuZm9yRWFjaCgoZWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkKGVsKSAmJiAhZWwuaGFzT3duUHJvcGVydHkoJ2dycFRpdGxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3RlZChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHMuZ2V0RmlsdGVyZWREYXRhKCkuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0ZWQoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3RlZChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuaXNGaWx0ZXJTZWxlY3RBbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uRmlsdGVyU2VsZWN0QWxsLmVtaXQoYWRkZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHJlbW92ZWQgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICAgICAgLyogICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ubGlzdC5mb3JFYWNoKChlbDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZChlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWQucHVzaChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsgKi9cclxuICAgICAgICAgICAgICAgIHRoaXMuZHMuZ2V0RmlsdGVyZWREYXRhKCkuZm9yRWFjaCgoZWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWQoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcy5nZXRGaWx0ZXJlZERhdGEoKS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWQucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc0ZpbHRlclNlbGVjdEFsbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm9uRmlsdGVyRGVTZWxlY3RBbGwuZW1pdChyZW1vdmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0b2dnbGVJbmZpbml0ZUZpbHRlclNlbGVjdEFsbCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNJbmZpbml0ZUZpbHRlclNlbGVjdEFsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0ZWQoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5pc0luZmluaXRlRmlsdGVyU2VsZWN0QWxsID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmlzSW5maW5pdGVGaWx0ZXJTZWxlY3RBbGwgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGVhclNlYXJjaCgpIHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IHRoaXMuY2xvbmVBcnJheSh0aGlzLmdyb3VwQ2FjaGVkSXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbHRlciA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5pc0ZpbHRlclNlbGVjdEFsbCA9IGZhbHNlO1xyXG5cclxuICAgIH1cclxuICAgIG9uRmlsdGVyQ2hhbmdlKGRhdGE6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbHRlciAmJiB0aGlzLmZpbHRlciA9PSBcIlwiIHx8IGRhdGEubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pc0ZpbHRlclNlbGVjdEFsbCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY250ID0gMDtcclxuICAgICAgICBkYXRhLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKCFpdGVtLmhhc093blByb3BlcnR5KCdncnBUaXRsZScpICYmIHRoaXMuaXNTZWxlY3RlZChpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgY250Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGNudCA+IDAgJiYgdGhpcy5maWx0ZXJMZW5ndGggPT0gY250KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNGaWx0ZXJTZWxlY3RBbGwgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjbnQgPiAwICYmIHRoaXMuZmlsdGVyTGVuZ3RoICE9IGNudCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzRmlsdGVyU2VsZWN0QWxsID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcclxuICAgIH1cclxuICAgIGNsb25lQXJyYXkoYXJyOiBhbnkpIHtcclxuICAgICAgICBsZXQgaSwgY29weTtcclxuXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhcnIpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcnIgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdDYW5ub3QgY2xvbmUgYXJyYXkgY29udGFpbmluZyBhbiBvYmplY3QhJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZUdyb3VwSW5mbyhpdGVtOiBhbnkpIHtcclxuICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBrZXkgPSB0aGlzLnNldHRpbmdzLmdyb3VwQnk7XHJcbiAgICAgICAgdGhpcy5ncm91cGVkRGF0YS5mb3JFYWNoKChvYmo6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY250ID0gMDtcclxuICAgICAgICAgICAgaWYgKG9iai5ncnBUaXRsZSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmxpc3QuZm9yRWFjaCgoZWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY250Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqLmxpc3QgJiYgKGNudCA9PT0gb2JqLmxpc3QubGVuZ3RoKSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChvYmoubGlzdCAmJiAoY250ICE9IG9iai5saXN0Lmxlbmd0aCkgJiYgKGl0ZW1ba2V5XSA9PSBvYmpba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5ncm91cENhY2hlZEl0ZW1zLmZvckVhY2goKG9iajogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSAwO1xyXG4gICAgICAgICAgICBpZiAob2JqLmdycFRpdGxlICYmIChpdGVtW2tleV0gPT0gb2JqW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoubGlzdC5mb3JFYWNoKChlbDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYmoubGlzdCAmJiAoY250ID09PSBvYmoubGlzdC5sZW5ndGgpICYmIChpdGVtW2tleV0gPT0gb2JqW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG9iai5saXN0ICYmIChjbnQgIT0gb2JqLmxpc3QubGVuZ3RoKSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHRyYW5zZm9ybURhdGEoYXJyOiBBcnJheTxhbnk+LCBmaWVsZDogYW55KTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBlZE9iajogYW55ID0gYXJyLnJlZHVjZSgocHJldjogYW55LCBjdXI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXByZXZbY3VyW2ZpZWxkXV0pIHtcclxuICAgICAgICAgICAgICAgIHByZXZbY3VyW2ZpZWxkXV0gPSBbY3VyXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByZXZbY3VyW2ZpZWxkXV0ucHVzaChjdXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcmV2O1xyXG4gICAgICAgIH0sIHt9KTtcclxuICAgICAgICBjb25zdCB0ZW1wQXJyOiBhbnkgPSBbXTtcclxuICAgICAgICBPYmplY3Qua2V5cyhncm91cGVkT2JqKS5tYXAoKHg6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgb2JqOiBhbnkgPSB7fTtcclxuICAgICAgICAgICAgbGV0IGRpc2FibGVkQ2hpbGRyZW5zID0gW107XHJcbiAgICAgICAgICAgIG9ialtcImdycFRpdGxlXCJdID0gdHJ1ZTtcclxuICAgICAgICAgICAgb2JqW3RoaXMuc2V0dGluZ3MubGFiZWxLZXldID0geDtcclxuICAgICAgICAgICAgb2JqW3RoaXMuc2V0dGluZ3MuZ3JvdXBCeV0gPSB4O1xyXG4gICAgICAgICAgICBvYmpbJ3NlbGVjdGVkJ10gPSBmYWxzZTtcclxuICAgICAgICAgICAgb2JqWydsaXN0J10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IGNudCA9IDA7XHJcbiAgICAgICAgICAgIGdyb3VwZWRPYmpbeF0uZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtWydsaXN0J10gPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0Rpc2FibGVkSXRlbVByZXNlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkQ2hpbGRyZW5zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvYmoubGlzdC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZChpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGNudCA9PSBvYmoubGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgY3VycmVudCBncm91cCBpdGVtJ3MgYWxsIGNoaWxkcmVucyBhcmUgZGlzYWJsZWQgb3Igbm90XHJcbiAgICAgICAgICAgIG9ialsnZGlzYWJsZWQnXSA9IGRpc2FibGVkQ2hpbGRyZW5zLmxlbmd0aCA9PT0gZ3JvdXBlZE9ialt4XS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRlbXBBcnIucHVzaChvYmopO1xyXG4gICAgICAgICAgICAvLyBvYmoubGlzdC5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIHRlbXBBcnIucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZmlsdGVySW5maW5pdGVMaXN0KGV2dDogYW55KSB7XHJcbiAgICAgICAgbGV0IGZpbHRlcmVkRWxlbXM6IEFycmF5PGFueT4gPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuY2FjaGVkSXRlbXMuc2xpY2UoKTtcclxuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IHRoaXMuY2FjaGVkSXRlbXMuc2xpY2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgoZXZ0ICE9IG51bGwgfHwgZXZ0ICE9ICcnKSAmJiAhdGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNlYXJjaEJ5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSAwOyB0IDwgdGhpcy5zZXR0aW5ncy5zZWFyY2hCeS5sZW5ndGg7IHQrKykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhLmZpbHRlcigoZWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxbdGhpcy5zZXR0aW5ncy5zZWFyY2hCeVt0XS50b1N0cmluZygpXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihldnQudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVsZW1zLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YS5maWx0ZXIoZnVuY3Rpb24gKGVsOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbFtwcm9wXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihldnQudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVsZW1zLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSBmaWx0ZXJlZEVsZW1zO1xyXG4gICAgICAgICAgICB0aGlzLmluZmluaXRlRmlsdGVyTGVuZ3RoID0gdGhpcy52aXJ0dWFsZGF0YS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChldnQudG9TdHJpbmcoKSAhPSAnJyAmJiB0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YS5maWx0ZXIoZnVuY3Rpb24gKGVsOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbC5oYXNPd25Qcm9wZXJ0eSgnZ3JwVGl0bGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWxlbXMucHVzaChlbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbFtwcm9wXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihldnQudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVsZW1zLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSBmaWx0ZXJlZEVsZW1zO1xyXG4gICAgICAgICAgICB0aGlzLmluZmluaXRlRmlsdGVyTGVuZ3RoID0gdGhpcy5ncm91cGVkRGF0YS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGV2dC50b1N0cmluZygpID09ICcnICYmIHRoaXMuY2FjaGVkSXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSB0aGlzLmNhY2hlZEl0ZW1zO1xyXG4gICAgICAgICAgICB0aGlzLmluZmluaXRlRmlsdGVyTGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsZXIucmVmcmVzaCgpO1xyXG4gICAgfVxyXG4gICAgcmVzZXRJbmZpbml0ZVNlYXJjaCgpIHtcclxuICAgICAgICB0aGlzLmZpbHRlciA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5pc0luZmluaXRlRmlsdGVyU2VsZWN0QWxsID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IFtdO1xyXG4gICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSB0aGlzLmNhY2hlZEl0ZW1zO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLmdyb3VwQ2FjaGVkSXRlbXM7XHJcbiAgICAgICAgdGhpcy5pbmZpbml0ZUZpbHRlckxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbiAgICBvblNjcm9sbEVuZChlOiBhbnkpIHtcclxuICAgICAgICBpZiAoZS5lbmRJbmRleCA9PT0gdGhpcy5kYXRhLmxlbmd0aCAtIDEgfHwgZS5zdGFydEluZGV4ID09PSAwKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uU2Nyb2xsVG9FbmQuZW1pdChlKTtcclxuXHJcbiAgICB9XHJcbiAgICBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgc2VsZWN0R3JvdXAoaXRlbTogYW55KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICBpdGVtLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGl0ZW0ubGlzdC5mb3JFYWNoKChvYmo6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChvYmopO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVHcm91cEluZm8oaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMub25Hcm91cFNlbGVjdC5lbWl0KGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGl0ZW0ubGlzdC5mb3JFYWNoKChvYmo6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0ZWQob2JqKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQob2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdyb3VwSW5mbyhpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5vbkdyb3VwRGVTZWxlY3QuZW1pdChpdGVtKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuICAgIGFkZEZpbHRlck5ld0l0ZW0oKSB7XHJcbiAgICAgICAgdGhpcy5vbkFkZEZpbHRlck5ld0l0ZW0uZW1pdCh0aGlzLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5maWx0ZXJQaXBlID0gbmV3IExpc3RGaWx0ZXJQaXBlKHRoaXMuZHMpO1xyXG4gICAgICAgIHRoaXMuZmlsdGVyUGlwZS50cmFuc2Zvcm0odGhpcy5kYXRhLCB0aGlzLmZpbHRlciwgdGhpcy5zZXR0aW5ncy5zZWFyY2hCeSk7XHJcbiAgICB9XHJcbiAgICBjYWxjdWxhdGVEcm9wZG93bkRpcmVjdGlvbigpIHtcclxuICAgICAgICBsZXQgc2hvdWxkT3BlblRvd2FyZHNUb3AgPSB0aGlzLnNldHRpbmdzLnBvc2l0aW9uID09ICd0b3AnO1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qb3NpdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBkcm9wZG93bkhlaWdodCA9IHRoaXMuZHJvcGRvd25MaXN0RWxlbS5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZExpc3RCb3VuZHMgPSB0aGlzLnNlbGVjdGVkTGlzdEVsZW0ubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNwYWNlT25Ub3A6IG51bWJlciA9IHNlbGVjdGVkTGlzdEJvdW5kcy50b3A7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwYWNlT25Cb3R0b206IG51bWJlciA9IHZpZXdwb3J0SGVpZ2h0IC0gc2VsZWN0ZWRMaXN0Qm91bmRzLnRvcDtcclxuICAgICAgICAgICAgaWYgKHNwYWNlT25Cb3R0b20gPCBzcGFjZU9uVG9wICYmIGRyb3Bkb3duSGVpZ2h0IDwgc3BhY2VPblRvcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuVG93YXJkc1RvcCh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblRvd2FyZHNUb3AoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEtlZXAgcHJlZmVyZW5jZSBpZiB0aGVyZSBpcyBub3QgZW5vdWdoIHNwYWNlIG9uIGVpdGhlciB0aGUgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAvKiBcdFx0XHRpZiAoc3BhY2VPblRvcCB8fCBzcGFjZU9uQm90dG9tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hvdWxkT3BlblRvd2FyZHNUb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRPcGVuVG93YXJkc1RvcCA9IHNwYWNlT25Ub3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZE9wZW5Ub3dhcmRzVG9wID0gIXNwYWNlT25Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gKi9cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgb3BlblRvd2FyZHNUb3AodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsdWUgJiYgdGhpcy5zZWxlY3RlZExpc3RFbGVtLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd25MaXN0WU9mZnNldCA9IDE1ICsgdGhpcy5zZWxlY3RlZExpc3RFbGVtLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd25MaXN0WU9mZnNldCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXJTZWxlY3Rpb24oZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMuZm9yRWFjaCgob2JqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jbGVhclNlYXJjaCgpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMub25EZVNlbGVjdEFsbC5lbWl0KHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgVmlydHVhbFNjcm9sbGVyTW9kdWxlXSxcclxuICAgIGRlY2xhcmF0aW9uczogW0FuZ3VsYXJNdWx0aVNlbGVjdCwgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLCBTY3JvbGxEaXJlY3RpdmUsIHN0eWxlRGlyZWN0aXZlLCBMaXN0RmlsdGVyUGlwZSwgSXRlbSwgVGVtcGxhdGVSZW5kZXJlciwgQmFkZ2UsIFNlYXJjaCwgc2V0UG9zaXRpb24sIENJY29uXSxcclxuICAgIGV4cG9ydHM6IFtBbmd1bGFyTXVsdGlTZWxlY3QsIENsaWNrT3V0c2lkZURpcmVjdGl2ZSwgU2Nyb2xsRGlyZWN0aXZlLCBzdHlsZURpcmVjdGl2ZSwgTGlzdEZpbHRlclBpcGUsIEl0ZW0sIFRlbXBsYXRlUmVuZGVyZXIsIEJhZGdlLCBTZWFyY2gsIHNldFBvc2l0aW9uLCBDSWNvbl0sXHJcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJNdWx0aVNlbGVjdE1vZHVsZSB7IH1cclxuIl19