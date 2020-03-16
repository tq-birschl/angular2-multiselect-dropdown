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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlzZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItbXVsdGlzZWxlY3QtZHJvcGRvd24vIiwic291cmNlcyI6WyJsaWIvbXVsdGlzZWxlY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLFlBQVksRUFBc0MsUUFBUSxFQUE0QixpQkFBaUIsRUFBb0IsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFzQyxNQUFNLGVBQWUsQ0FBQztBQUNsVCxPQUFPLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUF3QixhQUFhLEVBQTBCLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0gsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVsRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDM0UsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBZ0IsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2xHLE9BQU8sRUFBTyxZQUFZLEVBQUUsb0JBQW9CLEVBQWEsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0FBR3pGLE1BQU0sS0FB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RUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUM7b0JBQ3JLLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixFQUFFLHFCQUFxQixFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUM7b0JBQ2hLLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQztpQkFDM0I7O0lBQ3VDLCtCQUFDO0NBQUEsQUFOekMsSUFNeUM7U0FBNUIsd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEhvc3RMaXN0ZW5lciwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIE9uRGVzdHJveSwgTmdNb2R1bGUsIFNpbXBsZUNoYW5nZXMsIE9uQ2hhbmdlcywgQ2hhbmdlRGV0ZWN0b3JSZWYsIEFmdGVyVmlld0NoZWNrZWQsIFZpZXdFbmNhcHN1bGF0aW9uLCBDb250ZW50Q2hpbGQsIFZpZXdDaGlsZCwgZm9yd2FyZFJlZiwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTElEQVRPUlMsIFZhbGlkYXRvciwgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IE15RXhjZXB0aW9uIH0gZnJvbSAnLi9tdWx0aXNlbGVjdC5tb2RlbCc7XHJcbmltcG9ydCB7IERyb3Bkb3duU2V0dGluZ3MgfSBmcm9tICcuL211bHRpc2VsZWN0LmludGVyZmFjZSc7XHJcbmltcG9ydCB7IENsaWNrT3V0c2lkZURpcmVjdGl2ZSwgU2Nyb2xsRGlyZWN0aXZlLCBzdHlsZURpcmVjdGl2ZSwgc2V0UG9zaXRpb24gfSBmcm9tICcuL2NsaWNrT3V0c2lkZSc7XHJcbmltcG9ydCB7IExpc3RGaWx0ZXJQaXBlIH0gZnJvbSAnLi9saXN0LWZpbHRlcic7XHJcbmltcG9ydCB7IEl0ZW0sIEJhZGdlLCBTZWFyY2gsIFRlbXBsYXRlUmVuZGVyZXIsIENJY29uIH0gZnJvbSAnLi9tZW51LWl0ZW0nO1xyXG5pbXBvcnQgeyBEYXRhU2VydmljZSB9IGZyb20gJy4vbXVsdGlzZWxlY3Quc2VydmljZSc7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBWaXJ0dWFsU2Nyb2xsZXJNb2R1bGUsIFZpcnR1YWxTY3JvbGxlckNvbXBvbmVudCB9IGZyb20gJy4vdmlydHVhbC1zY3JvbGwvdmlydHVhbC1zY3JvbGwnO1xyXG5pbXBvcnQgeyBtYXAsIGRlYm91bmNlVGltZSwgZGlzdGluY3RVbnRpbENoYW5nZWQsIHN3aXRjaE1hcCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBUaHJvd1N0bXQgfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XHJcblxyXG5leHBvcnQgY29uc3QgRFJPUERPV05fQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xyXG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBBbmd1bGFyTXVsdGlTZWxlY3QpLFxyXG4gICAgbXVsdGk6IHRydWVcclxufTtcclxuZXhwb3J0IGNvbnN0IERST1BET1dOX0NPTlRST0xfVkFMSURBVElPTjogYW55ID0ge1xyXG4gICAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcclxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFuZ3VsYXJNdWx0aVNlbGVjdCksXHJcbiAgICBtdWx0aTogdHJ1ZSxcclxufVxyXG5jb25zdCBub29wID0gKCkgPT4ge1xyXG59O1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ2FuZ3VsYXIyLW11bHRpc2VsZWN0JyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9tdWx0aXNlbGVjdC5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBob3N0OiB7ICdbY2xhc3NdJzogJ2RlZmF1bHRTZXR0aW5ncy5jbGFzc2VzJyB9LFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vbXVsdGlzZWxlY3QuY29tcG9uZW50LnNjc3MnXSxcclxuICAgIHByb3ZpZGVyczogW0RST1BET1dOX0NPTlRST0xfVkFMVUVfQUNDRVNTT1IsIERST1BET1dOX0NPTlRST0xfVkFMSURBVElPTl0sXHJcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJNdWx0aVNlbGVjdCBpbXBsZW1lbnRzIE9uSW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uQ2hhbmdlcywgVmFsaWRhdG9yLCBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3kge1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBkYXRhOiBBcnJheTxhbnk+O1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBzZXR0aW5nczogRHJvcGRvd25TZXR0aW5ncztcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgbG9hZGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBAT3V0cHV0KCdvblNlbGVjdCcpXHJcbiAgICBvblNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvbkRlU2VsZWN0JylcclxuICAgIG9uRGVTZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25TZWxlY3RBbGwnKVxyXG4gICAgb25TZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvbkRlU2VsZWN0QWxsJylcclxuICAgIG9uRGVTZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvbk9wZW4nKVxyXG4gICAgb25PcGVuOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uQ2xvc2UnKVxyXG4gICAgb25DbG9zZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvblNjcm9sbFRvRW5kJylcclxuICAgIG9uU2Nyb2xsVG9FbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XHJcblxyXG4gICAgQE91dHB1dCgnb25GaWx0ZXJTZWxlY3RBbGwnKVxyXG4gICAgb25GaWx0ZXJTZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvbkZpbHRlckRlU2VsZWN0QWxsJylcclxuICAgIG9uRmlsdGVyRGVTZWxlY3RBbGw6IEV2ZW50RW1pdHRlcjxBcnJheTxhbnk+PiA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8YW55Pj4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvbkFkZEZpbHRlck5ld0l0ZW0nKVxyXG4gICAgb25BZGRGaWx0ZXJOZXdJdGVtOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIEBPdXRwdXQoJ29uR3JvdXBTZWxlY3QnKVxyXG4gICAgb25Hcm91cFNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgICBAT3V0cHV0KCdvbkdyb3VwRGVTZWxlY3QnKVxyXG4gICAgb25Hcm91cERlU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG5cclxuICAgIEBDb250ZW50Q2hpbGQoSXRlbSwgeyBzdGF0aWM6IGZhbHNlIH0pIGl0ZW1UZW1wbDogSXRlbTtcclxuICAgIEBDb250ZW50Q2hpbGQoQmFkZ2UsIHsgc3RhdGljOiBmYWxzZSB9KSBiYWRnZVRlbXBsOiBCYWRnZTtcclxuICAgIEBDb250ZW50Q2hpbGQoU2VhcmNoLCB7IHN0YXRpYzogZmFsc2UgfSkgc2VhcmNoVGVtcGw6IFNlYXJjaDtcclxuXHJcblxyXG4gICAgQFZpZXdDaGlsZCgnc2VhcmNoSW5wdXQnLCB7IHN0YXRpYzogZmFsc2UgfSkgc2VhcmNoSW5wdXQ6IEVsZW1lbnRSZWY7XHJcbiAgICBAVmlld0NoaWxkKCdzZWxlY3RlZExpc3QnLCB7IHN0YXRpYzogZmFsc2UgfSkgc2VsZWN0ZWRMaXN0RWxlbTogRWxlbWVudFJlZjtcclxuICAgIEBWaWV3Q2hpbGQoJ2Ryb3Bkb3duTGlzdCcsIHsgc3RhdGljOiBmYWxzZSB9KSBkcm9wZG93bkxpc3RFbGVtOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmtleXVwLmVzY2FwZScsIFsnJGV2ZW50J10pXHJcbiAgICBvbkVzY2FwZURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5lc2NhcGVUb0Nsb3NlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2VEcm9wZG93bigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZpcnR1YWxkYXRhOiBhbnkgPSBbXTtcclxuICAgIHNlYXJjaFRlcm0kID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xyXG5cclxuICAgIGZpbHRlclBpcGU6IExpc3RGaWx0ZXJQaXBlO1xyXG4gICAgcHVibGljIHNlbGVjdGVkSXRlbXM6IEFycmF5PGFueT47XHJcbiAgICBwdWJsaWMgaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBpc1NlbGVjdEFsbDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGlzRmlsdGVyU2VsZWN0QWxsOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaXNJbmZpbml0ZUZpbHRlclNlbGVjdEFsbDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGdyb3VwZWREYXRhOiBBcnJheTxhbnk+O1xyXG4gICAgZmlsdGVyOiBhbnk7XHJcbiAgICBwdWJsaWMgY2h1bmtBcnJheTogYW55W107XHJcbiAgICBwdWJsaWMgc2Nyb2xsVG9wOiBhbnk7XHJcbiAgICBwdWJsaWMgY2h1bmtJbmRleDogYW55W10gPSBbXTtcclxuICAgIHB1YmxpYyBjYWNoZWRJdGVtczogYW55W10gPSBbXTtcclxuICAgIHB1YmxpYyBncm91cENhY2hlZEl0ZW1zOiBhbnlbXSA9IFtdO1xyXG4gICAgcHVibGljIHRvdGFsUm93czogYW55O1xyXG4gICAgcHVibGljIGl0ZW1IZWlnaHQ6IGFueSA9IDQxLjY7XHJcbiAgICBwdWJsaWMgc2NyZWVuSXRlbXNMZW46IGFueTtcclxuICAgIHB1YmxpYyBjYWNoZWRJdGVtc0xlbjogYW55O1xyXG4gICAgcHVibGljIHRvdGFsSGVpZ2h0OiBhbnk7XHJcbiAgICBwdWJsaWMgc2Nyb2xsZXI6IGFueTtcclxuICAgIHB1YmxpYyBtYXhCdWZmZXI6IGFueTtcclxuICAgIHB1YmxpYyBsYXN0U2Nyb2xsZWQ6IGFueTtcclxuICAgIHB1YmxpYyBsYXN0UmVwYWludFk6IGFueTtcclxuICAgIHB1YmxpYyBzZWxlY3RlZExpc3RIZWlnaHQ6IGFueTtcclxuICAgIHB1YmxpYyBmaWx0ZXJMZW5ndGg6IGFueSA9IDA7XHJcbiAgICBwdWJsaWMgaW5maW5pdGVGaWx0ZXJMZW5ndGg6IGFueSA9IDA7XHJcbiAgICBwdWJsaWMgdmlld1BvcnRJdGVtczogYW55O1xyXG4gICAgcHVibGljIGl0ZW06IGFueTtcclxuICAgIHB1YmxpYyBkcm9wZG93bkxpc3RZT2Zmc2V0OiBudW1iZXIgPSAwO1xyXG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgICBkZWZhdWx0U2V0dGluZ3M6IERyb3Bkb3duU2V0dGluZ3MgPSB7XHJcbiAgICAgICAgc2luZ2xlU2VsZWN0aW9uOiBmYWxzZSxcclxuICAgICAgICB0ZXh0OiAnU2VsZWN0JyxcclxuICAgICAgICBlbmFibGVDaGVja0FsbDogdHJ1ZSxcclxuICAgICAgICBzZWxlY3RBbGxUZXh0OiAnU2VsZWN0IEFsbCcsXHJcbiAgICAgICAgdW5TZWxlY3RBbGxUZXh0OiAnVW5TZWxlY3QgQWxsJyxcclxuICAgICAgICBmaWx0ZXJTZWxlY3RBbGxUZXh0OiAnU2VsZWN0IGFsbCBmaWx0ZXJlZCByZXN1bHRzJyxcclxuICAgICAgICBmaWx0ZXJVblNlbGVjdEFsbFRleHQ6ICdVblNlbGVjdCBhbGwgZmlsdGVyZWQgcmVzdWx0cycsXHJcbiAgICAgICAgZW5hYmxlU2VhcmNoRmlsdGVyOiBmYWxzZSxcclxuICAgICAgICBzZWFyY2hCeTogW10sXHJcbiAgICAgICAgbWF4SGVpZ2h0OiAzMDAsXHJcbiAgICAgICAgYmFkZ2VTaG93TGltaXQ6IDk5OTk5OTk5OTk5OSxcclxuICAgICAgICBjbGFzc2VzOiAnJyxcclxuICAgICAgICBkaXNhYmxlZDogZmFsc2UsXHJcbiAgICAgICAgc2VhcmNoUGxhY2Vob2xkZXJUZXh0OiAnU2VhcmNoJyxcclxuICAgICAgICBzaG93Q2hlY2tib3g6IHRydWUsXHJcbiAgICAgICAgbm9EYXRhTGFiZWw6ICdObyBEYXRhIEF2YWlsYWJsZScsXHJcbiAgICAgICAgc2VhcmNoQXV0b2ZvY3VzOiB0cnVlLFxyXG4gICAgICAgIGxhenlMb2FkaW5nOiBmYWxzZSxcclxuICAgICAgICBsYWJlbEtleTogJ2l0ZW1OYW1lJyxcclxuICAgICAgICBwcmltYXJ5S2V5OiAnaWQnLFxyXG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJyxcclxuICAgICAgICBhdXRvUG9zaXRpb246IHRydWUsXHJcbiAgICAgICAgZW5hYmxlRmlsdGVyU2VsZWN0QWxsOiB0cnVlLFxyXG4gICAgICAgIHNlbGVjdEdyb3VwOiBmYWxzZSxcclxuICAgICAgICBhZGROZXdJdGVtT25GaWx0ZXI6IGZhbHNlLFxyXG4gICAgICAgIGFkZE5ld0J1dHRvblRleHQ6IFwiQWRkXCIsXHJcbiAgICAgICAgZXNjYXBlVG9DbG9zZTogdHJ1ZSxcclxuICAgICAgICBjbGVhckFsbDogdHJ1ZVxyXG4gICAgfVxyXG4gICAgcmFuZG9tU2l6ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgcGFyc2VFcnJvcjogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBmaWx0ZXJlZExpc3Q6IGFueSA9IFtdO1xyXG4gICAgdmlydHVhbFNjcm9vbGxJbml0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBAVmlld0NoaWxkKFZpcnR1YWxTY3JvbGxlckNvbXBvbmVudCwgeyBzdGF0aWM6IGZhbHNlIH0pXHJcbiAgICBwcml2YXRlIHZpcnR1YWxTY3JvbGxlcjogVmlydHVhbFNjcm9sbGVyQ29tcG9uZW50O1xyXG4gICAgcHVibGljIGlzRGlzYWJsZWRJdGVtUHJlc2VudCA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIGRzOiBEYXRhU2VydmljZSkge1xyXG4gICAgICAgIHRoaXMuc2VhcmNoVGVybSQuYXNPYnNlcnZhYmxlKCkucGlwZShcclxuICAgICAgICAgICAgZGVib3VuY2VUaW1lKDEwMDApLFxyXG4gICAgICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxyXG4gICAgICAgICAgICB0YXAodGVybSA9PiB0ZXJtKVxyXG4gICAgICAgICkuc3Vic2NyaWJlKHZhbCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsdGVySW5maW5pdGVMaXN0KHZhbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLnNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih0aGlzLmRlZmF1bHRTZXR0aW5ncywgdGhpcy5zZXR0aW5ncyk7XHJcblxyXG4gICAgICAgIHRoaXMuY2FjaGVkSXRlbXMgPSB0aGlzLmNsb25lQXJyYXkodGhpcy5kYXRhKTtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5wb3NpdGlvbiA9PSAndG9wJykge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRMaXN0SGVpZ2h0ID0geyB2YWw6IDAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRMaXN0SGVpZ2h0LnZhbCA9IHRoaXMuc2VsZWN0ZWRMaXN0RWxlbS5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5kcy5nZXREYXRhKCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxlbiA9IDA7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmZvckVhY2goKG9iajogYW55LCBpOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNEaXNhYmxlZEl0ZW1QcmVzZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoJ2dycFRpdGxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVuKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbHRlckxlbmd0aCA9IGxlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMub25GaWx0ZXJDaGFuZ2UoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlRHJvcGRvd25EaXJlY3Rpb24oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnZpcnR1YWxTY3Jvb2xsSW5pdCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgICAgIGlmIChjaGFuZ2VzLmRhdGEgJiYgIWNoYW5nZXMuZGF0YS5maXJzdENoYW5nZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy50cmFuc2Zvcm1EYXRhKHRoaXMuZGF0YSwgdGhpcy5zZXR0aW5ncy5ncm91cEJ5KTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBDYWNoZWRJdGVtcyA9IHRoaXMuY2xvbmVBcnJheSh0aGlzLmdyb3VwZWREYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNhY2hlZEl0ZW1zID0gdGhpcy5jbG9uZUFycmF5KHRoaXMuZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjaGFuZ2VzLnNldHRpbmdzICYmICFjaGFuZ2VzLnNldHRpbmdzLmZpcnN0Q2hhbmdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHRoaXMuZGVmYXVsdFNldHRpbmdzLCB0aGlzLnNldHRpbmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNoYW5nZXMubG9hZGluZykge1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5sYXp5TG9hZGluZyAmJiB0aGlzLnZpcnR1YWxTY3Jvb2xsSW5pdCAmJiBjaGFuZ2VzLmRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IGNoYW5nZXMuZGF0YS5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbmdEb0NoZWNrKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSXRlbXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPT0gMCB8fCB0aGlzLmRhdGEubGVuZ3RoID09IDAgfHwgdGhpcy5zZWxlY3RlZEl0ZW1zLmxlbmd0aCA8IHRoaXMuZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RBbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5sYXp5TG9hZGluZykge1xyXG4gICAgICAgICAgICAvLyB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxhenlDb250YWluZXJcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5vblNjcm9sbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRMaXN0RWxlbS5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodCAmJiB0aGlzLnNldHRpbmdzLnBvc2l0aW9uID09ICd0b3AnICYmIHRoaXMuc2VsZWN0ZWRMaXN0SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRMaXN0SGVpZ2h0LnZhbCA9IHRoaXMuc2VsZWN0ZWRMaXN0RWxlbS5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uSXRlbUNsaWNrKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlciwgZXZ0OiBFdmVudCkge1xyXG4gICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBmb3VuZCA9IHRoaXMuaXNTZWxlY3RlZChpdGVtKTtcclxuICAgICAgICBsZXQgbGltaXQgPSB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoIDwgdGhpcy5zZXR0aW5ncy5saW1pdFNlbGVjdGlvbiA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCFmb3VuZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5saW1pdFNlbGVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpbWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3RlZChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU2VsZWN0LmVtaXQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblNlbGVjdC5lbWl0KGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVTZWxlY3RlZChpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5vbkRlU2VsZWN0LmVtaXQoaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU2VsZWN0QWxsIHx8IHRoaXMuZGF0YS5sZW5ndGggPiB0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RBbGwgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID09IHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1NlbGVjdEFsbCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVHcm91cEluZm8oaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHZhbGlkYXRlKGM6IEZvcm1Db250cm9sKTogYW55IHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25Ub3VjaGVkQ2FsbGJhY2s6IChfOiBhbnkpID0+IHZvaWQgPSBub29wO1xyXG4gICAgcHJpdmF0ZSBvbkNoYW5nZUNhbGxiYWNrOiAoXzogYW55KSA9PiB2b2lkID0gbm9vcDtcclxuXHJcbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gJycpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc2luZ2xlU2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IHRoaXMudHJhbnNmb3JtRGF0YSh0aGlzLmRhdGEsIHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91cENhY2hlZEl0ZW1zID0gdGhpcy5jbG9uZUFycmF5KHRoaXMuZ3JvdXBlZERhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFt2YWx1ZVswXV07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW3ZhbHVlWzBdXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNeUV4Y2VwdGlvbig0MDQsIHsgXCJtc2dcIjogXCJTaW5nbGUgU2VsZWN0aW9uIE1vZGUsIFNlbGVjdGVkIEl0ZW1zIGNhbm5vdCBoYXZlIG1vcmUgdGhhbiBvbmUgaXRlbS5cIiB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZS5ib2R5Lm1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmxpbWl0U2VsZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gdmFsdWUuc2xpY2UoMCwgdGhpcy5zZXR0aW5ncy5saW1pdFNlbGVjdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSB0aGlzLmRhdGEubGVuZ3RoICYmIHRoaXMuZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1NlbGVjdEFsbCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IHRoaXMudHJhbnNmb3JtRGF0YSh0aGlzLmRhdGEsIHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncm91cENhY2hlZEl0ZW1zID0gdGhpcy5jbG9uZUFycmF5KHRoaXMuZ3JvdXBlZERhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vRnJvbSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcclxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSkge1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vRnJvbSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcclxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcclxuICAgICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrID0gZm47XHJcbiAgICB9XHJcbiAgICB0cmFja0J5Rm4oaW5kZXg6IG51bWJlciwgaXRlbTogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1bdGhpcy5zZXR0aW5ncy5wcmltYXJ5S2V5XTtcclxuICAgIH1cclxuICAgIGlzU2VsZWN0ZWQoY2xpY2tlZEl0ZW06IGFueSkge1xyXG4gICAgICAgIGlmIChjbGlja2VkSXRlbS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyAmJiB0aGlzLnNlbGVjdGVkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgaWYgKGNsaWNrZWRJdGVtW3RoaXMuc2V0dGluZ3MucHJpbWFyeUtleV0gPT09IGl0ZW1bdGhpcy5zZXR0aW5ncy5wcmltYXJ5S2V5XSkge1xyXG4gICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGZvdW5kO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZWN0ZWQoaXRlbTogYW55KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zaW5nbGVTZWxlY3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlRHJvcGRvd24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sodGhpcy5zZWxlY3RlZEl0ZW1zKTtcclxuICAgICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrKHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVTZWxlY3RlZChjbGlja2VkSXRlbTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zICYmIHRoaXMuc2VsZWN0ZWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2xpY2tlZEl0ZW1bdGhpcy5zZXR0aW5ncy5wcmltYXJ5S2V5XSA9PT0gaXRlbVt0aGlzLnNldHRpbmdzLnByaW1hcnlLZXldKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMuc3BsaWNlKHRoaXMuc2VsZWN0ZWRJdGVtcy5pbmRleE9mKGl0ZW0pLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG4gICAgICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sodGhpcy5zZWxlY3RlZEl0ZW1zKTtcclxuICAgIH1cclxuICAgIHRvZ2dsZURyb3Bkb3duKGV2dDogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gIXRoaXMuaXNBY3RpdmU7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNBY3RpdmUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc2VhcmNoQXV0b2ZvY3VzICYmIHRoaXMuc2VhcmNoSW5wdXQgJiYgdGhpcy5zZXR0aW5ncy5lbmFibGVTZWFyY2hGaWx0ZXIgJiYgIXRoaXMuc2VhcmNoVGVtcGwpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3Muc2VhcmNoQXV0b2ZvY3VzICYmICF0aGlzLnNlYXJjaElucHV0ICYmIHRoaXMuc2V0dGluZ3MuZW5hYmxlU2VhcmNoRmlsdGVyICYmIHRoaXMuc2VhcmNoVGVtcGwpIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibGlzdC1maWx0ZXJcIilbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vbk9wZW4uZW1pdCh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25DbG9zZS5lbWl0KGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlRHJvcGRvd25EaXJlY3Rpb24oKTtcclxuICAgICAgICB9LCAwKTtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5sYXp5TG9hZGluZykge1xyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxTY3Jvb2xsSW5pdCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIG9wZW5Ecm9wZG93bigpIHtcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNlYXJjaEF1dG9mb2N1cyAmJiB0aGlzLnNlYXJjaElucHV0ICYmIHRoaXMuc2V0dGluZ3MuZW5hYmxlU2VhcmNoRmlsdGVyICYmICF0aGlzLnNlYXJjaFRlbXBsKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uT3Blbi5lbWl0KHRydWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsb3NlRHJvcGRvd24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VhcmNoSW5wdXQgJiYgdGhpcy5zZXR0aW5ncy5sYXp5TG9hZGluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zZWFyY2hJbnB1dCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpbHRlciA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25DbG9zZS5lbWl0KGZhbHNlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbG9zZURyb3Bkb3duT25DbGlja091dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hJbnB1dCAmJiB0aGlzLnNldHRpbmdzLmxhenlMb2FkaW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlYXJjaElucHV0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyID0gXCJcIjtcclxuICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyU2VhcmNoKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25DbG9zZS5lbWl0KGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0b2dnbGVTZWxlY3RBbGwoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0QWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhLmZvckVhY2goKG9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9ICFvYmouZGlzYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cENhY2hlZEl0ZW1zLmZvckVhY2goKG9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9ICFvYmouZGlzYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IHRoaXMuZGF0YS5zbGljZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSB0aGlzLmRhdGEuZmlsdGVyKChpbmRpdmlkdWFsRGF0YSkgPT4gIWluZGl2aWR1YWxEYXRhLmRpc2FibGVkKTtcclxuICAgICAgICAgICAgdGhpcy5pc1NlbGVjdEFsbCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrKHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0QWxsLmVtaXQodGhpcy5zZWxlY3RlZEl0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEuZm9yRWFjaCgob2JqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBDYWNoZWRJdGVtcy5mb3JFYWNoKChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RBbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICAgICAgICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sodGhpcy5zZWxlY3RlZEl0ZW1zKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub25EZVNlbGVjdEFsbC5lbWl0KHRoaXMuc2VsZWN0ZWRJdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZmlsdGVyR3JvdXBlZExpc3QoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlsdGVyID09IFwiXCIgfHwgdGhpcy5maWx0ZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyU2VhcmNoKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IHRoaXMuY2xvbmVBcnJheSh0aGlzLmdyb3VwQ2FjaGVkSXRlbXMpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLmdyb3VwZWREYXRhLmZpbHRlcihvYmogPT4ge1xyXG4gICAgICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgICAgIGlmIChvYmpbdGhpcy5zZXR0aW5ncy5sYWJlbEtleV0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMuZmlsdGVyLnRvTG93ZXJDYXNlKCkpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIGFyciA9IG9iai5saXN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJyID0gb2JqLmxpc3QuZmlsdGVyKHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0W3RoaXMuc2V0dGluZ3MubGFiZWxLZXldLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLmZpbHRlci50b0xvd2VyQ2FzZSgpKSA+IC0xO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG9iai5saXN0ID0gYXJyO1xyXG4gICAgICAgICAgICBpZiAob2JqW3RoaXMuc2V0dGluZ3MubGFiZWxLZXldLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLmZpbHRlci50b0xvd2VyQ2FzZSgpKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFyci5zb21lKGNhdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhdFt0aGlzLnNldHRpbmdzLmxhYmVsS2V5XS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5maWx0ZXIudG9Mb3dlckNhc2UoKSkgPiAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHRvZ2dsZUZpbHRlclNlbGVjdEFsbCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNGaWx0ZXJTZWxlY3RBbGwpIHtcclxuICAgICAgICAgICAgbGV0IGFkZGVkID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgICAgIC8qICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmxpc3QuZm9yRWFjaCgoZWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkKGVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWQucHVzaChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVHcm91cEluZm8oaXRlbSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsgKi9cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRzLmdldEZpbHRlcmVkRGF0YSgpLmZvckVhY2goKGVsOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChlbCkgJiYgIWVsLmhhc093blByb3BlcnR5KCdncnBUaXRsZScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRlZC5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRzLmdldEZpbHRlcmVkRGF0YSgpLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZGVkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmlzRmlsdGVyU2VsZWN0QWxsID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5vbkZpbHRlclNlbGVjdEFsbC5lbWl0KGFkZGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCByZW1vdmVkID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgICAgIC8qICAgICAgICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmxpc3QuZm9yRWFjaCgoZWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWQoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7ICovXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRzLmdldEZpbHRlcmVkRGF0YSgpLmZvckVhY2goKGVsOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHMuZ2V0RmlsdGVyZWREYXRhKCkuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZChpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVNlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaXNGaWx0ZXJTZWxlY3RBbGwgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbkZpbHRlckRlU2VsZWN0QWxsLmVtaXQocmVtb3ZlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdG9nZ2xlSW5maW5pdGVGaWx0ZXJTZWxlY3RBbGwoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzSW5maW5pdGVGaWx0ZXJTZWxlY3RBbGwpIHtcclxuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRTZWxlY3RlZChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNJbmZpbml0ZUZpbHRlclNlbGVjdEFsbCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZChpdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5pc0luZmluaXRlRmlsdGVyU2VsZWN0QWxsID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXJTZWFyY2goKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEgPSB0aGlzLmNsb25lQXJyYXkodGhpcy5ncm91cENhY2hlZEl0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maWx0ZXIgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuaXNGaWx0ZXJTZWxlY3RBbGwgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcbiAgICBvbkZpbHRlckNoYW5nZShkYXRhOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5maWx0ZXIgJiYgdGhpcy5maWx0ZXIgPT0gXCJcIiB8fCBkYXRhLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNGaWx0ZXJTZWxlY3RBbGwgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNudCA9IDA7XHJcbiAgICAgICAgZGF0YS5mb3JFYWNoKChpdGVtOiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmICghaXRlbS5oYXNPd25Qcm9wZXJ0eSgnZ3JwVGl0bGUnKSAmJiB0aGlzLmlzU2VsZWN0ZWQoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgIGNudCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChjbnQgPiAwICYmIHRoaXMuZmlsdGVyTGVuZ3RoID09IGNudCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzRmlsdGVyU2VsZWN0QWxsID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY250ID4gMCAmJiB0aGlzLmZpbHRlckxlbmd0aCAhPSBjbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0ZpbHRlclNlbGVjdEFsbCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9XHJcbiAgICBjbG9uZUFycmF5KGFycjogYW55KSB7XHJcbiAgICAgICAgbGV0IGksIGNvcHk7XHJcblxyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYXJyKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYXJyID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNsb25lIGFycmF5IGNvbnRhaW5pbmcgYW4gb2JqZWN0ISc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGVHcm91cEluZm8oaXRlbTogYW55KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQga2V5ID0gdGhpcy5zZXR0aW5ncy5ncm91cEJ5O1xyXG4gICAgICAgIHRoaXMuZ3JvdXBlZERhdGEuZm9yRWFjaCgob2JqOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgbGV0IGNudCA9IDA7XHJcbiAgICAgICAgICAgIGlmIChvYmouZ3JwVGl0bGUgJiYgKGl0ZW1ba2V5XSA9PSBvYmpba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmoubGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5saXN0LmZvckVhY2goKGVsOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RlZChlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9iai5saXN0ICYmIChjbnQgPT09IG9iai5saXN0Lmxlbmd0aCkgJiYgKGl0ZW1ba2V5XSA9PSBvYmpba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAob2JqLmxpc3QgJiYgKGNudCAhPSBvYmoubGlzdC5sZW5ndGgpICYmIChpdGVtW2tleV0gPT0gb2JqW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBDYWNoZWRJdGVtcy5mb3JFYWNoKChvYmo6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgY250ID0gMDtcclxuICAgICAgICAgICAgaWYgKG9iai5ncnBUaXRsZSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iai5saXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLmxpc3QuZm9yRWFjaCgoZWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGVkKGVsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY250Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqLmxpc3QgJiYgKGNudCA9PT0gb2JqLmxpc3QubGVuZ3RoKSAmJiAoaXRlbVtrZXldID09IG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChvYmoubGlzdCAmJiAoY250ICE9IG9iai5saXN0Lmxlbmd0aCkgJiYgKGl0ZW1ba2V5XSA9PSBvYmpba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIG9iai5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB0cmFuc2Zvcm1EYXRhKGFycjogQXJyYXk8YW55PiwgZmllbGQ6IGFueSk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwZWRPYmo6IGFueSA9IGFyci5yZWR1Y2UoKHByZXY6IGFueSwgY3VyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFwcmV2W2N1cltmaWVsZF1dKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2W2N1cltmaWVsZF1dID0gW2N1cl07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2W2N1cltmaWVsZF1dLnB1c2goY3VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJldjtcclxuICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgY29uc3QgdGVtcEFycjogYW55ID0gW107XHJcbiAgICAgICAgT2JqZWN0LmtleXMoZ3JvdXBlZE9iaikubWFwKCh4OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgbGV0IG9iajogYW55ID0ge307XHJcbiAgICAgICAgICAgIGxldCBkaXNhYmxlZENoaWxkcmVucyA9IFtdO1xyXG4gICAgICAgICAgICBvYmpbXCJncnBUaXRsZVwiXSA9IHRydWU7XHJcbiAgICAgICAgICAgIG9ialt0aGlzLnNldHRpbmdzLmxhYmVsS2V5XSA9IHg7XHJcbiAgICAgICAgICAgIG9ialt0aGlzLnNldHRpbmdzLmdyb3VwQnldID0geDtcclxuICAgICAgICAgICAgb2JqWydzZWxlY3RlZCddID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG9ialsnbGlzdCddID0gW107XHJcbiAgICAgICAgICAgIGxldCBjbnQgPSAwO1xyXG4gICAgICAgICAgICBncm91cGVkT2JqW3hdLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbVsnbGlzdCddID0gW107XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNEaXNhYmxlZEl0ZW1QcmVzZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZENoaWxkcmVucy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb2JqLmxpc3QucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChjbnQgPT0gb2JqLmxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGN1cnJlbnQgZ3JvdXAgaXRlbSdzIGFsbCBjaGlsZHJlbnMgYXJlIGRpc2FibGVkIG9yIG5vdFxyXG4gICAgICAgICAgICBvYmpbJ2Rpc2FibGVkJ10gPSBkaXNhYmxlZENoaWxkcmVucy5sZW5ndGggPT09IGdyb3VwZWRPYmpbeF0ubGVuZ3RoO1xyXG4gICAgICAgICAgICB0ZW1wQXJyLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgLy8gb2JqLmxpc3QuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIC8vICAgICB0ZW1wQXJyLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0ZW1wQXJyO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGZpbHRlckluZmluaXRlTGlzdChldnQ6IGFueSkge1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZEVsZW1zOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy5ncm91cENhY2hlZEl0ZW1zLnNsaWNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLmNhY2hlZEl0ZW1zLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSB0aGlzLmNhY2hlZEl0ZW1zLnNsaWNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKGV2dCAhPSBudWxsIHx8IGV2dCAhPSAnJykgJiYgIXRoaXMuc2V0dGluZ3MuZ3JvdXBCeSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5zZWFyY2hCeS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IHRoaXMuc2V0dGluZ3Muc2VhcmNoQnkubGVuZ3RoOyB0KyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YS5maWx0ZXIoKGVsOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsW3RoaXMuc2V0dGluZ3Muc2VhcmNoQnlbdF0udG9TdHJpbmcoKV0udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZXZ0LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRFbGVtcy5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlydHVhbGRhdGEuZmlsdGVyKGZ1bmN0aW9uIChlbDogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcHJvcCBpbiBlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxbcHJvcF0udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZXZ0LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRFbGVtcy5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhID0gZmlsdGVyZWRFbGVtcztcclxuICAgICAgICAgICAgdGhpcy5pbmZpbml0ZUZpbHRlckxlbmd0aCA9IHRoaXMudmlydHVhbGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXZ0LnRvU3RyaW5nKCkgIT0gJycgJiYgdGhpcy5zZXR0aW5ncy5ncm91cEJ5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBlZERhdGEuZmlsdGVyKGZ1bmN0aW9uIChlbDogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWwuaGFzT3duUHJvcGVydHkoJ2dycFRpdGxlJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJlZEVsZW1zLnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcHJvcCBpbiBlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxbcHJvcF0udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZXZ0LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRFbGVtcy5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5ncm91cGVkRGF0YSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gZmlsdGVyZWRFbGVtcztcclxuICAgICAgICAgICAgdGhpcy5pbmZpbml0ZUZpbHRlckxlbmd0aCA9IHRoaXMuZ3JvdXBlZERhdGEubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldnQudG9TdHJpbmcoKSA9PSAnJyAmJiB0aGlzLmNhY2hlZEl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy52aXJ0dWFsZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnZpcnR1YWxkYXRhID0gdGhpcy5jYWNoZWRJdGVtcztcclxuICAgICAgICAgICAgdGhpcy5pbmZpbml0ZUZpbHRlckxlbmd0aCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmlydHVhbFNjcm9sbGVyLnJlZnJlc2goKTtcclxuICAgIH1cclxuICAgIHJlc2V0SW5maW5pdGVTZWFyY2goKSB7XHJcbiAgICAgICAgdGhpcy5maWx0ZXIgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuaXNJbmZpbml0ZUZpbHRlclNlbGVjdEFsbCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmlydHVhbGRhdGEgPSBbXTtcclxuICAgICAgICB0aGlzLnZpcnR1YWxkYXRhID0gdGhpcy5jYWNoZWRJdGVtcztcclxuICAgICAgICB0aGlzLmdyb3VwZWREYXRhID0gdGhpcy5ncm91cENhY2hlZEl0ZW1zO1xyXG4gICAgICAgIHRoaXMuaW5maW5pdGVGaWx0ZXJMZW5ndGggPSAwO1xyXG4gICAgfVxyXG4gICAgb25TY3JvbGxFbmQoZTogYW55KSB7XHJcbiAgICAgICAgaWYgKGUuZW5kSW5kZXggPT09IHRoaXMuZGF0YS5sZW5ndGggLSAxIHx8IGUuc3RhcnRJbmRleCA9PT0gMCkge1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vblNjcm9sbFRvRW5kLmVtaXQoZSk7XHJcblxyXG4gICAgfVxyXG4gICAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHNlbGVjdEdyb3VwKGl0ZW06IGFueSkge1xyXG4gICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpdGVtLmxpc3QuZm9yRWFjaCgob2JqOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlU2VsZWN0ZWQob2JqKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlR3JvdXBJbmZvKGl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLm9uR3JvdXBTZWxlY3QuZW1pdChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpdGVtLmxpc3QuZm9yRWFjaCgob2JqOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkKG9iaikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFNlbGVjdGVkKG9iaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVHcm91cEluZm8oaXRlbSk7XHJcbiAgICAgICAgICAgIHRoaXMub25Hcm91cERlU2VsZWN0LmVtaXQoaXRlbSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbiAgICBhZGRGaWx0ZXJOZXdJdGVtKCkge1xyXG4gICAgICAgIHRoaXMub25BZGRGaWx0ZXJOZXdJdGVtLmVtaXQodGhpcy5maWx0ZXIpO1xyXG4gICAgICAgIHRoaXMuZmlsdGVyUGlwZSA9IG5ldyBMaXN0RmlsdGVyUGlwZSh0aGlzLmRzKTtcclxuICAgICAgICB0aGlzLmZpbHRlclBpcGUudHJhbnNmb3JtKHRoaXMuZGF0YSwgdGhpcy5maWx0ZXIsIHRoaXMuc2V0dGluZ3Muc2VhcmNoQnkpO1xyXG4gICAgfVxyXG4gICAgY2FsY3VsYXRlRHJvcGRvd25EaXJlY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHNob3VsZE9wZW5Ub3dhcmRzVG9wID0gdGhpcy5zZXR0aW5ncy5wb3NpdGlvbiA9PSAndG9wJztcclxuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5hdXRvUG9zaXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3QgZHJvcGRvd25IZWlnaHQgPSB0aGlzLmRyb3Bkb3duTGlzdEVsZW0ubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXdwb3J0SGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRMaXN0Qm91bmRzID0gdGhpcy5zZWxlY3RlZExpc3RFbGVtLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcGFjZU9uVG9wOiBudW1iZXIgPSBzZWxlY3RlZExpc3RCb3VuZHMudG9wO1xyXG4gICAgICAgICAgICBjb25zdCBzcGFjZU9uQm90dG9tOiBudW1iZXIgPSB2aWV3cG9ydEhlaWdodCAtIHNlbGVjdGVkTGlzdEJvdW5kcy50b3A7XHJcbiAgICAgICAgICAgIGlmIChzcGFjZU9uQm90dG9tIDwgc3BhY2VPblRvcCAmJiBkcm9wZG93bkhlaWdodCA8IHNwYWNlT25Ub3ApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub3BlblRvd2FyZHNUb3AodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5Ub3dhcmRzVG9wKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBLZWVwIHByZWZlcmVuY2UgaWYgdGhlcmUgaXMgbm90IGVub3VnaCBzcGFjZSBvbiBlaXRoZXIgdGhlIHRvcCBvciBib3R0b21cclxuICAgICAgICAgICAgLyogXHRcdFx0aWYgKHNwYWNlT25Ub3AgfHwgc3BhY2VPbkJvdHRvbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNob3VsZE9wZW5Ub3dhcmRzVG9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdWxkT3BlblRvd2FyZHNUb3AgPSBzcGFjZU9uVG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRPcGVuVG93YXJkc1RvcCA9ICFzcGFjZU9uQm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ICovXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIG9wZW5Ub3dhcmRzVG9wKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICYmIHRoaXMuc2VsZWN0ZWRMaXN0RWxlbS5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duTGlzdFlPZmZzZXQgPSAxNSArIHRoaXMuc2VsZWN0ZWRMaXN0RWxlbS5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3duTGlzdFlPZmZzZXQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFyU2VsZWN0aW9uKGU6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmdyb3VwQnkpIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91cENhY2hlZEl0ZW1zLmZvckVhY2goKG9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2JqLnNlbGVjdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2xlYXJTZWFyY2goKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXMgPSBbXTtcclxuICAgICAgICB0aGlzLm9uRGVTZWxlY3RBbGwuZW1pdCh0aGlzLnNlbGVjdGVkSXRlbXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFZpcnR1YWxTY3JvbGxlck1vZHVsZV0sXHJcbiAgICBkZWNsYXJhdGlvbnM6IFtBbmd1bGFyTXVsdGlTZWxlY3QsIENsaWNrT3V0c2lkZURpcmVjdGl2ZSwgU2Nyb2xsRGlyZWN0aXZlLCBzdHlsZURpcmVjdGl2ZSwgTGlzdEZpbHRlclBpcGUsIEl0ZW0sIFRlbXBsYXRlUmVuZGVyZXIsIEJhZGdlLCBTZWFyY2gsIHNldFBvc2l0aW9uLCBDSWNvbl0sXHJcbiAgICBleHBvcnRzOiBbQW5ndWxhck11bHRpU2VsZWN0LCBDbGlja091dHNpZGVEaXJlY3RpdmUsIFNjcm9sbERpcmVjdGl2ZSwgc3R5bGVEaXJlY3RpdmUsIExpc3RGaWx0ZXJQaXBlLCBJdGVtLCBUZW1wbGF0ZVJlbmRlcmVyLCBCYWRnZSwgU2VhcmNoLCBzZXRQb3NpdGlvbiwgQ0ljb25dLFxyXG4gICAgcHJvdmlkZXJzOiBbRGF0YVNlcnZpY2VdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFyTXVsdGlTZWxlY3RNb2R1bGUgeyB9XHJcbiJdfQ==