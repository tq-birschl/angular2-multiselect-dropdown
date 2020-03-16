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
export var DROPDOWN_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    function () { return AngularMultiSelect; })),
    multi: true
};
/** @type {?} */
export var DROPDOWN_CONTROL_VALIDATION = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef((/**
     * @return {?}
     */
    function () { return AngularMultiSelect; })),
    multi: true,
};
/** @type {?} */
var noop = (/**
 * @return {?}
 */
function () {
});
var ɵ0 = noop;
var AngularMultiSelect = /** @class */ (function () {
    function AngularMultiSelect(_elementRef, cdr, ds) {
        var _this = this;
        this._elementRef = _elementRef;
        this.cdr = cdr;
        this.ds = ds;
        this.onSelect = new EventEmitter();
        this.onSearch = new EventEmitter();
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
        function (term) { return term; }))).subscribe((/**
         * @param {?} val
         * @return {?}
         */
        function (val) {
            _this.filterInfiniteList(val);
        }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    AngularMultiSelect.prototype.onEscapeDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.settings.escapeToClose) {
            this.closeDropdown();
        }
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.settings = Object.assign(this.defaultSettings, this.settings);
        this.cachedItems = this.cloneArray(this.data);
        if (this.settings.position == 'top') {
            setTimeout((/**
             * @return {?}
             */
            function () {
                _this.selectedListHeight = { val: 0 };
                _this.selectedListHeight.val = _this.selectedListElem.nativeElement.clientHeight;
            }));
        }
        this.subscription = this.ds.getData().subscribe((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            if (data) {
                /** @type {?} */
                var len_1 = 0;
                data.forEach((/**
                 * @param {?} obj
                 * @param {?} i
                 * @return {?}
                 */
                function (obj, i) {
                    if (obj.disabled) {
                        _this.isDisabledItemPresent = true;
                    }
                    if (!obj.hasOwnProperty('grpTitle')) {
                        len_1++;
                    }
                }));
                _this.filterLength = len_1;
                _this.onFilterChange(data);
            }
        }));
        setTimeout((/**
         * @return {?}
         */
        function () {
            _this.calculateDropdownDirection();
        }));
        this.virtualScroollInit = false;
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    AngularMultiSelect.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
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
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this.selectedItems) {
            if (this.selectedItems.length == 0 || this.data.length == 0 || this.selectedItems.length < this.data.length) {
                this.isSelectAll = false;
            }
        }
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        if (this.settings.lazyLoading) {
            // this._elementRef.nativeElement.getElementsByClassName("lazyContainer")[0].addEventListener('scroll', this.onScroll.bind(this));
        }
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.ngAfterViewChecked = /**
     * @return {?}
     */
    function () {
        if (this.selectedListElem.nativeElement.clientHeight && this.settings.position == 'top' && this.selectedListHeight) {
            this.selectedListHeight.val = this.selectedListElem.nativeElement.clientHeight;
            this.cdr.detectChanges();
        }
    };
    /**
     * @param {?} item
     * @param {?} index
     * @param {?} evt
     * @return {?}
     */
    AngularMultiSelect.prototype.onItemClick = /**
     * @param {?} item
     * @param {?} index
     * @param {?} evt
     * @return {?}
     */
    function (item, index, evt) {
        if (item.disabled) {
            return false;
        }
        if (this.settings.disabled) {
            return false;
        }
        /** @type {?} */
        var found = this.isSelected(item);
        /** @type {?} */
        var limit = this.selectedItems.length < this.settings.limitSelection ? true : false;
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
    };
    /**
     * @param {?} c
     * @return {?}
     */
    AngularMultiSelect.prototype.validate = /**
     * @param {?} c
     * @return {?}
     */
    function (c) {
        return null;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    AngularMultiSelect.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
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
    };
    //From ControlValueAccessor interface
    //From ControlValueAccessor interface
    /**
     * @param {?} fn
     * @return {?}
     */
    AngularMultiSelect.prototype.registerOnChange = 
    //From ControlValueAccessor interface
    /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onChangeCallback = fn;
    };
    //From ControlValueAccessor interface
    //From ControlValueAccessor interface
    /**
     * @param {?} fn
     * @return {?}
     */
    AngularMultiSelect.prototype.registerOnTouched = 
    //From ControlValueAccessor interface
    /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onTouchedCallback = fn;
    };
    /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    AngularMultiSelect.prototype.trackByFn = /**
     * @param {?} index
     * @param {?} item
     * @return {?}
     */
    function (index, item) {
        return item[this.settings.primaryKey];
    };
    /**
     * @param {?} clickedItem
     * @return {?}
     */
    AngularMultiSelect.prototype.isSelected = /**
     * @param {?} clickedItem
     * @return {?}
     */
    function (clickedItem) {
        var _this = this;
        if (clickedItem.disabled) {
            return false;
        }
        /** @type {?} */
        var found = false;
        this.selectedItems && this.selectedItems.forEach((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            if (clickedItem[_this.settings.primaryKey] === item[_this.settings.primaryKey]) {
                found = true;
            }
        }));
        return found;
    };
    /**
     * @param {?} item
     * @return {?}
     */
    AngularMultiSelect.prototype.addSelected = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
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
    };
    /**
     * @param {?} clickedItem
     * @return {?}
     */
    AngularMultiSelect.prototype.removeSelected = /**
     * @param {?} clickedItem
     * @return {?}
     */
    function (clickedItem) {
        var _this = this;
        this.selectedItems && this.selectedItems.forEach((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            if (clickedItem[_this.settings.primaryKey] === item[_this.settings.primaryKey]) {
                _this.selectedItems.splice(_this.selectedItems.indexOf(item), 1);
            }
        }));
        this.onChangeCallback(this.selectedItems);
        this.onTouchedCallback(this.selectedItems);
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    AngularMultiSelect.prototype.toggleDropdown = /**
     * @param {?} evt
     * @return {?}
     */
    function (evt) {
        var _this = this;
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = !this.isActive;
        if (this.isActive) {
            if (this.settings.searchAutofocus && this.searchInput && this.settings.enableSearchFilter && !this.searchTempl) {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this.searchInput.nativeElement.focus();
                }), 0);
            }
            if (this.settings.searchAutofocus && !this.searchInput && this.settings.enableSearchFilter && this.searchTempl) {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this._elementRef.nativeElement.getElementsByClassName("list-filter")[0].getElementsByTagName("input")[0].focus();
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
        function () {
            _this.calculateDropdownDirection();
        }), 0);
        if (this.settings.lazyLoading) {
            this.virtualdata = this.data;
            this.virtualScroollInit = true;
        }
        evt.preventDefault();
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.openDropdown = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.settings.disabled) {
            return false;
        }
        this.isActive = true;
        if (this.settings.searchAutofocus && this.searchInput && this.settings.enableSearchFilter && !this.searchTempl) {
            setTimeout((/**
             * @return {?}
             */
            function () {
                _this.searchInput.nativeElement.focus();
            }), 0);
        }
        this.onOpen.emit(true);
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.closeDropdown = /**
     * @return {?}
     */
    function () {
        if (this.searchInput && this.settings.lazyLoading) {
            this.searchInput.nativeElement.value = "";
        }
        if (this.searchInput) {
            this.searchInput.nativeElement.value = "";
        }
        this.filter = "";
        this.isActive = false;
        this.onClose.emit(false);
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.closeDropdownOnClickOut = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.toggleSelectAll = /**
     * @return {?}
     */
    function () {
        if (!this.isSelectAll) {
            this.selectedItems = [];
            if (this.settings.groupBy) {
                this.groupedData.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                function (obj) {
                    obj.selected = !obj.disabled;
                }));
                this.groupCachedItems.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                function (obj) {
                    obj.selected = !obj.disabled;
                }));
            }
            // this.selectedItems = this.data.slice();
            this.selectedItems = this.data.filter((/**
             * @param {?} individualData
             * @return {?}
             */
            function (individualData) { return !individualData.disabled; }));
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
                function (obj) {
                    obj.selected = false;
                }));
                this.groupCachedItems.forEach((/**
                 * @param {?} obj
                 * @return {?}
                 */
                function (obj) {
                    obj.selected = false;
                }));
            }
            this.selectedItems = [];
            this.isSelectAll = false;
            this.onChangeCallback(this.selectedItems);
            this.onTouchedCallback(this.selectedItems);
            this.onDeSelectAll.emit(this.selectedItems);
        }
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.filterGroupedList = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.filter == "" || this.filter == null) {
            this.clearSearch();
            return;
        }
        this.groupedData = this.cloneArray(this.groupCachedItems);
        this.groupedData = this.groupedData.filter((/**
         * @param {?} obj
         * @return {?}
         */
        function (obj) {
            /** @type {?} */
            var arr = [];
            if (obj[_this.settings.labelKey].toLowerCase().indexOf(_this.filter.toLowerCase()) > -1) {
                arr = obj.list;
            }
            else {
                arr = obj.list.filter((/**
                 * @param {?} t
                 * @return {?}
                 */
                function (t) {
                    return t[_this.settings.labelKey].toLowerCase().indexOf(_this.filter.toLowerCase()) > -1;
                }));
            }
            obj.list = arr;
            if (obj[_this.settings.labelKey].toLowerCase().indexOf(_this.filter.toLowerCase()) > -1) {
                return arr;
            }
            else {
                return arr.some((/**
                 * @param {?} cat
                 * @return {?}
                 */
                function (cat) {
                    return cat[_this.settings.labelKey].toLowerCase().indexOf(_this.filter.toLowerCase()) > -1;
                }));
            }
        }));
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.toggleFilterSelectAll = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.isFilterSelectAll) {
            /** @type {?} */
            var added_1 = [];
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
                function (el) {
                    if (!_this.isSelected(el) && !el.hasOwnProperty('grpTitle')) {
                        _this.addSelected(el);
                        added_1.push(el);
                    }
                }));
            }
            else {
                this.ds.getFilteredData().forEach((/**
                 * @param {?} item
                 * @return {?}
                 */
                function (item) {
                    if (!_this.isSelected(item)) {
                        _this.addSelected(item);
                        added_1.push(item);
                    }
                }));
            }
            this.isFilterSelectAll = true;
            this.onFilterSelectAll.emit(added_1);
        }
        else {
            /** @type {?} */
            var removed_1 = [];
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
                function (el) {
                    if (_this.isSelected(el)) {
                        _this.removeSelected(el);
                        removed_1.push(el);
                    }
                }));
            }
            else {
                this.ds.getFilteredData().forEach((/**
                 * @param {?} item
                 * @return {?}
                 */
                function (item) {
                    if (_this.isSelected(item)) {
                        _this.removeSelected(item);
                        removed_1.push(item);
                    }
                }));
            }
            this.isFilterSelectAll = false;
            this.onFilterDeSelectAll.emit(removed_1);
        }
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.toggleInfiniteFilterSelectAll = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.isInfiniteFilterSelectAll) {
            this.virtualdata.forEach((/**
             * @param {?} item
             * @return {?}
             */
            function (item) {
                if (!_this.isSelected(item)) {
                    _this.addSelected(item);
                }
            }));
            this.isInfiniteFilterSelectAll = true;
        }
        else {
            this.virtualdata.forEach((/**
             * @param {?} item
             * @return {?}
             */
            function (item) {
                if (_this.isSelected(item)) {
                    _this.removeSelected(item);
                }
            }));
            this.isInfiniteFilterSelectAll = false;
        }
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.clearSearch = /**
     * @return {?}
     */
    function () {
        if (this.settings.groupBy) {
            this.groupedData = [];
            this.groupedData = this.cloneArray(this.groupCachedItems);
        }
        this.filter = "";
        this.isFilterSelectAll = false;
    };
    /**
     * @param {?} data
     * @return {?}
     */
    AngularMultiSelect.prototype.onFilterChange = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        if (this.filter && this.filter == "" || data.length == 0) {
            this.isFilterSelectAll = false;
        }
        /** @type {?} */
        var cnt = 0;
        data.forEach((/**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            if (!item.hasOwnProperty('grpTitle') && _this.isSelected(item)) {
                cnt++;
            }
        }));
        if (cnt > 0 && this.filterLength == cnt) {
            this.isFilterSelectAll = true;
        }
        else if (cnt > 0 && this.filterLength != cnt) {
            this.isFilterSelectAll = false;
        }
        this.onSearch.emit(this.filter);
        this.cdr.detectChanges();
    };
    /**
     * @param {?} arr
     * @return {?}
     */
    AngularMultiSelect.prototype.cloneArray = /**
     * @param {?} arr
     * @return {?}
     */
    function (arr) {
        /** @type {?} */
        var i;
        /** @type {?} */
        var copy;
        if (Array.isArray(arr)) {
            return JSON.parse(JSON.stringify(arr));
        }
        else if (typeof arr === 'object') {
            throw 'Cannot clone array containing an object!';
        }
        else {
            return arr;
        }
    };
    /**
     * @param {?} item
     * @return {?}
     */
    AngularMultiSelect.prototype.updateGroupInfo = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        var _this = this;
        if (item.disabled) {
            return false;
        }
        /** @type {?} */
        var key = this.settings.groupBy;
        this.groupedData.forEach((/**
         * @param {?} obj
         * @return {?}
         */
        function (obj) {
            /** @type {?} */
            var cnt = 0;
            if (obj.grpTitle && (item[key] == obj[key])) {
                if (obj.list) {
                    obj.list.forEach((/**
                     * @param {?} el
                     * @return {?}
                     */
                    function (el) {
                        if (_this.isSelected(el)) {
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
        function (obj) {
            /** @type {?} */
            var cnt = 0;
            if (obj.grpTitle && (item[key] == obj[key])) {
                if (obj.list) {
                    obj.list.forEach((/**
                     * @param {?} el
                     * @return {?}
                     */
                    function (el) {
                        if (_this.isSelected(el)) {
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
    };
    /**
     * @param {?} arr
     * @param {?} field
     * @return {?}
     */
    AngularMultiSelect.prototype.transformData = /**
     * @param {?} arr
     * @param {?} field
     * @return {?}
     */
    function (arr, field) {
        var _this = this;
        /** @type {?} */
        var groupedObj = arr.reduce((/**
         * @param {?} prev
         * @param {?} cur
         * @return {?}
         */
        function (prev, cur) {
            if (!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            }
            else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }), {});
        /** @type {?} */
        var tempArr = [];
        Object.keys(groupedObj).map((/**
         * @param {?} x
         * @return {?}
         */
        function (x) {
            /** @type {?} */
            var obj = {};
            /** @type {?} */
            var disabledChildrens = [];
            obj["grpTitle"] = true;
            obj[_this.settings.labelKey] = x;
            obj[_this.settings.groupBy] = x;
            obj['selected'] = false;
            obj['list'] = [];
            /** @type {?} */
            var cnt = 0;
            groupedObj[x].forEach((/**
             * @param {?} item
             * @return {?}
             */
            function (item) {
                item['list'] = [];
                if (item.disabled) {
                    _this.isDisabledItemPresent = true;
                    disabledChildrens.push(item);
                }
                obj.list.push(item);
                if (_this.isSelected(item)) {
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
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    AngularMultiSelect.prototype.filterInfiniteList = /**
     * @param {?} evt
     * @return {?}
     */
    function (evt) {
        var _this = this;
        /** @type {?} */
        var filteredElems = [];
        if (this.settings.groupBy) {
            this.groupedData = this.groupCachedItems.slice();
        }
        else {
            this.data = this.cachedItems.slice();
            this.virtualdata = this.cachedItems.slice();
        }
        if ((evt != null || evt != '') && !this.settings.groupBy) {
            if (this.settings.searchBy.length > 0) {
                var _loop_1 = function (t) {
                    this_1.virtualdata.filter((/**
                     * @param {?} el
                     * @return {?}
                     */
                    function (el) {
                        if (el[_this.settings.searchBy[t].toString()].toString().toLowerCase().indexOf(evt.toString().toLowerCase()) >= 0) {
                            filteredElems.push(el);
                        }
                    }));
                };
                var this_1 = this;
                for (var t = 0; t < this.settings.searchBy.length; t++) {
                    _loop_1(t);
                }
            }
            else {
                this.virtualdata.filter((/**
                 * @param {?} el
                 * @return {?}
                 */
                function (el) {
                    for (var prop in el) {
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
                    for (var prop in el) {
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
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.resetInfiniteSearch = /**
     * @return {?}
     */
    function () {
        this.filter = "";
        this.isInfiniteFilterSelectAll = false;
        this.virtualdata = [];
        this.virtualdata = this.cachedItems;
        this.groupedData = this.groupCachedItems;
        this.infiniteFilterLength = 0;
    };
    /**
     * @param {?} e
     * @return {?}
     */
    AngularMultiSelect.prototype.onScrollEnd = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (e.endIndex === this.data.length - 1 || e.startIndex === 0) {
        }
        this.onScrollToEnd.emit(e);
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    /**
     * @param {?} item
     * @return {?}
     */
    AngularMultiSelect.prototype.selectGroup = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        var _this = this;
        if (item.disabled) {
            return false;
        }
        if (item.selected) {
            item.selected = false;
            item.list.forEach((/**
             * @param {?} obj
             * @return {?}
             */
            function (obj) {
                _this.removeSelected(obj);
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
            function (obj) {
                if (!_this.isSelected(obj)) {
                    _this.addSelected(obj);
                }
            }));
            this.updateGroupInfo(item);
            this.onGroupDeSelect.emit(item);
        }
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.addFilterNewItem = /**
     * @return {?}
     */
    function () {
        this.onAddFilterNewItem.emit(this.filter);
        this.filterPipe = new ListFilterPipe(this.ds);
        this.filterPipe.transform(this.data, this.filter, this.settings.searchBy);
    };
    /**
     * @return {?}
     */
    AngularMultiSelect.prototype.calculateDropdownDirection = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var shouldOpenTowardsTop = this.settings.position == 'top';
        if (this.settings.autoPosition) {
            /** @type {?} */
            var dropdownHeight = this.dropdownListElem.nativeElement.clientHeight;
            /** @type {?} */
            var viewportHeight = document.documentElement.clientHeight;
            /** @type {?} */
            var selectedListBounds = this.selectedListElem.nativeElement.getBoundingClientRect();
            /** @type {?} */
            var spaceOnTop = selectedListBounds.top;
            /** @type {?} */
            var spaceOnBottom = viewportHeight - selectedListBounds.top;
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
    };
    /**
     * @param {?} value
     * @return {?}
     */
    AngularMultiSelect.prototype.openTowardsTop = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value && this.selectedListElem.nativeElement.clientHeight) {
            this.dropdownListYOffset = 15 + this.selectedListElem.nativeElement.clientHeight;
        }
        else {
            this.dropdownListYOffset = 0;
        }
    };
    /**
     * @param {?} e
     * @return {?}
     */
    AngularMultiSelect.prototype.clearSelection = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        if (this.settings.groupBy) {
            this.groupCachedItems.forEach((/**
             * @param {?} obj
             * @return {?}
             */
            function (obj) {
                obj.selected = false;
            }));
        }
        this.clearSearch();
        this.selectedItems = [];
        this.onDeSelectAll.emit(this.selectedItems);
    };
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
    AngularMultiSelect.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: DataService }
    ]; };
    AngularMultiSelect.propDecorators = {
        data: [{ type: Input }],
        settings: [{ type: Input }],
        loading: [{ type: Input }],
        onSelect: [{ type: Output, args: ['onSelect',] }],
        onSearch: [{ type: Output, args: ['onSearch',] }],
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
    return AngularMultiSelect;
}());
export { AngularMultiSelect };
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
    AngularMultiSelect.prototype.onSearch;
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
var AngularMultiSelectModule = /** @class */ (function () {
    function AngularMultiSelectModule() {
    }
    AngularMultiSelectModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, FormsModule, VirtualScrollerModule],
                    declarations: [AngularMultiSelect, ClickOutsideDirective, ScrollDirective, styleDirective, ListFilterPipe, Item, TemplateRenderer, Badge, Search, setPosition, CIcon],
                    exports: [AngularMultiSelect, ClickOutsideDirective, ScrollDirective, styleDirective, ListFilterPipe, Item, TemplateRenderer, Badge, Search, setPosition, CIcon],
                    providers: [DataService]
                },] }
    ];
    return AngularMultiSelectModule;
}());
export { AngularMultiSelectModule };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlzZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItbXVsdGlzZWxlY3QtZHJvcGRvd24vIiwic291cmNlcyI6WyJsaWIvbXVsdGlzZWxlY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLFlBQVksRUFBc0MsUUFBUSxFQUE0QixpQkFBaUIsRUFBb0IsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFzQyxNQUFNLGVBQWUsQ0FBQztBQUNsVCxPQUFPLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUF3QixhQUFhLEVBQTBCLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0gsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVsRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDM0UsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBZ0IsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2xHLE9BQU8sRUFBTyxZQUFZLEVBQUUsb0JBQW9CLEVBQWEsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBR3pGLE1BQU0sS0FB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SUFNd0MsQ0FBQzs7Z0JBTnhDLFFBQVEsU0FBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLHFCQUFxQixDQUFDO29CQUMzRCxZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDO29CQUNySyxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDO29CQUNoSyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUM7aUJBQzNCOztJQUN1QywrQkFBQztDQUFBLEFBTnpDLElBTXlDO1NBQTVCLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBIb3N0TGlzdGVuZXIsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBPbkRlc3Ryb3ksIE5nTW9kdWxlLCBTaW1wbGVDaGFuZ2VzLCBPbkNoYW5nZXMsIENoYW5nZURldGVjdG9yUmVmLCBBZnRlclZpZXdDaGVja2VkLCBWaWV3RW5jYXBzdWxhdGlvbiwgQ29udGVudENoaWxkLCBWaWV3Q2hpbGQsIGZvcndhcmRSZWYsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgTkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxJREFUT1JTLCBWYWxpZGF0b3IsIEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBNeUV4Y2VwdGlvbiB9IGZyb20gJy4vbXVsdGlzZWxlY3QubW9kZWwnO1xyXG5pbXBvcnQgeyBEcm9wZG93blNldHRpbmdzIH0gZnJvbSAnLi9tdWx0aXNlbGVjdC5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBDbGlja091dHNpZGVEaXJlY3RpdmUsIFNjcm9sbERpcmVjdGl2ZSwgc3R5bGVEaXJlY3RpdmUsIHNldFBvc2l0aW9uIH0gZnJvbSAnLi9jbGlja091dHNpZGUnO1xyXG5pbXBvcnQgeyBMaXN0RmlsdGVyUGlwZSB9IGZyb20gJy4vbGlzdC1maWx0ZXInO1xyXG5pbXBvcnQgeyBJdGVtLCBCYWRnZSwgU2VhcmNoLCBUZW1wbGF0ZVJlbmRlcmVyLCBDSWNvbiB9IGZyb20gJy4vbWVudS1pdGVtJztcclxuaW1wb3J0IHsgRGF0YVNlcnZpY2UgfSBmcm9tICcuL211bHRpc2VsZWN0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24sIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgVmlydHVhbFNjcm9sbGVyTW9kdWxlLCBWaXJ0dWFsU2Nyb2xsZXJDb21wb25lbnQgfSBmcm9tICcuL3ZpcnR1YWwtc2Nyb2xsL3ZpcnR1YWwtc2Nyb2xsJztcclxuaW1wb3J0IHsgbWFwLCBkZWJvdW5jZVRpbWUsIGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBzd2l0Y2hNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgVGhyb3dTdG10IH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IERST1BET1dOX0NPTlRST0xfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcclxuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQW5ndWxhck11bHRpU2VsZWN0KSxcclxuICAgIG11bHRpOiB0cnVlXHJcbn07XHJcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9DT05UUk9MX1ZBTElEQVRJT046IGFueSA9IHtcclxuICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXHJcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBBbmd1bGFyTXVsdGlTZWxlY3QpLFxyXG4gICAgbXVsdGk6IHRydWUsXHJcbn1cclxuY29uc3Qgbm9vcCA9ICgpID0+IHtcclxufTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdhbmd1bGFyMi1tdWx0aXNlbGVjdCcsXHJcbiAgICB0ZW1wbGF0ZVVybDogJy4vbXVsdGlzZWxlY3QuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgaG9zdDogeyAnW2NsYXNzXSc6ICdkZWZhdWx0U2V0dGluZ3MuY2xhc3NlcycgfSxcclxuICAgIHN0eWxlVXJsczogWycuL211bHRpc2VsZWN0LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFtEUk9QRE9XTl9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SLCBEUk9QRE9XTl9DT05UUk9MX1ZBTElEQVRJT05dLFxyXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFyTXVsdGlTZWxlY3QgaW1wbGVtZW50cyBPbkluaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkNoYW5nZXMsIFZhbGlkYXRvciwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95IHtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgZGF0YTogQXJyYXk8YW55PjtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0dGluZ3M6IERyb3Bkb3duU2V0dGluZ3M7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIGxvYWRpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgQE91dHB1dCgnb25TZWxlY3QnKVxyXG4gICAgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblx0XHJcblx0QE91dHB1dCgnb25TZWFyY2gnKVxyXG4gICAgb25TZWFyY2g6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25EZVNlbGVjdCcpXHJcbiAgICBvbkRlU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uU2VsZWN0QWxsJylcclxuICAgIG9uU2VsZWN0QWxsOiBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4gPSBuZXcgRXZlbnRFbWl0dGVyPEFycmF5PGFueT4+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25EZVNlbGVjdEFsbCcpXHJcbiAgICBvbkRlU2VsZWN0QWxsOiBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4gPSBuZXcgRXZlbnRFbWl0dGVyPEFycmF5PGFueT4+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25PcGVuJylcclxuICAgIG9uT3BlbjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvbkNsb3NlJylcclxuICAgIG9uQ2xvc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25TY3JvbGxUb0VuZCcpXHJcbiAgICBvblNjcm9sbFRvRW5kOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uRmlsdGVyU2VsZWN0QWxsJylcclxuICAgIG9uRmlsdGVyU2VsZWN0QWxsOiBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4gPSBuZXcgRXZlbnRFbWl0dGVyPEFycmF5PGFueT4+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25GaWx0ZXJEZVNlbGVjdEFsbCcpXHJcbiAgICBvbkZpbHRlckRlU2VsZWN0QWxsOiBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4gPSBuZXcgRXZlbnRFbWl0dGVyPEFycmF5PGFueT4+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25BZGRGaWx0ZXJOZXdJdGVtJylcclxuICAgIG9uQWRkRmlsdGVyTmV3SXRlbTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvbkdyb3VwU2VsZWN0JylcclxuICAgIG9uR3JvdXBTZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25Hcm91cERlU2VsZWN0JylcclxuICAgIG9uR3JvdXBEZVNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBAQ29udGVudENoaWxkKEl0ZW0sIHsgc3RhdGljOiBmYWxzZSB9KSBpdGVtVGVtcGw6IEl0ZW07XHJcbiAgICBAQ29udGVudENoaWxkKEJhZGdlLCB7IHN0YXRpYzogZmFsc2UgfSkgYmFkZ2VUZW1wbDogQmFkZ2U7XHJcbiAgICBAQ29udGVudENoaWxkKFNlYXJjaCwgeyBzdGF0aWM6IGZhbHNlIH0pIHNlYXJjaFRlbXBsOiBTZWFyY2g7XHJcblxyXG5cclxuICAgIEBWaWV3Q2hpbGQoJ3NlYXJjaElucHV0JywgeyBzdGF0aWM6IGZhbHNlIH0pIHNlYXJjaElucHV0OiBFbGVtZW50UmVmO1xyXG4gICAgQFZpZXdDaGlsZCgnc2VsZWN0ZWRMaXN0JywgeyBzdGF0aWM6IGZhbHNlIH0pIHNlbGVjdGVkTGlzdEVsZW06IEVsZW1lbnRSZWY7XHJcbiAgICBAVmlld0NoaWxkKCdkcm9wZG93bkxpc3QnLCB7IHN0YXRpYzogZmFsc2UgfSkgZHJvcGRvd25MaXN0RWxlbTogRWxlbWVudFJlZjtcclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXl1cC5lc2NhcGUnLCBbJyRldmVudCddKVxyXG4gICAgb25Fc2NhcGVEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZXNjYXBlVG9DbG9zZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlRHJvcGRvd24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB2aXJ0dWFsZGF0YTogYW55ID0gW107XHJcbiAgICBzZWFyY2hUZXJtJCA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuXHJcbiAgICBmaWx0ZXJQaXBlOiBMaXN0RmlsdGVyUGlwZTtcclxuICAgIHB1YmxpYyBzZWxlY3RlZEl0ZW1zOiBBcnJheTxhbnk+O1xyXG4gICAgcHVibGljIGlzQWN0aXZlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNTZWxlY3RBbGw6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc0ZpbHRlclNlbGVjdEFsbDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzSW5maW5pdGVGaWx0ZXJTZWxlY3RBbGw6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBncm91cGVkRGF0YTogQXJyYXk8YW55PjtcclxuICAgIGZpbHRlcjogYW55O1xyXG4gICAgcHVibGljIGNodW5rQXJyYXk6IGFueVtdO1xyXG4gICAgcHVibGljIHNjcm9sbFRvcDogYW55O1xyXG4gICAgcHVibGljIGNodW5rSW5kZXg6IGFueVtdID0gW107XHJcbiAgICBwdWJsaWMgY2FjaGVkSXRlbXM6IGFueVtdID0gW107XHJcbiAgICBwdWJsaWMgZ3JvdXBDYWNoZWRJdGVtczogYW55W10gPSBbXTtcclxuICAgIHB1YmxpYyB0b3RhbFJvd3M6IGFueTtcclxuICAgIHB1YmxpYyBpdGVtSGVpZ2h0OiBhbnkgPSA0MS42O1xyXG4gICAgcHVibGljIHNjcmVlbkl0ZW1zTGVuOiBhbnk7XHJcbiAgICBwdWJsaWMgY2FjaGVkSXRlbXNMZW46IGFueTtcclxuICAgIHB1YmxpYyB0b3RhbEhlaWdodDogYW55O1xyXG4gICAgcHVibGljIHNjcm9sbGVyOiBhbnk7XHJcbiAgICBwdWJsaWMgbWF4QnVmZmVyOiBhbnk7XHJcbiAgICBwdWJsaWMgbGFzdFNjcm9sbGVkOiBhbnk7XHJcbiAgICBwdWJsaWMgbGFzdFJlcGFpbnRZOiBhbnk7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWRMaXN0SGVpZ2h0OiBhbnk7XHJcbiAgICBwdWJsaWMgZmlsdGVyTGVuZ3RoOiBhbnkgPSAwO1xyXG4gICAgcHVibGljIGluZmluaXRlRmlsdGVyTGVuZ3RoOiBhbnkgPSAwO1xyXG4gICAgcHVibGljIHZpZXdQb3J0SXRlbXM6IGFueTtcclxuICAgIHB1YmxpYyBpdGVtOiBhbnk7XHJcbiAgICBwdWJsaWMgZHJvcGRvd25MaXN0WU9mZnNldDogbnVtYmVyID0gMDtcclxuICAgIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG4gICAgZGVmYXVsdFNldHRpbmdzOiBEcm9wZG93blNldHRpbmdzID0ge1xyXG4gICAgICAgIHNpbmdsZVNlbGVjdGlvbjogZmFsc2UsXHJcbiAgICAgICAgdGV4dDogJ1NlbGVjdCcsXHJcbiAgICAgICAgZW5hYmxlQ2hlY2tBbGw6IHRydWUsXHJcbiAgICAgICAgc2VsZWN0QWxsVGV4dDogJ1NlbGVjdCBBbGwnLFxyXG4gICAgICAgIHVuU2VsZWN0QWxsVGV4dDogJ1VuU2VsZWN0IEFsbCcsXHJcbiAgICAgICAgZmlsdGVyU2VsZWN0QWxsVGV4dDogJ1NlbGVjdCBhbGwgZmlsdGVyZWQgcmVzdWx0cycsXHJcbiAgICAgICAgZmlsdGVyVW5TZWxlY3RBbGxUZXh0OiAnVW5TZWxlY3QgYWxsIGZpbHRlcmVkIHJlc3VsdHMnLFxyXG4gICAgICAgIGVuYWJsZVNlYXJjaEZpbHRlcjogZmFsc2UsXHJcbiAgICAgICAgc2VhcmNoQnk6IFtdLFxyXG4gICAgICAgIG1heEhlaWdodDogMzAwLFxyXG4gICAgICAgIGJhZGdlU2hvd0xpbWl0OiA5OTk5OTk5OTk5OTksXHJcbiAgICAgICAgY2xhc3NlczogJycsXHJcbiAgICAgICAgZGlzYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgIHNlYXJjaFBsYWNlaG9sZGVyVGV4dDogJ1NlYXJjaCcsXHJcbiAgICAgICAgc2hvd0NoZWNrYm94OiB0cnVlLFxyXG4gICAgICAgIG5vRGF0YUxhYmVsOiAnTm8gRGF0YSBBdmFpbGFibGUnLFxyXG4gICAgICAgIHNlYXJjaEF1dG9mb2N1czogdHJ1ZSxcclxuICAgICAgICBsYXp5TG9hZGluZzogZmFsc2UsXHJcbiAgICAgICAgbGFiZWxLZXk6ICdpdGVtTmFtZScsXHJcbiAgICAgICAgcHJpbWFyeUtleTogJ2lkJyxcclxuICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbScsXHJcbiAgICAgICAgYXV0b1Bvc2l0aW9uOiB0cnVlLFxyXG4gICAgICAgIGVuYWJsZUZpbHRlclNlbGVjdEFsbDogdHJ1ZSxcclxuICAgICAgICBzZWxlY3RHcm91cDogZmFsc2UsXHJcbiAgICAgICAgYWRkTmV3SXRlbU9uRmlsdGVyOiBmYWxzZSxcclxuICAgICAgICBhZGROZXdCdXR0b25UZXh0OiBcIkFkZFwiLFxyXG4gICAgICAgIGVzY2FwZVRvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgY2xlYXJBbGw6IHRydWVcclxuICAgIH1cclxuICAgIHJhbmRvbVNpemU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHBhcnNlRXJyb3I6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgZmlsdGVyZWRMaXN0OiBhbnkgPSBbXTtcclxuICAgIHZpcnR1YWxTY3Jvb2xsSW5pdDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgQFZpZXdDaGlsZChWaXJ0dWFsU2Nyb2xsZXJDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KVxyXG4gICAgcHJpdmF0ZSB2aXJ0dWFsU2Nyb2xsZXI6IFZpcnR1YWxTY3JvbGxlckNvbXBvbmVudDtcclxuICAgIHB1YmxpYyBpc0Rpc2FibGVkSXRlbVByZXNlbnQgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBkczogRGF0YVNlcnZpY2UpIHtcclxuICAgICAgICB0aGlzLnNlYXJjaFRlcm0kLmFzT2JzZXJ2YWJsZSgpLnBpcGUoXHJcbiAgICAgICAgICAgIGRlYm91bmNlVGltZSgxMDAwKSxcclxuICAgICAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcclxuICAgICAgICAgICAgdGFwKHRlcm0gPT4gdGVybSlcclxuICAgICAgICApLnN1YnNjcmliZSh2YWwgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmZpbHRlckluZmluaXRlTGlzdCh2YWwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24odGhpcy5kZWZhdWx0U2V0dGluZ3MsIHRoaXMuc2V0dGluZ3MpO1xyXG5cclxuICAgICAgICB0aGlzLmNhY2hlZEl0ZW1zID0gdGhpcy5jbG9uZUFycmF5KHRoaXMuZGF0YSk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MucG9zaXRpb24gPT0gJ3RvcCcpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTGlzdEhlaWdodCA9IHsgdmFsOiAwIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkTGlzdEhlaWdodC52YWwgPSB0aGlzLnNlbGVjdGVkTGlzdEVsZW0ubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMuZHMuZ2V0RGF0YSgpLnN1YnNjcmliZShkYXRhID0+IHtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsZW4gPSAwO1xyXG4gICAgICAgICAgICAgICAgZGF0YS5mb3JFYWNoKChvYmo6IGFueSwgaTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9iai5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzRGlzYWJsZWRJdGVtUHJlc2VudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KCdncnBUaXRsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbisrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWx0ZXJMZW5ndGggPSBsZW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRmlsdGVyQ2hhbmdlKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZURyb3Bkb3duRGlyZWN0aW9uKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb29sbEluaXQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgICAgICBpZiAoY2hhbmdlcy5kYXRhICYmICFjaGFuZ2VzLmRhdGEuZmlyc3RDaGFuZ2UpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IHRoaXMudHJhbnNmb3JtRGF0YSh0aGlzLmRhdGEsIHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMgPSB0aGlzLmNsb25lQXJyYXkodGhpcy5ncm91cGVkRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jYWNoZWRJdGVtcyA9IHRoaXMuY2xvbmVBcnJheSh0aGlzLmRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2hhbmdlcy5zZXR0aW5ncyAmJiAhY2hhbmdlcy5zZXR0aW5ncy5maXJzdENoYW5nZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjaGFuZ2VzLmxvYWRpbmcpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubGF6eUxvYWRpbmcgJiYgdGhpcy52aXJ0dWFsU2Nyb29sbEluaXQgJiYgY2hhbmdlcy5kYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSBjaGFuZ2VzLmRhdGEuY3VycmVudFZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5nRG9DaGVjaygpIHtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEl0ZW1zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID09IDAgfHwgdGhpcy5kYXRhLmxlbmd0aCA9PSAwIHx8IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPCB0aGlzLmRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2VsZWN0QWxsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubGF6eUxvYWRpbmcpIHtcclxuICAgICAgICAgICAgLy8gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsYXp5Q29udGFpbmVyXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMub25TY3JvbGwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkTGlzdEVsZW0ubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQgJiYgdGhpcy5zZXR0aW5ncy5wb3NpdGlvbiA9PSAndG9wJyAmJiB0aGlzLnNlbGVjdGVkTGlzdEhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkTGlzdEhlaWdodC52YWwgPSB0aGlzLnNlbGVjdGVkTGlzdEVsZW0ubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkl0ZW1DbGljayhpdGVtOiBhbnksIGluZGV4OiBudW1iZXIsIGV2dDogRXZlbnQpIHtcclxuICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZm91bmQgPSB0aGlzLmlzU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgbGV0IGxpbWl0ID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA8IHRoaXMuc2V0dGluZ3MubGltaXRTZWxlY3Rpb24gPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICghZm91bmQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubGltaXRTZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaW1pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblNlbGVjdC5lbWl0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3RlZChpdGVtKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TZWxlY3QuZW1pdChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMub25EZVNlbGVjdC5lbWl0KGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1NlbGVjdEFsbCB8fCB0aGlzLmRhdGEubGVuZ3RoID4gdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzU2VsZWN0QWxsID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA9PSB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RBbGwgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR3JvdXBJbmZvKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyB2YWxpZGF0ZShjOiBGb3JtQ29udHJvbCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uVG91Y2hlZENhbGxiYWNrOiAoXzogYW55KSA9PiB2b2lkID0gbm9vcDtcclxuICAgIHByaXZhdGUgb25DaGFuZ2VDYWxsYmFjazogKF86IGFueSkgPT4gdm9pZCA9IG5vb3A7XHJcblxyXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09ICcnKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNpbmdsZVNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLnRyYW5zZm9ybURhdGEodGhpcy5kYXRhLCB0aGlzLnNldHRpbmdzLmdyb3VwQnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBDYWNoZWRJdGVtcyA9IHRoaXMuY2xvbmVBcnJheSh0aGlzLmdyb3VwZWREYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbdmFsdWVbMF1dO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFt2YWx1ZVswXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTXlFeGNlcHRpb24oNDA0LCB7IFwibXNnXCI6IFwiU2luZ2xlIFNlbGVjdGlvbiBNb2RlLCBTZWxlY3RlZCBJdGVtcyBjYW5ub3QgaGF2ZSBtb3JlIHRoYW4gb25lIGl0ZW0uXCIgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUuYm9keS5tc2cpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5saW1pdFNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHZhbHVlLnNsaWNlKDAsIHRoaXMuc2V0dGluZ3MubGltaXRTZWxlY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA9PT0gdGhpcy5kYXRhLmxlbmd0aCAmJiB0aGlzLmRhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RBbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLnRyYW5zZm9ybURhdGEodGhpcy5kYXRhLCB0aGlzLnNldHRpbmdzLmdyb3VwQnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBDYWNoZWRJdGVtcyA9IHRoaXMuY2xvbmVBcnJheSh0aGlzLmdyb3VwZWREYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL0Zyb20gQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXHJcbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpIHtcclxuICAgICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICAvL0Zyb20gQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXHJcbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayA9IGZuO1xyXG4gICAgfVxyXG4gICAgdHJhY2tCeUZuKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkge1xyXG4gICAgICAgIHJldHVybiBpdGVtW3RoaXMuc2V0dGluZ3MucHJpbWFyeUtleV07XHJcbiAgICB9XHJcbiAgICBpc1NlbGVjdGVkKGNsaWNrZWRJdGVtOiBhbnkpIHtcclxuICAgICAgICBpZiAoY2xpY2tlZEl0ZW0uZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgJiYgdGhpcy5zZWxlY3RlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjbGlja2VkSXRlbVt0aGlzLnNldHRpbmdzLnByaW1hcnlLZXldID09PSBpdGVtW3RoaXMuc2V0dGluZ3MucHJpbWFyeUtleV0pIHtcclxuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmb3VuZDtcclxuICAgIH1cclxuICAgIGFkZFNlbGVjdGVkKGl0ZW06IGFueSkge1xyXG4gICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc2luZ2xlU2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZURyb3Bkb3duKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlU2VsZWN0ZWQoY2xpY2tlZEl0ZW06IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyAmJiB0aGlzLnNlbGVjdGVkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgaWYgKGNsaWNrZWRJdGVtW3RoaXMuc2V0dGluZ3MucHJpbWFyeUtleV0gPT09IGl0ZW1bdGhpcy5zZXR0aW5ncy5wcmltYXJ5S2V5XSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zLnNwbGljZSh0aGlzLnNlbGVjdGVkSXRlbXMuaW5kZXhPZihpdGVtKSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZEl0ZW1zKTtcclxuICAgICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrKHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICB9XHJcbiAgICB0b2dnbGVEcm9wZG93bihldnQ6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9ICF0aGlzLmlzQWN0aXZlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNlYXJjaEF1dG9mb2N1cyAmJiB0aGlzLnNlYXJjaElucHV0ICYmIHRoaXMuc2V0dGluZ3MuZW5hYmxlU2VhcmNoRmlsdGVyICYmICF0aGlzLnNlYXJjaFRlbXBsKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNlYXJjaEF1dG9mb2N1cyAmJiAhdGhpcy5zZWFyY2hJbnB1dCAmJiB0aGlzLnNldHRpbmdzLmVuYWJsZVNlYXJjaEZpbHRlciAmJiB0aGlzLnNlYXJjaFRlbXBsKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxpc3QtZmlsdGVyXCIpWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMub25PcGVuLmVtaXQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZURyb3Bkb3duRGlyZWN0aW9uKCk7XHJcbiAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubGF6eUxvYWRpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb29sbEluaXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBvcGVuRHJvcGRvd24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zZWFyY2hBdXRvZm9jdXMgJiYgdGhpcy5zZWFyY2hJbnB1dCAmJiB0aGlzLnNldHRpbmdzLmVuYWJsZVNlYXJjaEZpbHRlciAmJiAhdGhpcy5zZWFyY2hUZW1wbCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vbk9wZW4uZW1pdCh0cnVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbG9zZURyb3Bkb3duKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlYXJjaElucHV0ICYmIHRoaXMuc2V0dGluZ3MubGF6eUxvYWRpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoSW5wdXQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maWx0ZXIgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9uQ2xvc2UuZW1pdChmYWxzZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xvc2VEcm9wZG93bk9uQ2xpY2tPdXQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VhcmNoSW5wdXQgJiYgdGhpcy5zZXR0aW5ncy5sYXp5TG9hZGluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hJbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmZpbHRlciA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclNlYXJjaCgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xvc2UuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdG9nZ2xlU2VsZWN0QWxsKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc1NlbGVjdEFsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YS5mb3JFYWNoKChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSAhb2JqLmRpc2FibGVkO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBDYWNoZWRJdGVtcy5mb3JFYWNoKChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSAhb2JqLmRpc2FibGVkO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB0aGlzLnNlbGVjdGVkSXRlbXMgPSB0aGlzLmRhdGEuc2xpY2UoKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gdGhpcy5kYXRhLmZpbHRlcigoaW5kaXZpZHVhbERhdGEpID0+ICFpbmRpdmlkdWFsRGF0YS5kaXNhYmxlZCk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RBbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZEl0ZW1zKTtcclxuICAgICAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5vblNlbGVjdEFsbC5lbWl0KHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhLmZvckVhY2goKG9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMuZm9yRWFjaCgob2JqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmlzU2VsZWN0QWxsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrKHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uRGVTZWxlY3RBbGwuZW1pdCh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZpbHRlckdyb3VwZWRMaXN0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbHRlciA9PSBcIlwiIHx8IHRoaXMuZmlsdGVyID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclNlYXJjaCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLmNsb25lQXJyYXkodGhpcy5ncm91cENhY2hlZEl0ZW1zKTtcclxuICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy5ncm91cGVkRGF0YS5maWx0ZXIob2JqID0+IHtcclxuICAgICAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgICAgICBpZiAob2JqW3RoaXMuc2V0dGluZ3MubGFiZWxLZXldLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLmZpbHRlci50b0xvd2VyQ2FzZSgpKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIgPSBvYmoubGlzdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFyciA9IG9iai5saXN0LmZpbHRlcih0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdFt0aGlzLnNldHRpbmdzLmxhYmVsS2V5XS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5maWx0ZXIudG9Mb3dlckNhc2UoKSkgPiAtMTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvYmoubGlzdCA9IGFycjtcclxuICAgICAgICAgICAgaWYgKG9ialt0aGlzLnNldHRpbmdzLmxhYmVsS2V5XS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5maWx0ZXIudG9Mb3dlckNhc2UoKSkgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhcnIuc29tZShjYXQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYXRbdGhpcy5zZXR0aW5ncy5sYWJlbEtleV0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMuZmlsdGVyLnRvTG93ZXJDYXNlKCkpID4gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0b2dnbGVGaWx0ZXJTZWxlY3RBbGwoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRmlsdGVyU2VsZWN0QWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBhZGRlZCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAvKiAgICAgICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ubGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5saXN0LmZvckVhY2goKGVsOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3RlZChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlR3JvdXBJbmZvKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7ICovXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5kcy5nZXRGaWx0ZXJlZERhdGEoKS5mb3JFYWNoKChlbDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0ZWQoZWwpICYmICFlbC5oYXNPd25Qcm9wZXJ0eSgnZ3JwVGl0bGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWQucHVzaChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcy5nZXRGaWx0ZXJlZERhdGEoKS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRlZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5pc0ZpbHRlclNlbGVjdEFsbCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMub25GaWx0ZXJTZWxlY3RBbGwuZW1pdChhZGRlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcmVtb3ZlZCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAvKiAgICAgICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ubGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5saXN0LmZvckVhY2goKGVsOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAqL1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcy5nZXRGaWx0ZXJlZERhdGEoKS5mb3JFYWNoKChlbDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZChlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWQucHVzaChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRzLmdldEZpbHRlcmVkRGF0YSgpLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzRmlsdGVyU2VsZWN0QWxsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMub25GaWx0ZXJEZVNlbGVjdEFsbC5lbWl0KHJlbW92ZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRvZ2dsZUluZmluaXRlRmlsdGVyU2VsZWN0QWxsKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0luZmluaXRlRmlsdGVyU2VsZWN0QWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmlzSW5maW5pdGVGaWx0ZXJTZWxlY3RBbGwgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNJbmZpbml0ZUZpbHRlclNlbGVjdEFsbCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFyU2VhcmNoKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy5jbG9uZUFycmF5KHRoaXMuZ3JvdXBDYWNoZWRJdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmlsdGVyID0gXCJcIjtcclxuICAgICAgICB0aGlzLmlzRmlsdGVyU2VsZWN0QWxsID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG4gICAgb25GaWx0ZXJDaGFuZ2UoZGF0YTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyICYmIHRoaXMuZmlsdGVyID09IFwiXCIgfHwgZGF0YS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzRmlsdGVyU2VsZWN0QWxsID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjbnQgPSAwO1xyXG4gICAgICAgIGRhdGEuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0uaGFzT3duUHJvcGVydHkoJ2dycFRpdGxlJykgJiYgdGhpcy5pc1NlbGVjdGVkKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICBjbnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoY250ID4gMCAmJiB0aGlzLmZpbHRlckxlbmd0aCA9PSBjbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0ZpbHRlclNlbGVjdEFsbCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGNudCA+IDAgJiYgdGhpcy5maWx0ZXJMZW5ndGggIT0gY250KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNGaWx0ZXJTZWxlY3RBbGwgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblx0XHR0aGlzLm9uU2VhcmNoLmVtaXQodGhpcy5maWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcclxuICAgIH1cclxuICAgIGNsb25lQXJyYXkoYXJyOiBhbnkpIHtcclxuICAgICAgICBsZXQgaSwgY29weTtcclxuXHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhcnIpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhcnIgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRocm93ICdDYW5ub3QgY2xvbmUgYXJyYXkgY29udGFpbmluZyBhbiBvYmplY3QhJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZUdyb3VwSW5mbyhpdGVtOiBhbnkpIHtcclxuICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBrZXkgPSB0aGlzLnNldHRpbmdzLmdyb3VwQnk7XHJcbiAgICAgICAgdGhpcy5ncm91cGVkRGF0YS5mb3JFYWNoKChvYmo6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY250ID0gMDtcclxuICAgICAgICAgICAgaWYgKG9iai5ncnBUaXRsZSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmxpc3QuZm9yRWFjaCgoZWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY250Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqLmxpc3QgJiYgKGNudCA9PT0gb2JqLmxpc3QubGVuZ3RoKSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChvYmoubGlzdCAmJiAoY250ICE9IG9iai5saXN0Lmxlbmd0aCkgJiYgKGl0ZW1ba2V5XSA9PSBvYmpba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5ncm91cENhY2hlZEl0ZW1zLmZvckVhY2goKG9iajogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSAwO1xyXG4gICAgICAgICAgICBpZiAob2JqLmdycFRpdGxlICYmIChpdGVtW2tleV0gPT0gb2JqW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqLmxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoubGlzdC5mb3JFYWNoKChlbDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYmoubGlzdCAmJiAoY250ID09PSBvYmoubGlzdC5sZW5ndGgpICYmIChpdGVtW2tleV0gPT0gb2JqW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG9iai5saXN0ICYmIChjbnQgIT0gb2JqLmxpc3QubGVuZ3RoKSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHRyYW5zZm9ybURhdGEoYXJyOiBBcnJheTxhbnk+LCBmaWVsZDogYW55KTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBlZE9iajogYW55ID0gYXJyLnJlZHVjZSgocHJldjogYW55LCBjdXI6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXByZXZbY3VyW2ZpZWxkXV0pIHtcclxuICAgICAgICAgICAgICAgIHByZXZbY3VyW2ZpZWxkXV0gPSBbY3VyXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByZXZbY3VyW2ZpZWxkXV0ucHVzaChjdXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcmV2O1xyXG4gICAgICAgIH0sIHt9KTtcclxuICAgICAgICBjb25zdCB0ZW1wQXJyOiBhbnkgPSBbXTtcclxuICAgICAgICBPYmplY3Qua2V5cyhncm91cGVkT2JqKS5tYXAoKHg6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgb2JqOiBhbnkgPSB7fTtcclxuICAgICAgICAgICAgbGV0IGRpc2FibGVkQ2hpbGRyZW5zID0gW107XHJcbiAgICAgICAgICAgIG9ialtcImdycFRpdGxlXCJdID0gdHJ1ZTtcclxuICAgICAgICAgICAgb2JqW3RoaXMuc2V0dGluZ3MubGFiZWxLZXldID0geDtcclxuICAgICAgICAgICAgb2JqW3RoaXMuc2V0dGluZ3MuZ3JvdXBCeV0gPSB4O1xyXG4gICAgICAgICAgICBvYmpbJ3NlbGVjdGVkJ10gPSBmYWxzZTtcclxuICAgICAgICAgICAgb2JqWydsaXN0J10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IGNudCA9IDA7XHJcbiAgICAgICAgICAgIGdyb3VwZWRPYmpbeF0uZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtWydsaXN0J10gPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0Rpc2FibGVkSXRlbVByZXNlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkQ2hpbGRyZW5zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvYmoubGlzdC5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZChpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKGNudCA9PSBvYmoubGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgY3VycmVudCBncm91cCBpdGVtJ3MgYWxsIGNoaWxkcmVucyBhcmUgZGlzYWJsZWQgb3Igbm90XHJcbiAgICAgICAgICAgIG9ialsnZGlzYWJsZWQnXSA9IGRpc2FibGVkQ2hpbGRyZW5zLmxlbmd0aCA9PT0gZ3JvdXBlZE9ialt4XS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRlbXBBcnIucHVzaChvYmopO1xyXG4gICAgICAgICAgICAvLyBvYmoubGlzdC5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgLy8gICAgIHRlbXBBcnIucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRlbXBBcnI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZmlsdGVySW5maW5pdGVMaXN0KGV2dDogYW55KSB7XHJcbiAgICAgICAgbGV0IGZpbHRlcmVkRWxlbXM6IEFycmF5PGFueT4gPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMuY2FjaGVkSXRlbXMuc2xpY2UoKTtcclxuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IHRoaXMuY2FjaGVkSXRlbXMuc2xpY2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgoZXZ0ICE9IG51bGwgfHwgZXZ0ICE9ICcnKSAmJiAhdGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNlYXJjaEJ5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSAwOyB0IDwgdGhpcy5zZXR0aW5ncy5zZWFyY2hCeS5sZW5ndGg7IHQrKykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhLmZpbHRlcigoZWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxbdGhpcy5zZXR0aW5ncy5zZWFyY2hCeVt0XS50b1N0cmluZygpXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihldnQudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVsZW1zLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YS5maWx0ZXIoZnVuY3Rpb24gKGVsOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbFtwcm9wXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihldnQudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVsZW1zLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSBmaWx0ZXJlZEVsZW1zO1xyXG4gICAgICAgICAgICB0aGlzLmluZmluaXRlRmlsdGVyTGVuZ3RoID0gdGhpcy52aXJ0dWFsZGF0YS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChldnQudG9TdHJpbmcoKSAhPSAnJyAmJiB0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YS5maWx0ZXIoZnVuY3Rpb24gKGVsOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbC5oYXNPd25Qcm9wZXJ0eSgnZ3JwVGl0bGUnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkRWxlbXMucHVzaChlbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbFtwcm9wXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihldnQudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVsZW1zLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSBmaWx0ZXJlZEVsZW1zO1xyXG4gICAgICAgICAgICB0aGlzLmluZmluaXRlRmlsdGVyTGVuZ3RoID0gdGhpcy5ncm91cGVkRGF0YS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGV2dC50b1N0cmluZygpID09ICcnICYmIHRoaXMuY2FjaGVkSXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSB0aGlzLmNhY2hlZEl0ZW1zO1xyXG4gICAgICAgICAgICB0aGlzLmluZmluaXRlRmlsdGVyTGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsZXIucmVmcmVzaCgpO1xyXG4gICAgfVxyXG4gICAgcmVzZXRJbmZpbml0ZVNlYXJjaCgpIHtcclxuICAgICAgICB0aGlzLmZpbHRlciA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5pc0luZmluaXRlRmlsdGVyU2VsZWN0QWxsID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IFtdO1xyXG4gICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSB0aGlzLmNhY2hlZEl0ZW1zO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLmdyb3VwQ2FjaGVkSXRlbXM7XHJcbiAgICAgICAgdGhpcy5pbmZpbml0ZUZpbHRlckxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbiAgICBvblNjcm9sbEVuZChlOiBhbnkpIHtcclxuICAgICAgICBpZiAoZS5lbmRJbmRleCA9PT0gdGhpcy5kYXRhLmxlbmd0aCAtIDEgfHwgZS5zdGFydEluZGV4ID09PSAwKSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uU2Nyb2xsVG9FbmQuZW1pdChlKTtcclxuXHJcbiAgICB9XHJcbiAgICBuZ09uRGVzdHJveSgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgc2VsZWN0R3JvdXAoaXRlbTogYW55KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICBpdGVtLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGl0ZW0ubGlzdC5mb3JFYWNoKChvYmo6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChvYmopO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVHcm91cEluZm8oaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMub25Hcm91cFNlbGVjdC5lbWl0KGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGl0ZW0ubGlzdC5mb3JFYWNoKChvYmo6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0ZWQob2JqKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQob2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUdyb3VwSW5mbyhpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5vbkdyb3VwRGVTZWxlY3QuZW1pdChpdGVtKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuICAgIGFkZEZpbHRlck5ld0l0ZW0oKSB7XHJcbiAgICAgICAgdGhpcy5vbkFkZEZpbHRlck5ld0l0ZW0uZW1pdCh0aGlzLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5maWx0ZXJQaXBlID0gbmV3IExpc3RGaWx0ZXJQaXBlKHRoaXMuZHMpO1xyXG4gICAgICAgIHRoaXMuZmlsdGVyUGlwZS50cmFuc2Zvcm0odGhpcy5kYXRhLCB0aGlzLmZpbHRlciwgdGhpcy5zZXR0aW5ncy5zZWFyY2hCeSk7XHJcbiAgICB9XHJcbiAgICBjYWxjdWxhdGVEcm9wZG93bkRpcmVjdGlvbigpIHtcclxuICAgICAgICBsZXQgc2hvdWxkT3BlblRvd2FyZHNUb3AgPSB0aGlzLnNldHRpbmdzLnBvc2l0aW9uID09ICd0b3AnO1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qb3NpdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBkcm9wZG93bkhlaWdodCA9IHRoaXMuZHJvcGRvd25MaXN0RWxlbS5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgY29uc3Qgdmlld3BvcnRIZWlnaHQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZExpc3RCb3VuZHMgPSB0aGlzLnNlbGVjdGVkTGlzdEVsZW0ubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNwYWNlT25Ub3A6IG51bWJlciA9IHNlbGVjdGVkTGlzdEJvdW5kcy50b3A7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwYWNlT25Cb3R0b206IG51bWJlciA9IHZpZXdwb3J0SGVpZ2h0IC0gc2VsZWN0ZWRMaXN0Qm91bmRzLnRvcDtcclxuICAgICAgICAgICAgaWYgKHNwYWNlT25Cb3R0b20gPCBzcGFjZU9uVG9wICYmIGRyb3Bkb3duSGVpZ2h0IDwgc3BhY2VPblRvcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuVG93YXJkc1RvcCh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblRvd2FyZHNUb3AoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEtlZXAgcHJlZmVyZW5jZSBpZiB0aGVyZSBpcyBub3QgZW5vdWdoIHNwYWNlIG9uIGVpdGhlciB0aGUgdG9wIG9yIGJvdHRvbVxyXG4gICAgICAgICAgICAvKiBcdFx0XHRpZiAoc3BhY2VPblRvcCB8fCBzcGFjZU9uQm90dG9tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hvdWxkT3BlblRvd2FyZHNUb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRPcGVuVG93YXJkc1RvcCA9IHNwYWNlT25Ub3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZE9wZW5Ub3dhcmRzVG9wID0gIXNwYWNlT25Cb3R0b207XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gKi9cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgb3BlblRvd2FyZHNUb3AodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsdWUgJiYgdGhpcy5zZWxlY3RlZExpc3RFbGVtLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd25MaXN0WU9mZnNldCA9IDE1ICsgdGhpcy5zZWxlY3RlZExpc3RFbGVtLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd25MaXN0WU9mZnNldCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXJTZWxlY3Rpb24oZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VwQ2FjaGVkSXRlbXMuZm9yRWFjaCgob2JqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jbGVhclNlYXJjaCgpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG4gICAgICAgIHRoaXMub25EZVNlbGVjdEFsbC5lbWl0KHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgVmlydHVhbFNjcm9sbGVyTW9kdWxlXSxcclxuICAgIGRlY2xhcmF0aW9uczogW0FuZ3VsYXJNdWx0aVNlbGVjdCwgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlLCBTY3JvbGxEaXJlY3RpdmUsIHN0eWxlRGlyZWN0aXZlLCBMaXN0RmlsdGVyUGlwZSwgSXRlbSwgVGVtcGxhdGVSZW5kZXJlciwgQmFkZ2UsIFNlYXJjaCwgc2V0UG9zaXRpb24sIENJY29uXSxcclxuICAgIGV4cG9ydHM6IFtBbmd1bGFyTXVsdGlTZWxlY3QsIENsaWNrT3V0c2lkZURpcmVjdGl2ZSwgU2Nyb2xsRGlyZWN0aXZlLCBzdHlsZURpcmVjdGl2ZSwgTGlzdEZpbHRlclBpcGUsIEl0ZW0sIFRlbXBsYXRlUmVuZGVyZXIsIEJhZGdlLCBTZWFyY2gsIHNldFBvc2l0aW9uLCBDSWNvbl0sXHJcbiAgICBwcm92aWRlcnM6IFtEYXRhU2VydmljZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJNdWx0aVNlbGVjdE1vZHVsZSB7IH1cclxuIl19