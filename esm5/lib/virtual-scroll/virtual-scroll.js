/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ContentChild, ElementRef, EventEmitter, Inject, Optional, Input, NgModule, NgZone, Output, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CommonModule } from '@angular/common';
import * as tween from '@tweenjs/tween.js';
/**
 * @return {?}
 */
export function VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY() {
    return {
        scrollThrottlingTime: 0,
        scrollDebounceTime: 0,
        scrollAnimationTime: 750,
        checkResizeInterval: 1000,
        resizeBypassRefreshThreshold: 5,
        modifyOverflowStyleOfParentScroll: true,
        stripedTable: false
    };
}
var VirtualScrollerComponent = /** @class */ (function () {
    function VirtualScrollerComponent(element, renderer, zone, changeDetectorRef, platformId, options) {
        this.element = element;
        this.renderer = renderer;
        this.zone = zone;
        this.changeDetectorRef = changeDetectorRef;
        this.window = window;
        this.executeRefreshOutsideAngularZone = false;
        this._enableUnequalChildrenSizes = false;
        this.useMarginInsteadOfTranslate = false;
        this.ssrViewportWidth = 1920;
        this.ssrViewportHeight = 1080;
        this._bufferAmount = 0;
        this._items = [];
        this.compareItems = (/**
         * @param {?} item1
         * @param {?} item2
         * @return {?}
         */
        function (item1, item2) { return item1 === item2; });
        this.vsUpdate = new EventEmitter();
        this.vsChange = new EventEmitter();
        this.vsStart = new EventEmitter();
        this.vsEnd = new EventEmitter();
        this.calculatedScrollbarWidth = 0;
        this.calculatedScrollbarHeight = 0;
        this.padding = 0;
        this.previousViewPort = (/** @type {?} */ ({}));
        this.cachedPageSize = 0;
        this.previousScrollNumberElements = 0;
        this.isAngularUniversalSSR = isPlatformServer(platformId);
        this.scrollThrottlingTime = options.scrollThrottlingTime;
        this.scrollDebounceTime = options.scrollDebounceTime;
        this.scrollAnimationTime = options.scrollAnimationTime;
        this.scrollbarWidth = options.scrollbarWidth;
        this.scrollbarHeight = options.scrollbarHeight;
        this.checkResizeInterval = options.checkResizeInterval;
        this.resizeBypassRefreshThreshold = options.resizeBypassRefreshThreshold;
        this.modifyOverflowStyleOfParentScroll = options.modifyOverflowStyleOfParentScroll;
        this.stripedTable = options.stripedTable;
        this.horizontal = false;
        this.resetWrapGroupDimensions();
    }
    Object.defineProperty(VirtualScrollerComponent.prototype, "viewPortInfo", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var pageInfo = this.previousViewPort || (/** @type {?} */ ({}));
            return {
                startIndex: pageInfo.startIndex || 0,
                endIndex: pageInfo.endIndex || 0,
                scrollStartPosition: pageInfo.scrollStartPosition || 0,
                scrollEndPosition: pageInfo.scrollEndPosition || 0,
                maxScrollPosition: pageInfo.maxScrollPosition || 0,
                startIndexWithBuffer: pageInfo.startIndexWithBuffer || 0,
                endIndexWithBuffer: pageInfo.endIndexWithBuffer || 0
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "enableUnequalChildrenSizes", {
        get: /**
         * @return {?}
         */
        function () {
            return this._enableUnequalChildrenSizes;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this._enableUnequalChildrenSizes === value) {
                return;
            }
            this._enableUnequalChildrenSizes = value;
            this.minMeasuredChildWidth = undefined;
            this.minMeasuredChildHeight = undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "bufferAmount", {
        get: /**
         * @return {?}
         */
        function () {
            if (typeof (this._bufferAmount) === 'number' && this._bufferAmount >= 0) {
                return this._bufferAmount;
            }
            else {
                return this.enableUnequalChildrenSizes ? 5 : 0;
            }
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._bufferAmount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "scrollThrottlingTime", {
        get: /**
         * @return {?}
         */
        function () {
            return this._scrollThrottlingTime;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._scrollThrottlingTime = value;
            this.updateOnScrollFunction();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "scrollDebounceTime", {
        get: /**
         * @return {?}
         */
        function () {
            return this._scrollDebounceTime;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._scrollDebounceTime = value;
            this.updateOnScrollFunction();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.updateOnScrollFunction = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this_1 = this;
        if (this.scrollDebounceTime) {
            this.onScroll = (/** @type {?} */ (this.debounce((/**
             * @return {?}
             */
            function () {
                _this_1.refresh_internal(false);
            }), this.scrollDebounceTime)));
        }
        else if (this.scrollThrottlingTime) {
            this.onScroll = (/** @type {?} */ (this.throttleTrailing((/**
             * @return {?}
             */
            function () {
                _this_1.refresh_internal(false);
            }), this.scrollThrottlingTime)));
        }
        else {
            this.onScroll = (/**
             * @return {?}
             */
            function () {
                _this_1.refresh_internal(false);
            });
        }
    };
    Object.defineProperty(VirtualScrollerComponent.prototype, "checkResizeInterval", {
        get: /**
         * @return {?}
         */
        function () {
            return this._checkResizeInterval;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this._checkResizeInterval === value) {
                return;
            }
            this._checkResizeInterval = value;
            this.addScrollEventHandlers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "items", {
        get: /**
         * @return {?}
         */
        function () {
            return this._items;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value === this._items) {
                return;
            }
            this._items = value || [];
            this.refresh_internal(true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "horizontal", {
        get: /**
         * @return {?}
         */
        function () {
            return this._horizontal;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._horizontal = value;
            this.updateDirection();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.revertParentOverscroll = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var scrollElement = this.getScrollElement();
        if (scrollElement && this.oldParentScrollOverflow) {
            scrollElement.style['overflow-y'] = this.oldParentScrollOverflow.y;
            scrollElement.style['overflow-x'] = this.oldParentScrollOverflow.x;
        }
        this.oldParentScrollOverflow = undefined;
    };
    Object.defineProperty(VirtualScrollerComponent.prototype, "parentScroll", {
        get: /**
         * @return {?}
         */
        function () {
            return this._parentScroll;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this._parentScroll === value) {
                return;
            }
            this.revertParentOverscroll();
            this._parentScroll = value;
            this.addScrollEventHandlers();
            /** @type {?} */
            var scrollElement = this.getScrollElement();
            if (this.modifyOverflowStyleOfParentScroll && scrollElement !== this.element.nativeElement) {
                this.oldParentScrollOverflow = { x: scrollElement.style['overflow-x'], y: scrollElement.style['overflow-y'] };
                scrollElement.style['overflow-y'] = this.horizontal ? 'visible' : 'auto';
                scrollElement.style['overflow-x'] = this.horizontal ? 'auto' : 'visible';
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    VirtualScrollerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.addScrollEventHandlers();
    };
    /**
     * @return {?}
     */
    VirtualScrollerComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.removeScrollEventHandlers();
        this.revertParentOverscroll();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    VirtualScrollerComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var indexLengthChanged = this.cachedItemsLength !== this.items.length;
        this.cachedItemsLength = this.items.length;
        /** @type {?} */
        var firstRun = !changes.items || !changes.items.previousValue || changes.items.previousValue.length === 0;
        this.refresh_internal(indexLengthChanged || firstRun);
    };
    /**
     * @return {?}
     */
    VirtualScrollerComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this.cachedItemsLength !== this.items.length) {
            this.cachedItemsLength = this.items.length;
            this.refresh_internal(true);
            return;
        }
        if (this.previousViewPort && this.viewPortItems && this.viewPortItems.length > 0) {
            /** @type {?} */
            var itemsArrayChanged = false;
            for (var i = 0; i < this.viewPortItems.length; ++i) {
                if (!this.compareItems(this.items[this.previousViewPort.startIndexWithBuffer + i], this.viewPortItems[i])) {
                    itemsArrayChanged = true;
                    break;
                }
            }
            if (itemsArrayChanged) {
                this.refresh_internal(true);
            }
        }
    };
    /**
     * @return {?}
     */
    VirtualScrollerComponent.prototype.refresh = /**
     * @return {?}
     */
    function () {
        this.refresh_internal(true);
    };
    /**
     * @return {?}
     */
    VirtualScrollerComponent.prototype.invalidateAllCachedMeasurements = /**
     * @return {?}
     */
    function () {
        this.wrapGroupDimensions = {
            maxChildSizePerWrapGroup: [],
            numberOfKnownWrapGroupChildSizes: 0,
            sumOfKnownWrapGroupChildWidths: 0,
            sumOfKnownWrapGroupChildHeights: 0
        };
        this.minMeasuredChildWidth = undefined;
        this.minMeasuredChildHeight = undefined;
        this.refresh_internal(false);
    };
    /**
     * @param {?} item
     * @return {?}
     */
    VirtualScrollerComponent.prototype.invalidateCachedMeasurementForItem = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        if (this.enableUnequalChildrenSizes) {
            /** @type {?} */
            var index = this.items && this.items.indexOf(item);
            if (index >= 0) {
                this.invalidateCachedMeasurementAtIndex(index);
            }
        }
        else {
            this.minMeasuredChildWidth = undefined;
            this.minMeasuredChildHeight = undefined;
        }
        this.refresh_internal(false);
    };
    /**
     * @param {?} index
     * @return {?}
     */
    VirtualScrollerComponent.prototype.invalidateCachedMeasurementAtIndex = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (this.enableUnequalChildrenSizes) {
            /** @type {?} */
            var cachedMeasurement = this.wrapGroupDimensions.maxChildSizePerWrapGroup[index];
            if (cachedMeasurement) {
                this.wrapGroupDimensions.maxChildSizePerWrapGroup[index] = undefined;
                --this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
                this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths -= cachedMeasurement.childWidth || 0;
                this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights -= cachedMeasurement.childHeight || 0;
            }
        }
        else {
            this.minMeasuredChildWidth = undefined;
            this.minMeasuredChildHeight = undefined;
        }
        this.refresh_internal(false);
    };
    /**
     * @param {?} item
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    VirtualScrollerComponent.prototype.scrollInto = /**
     * @param {?} item
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    function (item, alignToBeginning, additionalOffset, animationMilliseconds, animationCompletedCallback) {
        if (alignToBeginning === void 0) { alignToBeginning = true; }
        if (additionalOffset === void 0) { additionalOffset = 0; }
        if (animationMilliseconds === void 0) { animationMilliseconds = undefined; }
        if (animationCompletedCallback === void 0) { animationCompletedCallback = undefined; }
        /** @type {?} */
        var index = this.items.indexOf(item);
        if (index === -1) {
            return;
        }
        this.scrollToIndex(index, alignToBeginning, additionalOffset, animationMilliseconds, animationCompletedCallback);
    };
    /**
     * @param {?} index
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    VirtualScrollerComponent.prototype.scrollToIndex = /**
     * @param {?} index
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    function (index, alignToBeginning, additionalOffset, animationMilliseconds, animationCompletedCallback) {
        var _this_1 = this;
        if (alignToBeginning === void 0) { alignToBeginning = true; }
        if (additionalOffset === void 0) { additionalOffset = 0; }
        if (animationMilliseconds === void 0) { animationMilliseconds = undefined; }
        if (animationCompletedCallback === void 0) { animationCompletedCallback = undefined; }
        /** @type {?} */
        var maxRetries = 5;
        /** @type {?} */
        var retryIfNeeded = (/**
         * @return {?}
         */
        function () {
            --maxRetries;
            if (maxRetries <= 0) {
                if (animationCompletedCallback) {
                    animationCompletedCallback();
                }
                return;
            }
            /** @type {?} */
            var dimensions = _this_1.calculateDimensions();
            /** @type {?} */
            var desiredStartIndex = Math.min(Math.max(index, 0), dimensions.itemCount - 1);
            if (_this_1.previousViewPort.startIndex === desiredStartIndex) {
                if (animationCompletedCallback) {
                    animationCompletedCallback();
                }
                return;
            }
            _this_1.scrollToIndex_internal(index, alignToBeginning, additionalOffset, 0, retryIfNeeded);
        });
        this.scrollToIndex_internal(index, alignToBeginning, additionalOffset, animationMilliseconds, retryIfNeeded);
    };
    /**
     * @protected
     * @param {?} index
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    VirtualScrollerComponent.prototype.scrollToIndex_internal = /**
     * @protected
     * @param {?} index
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    function (index, alignToBeginning, additionalOffset, animationMilliseconds, animationCompletedCallback) {
        if (alignToBeginning === void 0) { alignToBeginning = true; }
        if (additionalOffset === void 0) { additionalOffset = 0; }
        if (animationMilliseconds === void 0) { animationMilliseconds = undefined; }
        if (animationCompletedCallback === void 0) { animationCompletedCallback = undefined; }
        animationMilliseconds = animationMilliseconds === undefined ? this.scrollAnimationTime : animationMilliseconds;
        /** @type {?} */
        var dimensions = this.calculateDimensions();
        /** @type {?} */
        var scroll = this.calculatePadding(index, dimensions) + additionalOffset;
        if (!alignToBeginning) {
            scroll -= dimensions.wrapGroupsPerPage * dimensions[this._childScrollDim];
        }
        this.scrollToPosition(scroll, animationMilliseconds, animationCompletedCallback);
    };
    /**
     * @param {?} scrollPosition
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    VirtualScrollerComponent.prototype.scrollToPosition = /**
     * @param {?} scrollPosition
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    function (scrollPosition, animationMilliseconds, animationCompletedCallback) {
        var _this_1 = this;
        if (animationMilliseconds === void 0) { animationMilliseconds = undefined; }
        if (animationCompletedCallback === void 0) { animationCompletedCallback = undefined; }
        scrollPosition += this.getElementsOffset();
        animationMilliseconds = animationMilliseconds === undefined ? this.scrollAnimationTime : animationMilliseconds;
        /** @type {?} */
        var scrollElement = this.getScrollElement();
        /** @type {?} */
        var animationRequest;
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = undefined;
        }
        if (!animationMilliseconds) {
            this.renderer.setProperty(scrollElement, this._scrollType, scrollPosition);
            this.refresh_internal(false, animationCompletedCallback);
            return;
        }
        /** @type {?} */
        var tweenConfigObj = { scrollPosition: scrollElement[this._scrollType] };
        /** @type {?} */
        var newTween = new tween.Tween(tweenConfigObj)
            .to({ scrollPosition: scrollPosition }, animationMilliseconds)
            .easing(tween.Easing.Quadratic.Out)
            .onUpdate((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            if (isNaN(data.scrollPosition)) {
                return;
            }
            _this_1.renderer.setProperty(scrollElement, _this_1._scrollType, data.scrollPosition);
            _this_1.refresh_internal(false);
        }))
            .onStop((/**
         * @return {?}
         */
        function () {
            cancelAnimationFrame(animationRequest);
        }))
            .start();
        /** @type {?} */
        var animate = (/**
         * @param {?=} time
         * @return {?}
         */
        function (time) {
            if (!newTween["isPlaying"]()) {
                return;
            }
            newTween.update(time);
            if (tweenConfigObj.scrollPosition === scrollPosition) {
                _this_1.refresh_internal(false, animationCompletedCallback);
                return;
            }
            _this_1.zone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                animationRequest = requestAnimationFrame(animate);
            }));
        });
        animate();
        this.currentTween = newTween;
    };
    /**
     * @protected
     * @param {?} element
     * @return {?}
     */
    VirtualScrollerComponent.prototype.getElementSize = /**
     * @protected
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var result = element.getBoundingClientRect();
        /** @type {?} */
        var styles = getComputedStyle(element);
        /** @type {?} */
        var marginTop = parseInt(styles['margin-top'], 10) || 0;
        /** @type {?} */
        var marginBottom = parseInt(styles['margin-bottom'], 10) || 0;
        /** @type {?} */
        var marginLeft = parseInt(styles['margin-left'], 10) || 0;
        /** @type {?} */
        var marginRight = parseInt(styles['margin-right'], 10) || 0;
        return {
            top: result.top + marginTop,
            bottom: result.bottom + marginBottom,
            left: result.left + marginLeft,
            right: result.right + marginRight,
            width: result.width + marginLeft + marginRight,
            height: result.height + marginTop + marginBottom
        };
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.checkScrollElementResized = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var boundingRect = this.getElementSize(this.getScrollElement());
        /** @type {?} */
        var sizeChanged;
        if (!this.previousScrollBoundingRect) {
            sizeChanged = true;
        }
        else {
            /** @type {?} */
            var widthChange = Math.abs(boundingRect.width - this.previousScrollBoundingRect.width);
            /** @type {?} */
            var heightChange = Math.abs(boundingRect.height - this.previousScrollBoundingRect.height);
            sizeChanged = widthChange > this.resizeBypassRefreshThreshold || heightChange > this.resizeBypassRefreshThreshold;
        }
        if (sizeChanged) {
            this.previousScrollBoundingRect = boundingRect;
            if (boundingRect.width > 0 && boundingRect.height > 0) {
                this.refresh_internal(false);
            }
        }
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.updateDirection = /**
     * @protected
     * @return {?}
     */
    function () {
        if (this.horizontal) {
            this._invisiblePaddingProperty = 'width';
            this._offsetType = 'offsetLeft';
            this._pageOffsetType = 'pageXOffset';
            this._childScrollDim = 'childWidth';
            this._marginDir = 'margin-left';
            this._translateDir = 'translateX';
            this._scrollType = 'scrollLeft';
        }
        else {
            this._invisiblePaddingProperty = 'height';
            this._offsetType = 'offsetTop';
            this._pageOffsetType = 'pageYOffset';
            this._childScrollDim = 'childHeight';
            this._marginDir = 'margin-top';
            this._translateDir = 'translateY';
            this._scrollType = 'scrollTop';
        }
    };
    /**
     * @protected
     * @param {?} func
     * @param {?} wait
     * @return {?}
     */
    VirtualScrollerComponent.prototype.debounce = /**
     * @protected
     * @param {?} func
     * @param {?} wait
     * @return {?}
     */
    function (func, wait) {
        /** @type {?} */
        var throttled = this.throttleTrailing(func, wait);
        /** @type {?} */
        var result = (/**
         * @return {?}
         */
        function () {
            throttled['cancel']();
            throttled.apply(this, arguments);
        });
        result['cancel'] = (/**
         * @return {?}
         */
        function () {
            throttled['cancel']();
        });
        return result;
    };
    /**
     * @protected
     * @param {?} func
     * @param {?} wait
     * @return {?}
     */
    VirtualScrollerComponent.prototype.throttleTrailing = /**
     * @protected
     * @param {?} func
     * @param {?} wait
     * @return {?}
     */
    function (func, wait) {
        /** @type {?} */
        var timeout = undefined;
        /** @type {?} */
        var _arguments = arguments;
        /** @type {?} */
        var result = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var _this = this;
            _arguments = arguments;
            if (timeout) {
                return;
            }
            if (wait <= 0) {
                func.apply(_this, _arguments);
            }
            else {
                timeout = setTimeout((/**
                 * @return {?}
                 */
                function () {
                    timeout = undefined;
                    func.apply(_this, _arguments);
                }), wait);
            }
        });
        result['cancel'] = (/**
         * @return {?}
         */
        function () {
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
        });
        return result;
    };
    /**
     * @protected
     * @param {?} itemsArrayModified
     * @param {?=} refreshCompletedCallback
     * @param {?=} maxRunTimes
     * @return {?}
     */
    VirtualScrollerComponent.prototype.refresh_internal = /**
     * @protected
     * @param {?} itemsArrayModified
     * @param {?=} refreshCompletedCallback
     * @param {?=} maxRunTimes
     * @return {?}
     */
    function (itemsArrayModified, refreshCompletedCallback, maxRunTimes) {
        //note: maxRunTimes is to force it to keep recalculating if the previous iteration caused a re-render (different sliced items in viewport or scrollPosition changed).
        //The default of 2x max will probably be accurate enough without causing too large a performance bottleneck
        //The code would typically quit out on the 2nd iteration anyways. The main time it'd think more than 2 runs would be necessary would be for vastly different sized child items or if this is the 1st time the items array was initialized.
        //Without maxRunTimes, If the user is actively scrolling this code would become an infinite loop until they stopped scrolling. This would be okay, except each scroll event would start an additional infinte loop. We want to short-circuit it to prevent this.
        var _this_1 = this;
        if (refreshCompletedCallback === void 0) { refreshCompletedCallback = undefined; }
        if (maxRunTimes === void 0) { maxRunTimes = 2; }
        if (itemsArrayModified && this.previousViewPort && this.previousViewPort.scrollStartPosition > 0) {
            //if items were prepended, scroll forward to keep same items visible
            /** @type {?} */
            var oldViewPort_1 = this.previousViewPort;
            /** @type {?} */
            var oldViewPortItems_1 = this.viewPortItems;
            /** @type {?} */
            var oldRefreshCompletedCallback_1 = refreshCompletedCallback;
            refreshCompletedCallback = (/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var scrollLengthDelta = _this_1.previousViewPort.scrollLength - oldViewPort_1.scrollLength;
                if (scrollLengthDelta > 0 && _this_1.viewPortItems) {
                    /** @type {?} */
                    var oldStartItem_1 = oldViewPortItems_1[0];
                    /** @type {?} */
                    var oldStartItemIndex = _this_1.items.findIndex((/**
                     * @param {?} x
                     * @return {?}
                     */
                    function (x) { return _this_1.compareItems(oldStartItem_1, x); }));
                    if (oldStartItemIndex > _this_1.previousViewPort.startIndexWithBuffer) {
                        /** @type {?} */
                        var itemOrderChanged = false;
                        for (var i = 1; i < _this_1.viewPortItems.length; ++i) {
                            if (!_this_1.compareItems(_this_1.items[oldStartItemIndex + i], oldViewPortItems_1[i])) {
                                itemOrderChanged = true;
                                break;
                            }
                        }
                        if (!itemOrderChanged) {
                            _this_1.scrollToPosition(_this_1.previousViewPort.scrollStartPosition + scrollLengthDelta, 0, oldRefreshCompletedCallback_1);
                            return;
                        }
                    }
                }
                if (oldRefreshCompletedCallback_1) {
                    oldRefreshCompletedCallback_1();
                }
            });
        }
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            requestAnimationFrame((/**
             * @return {?}
             */
            function () {
                if (itemsArrayModified) {
                    _this_1.resetWrapGroupDimensions();
                }
                /** @type {?} */
                var viewport = _this_1.calculateViewport();
                /** @type {?} */
                var startChanged = itemsArrayModified || viewport.startIndex !== _this_1.previousViewPort.startIndex;
                /** @type {?} */
                var endChanged = itemsArrayModified || viewport.endIndex !== _this_1.previousViewPort.endIndex;
                /** @type {?} */
                var scrollLengthChanged = viewport.scrollLength !== _this_1.previousViewPort.scrollLength;
                /** @type {?} */
                var paddingChanged = viewport.padding !== _this_1.previousViewPort.padding;
                /** @type {?} */
                var scrollPositionChanged = viewport.scrollStartPosition !== _this_1.previousViewPort.scrollStartPosition || viewport.scrollEndPosition !== _this_1.previousViewPort.scrollEndPosition || viewport.maxScrollPosition !== _this_1.previousViewPort.maxScrollPosition;
                _this_1.previousViewPort = viewport;
                if (scrollLengthChanged) {
                    _this_1.renderer.setStyle(_this_1.invisiblePaddingElementRef.nativeElement, _this_1._invisiblePaddingProperty, viewport.scrollLength + "px");
                }
                if (paddingChanged) {
                    if (_this_1.useMarginInsteadOfTranslate) {
                        _this_1.renderer.setStyle(_this_1.contentElementRef.nativeElement, _this_1._marginDir, viewport.padding + "px");
                    }
                    else {
                        _this_1.renderer.setStyle(_this_1.contentElementRef.nativeElement, 'transform', _this_1._translateDir + "(" + viewport.padding + "px)");
                        _this_1.renderer.setStyle(_this_1.contentElementRef.nativeElement, 'webkitTransform', _this_1._translateDir + "(" + viewport.padding + "px)");
                    }
                }
                if (_this_1.headerElementRef) {
                    /** @type {?} */
                    var scrollPosition = _this_1.getScrollElement()[_this_1._scrollType];
                    /** @type {?} */
                    var containerOffset = _this_1.getElementsOffset();
                    /** @type {?} */
                    var offset = Math.max(scrollPosition - viewport.padding - containerOffset + _this_1.headerElementRef.nativeElement.clientHeight, 0);
                    _this_1.renderer.setStyle(_this_1.headerElementRef.nativeElement, 'transform', _this_1._translateDir + "(" + offset + "px)");
                    _this_1.renderer.setStyle(_this_1.headerElementRef.nativeElement, 'webkitTransform', _this_1._translateDir + "(" + offset + "px)");
                }
                /** @type {?} */
                var changeEventArg = (startChanged || endChanged) ? {
                    startIndex: viewport.startIndex,
                    endIndex: viewport.endIndex,
                    scrollStartPosition: viewport.scrollStartPosition,
                    scrollEndPosition: viewport.scrollEndPosition,
                    startIndexWithBuffer: viewport.startIndexWithBuffer,
                    endIndexWithBuffer: viewport.endIndexWithBuffer,
                    maxScrollPosition: viewport.maxScrollPosition
                } : undefined;
                if (startChanged || endChanged || scrollPositionChanged) {
                    /** @type {?} */
                    var handleChanged = (/**
                     * @return {?}
                     */
                    function () {
                        // update the scroll list to trigger re-render of components in viewport
                        _this_1.viewPortItems = viewport.startIndexWithBuffer >= 0 && viewport.endIndexWithBuffer >= 0 ? _this_1.items.slice(viewport.startIndexWithBuffer, viewport.endIndexWithBuffer + 1) : [];
                        _this_1.vsUpdate.emit(_this_1.viewPortItems);
                        if (startChanged) {
                            _this_1.vsStart.emit(changeEventArg);
                        }
                        if (endChanged) {
                            _this_1.vsEnd.emit(changeEventArg);
                        }
                        if (startChanged || endChanged) {
                            _this_1.changeDetectorRef.markForCheck();
                            _this_1.vsChange.emit(changeEventArg);
                        }
                        if (maxRunTimes > 0) {
                            _this_1.refresh_internal(false, refreshCompletedCallback, maxRunTimes - 1);
                            return;
                        }
                        if (refreshCompletedCallback) {
                            refreshCompletedCallback();
                        }
                    });
                    if (_this_1.executeRefreshOutsideAngularZone) {
                        handleChanged();
                    }
                    else {
                        _this_1.zone.run(handleChanged);
                    }
                }
                else {
                    if (maxRunTimes > 0 && (scrollLengthChanged || paddingChanged)) {
                        _this_1.refresh_internal(false, refreshCompletedCallback, maxRunTimes - 1);
                        return;
                    }
                    if (refreshCompletedCallback) {
                        refreshCompletedCallback();
                    }
                }
            }));
        }));
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.getScrollElement = /**
     * @protected
     * @return {?}
     */
    function () {
        return this.parentScroll instanceof Window ? document.scrollingElement || document.documentElement || document.body : this.parentScroll || this.element.nativeElement;
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.addScrollEventHandlers = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this_1 = this;
        if (this.isAngularUniversalSSR) {
            return;
        }
        /** @type {?} */
        var scrollElement = this.getScrollElement();
        this.removeScrollEventHandlers();
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            if (_this_1.parentScroll instanceof Window) {
                _this_1.disposeScrollHandler = _this_1.renderer.listen('window', 'scroll', _this_1.onScroll);
                _this_1.disposeResizeHandler = _this_1.renderer.listen('window', 'resize', _this_1.onScroll);
            }
            else {
                _this_1.disposeScrollHandler = _this_1.renderer.listen(scrollElement, 'scroll', _this_1.onScroll);
                if (_this_1._checkResizeInterval > 0) {
                    _this_1.checkScrollElementResizedTimer = (/** @type {?} */ (setInterval((/**
                     * @return {?}
                     */
                    function () { _this_1.checkScrollElementResized(); }), _this_1._checkResizeInterval)));
                }
            }
        }));
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.removeScrollEventHandlers = /**
     * @protected
     * @return {?}
     */
    function () {
        if (this.checkScrollElementResizedTimer) {
            clearInterval(this.checkScrollElementResizedTimer);
        }
        if (this.disposeScrollHandler) {
            this.disposeScrollHandler();
            this.disposeScrollHandler = undefined;
        }
        if (this.disposeResizeHandler) {
            this.disposeResizeHandler();
            this.disposeResizeHandler = undefined;
        }
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.getElementsOffset = /**
     * @protected
     * @return {?}
     */
    function () {
        if (this.isAngularUniversalSSR) {
            return 0;
        }
        /** @type {?} */
        var offset = 0;
        if (this.containerElementRef && this.containerElementRef.nativeElement) {
            offset += this.containerElementRef.nativeElement[this._offsetType];
        }
        if (this.parentScroll) {
            /** @type {?} */
            var scrollElement = this.getScrollElement();
            /** @type {?} */
            var elementClientRect = this.getElementSize(this.element.nativeElement);
            /** @type {?} */
            var scrollClientRect = this.getElementSize(scrollElement);
            if (this.horizontal) {
                offset += elementClientRect.left - scrollClientRect.left;
            }
            else {
                offset += elementClientRect.top - scrollClientRect.top;
            }
            if (!(this.parentScroll instanceof Window)) {
                offset += scrollElement[this._scrollType];
            }
        }
        return offset;
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.countItemsPerWrapGroup = /**
     * @protected
     * @return {?}
     */
    function () {
        if (this.isAngularUniversalSSR) {
            return Math.round(this.horizontal ? this.ssrViewportHeight / this.ssrChildHeight : this.ssrViewportWidth / this.ssrChildWidth);
        }
        /** @type {?} */
        var propertyName = this.horizontal ? 'offsetLeft' : 'offsetTop';
        /** @type {?} */
        var children = ((this.containerElementRef && this.containerElementRef.nativeElement) || this.contentElementRef.nativeElement).children;
        /** @type {?} */
        var childrenLength = children ? children.length : 0;
        if (childrenLength === 0) {
            return 1;
        }
        /** @type {?} */
        var firstOffset = children[0][propertyName];
        /** @type {?} */
        var result = 1;
        while (result < childrenLength && firstOffset === children[result][propertyName]) {
            ++result;
        }
        return result;
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.getScrollStartPosition = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var windowScrollValue = undefined;
        if (this.parentScroll instanceof Window) {
            windowScrollValue = window[this._pageOffsetType];
        }
        return windowScrollValue || this.getScrollElement()[this._scrollType] || 0;
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.resetWrapGroupDimensions = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var oldWrapGroupDimensions = this.wrapGroupDimensions;
        this.invalidateAllCachedMeasurements();
        if (!this.enableUnequalChildrenSizes || !oldWrapGroupDimensions || oldWrapGroupDimensions.numberOfKnownWrapGroupChildSizes === 0) {
            return;
        }
        /** @type {?} */
        var itemsPerWrapGroup = this.countItemsPerWrapGroup();
        for (var wrapGroupIndex = 0; wrapGroupIndex < oldWrapGroupDimensions.maxChildSizePerWrapGroup.length; ++wrapGroupIndex) {
            /** @type {?} */
            var oldWrapGroupDimension = oldWrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex];
            if (!oldWrapGroupDimension || !oldWrapGroupDimension.items || !oldWrapGroupDimension.items.length) {
                continue;
            }
            if (oldWrapGroupDimension.items.length !== itemsPerWrapGroup) {
                return;
            }
            /** @type {?} */
            var itemsChanged = false;
            /** @type {?} */
            var arrayStartIndex = itemsPerWrapGroup * wrapGroupIndex;
            for (var i = 0; i < itemsPerWrapGroup; ++i) {
                if (!this.compareItems(oldWrapGroupDimension.items[i], this.items[arrayStartIndex + i])) {
                    itemsChanged = true;
                    break;
                }
            }
            if (!itemsChanged) {
                ++this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
                this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths += oldWrapGroupDimension.childWidth || 0;
                this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights += oldWrapGroupDimension.childHeight || 0;
                this.wrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex] = oldWrapGroupDimension;
            }
        }
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.calculateDimensions = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var scrollElement = this.getScrollElement();
        /** @type {?} */
        var maxCalculatedScrollBarSize = 25;
        this.calculatedScrollbarHeight = Math.max(Math.min(scrollElement.offsetHeight - scrollElement.clientHeight, maxCalculatedScrollBarSize), this.calculatedScrollbarHeight);
        this.calculatedScrollbarWidth = Math.max(Math.min(scrollElement.offsetWidth - scrollElement.clientWidth, maxCalculatedScrollBarSize), this.calculatedScrollbarWidth);
        /** @type {?} */
        var viewportWidth = scrollElement.offsetWidth - (this.scrollbarWidth || this.calculatedScrollbarWidth || (this.horizontal ? 0 : maxCalculatedScrollBarSize));
        /** @type {?} */
        var viewportHeight = scrollElement.offsetHeight - (this.scrollbarHeight || this.calculatedScrollbarHeight || (this.horizontal ? maxCalculatedScrollBarSize : 0));
        /** @type {?} */
        var content = (this.containerElementRef && this.containerElementRef.nativeElement) || this.contentElementRef.nativeElement;
        /** @type {?} */
        var itemsPerWrapGroup = this.countItemsPerWrapGroup();
        /** @type {?} */
        var wrapGroupsPerPage;
        /** @type {?} */
        var defaultChildWidth;
        /** @type {?} */
        var defaultChildHeight;
        if (this.isAngularUniversalSSR) {
            viewportWidth = this.ssrViewportWidth;
            viewportHeight = this.ssrViewportHeight;
            defaultChildWidth = this.ssrChildWidth;
            defaultChildHeight = this.ssrChildHeight;
            /** @type {?} */
            var itemsPerRow = Math.max(Math.ceil(viewportWidth / defaultChildWidth), 1);
            /** @type {?} */
            var itemsPerCol = Math.max(Math.ceil(viewportHeight / defaultChildHeight), 1);
            wrapGroupsPerPage = this.horizontal ? itemsPerRow : itemsPerCol;
        }
        else if (!this.enableUnequalChildrenSizes) {
            if (content.children.length > 0) {
                if (!this.childWidth || !this.childHeight) {
                    if (!this.minMeasuredChildWidth && viewportWidth > 0) {
                        this.minMeasuredChildWidth = viewportWidth;
                    }
                    if (!this.minMeasuredChildHeight && viewportHeight > 0) {
                        this.minMeasuredChildHeight = viewportHeight;
                    }
                }
                /** @type {?} */
                var child = content.children[0];
                /** @type {?} */
                var clientRect = this.getElementSize(child);
                this.minMeasuredChildWidth = Math.min(this.minMeasuredChildWidth, clientRect.width);
                this.minMeasuredChildHeight = Math.min(this.minMeasuredChildHeight, clientRect.height);
            }
            defaultChildWidth = this.childWidth || this.minMeasuredChildWidth || viewportWidth;
            defaultChildHeight = this.childHeight || this.minMeasuredChildHeight || viewportHeight;
            /** @type {?} */
            var itemsPerRow = Math.max(Math.ceil(viewportWidth / defaultChildWidth), 1);
            /** @type {?} */
            var itemsPerCol = Math.max(Math.ceil(viewportHeight / defaultChildHeight), 1);
            wrapGroupsPerPage = this.horizontal ? itemsPerRow : itemsPerCol;
        }
        else {
            /** @type {?} */
            var scrollOffset = scrollElement[this._scrollType] - (this.previousViewPort ? this.previousViewPort.padding : 0);
            /** @type {?} */
            var arrayStartIndex = this.previousViewPort.startIndexWithBuffer || 0;
            /** @type {?} */
            var wrapGroupIndex = Math.ceil(arrayStartIndex / itemsPerWrapGroup);
            /** @type {?} */
            var maxWidthForWrapGroup = 0;
            /** @type {?} */
            var maxHeightForWrapGroup = 0;
            /** @type {?} */
            var sumOfVisibleMaxWidths = 0;
            /** @type {?} */
            var sumOfVisibleMaxHeights = 0;
            wrapGroupsPerPage = 0;
            for (var i = 0; i < content.children.length; ++i) {
                ++arrayStartIndex;
                /** @type {?} */
                var child = content.children[i];
                /** @type {?} */
                var clientRect = this.getElementSize(child);
                maxWidthForWrapGroup = Math.max(maxWidthForWrapGroup, clientRect.width);
                maxHeightForWrapGroup = Math.max(maxHeightForWrapGroup, clientRect.height);
                if (arrayStartIndex % itemsPerWrapGroup === 0) {
                    /** @type {?} */
                    var oldValue = this.wrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex];
                    if (oldValue) {
                        --this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
                        this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths -= oldValue.childWidth || 0;
                        this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights -= oldValue.childHeight || 0;
                    }
                    ++this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
                    /** @type {?} */
                    var items = this.items.slice(arrayStartIndex - itemsPerWrapGroup, arrayStartIndex);
                    this.wrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex] = {
                        childWidth: maxWidthForWrapGroup,
                        childHeight: maxHeightForWrapGroup,
                        items: items
                    };
                    this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths += maxWidthForWrapGroup;
                    this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights += maxHeightForWrapGroup;
                    if (this.horizontal) {
                        /** @type {?} */
                        var maxVisibleWidthForWrapGroup = Math.min(maxWidthForWrapGroup, Math.max(viewportWidth - sumOfVisibleMaxWidths, 0));
                        if (scrollOffset > 0) {
                            /** @type {?} */
                            var scrollOffsetToRemove = Math.min(scrollOffset, maxVisibleWidthForWrapGroup);
                            maxVisibleWidthForWrapGroup -= scrollOffsetToRemove;
                            scrollOffset -= scrollOffsetToRemove;
                        }
                        sumOfVisibleMaxWidths += maxVisibleWidthForWrapGroup;
                        if (maxVisibleWidthForWrapGroup > 0 && viewportWidth >= sumOfVisibleMaxWidths) {
                            ++wrapGroupsPerPage;
                        }
                    }
                    else {
                        /** @type {?} */
                        var maxVisibleHeightForWrapGroup = Math.min(maxHeightForWrapGroup, Math.max(viewportHeight - sumOfVisibleMaxHeights, 0));
                        if (scrollOffset > 0) {
                            /** @type {?} */
                            var scrollOffsetToRemove = Math.min(scrollOffset, maxVisibleHeightForWrapGroup);
                            maxVisibleHeightForWrapGroup -= scrollOffsetToRemove;
                            scrollOffset -= scrollOffsetToRemove;
                        }
                        sumOfVisibleMaxHeights += maxVisibleHeightForWrapGroup;
                        if (maxVisibleHeightForWrapGroup > 0 && viewportHeight >= sumOfVisibleMaxHeights) {
                            ++wrapGroupsPerPage;
                        }
                    }
                    ++wrapGroupIndex;
                    maxWidthForWrapGroup = 0;
                    maxHeightForWrapGroup = 0;
                }
            }
            /** @type {?} */
            var averageChildWidth = this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths / this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
            /** @type {?} */
            var averageChildHeight = this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights / this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
            defaultChildWidth = this.childWidth || averageChildWidth || viewportWidth;
            defaultChildHeight = this.childHeight || averageChildHeight || viewportHeight;
            if (this.horizontal) {
                if (viewportWidth > sumOfVisibleMaxWidths) {
                    wrapGroupsPerPage += Math.ceil((viewportWidth - sumOfVisibleMaxWidths) / defaultChildWidth);
                }
            }
            else {
                if (viewportHeight > sumOfVisibleMaxHeights) {
                    wrapGroupsPerPage += Math.ceil((viewportHeight - sumOfVisibleMaxHeights) / defaultChildHeight);
                }
            }
        }
        /** @type {?} */
        var itemCount = this.items.length;
        /** @type {?} */
        var itemsPerPage = itemsPerWrapGroup * wrapGroupsPerPage;
        /** @type {?} */
        var pageCount_fractional = itemCount / itemsPerPage;
        /** @type {?} */
        var numberOfWrapGroups = Math.ceil(itemCount / itemsPerWrapGroup);
        /** @type {?} */
        var scrollLength = 0;
        /** @type {?} */
        var defaultScrollLengthPerWrapGroup = this.horizontal ? defaultChildWidth : defaultChildHeight;
        if (this.enableUnequalChildrenSizes) {
            /** @type {?} */
            var numUnknownChildSizes = 0;
            for (var i = 0; i < numberOfWrapGroups; ++i) {
                /** @type {?} */
                var childSize = this.wrapGroupDimensions.maxChildSizePerWrapGroup[i] && this.wrapGroupDimensions.maxChildSizePerWrapGroup[i][this._childScrollDim];
                if (childSize) {
                    scrollLength += childSize;
                }
                else {
                    ++numUnknownChildSizes;
                }
            }
            scrollLength += Math.round(numUnknownChildSizes * defaultScrollLengthPerWrapGroup);
        }
        else {
            scrollLength = numberOfWrapGroups * defaultScrollLengthPerWrapGroup;
        }
        if (this.headerElementRef) {
            scrollLength += this.headerElementRef.nativeElement.clientHeight;
        }
        /** @type {?} */
        var viewportLength = this.horizontal ? viewportWidth : viewportHeight;
        /** @type {?} */
        var maxScrollPosition = Math.max(scrollLength - viewportLength, 0);
        return {
            itemCount: itemCount,
            itemsPerWrapGroup: itemsPerWrapGroup,
            wrapGroupsPerPage: wrapGroupsPerPage,
            itemsPerPage: itemsPerPage,
            pageCount_fractional: pageCount_fractional,
            childWidth: defaultChildWidth,
            childHeight: defaultChildHeight,
            scrollLength: scrollLength,
            viewportLength: viewportLength,
            maxScrollPosition: maxScrollPosition
        };
    };
    /**
     * @protected
     * @param {?} arrayStartIndexWithBuffer
     * @param {?} dimensions
     * @return {?}
     */
    VirtualScrollerComponent.prototype.calculatePadding = /**
     * @protected
     * @param {?} arrayStartIndexWithBuffer
     * @param {?} dimensions
     * @return {?}
     */
    function (arrayStartIndexWithBuffer, dimensions) {
        if (dimensions.itemCount === 0) {
            return 0;
        }
        /** @type {?} */
        var defaultScrollLengthPerWrapGroup = dimensions[this._childScrollDim];
        /** @type {?} */
        var startingWrapGroupIndex = Math.floor(arrayStartIndexWithBuffer / dimensions.itemsPerWrapGroup) || 0;
        if (!this.enableUnequalChildrenSizes) {
            return defaultScrollLengthPerWrapGroup * startingWrapGroupIndex;
        }
        /** @type {?} */
        var numUnknownChildSizes = 0;
        /** @type {?} */
        var result = 0;
        for (var i = 0; i < startingWrapGroupIndex; ++i) {
            /** @type {?} */
            var childSize = this.wrapGroupDimensions.maxChildSizePerWrapGroup[i] && this.wrapGroupDimensions.maxChildSizePerWrapGroup[i][this._childScrollDim];
            if (childSize) {
                result += childSize;
            }
            else {
                ++numUnknownChildSizes;
            }
        }
        result += Math.round(numUnknownChildSizes * defaultScrollLengthPerWrapGroup);
        return result;
    };
    /**
     * @protected
     * @param {?} scrollPosition
     * @param {?} dimensions
     * @return {?}
     */
    VirtualScrollerComponent.prototype.calculatePageInfo = /**
     * @protected
     * @param {?} scrollPosition
     * @param {?} dimensions
     * @return {?}
     */
    function (scrollPosition, dimensions) {
        /** @type {?} */
        var scrollPercentage = 0;
        if (this.enableUnequalChildrenSizes) {
            /** @type {?} */
            var numberOfWrapGroups = Math.ceil(dimensions.itemCount / dimensions.itemsPerWrapGroup);
            /** @type {?} */
            var totalScrolledLength = 0;
            /** @type {?} */
            var defaultScrollLengthPerWrapGroup = dimensions[this._childScrollDim];
            for (var i = 0; i < numberOfWrapGroups; ++i) {
                /** @type {?} */
                var childSize = this.wrapGroupDimensions.maxChildSizePerWrapGroup[i] && this.wrapGroupDimensions.maxChildSizePerWrapGroup[i][this._childScrollDim];
                if (childSize) {
                    totalScrolledLength += childSize;
                }
                else {
                    totalScrolledLength += defaultScrollLengthPerWrapGroup;
                }
                if (scrollPosition < totalScrolledLength) {
                    scrollPercentage = i / numberOfWrapGroups;
                    break;
                }
            }
        }
        else {
            scrollPercentage = scrollPosition / dimensions.scrollLength;
        }
        /** @type {?} */
        var startingArrayIndex_fractional = Math.min(Math.max(scrollPercentage * dimensions.pageCount_fractional, 0), dimensions.pageCount_fractional) * dimensions.itemsPerPage;
        /** @type {?} */
        var maxStart = dimensions.itemCount - dimensions.itemsPerPage - 1;
        /** @type {?} */
        var arrayStartIndex = Math.min(Math.floor(startingArrayIndex_fractional), maxStart);
        arrayStartIndex -= arrayStartIndex % dimensions.itemsPerWrapGroup; // round down to start of wrapGroup
        if (this.stripedTable) {
            /** @type {?} */
            var bufferBoundary = 2 * dimensions.itemsPerWrapGroup;
            if (arrayStartIndex % bufferBoundary !== 0) {
                arrayStartIndex = Math.max(arrayStartIndex - arrayStartIndex % bufferBoundary, 0);
            }
        }
        /** @type {?} */
        var arrayEndIndex = Math.ceil(startingArrayIndex_fractional) + dimensions.itemsPerPage - 1;
        /** @type {?} */
        var endIndexWithinWrapGroup = (arrayEndIndex + 1) % dimensions.itemsPerWrapGroup;
        if (endIndexWithinWrapGroup > 0) {
            arrayEndIndex += dimensions.itemsPerWrapGroup - endIndexWithinWrapGroup; // round up to end of wrapGroup
        }
        if (isNaN(arrayStartIndex)) {
            arrayStartIndex = 0;
        }
        if (isNaN(arrayEndIndex)) {
            arrayEndIndex = 0;
        }
        arrayStartIndex = Math.min(Math.max(arrayStartIndex, 0), dimensions.itemCount - 1);
        arrayEndIndex = Math.min(Math.max(arrayEndIndex, 0), dimensions.itemCount - 1);
        /** @type {?} */
        var bufferSize = this.bufferAmount * dimensions.itemsPerWrapGroup;
        /** @type {?} */
        var startIndexWithBuffer = Math.min(Math.max(arrayStartIndex - bufferSize, 0), dimensions.itemCount - 1);
        /** @type {?} */
        var endIndexWithBuffer = Math.min(Math.max(arrayEndIndex + bufferSize, 0), dimensions.itemCount - 1);
        return {
            startIndex: arrayStartIndex,
            endIndex: arrayEndIndex,
            startIndexWithBuffer: startIndexWithBuffer,
            endIndexWithBuffer: endIndexWithBuffer,
            scrollStartPosition: scrollPosition,
            scrollEndPosition: scrollPosition + dimensions.viewportLength,
            maxScrollPosition: dimensions.maxScrollPosition
        };
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.calculateViewport = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var dimensions = this.calculateDimensions();
        /** @type {?} */
        var offset = this.getElementsOffset();
        /** @type {?} */
        var scrollStartPosition = this.getScrollStartPosition();
        if (scrollStartPosition > (dimensions.scrollLength + offset) && !(this.parentScroll instanceof Window)) {
            scrollStartPosition = dimensions.scrollLength;
        }
        else {
            scrollStartPosition -= offset;
        }
        scrollStartPosition = Math.max(0, scrollStartPosition);
        /** @type {?} */
        var pageInfo = this.calculatePageInfo(scrollStartPosition, dimensions);
        /** @type {?} */
        var newPadding = this.calculatePadding(pageInfo.startIndexWithBuffer, dimensions);
        /** @type {?} */
        var newScrollLength = dimensions.scrollLength;
        return {
            startIndex: pageInfo.startIndex,
            endIndex: pageInfo.endIndex,
            startIndexWithBuffer: pageInfo.startIndexWithBuffer,
            endIndexWithBuffer: pageInfo.endIndexWithBuffer,
            padding: Math.round(newPadding),
            scrollLength: Math.round(newScrollLength),
            scrollStartPosition: pageInfo.scrollStartPosition,
            scrollEndPosition: pageInfo.scrollEndPosition,
            maxScrollPosition: pageInfo.maxScrollPosition
        };
    };
    VirtualScrollerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'virtual-scroller,[virtualScroller]',
                    exportAs: 'virtualScroller',
                    template: "\n    <div class=\"total-padding\" #invisiblePadding></div>\n    <div class=\"scrollable-content\" #content>\n      <ng-content></ng-content>\n    </div>\n  ",
                    host: {
                        '[class.horizontal]': "horizontal",
                        '[class.vertical]': "!horizontal",
                        '[class.selfScroll]': "!parentScroll"
                    },
                    styles: ["\n    :host {\n      position: relative;\n\t  display: block;\n      -webkit-overflow-scrolling: touch;\n    }\n\t\n\t:host.horizontal.selfScroll {\n      overflow-y: visible;\n      overflow-x: auto;\n\t}\n\t:host.vertical.selfScroll {\n      overflow-y: auto;\n      overflow-x: visible;\n\t}\n\t\n    .scrollable-content {\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      max-width: 100vw;\n      max-height: 100vh;\n      position: absolute;\n    }\n\n\t.scrollable-content ::ng-deep > * {\n\t\tbox-sizing: border-box;\n\t}\n\t\n\t:host.horizontal {\n\t\twhite-space: nowrap;\n\t}\n\t\n\t:host.horizontal .scrollable-content {\n\t\tdisplay: flex;\n\t}\n\t\n\t:host.horizontal .scrollable-content ::ng-deep > * {\n\t\tflex-shrink: 0;\n\t\tflex-grow: 0;\n\t\twhite-space: initial;\n\t}\n\t\n    .total-padding {\n      width: 1px;\n      opacity: 0;\n    }\n    \n    :host.horizontal .total-padding {\n      height: 100%;\n    }\n  "]
                }] }
    ];
    /** @nocollapse */
    VirtualScrollerComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['virtual-scroller-default-options',] }] }
    ]; };
    VirtualScrollerComponent.propDecorators = {
        executeRefreshOutsideAngularZone: [{ type: Input }],
        enableUnequalChildrenSizes: [{ type: Input }],
        useMarginInsteadOfTranslate: [{ type: Input }],
        modifyOverflowStyleOfParentScroll: [{ type: Input }],
        stripedTable: [{ type: Input }],
        scrollbarWidth: [{ type: Input }],
        scrollbarHeight: [{ type: Input }],
        childWidth: [{ type: Input }],
        childHeight: [{ type: Input }],
        ssrChildWidth: [{ type: Input }],
        ssrChildHeight: [{ type: Input }],
        ssrViewportWidth: [{ type: Input }],
        ssrViewportHeight: [{ type: Input }],
        bufferAmount: [{ type: Input }],
        scrollAnimationTime: [{ type: Input }],
        resizeBypassRefreshThreshold: [{ type: Input }],
        scrollThrottlingTime: [{ type: Input }],
        scrollDebounceTime: [{ type: Input }],
        checkResizeInterval: [{ type: Input }],
        items: [{ type: Input }],
        compareItems: [{ type: Input }],
        horizontal: [{ type: Input }],
        parentScroll: [{ type: Input }],
        vsUpdate: [{ type: Output }],
        vsChange: [{ type: Output }],
        vsStart: [{ type: Output }],
        vsEnd: [{ type: Output }],
        contentElementRef: [{ type: ViewChild, args: ['content', { read: ElementRef, static: false },] }],
        invisiblePaddingElementRef: [{ type: ViewChild, args: ['invisiblePadding', { read: ElementRef, static: false },] }],
        headerElementRef: [{ type: ContentChild, args: ['header', { read: ElementRef, static: false },] }],
        containerElementRef: [{ type: ContentChild, args: ['container', { read: ElementRef, static: false },] }]
    };
    return VirtualScrollerComponent;
}());
export { VirtualScrollerComponent };
if (false) {
    /** @type {?} */
    VirtualScrollerComponent.prototype.viewPortItems;
    /** @type {?} */
    VirtualScrollerComponent.prototype.window;
    /** @type {?} */
    VirtualScrollerComponent.prototype.executeRefreshOutsideAngularZone;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._enableUnequalChildrenSizes;
    /** @type {?} */
    VirtualScrollerComponent.prototype.useMarginInsteadOfTranslate;
    /** @type {?} */
    VirtualScrollerComponent.prototype.modifyOverflowStyleOfParentScroll;
    /** @type {?} */
    VirtualScrollerComponent.prototype.stripedTable;
    /** @type {?} */
    VirtualScrollerComponent.prototype.scrollbarWidth;
    /** @type {?} */
    VirtualScrollerComponent.prototype.scrollbarHeight;
    /** @type {?} */
    VirtualScrollerComponent.prototype.childWidth;
    /** @type {?} */
    VirtualScrollerComponent.prototype.childHeight;
    /** @type {?} */
    VirtualScrollerComponent.prototype.ssrChildWidth;
    /** @type {?} */
    VirtualScrollerComponent.prototype.ssrChildHeight;
    /** @type {?} */
    VirtualScrollerComponent.prototype.ssrViewportWidth;
    /** @type {?} */
    VirtualScrollerComponent.prototype.ssrViewportHeight;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._bufferAmount;
    /** @type {?} */
    VirtualScrollerComponent.prototype.scrollAnimationTime;
    /** @type {?} */
    VirtualScrollerComponent.prototype.resizeBypassRefreshThreshold;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._scrollThrottlingTime;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._scrollDebounceTime;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.onScroll;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.checkScrollElementResizedTimer;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._checkResizeInterval;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._items;
    /** @type {?} */
    VirtualScrollerComponent.prototype.compareItems;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._horizontal;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.oldParentScrollOverflow;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._parentScroll;
    /** @type {?} */
    VirtualScrollerComponent.prototype.vsUpdate;
    /** @type {?} */
    VirtualScrollerComponent.prototype.vsChange;
    /** @type {?} */
    VirtualScrollerComponent.prototype.vsStart;
    /** @type {?} */
    VirtualScrollerComponent.prototype.vsEnd;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.contentElementRef;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.invisiblePaddingElementRef;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.headerElementRef;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.containerElementRef;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.isAngularUniversalSSR;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.previousScrollBoundingRect;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._invisiblePaddingProperty;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._offsetType;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._scrollType;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._pageOffsetType;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._childScrollDim;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._translateDir;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._marginDir;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.calculatedScrollbarWidth;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.calculatedScrollbarHeight;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.padding;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.previousViewPort;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.currentTween;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.cachedItemsLength;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.disposeScrollHandler;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.disposeResizeHandler;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.minMeasuredChildWidth;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.minMeasuredChildHeight;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.wrapGroupDimensions;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.cachedPageSize;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.previousScrollNumberElements;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.element;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.renderer;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.zone;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.changeDetectorRef;
}
var VirtualScrollerModule = /** @class */ (function () {
    function VirtualScrollerModule() {
    }
    VirtualScrollerModule.decorators = [
        { type: NgModule, args: [{
                    exports: [VirtualScrollerComponent],
                    declarations: [VirtualScrollerComponent],
                    imports: [CommonModule],
                    providers: [
                        {
                            provide: 'virtual-scroller-default-options',
                            useFactory: VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY
                        }
                    ]
                },] }
    ];
    return VirtualScrollerModule;
}());
export { VirtualScrollerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1zY3JvbGwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bi8iLCJzb3VyY2VzIjpbImxpYi92aXJ0dWFsLXNjcm9sbC92aXJ0dWFsLXNjcm9sbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNOLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUlOLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUVqQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEtBQUssS0FBSyxNQUFNLG1CQUFtQixDQUFBOzs7O0FBYzFDLE1BQU0sVUFBVSx3Q0FBd0M7SUFDdkQsT0FBTztRQUNOLG9CQUFvQixFQUFFLENBQUM7UUFDdkIsa0JBQWtCLEVBQUUsQ0FBQztRQUNyQixtQkFBbUIsRUFBRSxHQUFHO1FBQ3hCLG1CQUFtQixFQUFFLElBQUk7UUFDekIsNEJBQTRCLEVBQUUsQ0FBQztRQUMvQixpQ0FBaUMsRUFBRSxJQUFJO1FBQ3ZDLFlBQVksRUFBRSxLQUFLO0tBQ25CLENBQUM7QUFDSCxDQUFDO0FBWUQ7SUF3ZUMsa0NBQStCLE9BQW1CLEVBQzlCLFFBQW1CLEVBQ25CLElBQVksRUFDckIsaUJBQW9DLEVBQ3pCLFVBQWtCLEVBRXZDLE9BQXNDO1FBTlIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUM5QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLFNBQUksR0FBSixJQUFJLENBQVE7UUFDckIsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQXJheEMsV0FBTSxHQUFHLE1BQU0sQ0FBQztRQWdCaEIscUNBQWdDLEdBQVksS0FBSyxDQUFDO1FBRS9DLGdDQUEyQixHQUFZLEtBQUssQ0FBQztRQWdCaEQsZ0NBQTJCLEdBQVksS0FBSyxDQUFDO1FBMkI3QyxxQkFBZ0IsR0FBVyxJQUFJLENBQUM7UUFHaEMsc0JBQWlCLEdBQVcsSUFBSSxDQUFDO1FBRTlCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1FBeUUxQixXQUFNLEdBQVUsRUFBRSxDQUFDO1FBZXRCLGlCQUFZOzs7OztRQUF3QyxVQUFDLEtBQVUsRUFBRSxLQUFVLElBQUssT0FBQSxLQUFLLEtBQUssS0FBSyxFQUFmLENBQWUsRUFBQztRQThDaEcsYUFBUSxHQUF3QixJQUFJLFlBQVksRUFBUyxDQUFDO1FBRzFELGFBQVEsR0FBNEIsSUFBSSxZQUFZLEVBQWEsQ0FBQztRQUdsRSxZQUFPLEdBQTRCLElBQUksWUFBWSxFQUFhLENBQUM7UUFHakUsVUFBSyxHQUE0QixJQUFJLFlBQVksRUFBYSxDQUFDO1FBdVY1RCw2QkFBd0IsR0FBVyxDQUFDLENBQUM7UUFDckMsOEJBQXlCLEdBQVcsQ0FBQyxDQUFDO1FBRXRDLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEIscUJBQWdCLEdBQWMsbUJBQUssRUFBRSxFQUFBLENBQUM7UUF3ZHRDLG1CQUFjLEdBQVcsQ0FBQyxDQUFDO1FBQzNCLGlDQUE0QixHQUFXLENBQUMsQ0FBQztRQTNsQmxELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUxRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDO1FBQ3pELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7UUFDckQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQztRQUN2RCxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7UUFDN0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO1FBQy9DLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUM7UUFDdkQsSUFBSSxDQUFDLDRCQUE0QixHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQztRQUN6RSxJQUFJLENBQUMsaUNBQWlDLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDO1FBQ25GLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUV6QyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBdGJELHNCQUFXLGtEQUFZOzs7O1FBQXZCOztnQkFDSyxRQUFRLEdBQWMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLG1CQUFLLEVBQUUsRUFBQTtZQUMxRCxPQUFPO2dCQUNOLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVSxJQUFJLENBQUM7Z0JBQ3BDLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxJQUFJLENBQUM7Z0JBQ2hDLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxtQkFBbUIsSUFBSSxDQUFDO2dCQUN0RCxpQkFBaUIsRUFBRSxRQUFRLENBQUMsaUJBQWlCLElBQUksQ0FBQztnQkFDbEQsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixJQUFJLENBQUM7Z0JBQ2xELG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxvQkFBb0IsSUFBSSxDQUFDO2dCQUN4RCxrQkFBa0IsRUFBRSxRQUFRLENBQUMsa0JBQWtCLElBQUksQ0FBQzthQUNwRCxDQUFDO1FBQ0gsQ0FBQzs7O09BQUE7SUFNRCxzQkFDVyxnRUFBMEI7Ozs7UUFEckM7WUFFQyxPQUFPLElBQUksQ0FBQywyQkFBMkIsQ0FBQztRQUN6QyxDQUFDOzs7OztRQUNELFVBQXNDLEtBQWM7WUFDbkQsSUFBSSxJQUFJLENBQUMsMkJBQTJCLEtBQUssS0FBSyxFQUFFO2dCQUMvQyxPQUFPO2FBQ1A7WUFFRCxJQUFJLENBQUMsMkJBQTJCLEdBQUcsS0FBSyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUM7WUFDdkMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLFNBQVMsQ0FBQztRQUN6QyxDQUFDOzs7T0FUQTtJQTZDRCxzQkFDVyxrREFBWTs7OztRQUR2QjtZQUVDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQzthQUMxQjtpQkFBTTtnQkFDTixPQUFPLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDL0M7UUFDRixDQUFDOzs7OztRQUNELFVBQXdCLEtBQWE7WUFDcEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDNUIsQ0FBQzs7O09BSEE7SUFZRCxzQkFDVywwREFBb0I7Ozs7UUFEL0I7WUFFQyxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUNuQyxDQUFDOzs7OztRQUNELFVBQWdDLEtBQWE7WUFDNUMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztZQUNuQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUMvQixDQUFDOzs7T0FKQTtJQU9ELHNCQUNXLHdEQUFrQjs7OztRQUQ3QjtZQUVDLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDO1FBQ2pDLENBQUM7Ozs7O1FBQ0QsVUFBOEIsS0FBYTtZQUMxQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQy9CLENBQUM7OztPQUpBOzs7OztJQU9TLHlEQUFzQjs7OztJQUFoQztRQUFBLG1CQWdCQztRQWZBLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsbUJBQUssSUFBSSxDQUFDLFFBQVE7OztZQUFDO2dCQUNsQyxPQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsQ0FBQyxHQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFBLENBQUM7U0FDNUI7YUFDSSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLG1CQUFLLElBQUksQ0FBQyxnQkFBZ0I7OztZQUFDO2dCQUMxQyxPQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsQ0FBQyxHQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFBLENBQUM7U0FDOUI7YUFDSTtZQUNKLElBQUksQ0FBQyxRQUFROzs7WUFBRztnQkFDZixPQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsQ0FBQyxDQUFBLENBQUM7U0FDRjtJQUNGLENBQUM7SUFJRCxzQkFDVyx5REFBbUI7Ozs7UUFEOUI7WUFFQyxPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztRQUNsQyxDQUFDOzs7OztRQUNELFVBQStCLEtBQWE7WUFDM0MsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEtBQUssS0FBSyxFQUFFO2dCQUN4QyxPQUFPO2FBQ1A7WUFFRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQy9CLENBQUM7OztPQVJBO0lBV0Qsc0JBQ1csMkNBQUs7Ozs7UUFEaEI7WUFFQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsQ0FBQzs7Ozs7UUFDRCxVQUFpQixLQUFZO1lBQzVCLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQzFCLE9BQU87YUFDUDtZQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsQ0FBQzs7O09BUkE7SUFjRCxzQkFDVyxnREFBVTs7OztRQURyQjtZQUVDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUN6QixDQUFDOzs7OztRQUNELFVBQXNCLEtBQWM7WUFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDekIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLENBQUM7OztPQUpBOzs7OztJQU1TLHlEQUFzQjs7OztJQUFoQzs7WUFDTyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1FBQzdDLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtZQUNsRCxhQUFhLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7WUFDbkUsYUFBYSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1NBQ25FO1FBRUQsSUFBSSxDQUFDLHVCQUF1QixHQUFHLFNBQVMsQ0FBQztJQUMxQyxDQUFDO0lBSUQsc0JBQ1csa0RBQVk7Ozs7UUFEdkI7WUFFQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDM0IsQ0FBQzs7Ozs7UUFDRCxVQUF3QixLQUF1QjtZQUM5QyxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssS0FBSyxFQUFFO2dCQUNqQyxPQUFPO2FBQ1A7WUFFRCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztZQUMzQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQzs7Z0JBRXhCLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDN0MsSUFBSSxJQUFJLENBQUMsaUNBQWlDLElBQUksYUFBYSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFO2dCQUMzRixJQUFJLENBQUMsdUJBQXVCLEdBQUcsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO2dCQUM5RyxhQUFhLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUN6RSxhQUFhLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2FBQ3pFO1FBQ0YsQ0FBQzs7O09BaEJBOzs7O0lBMENNLDJDQUFROzs7SUFBZjtRQUNDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQy9CLENBQUM7Ozs7SUFFTSw4Q0FBVzs7O0lBQWxCO1FBQ0MsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDL0IsQ0FBQzs7Ozs7SUFFTSw4Q0FBVzs7OztJQUFsQixVQUFtQixPQUFZOztZQUMxQixrQkFBa0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO1FBQ3JFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7WUFFckMsUUFBUSxHQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQ3BILElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsSUFBSSxRQUFRLENBQUMsQ0FBQztJQUN2RCxDQUFDOzs7O0lBR00sNENBQVM7OztJQUFoQjtRQUNDLElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUMzQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUIsT0FBTztTQUNQO1FBRUQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O2dCQUM3RSxpQkFBaUIsR0FBRyxLQUFLO1lBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUMxRyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7b0JBQ3pCLE1BQU07aUJBQ047YUFDRDtZQUNELElBQUksaUJBQWlCLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QjtTQUNEO0lBQ0YsQ0FBQzs7OztJQUVNLDBDQUFPOzs7SUFBZDtRQUNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDOzs7O0lBRU0sa0VBQStCOzs7SUFBdEM7UUFDQyxJQUFJLENBQUMsbUJBQW1CLEdBQUc7WUFDMUIsd0JBQXdCLEVBQUUsRUFBRTtZQUM1QixnQ0FBZ0MsRUFBRSxDQUFDO1lBQ25DLDhCQUE4QixFQUFFLENBQUM7WUFDakMsK0JBQStCLEVBQUUsQ0FBQztTQUNsQyxDQUFDO1FBRUYsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztRQUN2QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsU0FBUyxDQUFDO1FBRXhDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDOzs7OztJQUVNLHFFQUFrQzs7OztJQUF6QyxVQUEwQyxJQUFTO1FBQ2xELElBQUksSUFBSSxDQUFDLDBCQUEwQixFQUFFOztnQkFDaEMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2xELElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtnQkFDZixJQUFJLENBQUMsa0NBQWtDLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDL0M7U0FDRDthQUFNO1lBQ04sSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztZQUN2QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsU0FBUyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7Ozs7O0lBRU0scUVBQWtDOzs7O0lBQXpDLFVBQTBDLEtBQWE7UUFDdEQsSUFBSSxJQUFJLENBQUMsMEJBQTBCLEVBQUU7O2dCQUNoQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDO1lBQ2hGLElBQUksaUJBQWlCLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUM7Z0JBQ3JFLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdDQUFnQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsbUJBQW1CLENBQUMsOEJBQThCLElBQUksaUJBQWlCLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztnQkFDN0YsSUFBSSxDQUFDLG1CQUFtQixDQUFDLCtCQUErQixJQUFJLGlCQUFpQixDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7YUFDL0Y7U0FDRDthQUFNO1lBQ04sSUFBSSxDQUFDLHFCQUFxQixHQUFHLFNBQVMsQ0FBQztZQUN2QyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsU0FBUyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7Ozs7Ozs7OztJQUVNLDZDQUFVOzs7Ozs7OztJQUFqQixVQUFrQixJQUFTLEVBQUUsZ0JBQWdDLEVBQUUsZ0JBQTRCLEVBQUUscUJBQXlDLEVBQUUsMEJBQWtEO1FBQTdKLGlDQUFBLEVBQUEsdUJBQWdDO1FBQUUsaUNBQUEsRUFBQSxvQkFBNEI7UUFBRSxzQ0FBQSxFQUFBLGlDQUF5QztRQUFFLDJDQUFBLEVBQUEsc0NBQWtEOztZQUNyTCxLQUFLLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzVDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ2pCLE9BQU87U0FDUDtRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLHFCQUFxQixFQUFFLDBCQUEwQixDQUFDLENBQUM7SUFDbEgsQ0FBQzs7Ozs7Ozs7O0lBRU0sZ0RBQWE7Ozs7Ozs7O0lBQXBCLFVBQXFCLEtBQWEsRUFBRSxnQkFBZ0MsRUFBRSxnQkFBNEIsRUFBRSxxQkFBeUMsRUFBRSwwQkFBa0Q7UUFBak0sbUJBeUJDO1FBekJtQyxpQ0FBQSxFQUFBLHVCQUFnQztRQUFFLGlDQUFBLEVBQUEsb0JBQTRCO1FBQUUsc0NBQUEsRUFBQSxpQ0FBeUM7UUFBRSwyQ0FBQSxFQUFBLHNDQUFrRDs7WUFDNUwsVUFBVSxHQUFXLENBQUM7O1lBRXRCLGFBQWE7OztRQUFHO1lBQ25CLEVBQUUsVUFBVSxDQUFDO1lBQ2IsSUFBSSxVQUFVLElBQUksQ0FBQyxFQUFFO2dCQUNwQixJQUFJLDBCQUEwQixFQUFFO29CQUMvQiwwQkFBMEIsRUFBRSxDQUFDO2lCQUM3QjtnQkFDRCxPQUFPO2FBQ1A7O2dCQUVHLFVBQVUsR0FBRyxPQUFJLENBQUMsbUJBQW1CLEVBQUU7O2dCQUN2QyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQzlFLElBQUksT0FBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsS0FBSyxpQkFBaUIsRUFBRTtnQkFDM0QsSUFBSSwwQkFBMEIsRUFBRTtvQkFDL0IsMEJBQTBCLEVBQUUsQ0FBQztpQkFDN0I7Z0JBQ0QsT0FBTzthQUNQO1lBRUQsT0FBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDMUYsQ0FBQyxDQUFBO1FBRUQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM5RyxDQUFDOzs7Ozs7Ozs7O0lBRVMseURBQXNCOzs7Ozs7Ozs7SUFBaEMsVUFBaUMsS0FBYSxFQUFFLGdCQUFnQyxFQUFFLGdCQUE0QixFQUFFLHFCQUF5QyxFQUFFLDBCQUFrRDtRQUE3SixpQ0FBQSxFQUFBLHVCQUFnQztRQUFFLGlDQUFBLEVBQUEsb0JBQTRCO1FBQUUsc0NBQUEsRUFBQSxpQ0FBeUM7UUFBRSwyQ0FBQSxFQUFBLHNDQUFrRDtRQUM1TSxxQkFBcUIsR0FBRyxxQkFBcUIsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUM7O1lBRTNHLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7O1lBQ3ZDLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxHQUFHLGdCQUFnQjtRQUN4RSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDdEIsTUFBTSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7Ozs7Ozs7SUFFTSxtREFBZ0I7Ozs7OztJQUF2QixVQUF3QixjQUFzQixFQUFFLHFCQUF5QyxFQUFFLDBCQUFrRDtRQUE3SSxtQkF1REM7UUF2RCtDLHNDQUFBLEVBQUEsaUNBQXlDO1FBQUUsMkNBQUEsRUFBQSxzQ0FBa0Q7UUFDNUksY0FBYyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBRTNDLHFCQUFxQixHQUFHLHFCQUFxQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQzs7WUFFM0csYUFBYSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTs7WUFFdkMsZ0JBQXdCO1FBRTVCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1NBQzlCO1FBRUQsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQzNFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztZQUN6RCxPQUFPO1NBQ1A7O1lBRUssY0FBYyxHQUFHLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7O1lBRXRFLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO2FBQzVDLEVBQUUsQ0FBQyxFQUFFLGNBQWMsZ0JBQUEsRUFBRSxFQUFFLHFCQUFxQixDQUFDO2FBQzdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7YUFDbEMsUUFBUTs7OztRQUFDLFVBQUMsSUFBSTtZQUNkLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDL0IsT0FBTzthQUNQO1lBQ0QsT0FBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLE9BQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2hGLE9BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDLEVBQUM7YUFDRCxNQUFNOzs7UUFBQztZQUNQLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDeEMsQ0FBQyxFQUFDO2FBQ0QsS0FBSyxFQUFFOztZQUVILE9BQU87Ozs7UUFBRyxVQUFDLElBQWE7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFO2dCQUM3QixPQUFPO2FBQ1A7WUFFRCxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLElBQUksY0FBYyxDQUFDLGNBQWMsS0FBSyxjQUFjLEVBQUU7Z0JBQ3JELE9BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztnQkFDekQsT0FBTzthQUNQO1lBRUQsT0FBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUI7OztZQUFDO2dCQUMzQixnQkFBZ0IsR0FBRyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRCxDQUFDLEVBQUMsQ0FBQztRQUNKLENBQUMsQ0FBQTtRQUVELE9BQU8sRUFBRSxDQUFDO1FBQ1YsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7SUFDOUIsQ0FBQzs7Ozs7O0lBNEJTLGlEQUFjOzs7OztJQUF4QixVQUF5QixPQUFvQjs7WUFDeEMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRTs7WUFDeEMsTUFBTSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQzs7WUFDbEMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQzs7WUFDbkQsWUFBWSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQzs7WUFDekQsVUFBVSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQzs7WUFDckQsV0FBVyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQztRQUUzRCxPQUFPO1lBQ04sR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsU0FBUztZQUMzQixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxZQUFZO1lBQ3BDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVU7WUFDOUIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEdBQUcsV0FBVztZQUNqQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsV0FBVztZQUM5QyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxTQUFTLEdBQUcsWUFBWTtTQUNoRCxDQUFDO0lBQ0gsQ0FBQzs7Ozs7SUFHUyw0REFBeUI7Ozs7SUFBbkM7O1lBQ0ssWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7O1lBRTNELFdBQW9CO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUU7WUFDckMsV0FBVyxHQUFHLElBQUksQ0FBQztTQUNuQjthQUFNOztnQkFDRixXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUM7O2dCQUNsRixZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLENBQUM7WUFDekYsV0FBVyxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsNEJBQTRCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQztTQUNsSDtRQUVELElBQUksV0FBVyxFQUFFO1lBQ2hCLElBQUksQ0FBQywwQkFBMEIsR0FBRyxZQUFZLENBQUM7WUFDL0MsSUFBSSxZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDdEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzdCO1NBQ0Q7SUFDRixDQUFDOzs7OztJQVNTLGtEQUFlOzs7O0lBQXpCO1FBQ0MsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxPQUFPLENBQUM7WUFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUM7WUFDaEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxhQUFhLENBQUM7WUFDckMsSUFBSSxDQUFDLGVBQWUsR0FBRyxZQUFZLENBQUM7WUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUM7WUFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7WUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUM7U0FDaEM7YUFDSTtZQUNKLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxRQUFRLENBQUM7WUFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7WUFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxhQUFhLENBQUM7WUFDckMsSUFBSSxDQUFDLGVBQWUsR0FBRyxhQUFhLENBQUM7WUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUM7WUFDL0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7WUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7U0FDL0I7SUFDRixDQUFDOzs7Ozs7O0lBRVMsMkNBQVE7Ozs7OztJQUFsQixVQUFtQixJQUFjLEVBQUUsSUFBWTs7WUFDeEMsU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDOztZQUM3QyxNQUFNOzs7UUFBRztZQUNkLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1lBQ3RCLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQTtRQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7OztRQUFHO1lBQ2xCLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQSxDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDOzs7Ozs7O0lBRVMsbURBQWdCOzs7Ozs7SUFBMUIsVUFBMkIsSUFBYyxFQUFFLElBQVk7O1lBQ2xELE9BQU8sR0FBRyxTQUFTOztZQUNuQixVQUFVLEdBQUcsU0FBUzs7WUFDcEIsTUFBTTs7O1FBQUc7O2dCQUNSLEtBQUssR0FBRyxJQUFJO1lBQ2xCLFVBQVUsR0FBRyxTQUFTLENBQUE7WUFFdEIsSUFBSSxPQUFPLEVBQUU7Z0JBQ1osT0FBTzthQUNQO1lBRUQsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO2dCQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2FBQzlCO2lCQUFNO2dCQUNOLE9BQU8sR0FBRyxVQUFVOzs7Z0JBQUM7b0JBQ3BCLE9BQU8sR0FBRyxTQUFTLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQixDQUFDLEdBQUUsSUFBSSxDQUFDLENBQUM7YUFDVDtRQUNGLENBQUMsQ0FBQTtRQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7OztRQUFHO1lBQ2xCLElBQUksT0FBTyxFQUFFO2dCQUNaLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdEIsT0FBTyxHQUFHLFNBQVMsQ0FBQzthQUNwQjtRQUNGLENBQUMsQ0FBQSxDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDOzs7Ozs7OztJQWFTLG1EQUFnQjs7Ozs7OztJQUExQixVQUEyQixrQkFBMkIsRUFBRSx3QkFBZ0QsRUFBRSxXQUF1QjtRQUNoSSxxS0FBcUs7UUFDckssMkdBQTJHO1FBQzNHLDBPQUEwTztRQUMxTyxnUUFBZ1E7UUFKalEsbUJBd0lDO1FBeEl1RCx5Q0FBQSxFQUFBLG9DQUFnRDtRQUFFLDRCQUFBLEVBQUEsZUFBdUI7UUFNaEksSUFBSSxrQkFBa0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixHQUFHLENBQUMsRUFBRTs7O2dCQUU3RixhQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQjs7Z0JBQ25DLGtCQUFnQixHQUFHLElBQUksQ0FBQyxhQUFhOztnQkFFckMsNkJBQTJCLEdBQUcsd0JBQXdCO1lBQzFELHdCQUF3Qjs7O1lBQUc7O29CQUN0QixpQkFBaUIsR0FBRyxPQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxHQUFHLGFBQVcsQ0FBQyxZQUFZO2dCQUNyRixJQUFJLGlCQUFpQixHQUFHLENBQUMsSUFBSSxPQUFJLENBQUMsYUFBYSxFQUFFOzt3QkFDNUMsY0FBWSxHQUFHLGtCQUFnQixDQUFDLENBQUMsQ0FBQzs7d0JBQ2xDLGlCQUFpQixHQUFHLE9BQUksQ0FBQyxLQUFLLENBQUMsU0FBUzs7OztvQkFBQyxVQUFBLENBQUMsSUFBSSxPQUFBLE9BQUksQ0FBQyxZQUFZLENBQUMsY0FBWSxFQUFFLENBQUMsQ0FBQyxFQUFsQyxDQUFrQyxFQUFDO29CQUNyRixJQUFJLGlCQUFpQixHQUFHLE9BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRTs7NEJBQy9ELGdCQUFnQixHQUFHLEtBQUs7d0JBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTs0QkFDbkQsSUFBSSxDQUFDLE9BQUksQ0FBQyxZQUFZLENBQUMsT0FBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsRUFBRSxrQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dDQUMvRSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Z0NBQ3hCLE1BQU07NkJBQ047eUJBQ0Q7d0JBRUQsSUFBSSxDQUFDLGdCQUFnQixFQUFFOzRCQUN0QixPQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixHQUFHLGlCQUFpQixFQUFHLENBQUMsRUFBRSw2QkFBMkIsQ0FBQyxDQUFDOzRCQUN0SCxPQUFPO3lCQUNQO3FCQUNEO2lCQUNEO2dCQUVELElBQUksNkJBQTJCLEVBQUU7b0JBQ2hDLDZCQUEyQixFQUFFLENBQUM7aUJBQzlCO1lBQ0YsQ0FBQyxDQUFBLENBQUM7U0FDRjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCOzs7UUFBQztZQUMzQixxQkFBcUI7OztZQUFDO2dCQUVyQixJQUFJLGtCQUFrQixFQUFFO29CQUN2QixPQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztpQkFDaEM7O29CQUNHLFFBQVEsR0FBRyxPQUFJLENBQUMsaUJBQWlCLEVBQUU7O29CQUVuQyxZQUFZLEdBQUcsa0JBQWtCLElBQUksUUFBUSxDQUFDLFVBQVUsS0FBSyxPQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVTs7b0JBQzdGLFVBQVUsR0FBRyxrQkFBa0IsSUFBSSxRQUFRLENBQUMsUUFBUSxLQUFLLE9BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFROztvQkFDdkYsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLFlBQVksS0FBSyxPQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWTs7b0JBQ2xGLGNBQWMsR0FBRyxRQUFRLENBQUMsT0FBTyxLQUFLLE9BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPOztvQkFDbkUscUJBQXFCLEdBQUcsUUFBUSxDQUFDLG1CQUFtQixLQUFLLE9BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsSUFBSSxRQUFRLENBQUMsaUJBQWlCLEtBQUssT0FBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsS0FBSyxPQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCO2dCQUUxUCxPQUFJLENBQUMsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO2dCQUVqQyxJQUFJLG1CQUFtQixFQUFFO29CQUN4QixPQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFJLENBQUMsMEJBQTBCLENBQUMsYUFBYSxFQUFFLE9BQUksQ0FBQyx5QkFBeUIsRUFBSyxRQUFRLENBQUMsWUFBWSxPQUFJLENBQUMsQ0FBQztpQkFDcEk7Z0JBRUQsSUFBSSxjQUFjLEVBQUU7b0JBQ25CLElBQUksT0FBSSxDQUFDLDJCQUEyQixFQUFFO3dCQUNyQyxPQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLE9BQUksQ0FBQyxVQUFVLEVBQUssUUFBUSxDQUFDLE9BQU8sT0FBSSxDQUFDLENBQUM7cUJBQ3ZHO3lCQUNJO3dCQUNKLE9BQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFLLE9BQUksQ0FBQyxhQUFhLFNBQUksUUFBUSxDQUFDLE9BQU8sUUFBSyxDQUFDLENBQUM7d0JBQzFILE9BQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLEVBQUssT0FBSSxDQUFDLGFBQWEsU0FBSSxRQUFRLENBQUMsT0FBTyxRQUFLLENBQUMsQ0FBQztxQkFDaEk7aUJBQ0Q7Z0JBRUQsSUFBSSxPQUFJLENBQUMsZ0JBQWdCLEVBQUU7O3dCQUN0QixjQUFjLEdBQUcsT0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsT0FBSSxDQUFDLFdBQVcsQ0FBQzs7d0JBQzFELGVBQWUsR0FBRyxPQUFJLENBQUMsaUJBQWlCLEVBQUU7O3dCQUMxQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLE9BQU8sR0FBRyxlQUFlLEdBQUcsT0FBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO29CQUNoSSxPQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBSyxPQUFJLENBQUMsYUFBYSxTQUFJLE1BQU0sUUFBSyxDQUFDLENBQUM7b0JBQy9HLE9BQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLEVBQUssT0FBSSxDQUFDLGFBQWEsU0FBSSxNQUFNLFFBQUssQ0FBQyxDQUFDO2lCQUNySDs7b0JBRUssY0FBYyxHQUFjLENBQUMsWUFBWSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVO29CQUMvQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7b0JBQzNCLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxtQkFBbUI7b0JBQ2pELGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxpQkFBaUI7b0JBQzdDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxvQkFBb0I7b0JBQ25ELGtCQUFrQixFQUFFLFFBQVEsQ0FBQyxrQkFBa0I7b0JBQy9DLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxpQkFBaUI7aUJBQzdDLENBQUMsQ0FBQyxDQUFDLFNBQVM7Z0JBR2IsSUFBSSxZQUFZLElBQUksVUFBVSxJQUFJLHFCQUFxQixFQUFFOzt3QkFDbEQsYUFBYTs7O29CQUFHO3dCQUNyQix3RUFBd0U7d0JBQ3hFLE9BQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixJQUFJLENBQUMsSUFBSSxRQUFRLENBQUMsa0JBQWtCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7d0JBQ3BMLE9BQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFFdkMsSUFBSSxZQUFZLEVBQUU7NEJBQ2pCLE9BQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3lCQUNsQzt3QkFFRCxJQUFJLFVBQVUsRUFBRTs0QkFDZixPQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzt5QkFDaEM7d0JBRUQsSUFBSSxZQUFZLElBQUksVUFBVSxFQUFFOzRCQUMvQixPQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7NEJBQ3RDLE9BQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3lCQUNuQzt3QkFFRCxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUU7NEJBQ3BCLE9BQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUUsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUN4RSxPQUFPO3lCQUNQO3dCQUVELElBQUksd0JBQXdCLEVBQUU7NEJBQzdCLHdCQUF3QixFQUFFLENBQUM7eUJBQzNCO29CQUNGLENBQUMsQ0FBQTtvQkFHRCxJQUFJLE9BQUksQ0FBQyxnQ0FBZ0MsRUFBRTt3QkFDMUMsYUFBYSxFQUFFLENBQUM7cUJBQ2hCO3lCQUNJO3dCQUNKLE9BQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3FCQUM3QjtpQkFDRDtxQkFBTTtvQkFDTixJQUFJLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxjQUFjLENBQUMsRUFBRTt3QkFDL0QsT0FBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBRSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3hFLE9BQU87cUJBQ1A7b0JBRUQsSUFBSSx3QkFBd0IsRUFBRTt3QkFDN0Isd0JBQXdCLEVBQUUsQ0FBQztxQkFDM0I7aUJBQ0Q7WUFDRixDQUFDLEVBQUMsQ0FBQztRQUNKLENBQUMsRUFBQyxDQUFDO0lBQ0osQ0FBQzs7Ozs7SUFFUyxtREFBZ0I7Ozs7SUFBMUI7UUFDQyxPQUFPLElBQUksQ0FBQyxZQUFZLFlBQVksTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLElBQUksUUFBUSxDQUFDLGVBQWUsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQ3ZLLENBQUM7Ozs7O0lBRVMseURBQXNCOzs7O0lBQWhDO1FBQUEsbUJBcUJDO1FBcEJBLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQy9CLE9BQU87U0FDUDs7WUFFRyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1FBRTNDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBRWpDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCOzs7UUFBQztZQUMzQixJQUFJLE9BQUksQ0FBQyxZQUFZLFlBQVksTUFBTSxFQUFFO2dCQUN4QyxPQUFJLENBQUMsb0JBQW9CLEdBQUcsT0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3BGLE9BQUksQ0FBQyxvQkFBb0IsR0FBRyxPQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNwRjtpQkFDSTtnQkFDSixPQUFJLENBQUMsb0JBQW9CLEdBQUcsT0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxPQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3pGLElBQUksT0FBSSxDQUFDLG9CQUFvQixHQUFHLENBQUMsRUFBRTtvQkFDbEMsT0FBSSxDQUFDLDhCQUE4QixHQUFHLG1CQUFLLFdBQVc7OztvQkFBQyxjQUFRLE9BQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLE9BQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFBLENBQUM7aUJBQy9IO2FBQ0Q7UUFDRixDQUFDLEVBQUMsQ0FBQztJQUNKLENBQUM7Ozs7O0lBRVMsNERBQXlCOzs7O0lBQW5DO1FBQ0MsSUFBSSxJQUFJLENBQUMsOEJBQThCLEVBQUU7WUFDeEMsYUFBYSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1NBQ25EO1FBRUQsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDOUIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztTQUN0QztRQUVELElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLENBQUM7U0FDdEM7SUFDRixDQUFDOzs7OztJQUVTLG9EQUFpQjs7OztJQUEzQjtRQUNDLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQy9CLE9BQU8sQ0FBQyxDQUFDO1NBQ1Q7O1lBRUcsTUFBTSxHQUFHLENBQUM7UUFFZCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFO1lBQ3ZFLE1BQU0sSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNuRTtRQUVELElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTs7Z0JBQ2xCLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7O2dCQUN2QyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDOztnQkFDbkUsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUM7WUFDekQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNwQixNQUFNLElBQUksaUJBQWlCLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQzthQUN6RDtpQkFDSTtnQkFDSixNQUFNLElBQUksaUJBQWlCLENBQUMsR0FBRyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQzthQUN2RDtZQUVELElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLFlBQVksTUFBTSxDQUFDLEVBQUU7Z0JBQzNDLE1BQU0sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzFDO1NBQ0Q7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7Ozs7O0lBRVMseURBQXNCOzs7O0lBQWhDO1FBQ0MsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDL0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQy9IOztZQUVHLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFdBQVc7O1lBQzNELFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUTs7WUFFbEksY0FBYyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLGNBQWMsS0FBSyxDQUFDLEVBQUU7WUFDekIsT0FBTyxDQUFDLENBQUM7U0FDVDs7WUFFRyxXQUFXLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQzs7WUFDdkMsTUFBTSxHQUFHLENBQUM7UUFDZCxPQUFPLE1BQU0sR0FBRyxjQUFjLElBQUksV0FBVyxLQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUNqRixFQUFFLE1BQU0sQ0FBQztTQUNUO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDZixDQUFDOzs7OztJQUVTLHlEQUFzQjs7OztJQUFoQzs7WUFDSyxpQkFBaUIsR0FBRyxTQUFTO1FBQ2pDLElBQUksSUFBSSxDQUFDLFlBQVksWUFBWSxNQUFNLEVBQUU7WUFDeEMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNqRDtRQUVELE9BQU8saUJBQWlCLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1RSxDQUFDOzs7OztJQU9TLDJEQUF3Qjs7OztJQUFsQzs7WUFDTyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CO1FBQ3ZELElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1FBRXZDLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxzQkFBc0IsQ0FBQyxnQ0FBZ0MsS0FBSyxDQUFDLEVBQUU7WUFDakksT0FBTztTQUNQOztZQUVLLGlCQUFpQixHQUFXLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtRQUMvRCxLQUFLLElBQUksY0FBYyxHQUFHLENBQUMsRUFBRSxjQUFjLEdBQUcsc0JBQXNCLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLEVBQUUsY0FBYyxFQUFFOztnQkFDakgscUJBQXFCLEdBQXVCLHNCQUFzQixDQUFDLHdCQUF3QixDQUFDLGNBQWMsQ0FBQztZQUNqSCxJQUFJLENBQUMscUJBQXFCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNsRyxTQUFTO2FBQ1Q7WUFFRCxJQUFJLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssaUJBQWlCLEVBQUU7Z0JBQzdELE9BQU87YUFDUDs7Z0JBRUcsWUFBWSxHQUFHLEtBQUs7O2dCQUNwQixlQUFlLEdBQUcsaUJBQWlCLEdBQUcsY0FBYztZQUN4RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN4RixZQUFZLEdBQUcsSUFBSSxDQUFDO29CQUNwQixNQUFNO2lCQUNOO2FBQ0Q7WUFFRCxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNsQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQ0FBZ0MsQ0FBQztnQkFDNUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLDhCQUE4QixJQUFJLHFCQUFxQixDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQywrQkFBK0IsSUFBSSxxQkFBcUIsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO2dCQUNuRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsd0JBQXdCLENBQUMsY0FBYyxDQUFDLEdBQUcscUJBQXFCLENBQUM7YUFDMUY7U0FDRDtJQUNGLENBQUM7Ozs7O0lBRVMsc0RBQW1COzs7O0lBQTdCOztZQUNLLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7O1lBRXJDLDBCQUEwQixHQUFXLEVBQUU7UUFDN0MsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQyxZQUFZLEVBQUUsMEJBQTBCLENBQUMsRUFBRSxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUN6SyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDLFdBQVcsRUFBRSwwQkFBMEIsQ0FBQyxFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztZQUVqSyxhQUFhLEdBQUcsYUFBYSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLHdCQUF3QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztZQUN4SixjQUFjLEdBQUcsYUFBYSxDQUFDLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLHlCQUF5QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztZQUU1SixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhOztZQUV0SCxpQkFBaUIsR0FBRyxJQUFJLENBQUMsc0JBQXNCLEVBQUU7O1lBQ2pELGlCQUFpQjs7WUFFakIsaUJBQWlCOztZQUNqQixrQkFBa0I7UUFFdEIsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDL0IsYUFBYSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUN0QyxjQUFjLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQ3hDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDdkMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQzs7Z0JBQ3JDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDOztnQkFDdkUsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0UsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7U0FDaEU7YUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFO1lBQzFDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLElBQUksYUFBYSxHQUFHLENBQUMsRUFBRTt3QkFDckQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLGFBQWEsQ0FBQztxQkFDM0M7b0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxjQUFjLEdBQUcsQ0FBQyxFQUFFO3dCQUN2RCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsY0FBYyxDQUFDO3FCQUM3QztpQkFDRDs7b0JBRUcsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOztvQkFDM0IsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO2dCQUMzQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwRixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3ZGO1lBRUQsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksYUFBYSxDQUFDO1lBQ25GLGtCQUFrQixHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLHNCQUFzQixJQUFJLGNBQWMsQ0FBQzs7Z0JBQ25GLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDOztnQkFDdkUsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0UsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7U0FDaEU7YUFBTTs7Z0JBQ0YsWUFBWSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Z0JBRTVHLGVBQWUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLElBQUksQ0FBQzs7Z0JBQ2pFLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQzs7Z0JBRS9ELG9CQUFvQixHQUFHLENBQUM7O2dCQUN4QixxQkFBcUIsR0FBRyxDQUFDOztnQkFDekIscUJBQXFCLEdBQUcsQ0FBQzs7Z0JBQ3pCLHNCQUFzQixHQUFHLENBQUM7WUFDOUIsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1lBRXRCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDakQsRUFBRSxlQUFlLENBQUM7O29CQUNkLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7b0JBQzNCLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztnQkFFM0Msb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3hFLHFCQUFxQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUUzRSxJQUFJLGVBQWUsR0FBRyxpQkFBaUIsS0FBSyxDQUFDLEVBQUU7O3dCQUMxQyxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLHdCQUF3QixDQUFDLGNBQWMsQ0FBQztvQkFDaEYsSUFBSSxRQUFRLEVBQUU7d0JBQ2IsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0NBQWdDLENBQUM7d0JBQzVELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyw4QkFBOEIsSUFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQzt3QkFDcEYsSUFBSSxDQUFDLG1CQUFtQixDQUFDLCtCQUErQixJQUFJLFFBQVEsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO3FCQUN0RjtvQkFFRCxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQ0FBZ0MsQ0FBQzs7d0JBQ3RELEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsaUJBQWlCLEVBQUUsZUFBZSxDQUFDO29CQUNwRixJQUFJLENBQUMsbUJBQW1CLENBQUMsd0JBQXdCLENBQUMsY0FBYyxDQUFDLEdBQUc7d0JBQ25FLFVBQVUsRUFBRSxvQkFBb0I7d0JBQ2hDLFdBQVcsRUFBRSxxQkFBcUI7d0JBQ2xDLEtBQUssRUFBRSxLQUFLO3FCQUNaLENBQUM7b0JBQ0YsSUFBSSxDQUFDLG1CQUFtQixDQUFDLDhCQUE4QixJQUFJLG9CQUFvQixDQUFDO29CQUNoRixJQUFJLENBQUMsbUJBQW1CLENBQUMsK0JBQStCLElBQUkscUJBQXFCLENBQUM7b0JBRWxGLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTs7NEJBQ2hCLDJCQUEyQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3BILElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTs7Z0NBQ2pCLG9CQUFvQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLDJCQUEyQixDQUFDOzRCQUM5RSwyQkFBMkIsSUFBSSxvQkFBb0IsQ0FBQzs0QkFDcEQsWUFBWSxJQUFJLG9CQUFvQixDQUFDO3lCQUNyQzt3QkFFRCxxQkFBcUIsSUFBSSwyQkFBMkIsQ0FBQzt3QkFDckQsSUFBSSwyQkFBMkIsR0FBRyxDQUFDLElBQUksYUFBYSxJQUFJLHFCQUFxQixFQUFFOzRCQUM5RSxFQUFFLGlCQUFpQixDQUFDO3lCQUNwQjtxQkFDRDt5QkFBTTs7NEJBQ0YsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxzQkFBc0IsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDeEgsSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFOztnQ0FDakIsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsNEJBQTRCLENBQUM7NEJBQy9FLDRCQUE0QixJQUFJLG9CQUFvQixDQUFDOzRCQUNyRCxZQUFZLElBQUksb0JBQW9CLENBQUM7eUJBQ3JDO3dCQUVELHNCQUFzQixJQUFJLDRCQUE0QixDQUFDO3dCQUN2RCxJQUFJLDRCQUE0QixHQUFHLENBQUMsSUFBSSxjQUFjLElBQUksc0JBQXNCLEVBQUU7NEJBQ2pGLEVBQUUsaUJBQWlCLENBQUM7eUJBQ3BCO3FCQUNEO29CQUVELEVBQUUsY0FBYyxDQUFDO29CQUVqQixvQkFBb0IsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLHFCQUFxQixHQUFHLENBQUMsQ0FBQztpQkFDMUI7YUFDRDs7Z0JBRUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLDhCQUE4QixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQ0FBZ0M7O2dCQUN2SSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsK0JBQStCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdDQUFnQztZQUM3SSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLGlCQUFpQixJQUFJLGFBQWEsQ0FBQztZQUMxRSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLGtCQUFrQixJQUFJLGNBQWMsQ0FBQztZQUU5RSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3BCLElBQUksYUFBYSxHQUFHLHFCQUFxQixFQUFFO29CQUMxQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxHQUFHLHFCQUFxQixDQUFDLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztpQkFDNUY7YUFDRDtpQkFBTTtnQkFDTixJQUFJLGNBQWMsR0FBRyxzQkFBc0IsRUFBRTtvQkFDNUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsR0FBRyxzQkFBc0IsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLENBQUM7aUJBQy9GO2FBQ0Q7U0FDRDs7WUFFRyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNOztZQUM3QixZQUFZLEdBQUcsaUJBQWlCLEdBQUcsaUJBQWlCOztZQUNwRCxvQkFBb0IsR0FBRyxTQUFTLEdBQUcsWUFBWTs7WUFDL0Msa0JBQWtCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUM7O1lBRTdELFlBQVksR0FBRyxDQUFDOztZQUVoQiwrQkFBK0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsa0JBQWtCO1FBQzlGLElBQUksSUFBSSxDQUFDLDBCQUEwQixFQUFFOztnQkFDaEMsb0JBQW9CLEdBQUcsQ0FBQztZQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLEVBQUU7O29CQUN4QyxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2dCQUNsSixJQUFJLFNBQVMsRUFBRTtvQkFDZCxZQUFZLElBQUksU0FBUyxDQUFDO2lCQUMxQjtxQkFBTTtvQkFDTixFQUFFLG9CQUFvQixDQUFDO2lCQUN2QjthQUNEO1lBRUQsWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEdBQUcsK0JBQStCLENBQUMsQ0FBQztTQUNuRjthQUFNO1lBQ04sWUFBWSxHQUFHLGtCQUFrQixHQUFHLCtCQUErQixDQUFDO1NBQ3BFO1FBRUQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUIsWUFBWSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO1NBQ2pFOztZQUVHLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGNBQWM7O1lBQ2pFLGlCQUFpQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFFbEUsT0FBTztZQUNOLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLGlCQUFpQixFQUFFLGlCQUFpQjtZQUNwQyxpQkFBaUIsRUFBRSxpQkFBaUI7WUFDcEMsWUFBWSxFQUFFLFlBQVk7WUFDMUIsb0JBQW9CLEVBQUUsb0JBQW9CO1lBQzFDLFVBQVUsRUFBRSxpQkFBaUI7WUFDN0IsV0FBVyxFQUFFLGtCQUFrQjtZQUMvQixZQUFZLEVBQUUsWUFBWTtZQUMxQixjQUFjLEVBQUUsY0FBYztZQUM5QixpQkFBaUIsRUFBRSxpQkFBaUI7U0FDcEMsQ0FBQztJQUNILENBQUM7Ozs7Ozs7SUFLUyxtREFBZ0I7Ozs7OztJQUExQixVQUEyQix5QkFBaUMsRUFBRSxVQUF1QjtRQUNwRixJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssQ0FBQyxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxDQUFDO1NBQ1Q7O1lBRUcsK0JBQStCLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7O1lBQ2xFLHNCQUFzQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMseUJBQXlCLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztRQUV0RyxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFO1lBQ3JDLE9BQU8sK0JBQStCLEdBQUcsc0JBQXNCLENBQUM7U0FDaEU7O1lBRUcsb0JBQW9CLEdBQUcsQ0FBQzs7WUFDeEIsTUFBTSxHQUFHLENBQUM7UUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsc0JBQXNCLEVBQUUsRUFBRSxDQUFDLEVBQUU7O2dCQUM1QyxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQ2xKLElBQUksU0FBUyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxTQUFTLENBQUM7YUFDcEI7aUJBQU07Z0JBQ04sRUFBRSxvQkFBb0IsQ0FBQzthQUN2QjtTQUNEO1FBQ0QsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEdBQUcsK0JBQStCLENBQUMsQ0FBQztRQUU3RSxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7Ozs7Ozs7SUFFUyxvREFBaUI7Ozs7OztJQUEzQixVQUE0QixjQUFzQixFQUFFLFVBQXVCOztZQUN0RSxnQkFBZ0IsR0FBRyxDQUFDO1FBQ3hCLElBQUksSUFBSSxDQUFDLDBCQUEwQixFQUFFOztnQkFDOUIsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQzs7Z0JBQ3JGLG1CQUFtQixHQUFHLENBQUM7O2dCQUN2QiwrQkFBK0IsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUN0RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLEVBQUU7O29CQUN4QyxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2dCQUNsSixJQUFJLFNBQVMsRUFBRTtvQkFDZCxtQkFBbUIsSUFBSSxTQUFTLENBQUM7aUJBQ2pDO3FCQUFNO29CQUNOLG1CQUFtQixJQUFJLCtCQUErQixDQUFDO2lCQUN2RDtnQkFFRCxJQUFJLGNBQWMsR0FBRyxtQkFBbUIsRUFBRTtvQkFDekMsZ0JBQWdCLEdBQUcsQ0FBQyxHQUFHLGtCQUFrQixDQUFDO29CQUMxQyxNQUFNO2lCQUNOO2FBQ0Q7U0FDRDthQUFNO1lBQ04sZ0JBQWdCLEdBQUcsY0FBYyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7U0FDNUQ7O1lBRUcsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsb0JBQW9CLENBQUMsR0FBRyxVQUFVLENBQUMsWUFBWTs7WUFFcEssUUFBUSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFlBQVksR0FBRyxDQUFDOztZQUM3RCxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLEVBQUUsUUFBUSxDQUFDO1FBQ25GLGVBQWUsSUFBSSxlQUFlLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsbUNBQW1DO1FBRXRHLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTs7Z0JBQ2xCLGNBQWMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLGlCQUFpQjtZQUNyRCxJQUFJLGVBQWUsR0FBRyxjQUFjLEtBQUssQ0FBQyxFQUFFO2dCQUMzQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsZUFBZSxHQUFHLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNsRjtTQUNEOztZQUVHLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLEdBQUcsVUFBVSxDQUFDLFlBQVksR0FBRyxDQUFDOztZQUN0Rix1QkFBdUIsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsaUJBQWlCO1FBQ2hGLElBQUksdUJBQXVCLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDLGFBQWEsSUFBSSxVQUFVLENBQUMsaUJBQWlCLEdBQUcsdUJBQXVCLENBQUMsQ0FBQywrQkFBK0I7U0FDeEc7UUFFRCxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUMzQixlQUFlLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDekIsYUFBYSxHQUFHLENBQUMsQ0FBQztTQUNsQjtRQUVELGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkYsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7WUFFM0UsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLGlCQUFpQjs7WUFDN0Qsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7O1lBQ3BHLGtCQUFrQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRXBHLE9BQU87WUFDTixVQUFVLEVBQUUsZUFBZTtZQUMzQixRQUFRLEVBQUUsYUFBYTtZQUN2QixvQkFBb0IsRUFBRSxvQkFBb0I7WUFDMUMsa0JBQWtCLEVBQUUsa0JBQWtCO1lBQ3RDLG1CQUFtQixFQUFFLGNBQWM7WUFDbkMsaUJBQWlCLEVBQUUsY0FBYyxHQUFHLFVBQVUsQ0FBQyxjQUFjO1lBQzdELGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxpQkFBaUI7U0FDL0MsQ0FBQztJQUNILENBQUM7Ozs7O0lBRVMsb0RBQWlCOzs7O0lBQTNCOztZQUNLLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7O1lBQ3ZDLE1BQU0sR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7O1lBRWpDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtRQUN2RCxJQUFJLG1CQUFtQixHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksWUFBWSxNQUFNLENBQUMsRUFBRTtZQUN2RyxtQkFBbUIsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO1NBQzlDO2FBQU07WUFDTixtQkFBbUIsSUFBSSxNQUFNLENBQUM7U0FDOUI7UUFDRCxtQkFBbUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOztZQUVuRCxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixFQUFFLFVBQVUsQ0FBQzs7WUFDbEUsVUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsVUFBVSxDQUFDOztZQUM3RSxlQUFlLEdBQUcsVUFBVSxDQUFDLFlBQVk7UUFFN0MsT0FBTztZQUNOLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTtZQUMvQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7WUFDM0Isb0JBQW9CLEVBQUUsUUFBUSxDQUFDLG9CQUFvQjtZQUNuRCxrQkFBa0IsRUFBRSxRQUFRLENBQUMsa0JBQWtCO1lBQy9DLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUMvQixZQUFZLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7WUFDekMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLG1CQUFtQjtZQUNqRCxpQkFBaUIsRUFBRSxRQUFRLENBQUMsaUJBQWlCO1lBQzdDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxpQkFBaUI7U0FDN0MsQ0FBQztJQUNILENBQUM7O2dCQXRzQ0QsU0FBUyxTQUFDO29CQUNWLFFBQVEsRUFBRSxvQ0FBb0M7b0JBQzlDLFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFFBQVEsRUFBRSwrSkFLUjtvQkFDRixJQUFJLEVBQUU7d0JBQ0wsb0JBQW9CLEVBQUUsWUFBWTt3QkFDbEMsa0JBQWtCLEVBQUUsYUFBYTt3QkFDakMsb0JBQW9CLEVBQUUsZUFBZTtxQkFDckM7NkJBQ1EsdThCQW9EUDtpQkFDRjs7OztnQkE3SEEsVUFBVTtnQkFXVixTQUFTO2dCQUxULE1BQU07Z0JBT04saUJBQWlCO2dCQXloQmlCLE1BQU0sdUJBQXRDLE1BQU0sU0FBQyxXQUFXO2dEQUNsQixRQUFRLFlBQUksTUFBTSxTQUFDLGtDQUFrQzs7O21EQXhadEQsS0FBSzs2Q0FJTCxLQUFLOzhDQWNMLEtBQUs7b0RBR0wsS0FBSzsrQkFHTCxLQUFLO2lDQUdMLEtBQUs7a0NBR0wsS0FBSzs2QkFHTCxLQUFLOzhCQUdMLEtBQUs7Z0NBR0wsS0FBSztpQ0FHTCxLQUFLO21DQUdMLEtBQUs7b0NBR0wsS0FBSzsrQkFJTCxLQUFLO3NDQVlMLEtBQUs7K0NBR0wsS0FBSzt1Q0FJTCxLQUFLO3FDQVVMLEtBQUs7c0NBOEJMLEtBQUs7d0JBY0wsS0FBSzsrQkFhTCxLQUFLOzZCQUlMLEtBQUs7K0JBcUJMLEtBQUs7MkJBcUJMLE1BQU07MkJBR04sTUFBTTswQkFHTixNQUFNO3dCQUdOLE1BQU07b0NBR04sU0FBUyxTQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs2Q0FHeEQsU0FBUyxTQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO21DQUdqRSxZQUFZLFNBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO3NDQUcxRCxZQUFZLFNBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztJQXE2Qi9ELCtCQUFDO0NBQUEsQUF2c0NELElBdXNDQztTQW5vQ1ksd0JBQXdCOzs7SUFDcEMsaURBQTRCOztJQUM1QiwwQ0FBdUI7O0lBZXZCLG9FQUN5RDs7Ozs7SUFFekQsK0RBQXVEOztJQWV2RCwrREFDb0Q7O0lBRXBELHFFQUNrRDs7SUFFbEQsZ0RBQzZCOztJQUU3QixrREFDOEI7O0lBRTlCLG1EQUMrQjs7SUFFL0IsOENBQzBCOztJQUUxQiwrQ0FDMkI7O0lBRTNCLGlEQUM2Qjs7SUFFN0Isa0RBQzhCOztJQUU5QixvREFDdUM7O0lBRXZDLHFEQUN3Qzs7Ozs7SUFFeEMsaURBQW9DOztJQWFwQyx1REFDbUM7O0lBRW5DLGdFQUM0Qzs7Ozs7SUFFNUMseURBQXdDOzs7OztJQVV4Qyx1REFBc0M7Ozs7O0lBVXRDLDRDQUErQjs7Ozs7SUFtQi9CLGtFQUFpRDs7Ozs7SUFDakQsd0RBQXVDOzs7OztJQWN2QywwQ0FBNkI7O0lBYzdCLGdEQUN1Rzs7Ozs7SUFFdkcsK0NBQStCOzs7OztJQW9CL0IsMkRBQTREOzs7OztJQUM1RCxpREFBMEM7O0lBc0IxQyw0Q0FDaUU7O0lBRWpFLDRDQUN5RTs7SUFFekUsMkNBQ3dFOztJQUV4RSx5Q0FDc0U7Ozs7O0lBRXRFLHFEQUN3Qzs7Ozs7SUFFeEMsOERBQ2lEOzs7OztJQUVqRCxvREFDdUM7Ozs7O0lBRXZDLHVEQUMwQzs7Ozs7SUFtTTFDLHlEQUF5Qzs7Ozs7SUE0Q3pDLDhEQUFpRDs7Ozs7SUFxQmpELDZEQUFvQzs7Ozs7SUFDcEMsK0NBQXNCOzs7OztJQUN0QiwrQ0FBc0I7Ozs7O0lBQ3RCLG1EQUEwQjs7Ozs7SUFDMUIsbURBQTBCOzs7OztJQUMxQixpREFBd0I7Ozs7O0lBQ3hCLDhDQUFxQjs7Ozs7SUFpRXJCLDREQUErQzs7Ozs7SUFDL0MsNkRBQWdEOzs7OztJQUVoRCwyQ0FBOEI7Ozs7O0lBQzlCLG9EQUFnRDs7Ozs7SUFDaEQsZ0RBQW9DOzs7OztJQUNwQyxxREFBb0M7Ozs7O0lBRXBDLHdEQUF1RDs7Ozs7SUFDdkQsd0RBQXVEOzs7OztJQW9QdkQseURBQXdDOzs7OztJQUN4QywwREFBeUM7Ozs7O0lBRXpDLHVEQUFtRDs7Ozs7SUE0Tm5ELGtEQUFxQzs7Ozs7SUFDckMsZ0VBQW1EOzs7OztJQW5tQnZDLDJDQUFzQzs7Ozs7SUFDakQsNENBQXNDOzs7OztJQUN0Qyx3Q0FBK0I7Ozs7O0lBQy9CLHFEQUE4Qzs7QUE4dEJoRDtJQUFBO0lBV3FDLENBQUM7O2dCQVhyQyxRQUFRLFNBQUM7b0JBQ1QsT0FBTyxFQUFFLENBQUMsd0JBQXdCLENBQUM7b0JBQ25DLFlBQVksRUFBRSxDQUFDLHdCQUF3QixDQUFDO29CQUN4QyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFNBQVMsRUFBRTt3QkFDVjs0QkFDQyxPQUFPLEVBQUUsa0NBQWtDOzRCQUMzQyxVQUFVLEVBQUUsd0NBQXdDO3lCQUNwRDtxQkFDRDtpQkFDRDs7SUFDb0MsNEJBQUM7Q0FBQSxBQVh0QyxJQVdzQztTQUF6QixxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdENvbXBvbmVudCxcclxuXHRDb250ZW50Q2hpbGQsXHJcblx0RWxlbWVudFJlZixcclxuXHRFdmVudEVtaXR0ZXIsXHJcblx0SW5qZWN0LFxyXG5cdE9wdGlvbmFsLFxyXG5cdElucHV0LFxyXG5cdE5nTW9kdWxlLFxyXG5cdE5nWm9uZSxcclxuXHRPbkNoYW5nZXMsXHJcblx0T25EZXN0cm95LFxyXG5cdE9uSW5pdCxcclxuXHRPdXRwdXQsXHJcblx0UmVuZGVyZXIyLFxyXG5cdFZpZXdDaGlsZCxcclxuXHRDaGFuZ2VEZXRlY3RvclJlZixcclxuXHRJbmplY3Rpb25Ub2tlblxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgUExBVEZPUk1fSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgaXNQbGF0Zm9ybVNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcblxyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuaW1wb3J0ICogYXMgdHdlZW4gZnJvbSAnQHR3ZWVuanMvdHdlZW4uanMnXHJcbmltcG9ydCB7IFZpcnR1YWxTY3JvbGxlckRlZmF1bHRPcHRpb25zIH0gZnJvbSAnLi9kZWZhdWx0b3B0aW9ucyc7XHJcbmltcG9ydCB7IElQYWdlSW5mbyB9IGZyb20gJy4vaXBhZ2VpbmZvJztcclxuaW1wb3J0IHsgSVZpZXdwb3J0IH0gZnJvbSAnLi9pdmlld3BvcnQnO1xyXG5cclxuaW1wb3J0IHsgV3JhcEdyb3VwRGltZW5zaW9ucyB9IGZyb20gJy4vd3JhcGdyb3VwZGltZW5zaW9ucyc7XHJcbmltcG9ydCB7IFdyYXBHcm91cERpbWVuc2lvbiB9IGZyb20gJy4vd3JhcGdyb3VwZGltZW5zaW9uJztcclxuXHJcbmltcG9ydCB7IElEaW1lbnNpb25zIH0gZnJvbSAnLi9pZGltZW5zaW9uJztcclxuXHJcbiBcclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFZJUlRVQUxfU0NST0xMRVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogVmlydHVhbFNjcm9sbGVyRGVmYXVsdE9wdGlvbnMge1xyXG5cdHJldHVybiB7XHJcblx0XHRzY3JvbGxUaHJvdHRsaW5nVGltZTogMCxcclxuXHRcdHNjcm9sbERlYm91bmNlVGltZTogMCxcclxuXHRcdHNjcm9sbEFuaW1hdGlvblRpbWU6IDc1MCxcclxuXHRcdGNoZWNrUmVzaXplSW50ZXJ2YWw6IDEwMDAsXHJcblx0XHRyZXNpemVCeXBhc3NSZWZyZXNoVGhyZXNob2xkOiA1LFxyXG5cdFx0bW9kaWZ5T3ZlcmZsb3dTdHlsZU9mUGFyZW50U2Nyb2xsOiB0cnVlLFxyXG5cdFx0c3RyaXBlZFRhYmxlOiBmYWxzZVxyXG5cdH07XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ3ZpcnR1YWwtc2Nyb2xsZXIsW3ZpcnR1YWxTY3JvbGxlcl0nLFxyXG5cdGV4cG9ydEFzOiAndmlydHVhbFNjcm9sbGVyJyxcclxuXHR0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBjbGFzcz1cInRvdGFsLXBhZGRpbmdcIiAjaW52aXNpYmxlUGFkZGluZz48L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJzY3JvbGxhYmxlLWNvbnRlbnRcIiAjY29udGVudD5cclxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG4gICAgPC9kaXY+XHJcbiAgYCxcclxuXHRob3N0OiB7XHJcblx0XHQnW2NsYXNzLmhvcml6b250YWxdJzogXCJob3Jpem9udGFsXCIsXHJcblx0XHQnW2NsYXNzLnZlcnRpY2FsXSc6IFwiIWhvcml6b250YWxcIixcclxuXHRcdCdbY2xhc3Muc2VsZlNjcm9sbF0nOiBcIiFwYXJlbnRTY3JvbGxcIlxyXG5cdH0sXHJcblx0c3R5bGVzOiBbYFxyXG4gICAgOmhvc3Qge1xyXG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0ICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO1xyXG4gICAgfVxyXG5cdFxyXG5cdDpob3N0Lmhvcml6b250YWwuc2VsZlNjcm9sbCB7XHJcbiAgICAgIG92ZXJmbG93LXk6IHZpc2libGU7XHJcbiAgICAgIG92ZXJmbG93LXg6IGF1dG87XHJcblx0fVxyXG5cdDpob3N0LnZlcnRpY2FsLnNlbGZTY3JvbGwge1xyXG4gICAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG4gICAgICBvdmVyZmxvdy14OiB2aXNpYmxlO1xyXG5cdH1cclxuXHRcclxuICAgIC5zY3JvbGxhYmxlLWNvbnRlbnQge1xyXG4gICAgICB0b3A6IDA7XHJcbiAgICAgIGxlZnQ6IDA7XHJcbiAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICAgIG1heC13aWR0aDogMTAwdnc7XHJcbiAgICAgIG1heC1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB9XHJcblxyXG5cdC5zY3JvbGxhYmxlLWNvbnRlbnQgOjpuZy1kZWVwID4gKiB7XHJcblx0XHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG5cdH1cclxuXHRcclxuXHQ6aG9zdC5ob3Jpem9udGFsIHtcclxuXHRcdHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcblx0fVxyXG5cdFxyXG5cdDpob3N0Lmhvcml6b250YWwgLnNjcm9sbGFibGUtY29udGVudCB7XHJcblx0XHRkaXNwbGF5OiBmbGV4O1xyXG5cdH1cclxuXHRcclxuXHQ6aG9zdC5ob3Jpem9udGFsIC5zY3JvbGxhYmxlLWNvbnRlbnQgOjpuZy1kZWVwID4gKiB7XHJcblx0XHRmbGV4LXNocmluazogMDtcclxuXHRcdGZsZXgtZ3JvdzogMDtcclxuXHRcdHdoaXRlLXNwYWNlOiBpbml0aWFsO1xyXG5cdH1cclxuXHRcclxuICAgIC50b3RhbC1wYWRkaW5nIHtcclxuICAgICAgd2lkdGg6IDFweDtcclxuICAgICAgb3BhY2l0eTogMDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgOmhvc3QuaG9yaXpvbnRhbCAudG90YWwtcGFkZGluZyB7XHJcbiAgICAgIGhlaWdodDogMTAwJTtcclxuICAgIH1cclxuICBgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVmlydHVhbFNjcm9sbGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XHJcblx0cHVibGljIHZpZXdQb3J0SXRlbXM6IGFueVtdO1xyXG5cdHB1YmxpYyB3aW5kb3cgPSB3aW5kb3c7XHJcblxyXG5cdHB1YmxpYyBnZXQgdmlld1BvcnRJbmZvKCk6IElQYWdlSW5mbyB7XHJcblx0XHRsZXQgcGFnZUluZm86IElWaWV3cG9ydCA9IHRoaXMucHJldmlvdXNWaWV3UG9ydCB8fCA8YW55Pnt9O1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0c3RhcnRJbmRleDogcGFnZUluZm8uc3RhcnRJbmRleCB8fCAwLFxyXG5cdFx0XHRlbmRJbmRleDogcGFnZUluZm8uZW5kSW5kZXggfHwgMCxcclxuXHRcdFx0c2Nyb2xsU3RhcnRQb3NpdGlvbjogcGFnZUluZm8uc2Nyb2xsU3RhcnRQb3NpdGlvbiB8fCAwLFxyXG5cdFx0XHRzY3JvbGxFbmRQb3NpdGlvbjogcGFnZUluZm8uc2Nyb2xsRW5kUG9zaXRpb24gfHwgMCxcclxuXHRcdFx0bWF4U2Nyb2xsUG9zaXRpb246IHBhZ2VJbmZvLm1heFNjcm9sbFBvc2l0aW9uIHx8IDAsXHJcblx0XHRcdHN0YXJ0SW5kZXhXaXRoQnVmZmVyOiBwYWdlSW5mby5zdGFydEluZGV4V2l0aEJ1ZmZlciB8fCAwLFxyXG5cdFx0XHRlbmRJbmRleFdpdGhCdWZmZXI6IHBhZ2VJbmZvLmVuZEluZGV4V2l0aEJ1ZmZlciB8fCAwXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0QElucHV0KClcclxuXHRwdWJsaWMgZXhlY3V0ZVJlZnJlc2hPdXRzaWRlQW5ndWxhclpvbmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHJvdGVjdGVkIF9lbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdEBJbnB1dCgpXHJcblx0cHVibGljIGdldCBlbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcygpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiB0aGlzLl9lbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcztcclxuXHR9XHJcblx0cHVibGljIHNldCBlbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcyh2YWx1ZTogYm9vbGVhbikge1xyXG5cdFx0aWYgKHRoaXMuX2VuYWJsZVVuZXF1YWxDaGlsZHJlblNpemVzID09PSB2YWx1ZSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fZW5hYmxlVW5lcXVhbENoaWxkcmVuU2l6ZXMgPSB2YWx1ZTtcclxuXHRcdHRoaXMubWluTWVhc3VyZWRDaGlsZFdpZHRoID0gdW5kZWZpbmVkO1xyXG5cdFx0dGhpcy5taW5NZWFzdXJlZENoaWxkSGVpZ2h0ID0gdW5kZWZpbmVkO1xyXG5cdH1cclxuXHJcblx0QElucHV0KClcclxuXHRwdWJsaWMgdXNlTWFyZ2luSW5zdGVhZE9mVHJhbnNsYXRlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdEBJbnB1dCgpXHJcblx0cHVibGljIG1vZGlmeU92ZXJmbG93U3R5bGVPZlBhcmVudFNjcm9sbDogYm9vbGVhbjtcclxuXHJcblx0QElucHV0KClcclxuXHRwdWJsaWMgc3RyaXBlZFRhYmxlOiBib29sZWFuO1xyXG5cclxuXHRASW5wdXQoKVxyXG5cdHB1YmxpYyBzY3JvbGxiYXJXaWR0aDogbnVtYmVyO1xyXG5cclxuXHRASW5wdXQoKVxyXG5cdHB1YmxpYyBzY3JvbGxiYXJIZWlnaHQ6IG51bWJlcjtcclxuXHJcblx0QElucHV0KClcclxuXHRwdWJsaWMgY2hpbGRXaWR0aDogbnVtYmVyO1xyXG5cclxuXHRASW5wdXQoKVxyXG5cdHB1YmxpYyBjaGlsZEhlaWdodDogbnVtYmVyO1xyXG5cclxuXHRASW5wdXQoKVxyXG5cdHB1YmxpYyBzc3JDaGlsZFdpZHRoOiBudW1iZXI7XHJcblxyXG5cdEBJbnB1dCgpXHJcblx0cHVibGljIHNzckNoaWxkSGVpZ2h0OiBudW1iZXI7XHJcblxyXG5cdEBJbnB1dCgpXHJcblx0cHVibGljIHNzclZpZXdwb3J0V2lkdGg6IG51bWJlciA9IDE5MjA7XHJcblxyXG5cdEBJbnB1dCgpXHJcblx0cHVibGljIHNzclZpZXdwb3J0SGVpZ2h0OiBudW1iZXIgPSAxMDgwO1xyXG5cclxuXHRwcm90ZWN0ZWQgX2J1ZmZlckFtb3VudDogbnVtYmVyID0gMDtcclxuXHRASW5wdXQoKVxyXG5cdHB1YmxpYyBnZXQgYnVmZmVyQW1vdW50KCk6IG51bWJlciB7XHJcblx0XHRpZiAodHlwZW9mICh0aGlzLl9idWZmZXJBbW91bnQpID09PSAnbnVtYmVyJyAmJiB0aGlzLl9idWZmZXJBbW91bnQgPj0gMCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5fYnVmZmVyQW1vdW50O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZW5hYmxlVW5lcXVhbENoaWxkcmVuU2l6ZXMgPyA1IDogMDtcdFxyXG5cdFx0fVxyXG5cdH1cclxuXHRwdWJsaWMgc2V0IGJ1ZmZlckFtb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcblx0XHR0aGlzLl9idWZmZXJBbW91bnQgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdEBJbnB1dCgpXHJcblx0cHVibGljIHNjcm9sbEFuaW1hdGlvblRpbWU6IG51bWJlcjtcclxuXHJcblx0QElucHV0KClcclxuXHRwdWJsaWMgcmVzaXplQnlwYXNzUmVmcmVzaFRocmVzaG9sZDogbnVtYmVyO1xyXG5cclxuXHRwcm90ZWN0ZWQgX3Njcm9sbFRocm90dGxpbmdUaW1lOiBudW1iZXI7XHJcblx0QElucHV0KClcclxuXHRwdWJsaWMgZ2V0IHNjcm9sbFRocm90dGxpbmdUaW1lKCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2Nyb2xsVGhyb3R0bGluZ1RpbWU7XHJcblx0fVxyXG5cdHB1YmxpYyBzZXQgc2Nyb2xsVGhyb3R0bGluZ1RpbWUodmFsdWU6IG51bWJlcikge1xyXG5cdFx0dGhpcy5fc2Nyb2xsVGhyb3R0bGluZ1RpbWUgPSB2YWx1ZTtcclxuXHRcdHRoaXMudXBkYXRlT25TY3JvbGxGdW5jdGlvbigpO1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIF9zY3JvbGxEZWJvdW5jZVRpbWU6IG51bWJlcjtcclxuXHRASW5wdXQoKVxyXG5cdHB1YmxpYyBnZXQgc2Nyb2xsRGVib3VuY2VUaW1lKCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5fc2Nyb2xsRGVib3VuY2VUaW1lO1xyXG5cdH1cclxuXHRwdWJsaWMgc2V0IHNjcm9sbERlYm91bmNlVGltZSh2YWx1ZTogbnVtYmVyKSB7XHJcblx0XHR0aGlzLl9zY3JvbGxEZWJvdW5jZVRpbWUgPSB2YWx1ZTtcclxuXHRcdHRoaXMudXBkYXRlT25TY3JvbGxGdW5jdGlvbigpO1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIG9uU2Nyb2xsOiAoKSA9PiB2b2lkO1xyXG5cdHByb3RlY3RlZCB1cGRhdGVPblNjcm9sbEZ1bmN0aW9uKCk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuc2Nyb2xsRGVib3VuY2VUaW1lKSB7XHJcblx0XHRcdHRoaXMub25TY3JvbGwgPSA8YW55PnRoaXMuZGVib3VuY2UoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSk7XHJcblx0XHRcdH0sIHRoaXMuc2Nyb2xsRGVib3VuY2VUaW1lKTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMuc2Nyb2xsVGhyb3R0bGluZ1RpbWUpIHtcclxuXHRcdFx0dGhpcy5vblNjcm9sbCA9IDxhbnk+dGhpcy50aHJvdHRsZVRyYWlsaW5nKCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwoZmFsc2UpO1xyXG5cdFx0XHR9LCB0aGlzLnNjcm9sbFRocm90dGxpbmdUaW1lKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLm9uU2Nyb2xsID0gKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSk7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgY2hlY2tTY3JvbGxFbGVtZW50UmVzaXplZFRpbWVyOiBudW1iZXI7XHJcblx0cHJvdGVjdGVkIF9jaGVja1Jlc2l6ZUludGVydmFsOiBudW1iZXI7XHJcblx0QElucHV0KClcclxuXHRwdWJsaWMgZ2V0IGNoZWNrUmVzaXplSW50ZXJ2YWwoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLl9jaGVja1Jlc2l6ZUludGVydmFsO1xyXG5cdH1cclxuXHRwdWJsaWMgc2V0IGNoZWNrUmVzaXplSW50ZXJ2YWwodmFsdWU6IG51bWJlcikge1xyXG5cdFx0aWYgKHRoaXMuX2NoZWNrUmVzaXplSW50ZXJ2YWwgPT09IHZhbHVlKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9jaGVja1Jlc2l6ZUludGVydmFsID0gdmFsdWU7XHJcblx0XHR0aGlzLmFkZFNjcm9sbEV2ZW50SGFuZGxlcnMoKTtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBfaXRlbXM6IGFueVtdID0gW107XHJcblx0QElucHV0KClcclxuXHRwdWJsaWMgZ2V0IGl0ZW1zKCk6IGFueVtdIHtcclxuXHRcdHJldHVybiB0aGlzLl9pdGVtcztcclxuXHR9XHJcblx0cHVibGljIHNldCBpdGVtcyh2YWx1ZTogYW55W10pIHtcclxuXHRcdGlmICh2YWx1ZSA9PT0gdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2l0ZW1zID0gdmFsdWUgfHwgW107XHJcblx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwodHJ1ZSk7XHJcblx0fVxyXG5cclxuXHRASW5wdXQoKVxyXG5cdHB1YmxpYyBjb21wYXJlSXRlbXM6IChpdGVtMTogYW55LCBpdGVtMjogYW55KSA9PiBib29sZWFuID0gKGl0ZW0xOiBhbnksIGl0ZW0yOiBhbnkpID0+IGl0ZW0xID09PSBpdGVtMjtcclxuXHJcblx0cHJvdGVjdGVkIF9ob3Jpem9udGFsOiBib29sZWFuO1xyXG5cdEBJbnB1dCgpXHJcblx0cHVibGljIGdldCBob3Jpem9udGFsKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2hvcml6b250YWw7XHJcblx0fVxyXG5cdHB1YmxpYyBzZXQgaG9yaXpvbnRhbCh2YWx1ZTogYm9vbGVhbikge1xyXG5cdFx0dGhpcy5faG9yaXpvbnRhbCA9IHZhbHVlO1xyXG5cdFx0dGhpcy51cGRhdGVEaXJlY3Rpb24oKTtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCByZXZlcnRQYXJlbnRPdmVyc2Nyb2xsKCk6IHZvaWQge1xyXG5cdFx0Y29uc3Qgc2Nyb2xsRWxlbWVudCA9IHRoaXMuZ2V0U2Nyb2xsRWxlbWVudCgpO1xyXG5cdFx0aWYgKHNjcm9sbEVsZW1lbnQgJiYgdGhpcy5vbGRQYXJlbnRTY3JvbGxPdmVyZmxvdykge1xyXG5cdFx0XHRzY3JvbGxFbGVtZW50LnN0eWxlWydvdmVyZmxvdy15J10gPSB0aGlzLm9sZFBhcmVudFNjcm9sbE92ZXJmbG93Lnk7XHJcblx0XHRcdHNjcm9sbEVsZW1lbnQuc3R5bGVbJ292ZXJmbG93LXgnXSA9IHRoaXMub2xkUGFyZW50U2Nyb2xsT3ZlcmZsb3cueDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLm9sZFBhcmVudFNjcm9sbE92ZXJmbG93ID0gdW5kZWZpbmVkO1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIG9sZFBhcmVudFNjcm9sbE92ZXJmbG93OiB7IHg6IHN0cmluZywgeTogc3RyaW5nIH07XHJcblx0cHJvdGVjdGVkIF9wYXJlbnRTY3JvbGw6IEVsZW1lbnQgfCBXaW5kb3c7XHJcblx0QElucHV0KClcclxuXHRwdWJsaWMgZ2V0IHBhcmVudFNjcm9sbCgpOiBFbGVtZW50IHwgV2luZG93IHtcclxuXHRcdHJldHVybiB0aGlzLl9wYXJlbnRTY3JvbGw7XHJcblx0fVxyXG5cdHB1YmxpYyBzZXQgcGFyZW50U2Nyb2xsKHZhbHVlOiBFbGVtZW50IHwgV2luZG93KSB7XHJcblx0XHRpZiAodGhpcy5fcGFyZW50U2Nyb2xsID09PSB2YWx1ZSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5yZXZlcnRQYXJlbnRPdmVyc2Nyb2xsKCk7XHJcblx0XHR0aGlzLl9wYXJlbnRTY3JvbGwgPSB2YWx1ZTtcclxuXHRcdHRoaXMuYWRkU2Nyb2xsRXZlbnRIYW5kbGVycygpO1xyXG5cclxuXHRcdGNvbnN0IHNjcm9sbEVsZW1lbnQgPSB0aGlzLmdldFNjcm9sbEVsZW1lbnQoKTtcclxuXHRcdGlmICh0aGlzLm1vZGlmeU92ZXJmbG93U3R5bGVPZlBhcmVudFNjcm9sbCAmJiBzY3JvbGxFbGVtZW50ICE9PSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCkge1xyXG5cdFx0XHR0aGlzLm9sZFBhcmVudFNjcm9sbE92ZXJmbG93ID0geyB4OiBzY3JvbGxFbGVtZW50LnN0eWxlWydvdmVyZmxvdy14J10sIHk6IHNjcm9sbEVsZW1lbnQuc3R5bGVbJ292ZXJmbG93LXknXSB9O1xyXG5cdFx0XHRzY3JvbGxFbGVtZW50LnN0eWxlWydvdmVyZmxvdy15J10gPSB0aGlzLmhvcml6b250YWwgPyAndmlzaWJsZScgOiAnYXV0byc7XHJcblx0XHRcdHNjcm9sbEVsZW1lbnQuc3R5bGVbJ292ZXJmbG93LXgnXSA9IHRoaXMuaG9yaXpvbnRhbCA/ICdhdXRvJyA6ICd2aXNpYmxlJztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdEBPdXRwdXQoKVxyXG5cdHB1YmxpYyB2c1VwZGF0ZTogRXZlbnRFbWl0dGVyPGFueVtdPiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55W10+KCk7XHJcblxyXG5cdEBPdXRwdXQoKVxyXG5cdHB1YmxpYyB2c0NoYW5nZTogRXZlbnRFbWl0dGVyPElQYWdlSW5mbz4gPSBuZXcgRXZlbnRFbWl0dGVyPElQYWdlSW5mbz4oKTtcclxuXHJcblx0QE91dHB1dCgpXHJcblx0cHVibGljIHZzU3RhcnQ6IEV2ZW50RW1pdHRlcjxJUGFnZUluZm8+ID0gbmV3IEV2ZW50RW1pdHRlcjxJUGFnZUluZm8+KCk7XHJcblxyXG5cdEBPdXRwdXQoKVxyXG5cdHB1YmxpYyB2c0VuZDogRXZlbnRFbWl0dGVyPElQYWdlSW5mbz4gPSBuZXcgRXZlbnRFbWl0dGVyPElQYWdlSW5mbz4oKTtcclxuXHJcblx0QFZpZXdDaGlsZCgnY29udGVudCcsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxyXG5cdHByb3RlY3RlZCBjb250ZW50RWxlbWVudFJlZjogRWxlbWVudFJlZjtcclxuXHJcblx0QFZpZXdDaGlsZCgnaW52aXNpYmxlUGFkZGluZycsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxyXG5cdHByb3RlY3RlZCBpbnZpc2libGVQYWRkaW5nRWxlbWVudFJlZjogRWxlbWVudFJlZjtcclxuXHJcblx0QENvbnRlbnRDaGlsZCgnaGVhZGVyJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IGZhbHNlIH0pXHJcblx0cHJvdGVjdGVkIGhlYWRlckVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XHJcblxyXG5cdEBDb250ZW50Q2hpbGQoJ2NvbnRhaW5lcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxyXG5cdHByb3RlY3RlZCBjb250YWluZXJFbGVtZW50UmVmOiBFbGVtZW50UmVmO1xyXG5cclxuXHRwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcblx0XHR0aGlzLmFkZFNjcm9sbEV2ZW50SGFuZGxlcnMoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuXHRcdHRoaXMucmVtb3ZlU2Nyb2xsRXZlbnRIYW5kbGVycygpO1xyXG5cdFx0dGhpcy5yZXZlcnRQYXJlbnRPdmVyc2Nyb2xsKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogYW55KTogdm9pZCB7XHJcblx0XHRsZXQgaW5kZXhMZW5ndGhDaGFuZ2VkID0gdGhpcy5jYWNoZWRJdGVtc0xlbmd0aCAhPT0gdGhpcy5pdGVtcy5sZW5ndGg7XHJcblx0XHR0aGlzLmNhY2hlZEl0ZW1zTGVuZ3RoID0gdGhpcy5pdGVtcy5sZW5ndGg7XHJcblxyXG5cdFx0Y29uc3QgZmlyc3RSdW46IGJvb2xlYW4gPSAhY2hhbmdlcy5pdGVtcyB8fCAhY2hhbmdlcy5pdGVtcy5wcmV2aW91c1ZhbHVlIHx8IGNoYW5nZXMuaXRlbXMucHJldmlvdXNWYWx1ZS5sZW5ndGggPT09IDA7XHJcblx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwoaW5kZXhMZW5ndGhDaGFuZ2VkIHx8IGZpcnN0UnVuKTtcclxuXHR9XHJcblxyXG5cdFxyXG5cdHB1YmxpYyBuZ0RvQ2hlY2soKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5jYWNoZWRJdGVtc0xlbmd0aCAhPT0gdGhpcy5pdGVtcy5sZW5ndGgpIHtcclxuXHRcdFx0dGhpcy5jYWNoZWRJdGVtc0xlbmd0aCA9IHRoaXMuaXRlbXMubGVuZ3RoO1xyXG5cdFx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwodHJ1ZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMucHJldmlvdXNWaWV3UG9ydCAmJiB0aGlzLnZpZXdQb3J0SXRlbXMgJiYgdGhpcy52aWV3UG9ydEl0ZW1zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0bGV0IGl0ZW1zQXJyYXlDaGFuZ2VkID0gZmFsc2U7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52aWV3UG9ydEl0ZW1zLmxlbmd0aDsgKytpKSB7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmNvbXBhcmVJdGVtcyh0aGlzLml0ZW1zW3RoaXMucHJldmlvdXNWaWV3UG9ydC5zdGFydEluZGV4V2l0aEJ1ZmZlciArIGldLCB0aGlzLnZpZXdQb3J0SXRlbXNbaV0pKSB7XHJcblx0XHRcdFx0XHRpdGVtc0FycmF5Q2hhbmdlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGl0ZW1zQXJyYXlDaGFuZ2VkKSB7XHJcblx0XHRcdFx0dGhpcy5yZWZyZXNoX2ludGVybmFsKHRydWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVmcmVzaCgpOiB2b2lkIHtcclxuXHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbCh0cnVlKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBpbnZhbGlkYXRlQWxsQ2FjaGVkTWVhc3VyZW1lbnRzKCk6IHZvaWQge1xyXG5cdFx0dGhpcy53cmFwR3JvdXBEaW1lbnNpb25zID0ge1xyXG5cdFx0XHRtYXhDaGlsZFNpemVQZXJXcmFwR3JvdXA6IFtdLFxyXG5cdFx0XHRudW1iZXJPZktub3duV3JhcEdyb3VwQ2hpbGRTaXplczogMCxcclxuXHRcdFx0c3VtT2ZLbm93bldyYXBHcm91cENoaWxkV2lkdGhzOiAwLFxyXG5cdFx0XHRzdW1PZktub3duV3JhcEdyb3VwQ2hpbGRIZWlnaHRzOiAwXHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMubWluTWVhc3VyZWRDaGlsZFdpZHRoID0gdW5kZWZpbmVkO1xyXG5cdFx0dGhpcy5taW5NZWFzdXJlZENoaWxkSGVpZ2h0ID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaW52YWxpZGF0ZUNhY2hlZE1lYXN1cmVtZW50Rm9ySXRlbShpdGVtOiBhbnkpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmVuYWJsZVVuZXF1YWxDaGlsZHJlblNpemVzKSB7XHJcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuaXRlbXMgJiYgdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xyXG5cdFx0XHRpZiAoaW5kZXggPj0gMCkge1xyXG5cdFx0XHRcdHRoaXMuaW52YWxpZGF0ZUNhY2hlZE1lYXN1cmVtZW50QXRJbmRleChpbmRleCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMubWluTWVhc3VyZWRDaGlsZFdpZHRoID0gdW5kZWZpbmVkO1xyXG5cdFx0XHR0aGlzLm1pbk1lYXN1cmVkQ2hpbGRIZWlnaHQgPSB1bmRlZmluZWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5yZWZyZXNoX2ludGVybmFsKGZhbHNlKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBpbnZhbGlkYXRlQ2FjaGVkTWVhc3VyZW1lbnRBdEluZGV4KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmVuYWJsZVVuZXF1YWxDaGlsZHJlblNpemVzKSB7XHJcblx0XHRcdGxldCBjYWNoZWRNZWFzdXJlbWVudCA9IHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5tYXhDaGlsZFNpemVQZXJXcmFwR3JvdXBbaW5kZXhdO1xyXG5cdFx0XHRpZiAoY2FjaGVkTWVhc3VyZW1lbnQpIHtcclxuXHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMubWF4Q2hpbGRTaXplUGVyV3JhcEdyb3VwW2luZGV4XSA9IHVuZGVmaW5lZDtcclxuXHRcdFx0XHQtLXRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5udW1iZXJPZktub3duV3JhcEdyb3VwQ2hpbGRTaXplcztcclxuXHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMuc3VtT2ZLbm93bldyYXBHcm91cENoaWxkV2lkdGhzIC09IGNhY2hlZE1lYXN1cmVtZW50LmNoaWxkV2lkdGggfHwgMDtcclxuXHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMuc3VtT2ZLbm93bldyYXBHcm91cENoaWxkSGVpZ2h0cyAtPSBjYWNoZWRNZWFzdXJlbWVudC5jaGlsZEhlaWdodCB8fCAwO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLm1pbk1lYXN1cmVkQ2hpbGRXaWR0aCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0dGhpcy5taW5NZWFzdXJlZENoaWxkSGVpZ2h0ID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2Nyb2xsSW50byhpdGVtOiBhbnksIGFsaWduVG9CZWdpbm5pbmc6IGJvb2xlYW4gPSB0cnVlLCBhZGRpdGlvbmFsT2Zmc2V0OiBudW1iZXIgPSAwLCBhbmltYXRpb25NaWxsaXNlY29uZHM6IG51bWJlciA9IHVuZGVmaW5lZCwgYW5pbWF0aW9uQ29tcGxldGVkQ2FsbGJhY2s6ICgpID0+IHZvaWQgPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuXHRcdGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pO1xyXG5cdFx0aWYgKGluZGV4ID09PSAtMSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5zY3JvbGxUb0luZGV4KGluZGV4LCBhbGlnblRvQmVnaW5uaW5nLCBhZGRpdGlvbmFsT2Zmc2V0LCBhbmltYXRpb25NaWxsaXNlY29uZHMsIGFuaW1hdGlvbkNvbXBsZXRlZENhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzY3JvbGxUb0luZGV4KGluZGV4OiBudW1iZXIsIGFsaWduVG9CZWdpbm5pbmc6IGJvb2xlYW4gPSB0cnVlLCBhZGRpdGlvbmFsT2Zmc2V0OiBudW1iZXIgPSAwLCBhbmltYXRpb25NaWxsaXNlY29uZHM6IG51bWJlciA9IHVuZGVmaW5lZCwgYW5pbWF0aW9uQ29tcGxldGVkQ2FsbGJhY2s6ICgpID0+IHZvaWQgPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuXHRcdGxldCBtYXhSZXRyaWVzOiBudW1iZXIgPSA1O1xyXG5cclxuXHRcdGxldCByZXRyeUlmTmVlZGVkID0gKCkgPT4ge1xyXG5cdFx0XHQtLW1heFJldHJpZXM7XHJcblx0XHRcdGlmIChtYXhSZXRyaWVzIDw9IDApIHtcclxuXHRcdFx0XHRpZiAoYW5pbWF0aW9uQ29tcGxldGVkQ2FsbGJhY2spIHtcclxuXHRcdFx0XHRcdGFuaW1hdGlvbkNvbXBsZXRlZENhbGxiYWNrKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGRpbWVuc2lvbnMgPSB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcclxuXHRcdFx0bGV0IGRlc2lyZWRTdGFydEluZGV4ID0gTWF0aC5taW4oTWF0aC5tYXgoaW5kZXgsIDApLCBkaW1lbnNpb25zLml0ZW1Db3VudCAtIDEpO1xyXG5cdFx0XHRpZiAodGhpcy5wcmV2aW91c1ZpZXdQb3J0LnN0YXJ0SW5kZXggPT09IGRlc2lyZWRTdGFydEluZGV4KSB7XHJcblx0XHRcdFx0aWYgKGFuaW1hdGlvbkNvbXBsZXRlZENhbGxiYWNrKSB7XHJcblx0XHRcdFx0XHRhbmltYXRpb25Db21wbGV0ZWRDYWxsYmFjaygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuc2Nyb2xsVG9JbmRleF9pbnRlcm5hbChpbmRleCwgYWxpZ25Ub0JlZ2lubmluZywgYWRkaXRpb25hbE9mZnNldCwgMCwgcmV0cnlJZk5lZWRlZCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc2Nyb2xsVG9JbmRleF9pbnRlcm5hbChpbmRleCwgYWxpZ25Ub0JlZ2lubmluZywgYWRkaXRpb25hbE9mZnNldCwgYW5pbWF0aW9uTWlsbGlzZWNvbmRzLCByZXRyeUlmTmVlZGVkKTtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBzY3JvbGxUb0luZGV4X2ludGVybmFsKGluZGV4OiBudW1iZXIsIGFsaWduVG9CZWdpbm5pbmc6IGJvb2xlYW4gPSB0cnVlLCBhZGRpdGlvbmFsT2Zmc2V0OiBudW1iZXIgPSAwLCBhbmltYXRpb25NaWxsaXNlY29uZHM6IG51bWJlciA9IHVuZGVmaW5lZCwgYW5pbWF0aW9uQ29tcGxldGVkQ2FsbGJhY2s6ICgpID0+IHZvaWQgPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuXHRcdGFuaW1hdGlvbk1pbGxpc2Vjb25kcyA9IGFuaW1hdGlvbk1pbGxpc2Vjb25kcyA9PT0gdW5kZWZpbmVkID8gdGhpcy5zY3JvbGxBbmltYXRpb25UaW1lIDogYW5pbWF0aW9uTWlsbGlzZWNvbmRzO1xyXG5cclxuXHRcdGxldCBkaW1lbnNpb25zID0gdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zKCk7XHJcblx0XHRsZXQgc2Nyb2xsID0gdGhpcy5jYWxjdWxhdGVQYWRkaW5nKGluZGV4LCBkaW1lbnNpb25zKSArIGFkZGl0aW9uYWxPZmZzZXQ7XHJcblx0XHRpZiAoIWFsaWduVG9CZWdpbm5pbmcpIHtcclxuXHRcdFx0c2Nyb2xsIC09IGRpbWVuc2lvbnMud3JhcEdyb3Vwc1BlclBhZ2UgKiBkaW1lbnNpb25zW3RoaXMuX2NoaWxkU2Nyb2xsRGltXTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnNjcm9sbFRvUG9zaXRpb24oc2Nyb2xsLCBhbmltYXRpb25NaWxsaXNlY29uZHMsIGFuaW1hdGlvbkNvbXBsZXRlZENhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzY3JvbGxUb1Bvc2l0aW9uKHNjcm9sbFBvc2l0aW9uOiBudW1iZXIsIGFuaW1hdGlvbk1pbGxpc2Vjb25kczogbnVtYmVyID0gdW5kZWZpbmVkLCBhbmltYXRpb25Db21wbGV0ZWRDYWxsYmFjazogKCkgPT4gdm9pZCA9IHVuZGVmaW5lZCk6IHZvaWQge1xyXG5cdFx0c2Nyb2xsUG9zaXRpb24gKz0gdGhpcy5nZXRFbGVtZW50c09mZnNldCgpO1xyXG5cclxuXHRcdGFuaW1hdGlvbk1pbGxpc2Vjb25kcyA9IGFuaW1hdGlvbk1pbGxpc2Vjb25kcyA9PT0gdW5kZWZpbmVkID8gdGhpcy5zY3JvbGxBbmltYXRpb25UaW1lIDogYW5pbWF0aW9uTWlsbGlzZWNvbmRzO1xyXG5cclxuXHRcdGxldCBzY3JvbGxFbGVtZW50ID0gdGhpcy5nZXRTY3JvbGxFbGVtZW50KCk7XHJcblxyXG5cdFx0bGV0IGFuaW1hdGlvblJlcXVlc3Q6IG51bWJlcjtcclxuXHJcblx0XHRpZiAodGhpcy5jdXJyZW50VHdlZW4pIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50VHdlZW4uc3RvcCgpO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRUd2VlbiA9IHVuZGVmaW5lZDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIWFuaW1hdGlvbk1pbGxpc2Vjb25kcykge1xyXG5cdFx0XHR0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHNjcm9sbEVsZW1lbnQsIHRoaXMuX3Njcm9sbFR5cGUsIHNjcm9sbFBvc2l0aW9uKTtcclxuXHRcdFx0dGhpcy5yZWZyZXNoX2ludGVybmFsKGZhbHNlLCBhbmltYXRpb25Db21wbGV0ZWRDYWxsYmFjayk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0d2VlbkNvbmZpZ09iaiA9IHsgc2Nyb2xsUG9zaXRpb246IHNjcm9sbEVsZW1lbnRbdGhpcy5fc2Nyb2xsVHlwZV0gfTtcclxuXHJcblx0XHRsZXQgbmV3VHdlZW4gPSBuZXcgdHdlZW4uVHdlZW4odHdlZW5Db25maWdPYmopXHJcblx0XHRcdC50byh7IHNjcm9sbFBvc2l0aW9uIH0sIGFuaW1hdGlvbk1pbGxpc2Vjb25kcylcclxuXHRcdFx0LmVhc2luZyh0d2Vlbi5FYXNpbmcuUXVhZHJhdGljLk91dClcclxuXHRcdFx0Lm9uVXBkYXRlKChkYXRhKSA9PiB7XHJcblx0XHRcdFx0aWYgKGlzTmFOKGRhdGEuc2Nyb2xsUG9zaXRpb24pKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkoc2Nyb2xsRWxlbWVudCwgdGhpcy5fc2Nyb2xsVHlwZSwgZGF0YS5zY3JvbGxQb3NpdGlvbik7XHJcblx0XHRcdFx0dGhpcy5yZWZyZXNoX2ludGVybmFsKGZhbHNlKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Lm9uU3RvcCgoKSA9PiB7XHJcblx0XHRcdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uUmVxdWVzdCk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5zdGFydCgpO1xyXG5cclxuXHRcdGNvbnN0IGFuaW1hdGUgPSAodGltZT86IG51bWJlcikgPT4ge1xyXG5cdFx0XHRpZiAoIW5ld1R3ZWVuW1wiaXNQbGF5aW5nXCJdKCkpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG5ld1R3ZWVuLnVwZGF0ZSh0aW1lKTtcclxuXHRcdFx0aWYgKHR3ZWVuQ29uZmlnT2JqLnNjcm9sbFBvc2l0aW9uID09PSBzY3JvbGxQb3NpdGlvbikge1xyXG5cdFx0XHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSwgYW5pbWF0aW9uQ29tcGxldGVkQ2FsbGJhY2spO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuXHRcdFx0XHRhbmltYXRpb25SZXF1ZXN0ID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0YW5pbWF0ZSgpO1xyXG5cdFx0dGhpcy5jdXJyZW50VHdlZW4gPSBuZXdUd2VlbjtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBpc0FuZ3VsYXJVbml2ZXJzYWxTU1I6IGJvb2xlYW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBlbGVtZW50OiBFbGVtZW50UmVmLFxyXG5cdFx0cHJvdGVjdGVkIHJlYWRvbmx5IHJlbmRlcmVyOiBSZW5kZXJlcjIsXHJcblx0XHRwcm90ZWN0ZWQgcmVhZG9ubHkgem9uZTogTmdab25lLFxyXG5cdFx0cHJvdGVjdGVkIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcclxuXHRcdEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ6IE9iamVjdCxcclxuXHRcdEBPcHRpb25hbCgpIEBJbmplY3QoJ3ZpcnR1YWwtc2Nyb2xsZXItZGVmYXVsdC1vcHRpb25zJylcclxuXHRcdG9wdGlvbnM6IFZpcnR1YWxTY3JvbGxlckRlZmF1bHRPcHRpb25zKSB7XHJcblx0XHRcdFxyXG5cdFx0dGhpcy5pc0FuZ3VsYXJVbml2ZXJzYWxTU1IgPSBpc1BsYXRmb3JtU2VydmVyKHBsYXRmb3JtSWQpO1xyXG5cclxuXHRcdHRoaXMuc2Nyb2xsVGhyb3R0bGluZ1RpbWUgPSBvcHRpb25zLnNjcm9sbFRocm90dGxpbmdUaW1lO1xyXG5cdFx0dGhpcy5zY3JvbGxEZWJvdW5jZVRpbWUgPSBvcHRpb25zLnNjcm9sbERlYm91bmNlVGltZTtcclxuXHRcdHRoaXMuc2Nyb2xsQW5pbWF0aW9uVGltZSA9IG9wdGlvbnMuc2Nyb2xsQW5pbWF0aW9uVGltZTtcclxuXHRcdHRoaXMuc2Nyb2xsYmFyV2lkdGggPSBvcHRpb25zLnNjcm9sbGJhcldpZHRoO1xyXG5cdFx0dGhpcy5zY3JvbGxiYXJIZWlnaHQgPSBvcHRpb25zLnNjcm9sbGJhckhlaWdodDtcclxuXHRcdHRoaXMuY2hlY2tSZXNpemVJbnRlcnZhbCA9IG9wdGlvbnMuY2hlY2tSZXNpemVJbnRlcnZhbDtcclxuXHRcdHRoaXMucmVzaXplQnlwYXNzUmVmcmVzaFRocmVzaG9sZCA9IG9wdGlvbnMucmVzaXplQnlwYXNzUmVmcmVzaFRocmVzaG9sZDtcclxuXHRcdHRoaXMubW9kaWZ5T3ZlcmZsb3dTdHlsZU9mUGFyZW50U2Nyb2xsID0gb3B0aW9ucy5tb2RpZnlPdmVyZmxvd1N0eWxlT2ZQYXJlbnRTY3JvbGw7XHJcblx0XHR0aGlzLnN0cmlwZWRUYWJsZSA9IG9wdGlvbnMuc3RyaXBlZFRhYmxlO1xyXG5cclxuXHRcdHRoaXMuaG9yaXpvbnRhbCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5yZXNldFdyYXBHcm91cERpbWVuc2lvbnMoKTtcclxuXHR9XHJcblx0XHJcblx0cHJvdGVjdGVkIGdldEVsZW1lbnRTaXplKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA6IENsaWVudFJlY3Qge1xyXG5cdFx0bGV0IHJlc3VsdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblx0XHRsZXQgc3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcclxuXHRcdGxldCBtYXJnaW5Ub3AgPSBwYXJzZUludChzdHlsZXNbJ21hcmdpbi10b3AnXSwgMTApIHx8IDA7XHJcblx0XHRsZXQgbWFyZ2luQm90dG9tID0gcGFyc2VJbnQoc3R5bGVzWydtYXJnaW4tYm90dG9tJ10sIDEwKSB8fCAwO1xyXG5cdFx0bGV0IG1hcmdpbkxlZnQgPSBwYXJzZUludChzdHlsZXNbJ21hcmdpbi1sZWZ0J10sIDEwKSB8fCAwO1xyXG5cdFx0bGV0IG1hcmdpblJpZ2h0ID0gcGFyc2VJbnQoc3R5bGVzWydtYXJnaW4tcmlnaHQnXSwgMTApIHx8IDA7XHJcblx0XHRcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHRvcDogcmVzdWx0LnRvcCArIG1hcmdpblRvcCxcclxuXHRcdFx0Ym90dG9tOiByZXN1bHQuYm90dG9tICsgbWFyZ2luQm90dG9tLFxyXG5cdFx0XHRsZWZ0OiByZXN1bHQubGVmdCArIG1hcmdpbkxlZnQsXHJcblx0XHRcdHJpZ2h0OiByZXN1bHQucmlnaHQgKyBtYXJnaW5SaWdodCxcclxuXHRcdFx0d2lkdGg6IHJlc3VsdC53aWR0aCArIG1hcmdpbkxlZnQgKyBtYXJnaW5SaWdodCxcclxuXHRcdFx0aGVpZ2h0OiByZXN1bHQuaGVpZ2h0ICsgbWFyZ2luVG9wICsgbWFyZ2luQm90dG9tXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIHByZXZpb3VzU2Nyb2xsQm91bmRpbmdSZWN0OiBDbGllbnRSZWN0O1xyXG5cdHByb3RlY3RlZCBjaGVja1Njcm9sbEVsZW1lbnRSZXNpemVkKCk6IHZvaWQge1xyXG5cdFx0bGV0IGJvdW5kaW5nUmVjdCA9IHRoaXMuZ2V0RWxlbWVudFNpemUodGhpcy5nZXRTY3JvbGxFbGVtZW50KCkpO1xyXG5cclxuXHRcdGxldCBzaXplQ2hhbmdlZDogYm9vbGVhbjtcclxuXHRcdGlmICghdGhpcy5wcmV2aW91c1Njcm9sbEJvdW5kaW5nUmVjdCkge1xyXG5cdFx0XHRzaXplQ2hhbmdlZCA9IHRydWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgd2lkdGhDaGFuZ2UgPSBNYXRoLmFicyhib3VuZGluZ1JlY3Qud2lkdGggLSB0aGlzLnByZXZpb3VzU2Nyb2xsQm91bmRpbmdSZWN0LndpZHRoKTtcclxuXHRcdFx0bGV0IGhlaWdodENoYW5nZSA9IE1hdGguYWJzKGJvdW5kaW5nUmVjdC5oZWlnaHQgLSB0aGlzLnByZXZpb3VzU2Nyb2xsQm91bmRpbmdSZWN0LmhlaWdodCk7XHJcblx0XHRcdHNpemVDaGFuZ2VkID0gd2lkdGhDaGFuZ2UgPiB0aGlzLnJlc2l6ZUJ5cGFzc1JlZnJlc2hUaHJlc2hvbGQgfHwgaGVpZ2h0Q2hhbmdlID4gdGhpcy5yZXNpemVCeXBhc3NSZWZyZXNoVGhyZXNob2xkO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChzaXplQ2hhbmdlZCkge1xyXG5cdFx0XHR0aGlzLnByZXZpb3VzU2Nyb2xsQm91bmRpbmdSZWN0ID0gYm91bmRpbmdSZWN0O1xyXG5cdFx0XHRpZiAoYm91bmRpbmdSZWN0LndpZHRoID4gMCAmJiBib3VuZGluZ1JlY3QuaGVpZ2h0ID4gMCkge1xyXG5cdFx0XHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBfaW52aXNpYmxlUGFkZGluZ1Byb3BlcnR5O1xyXG5cdHByb3RlY3RlZCBfb2Zmc2V0VHlwZTtcclxuXHRwcm90ZWN0ZWQgX3Njcm9sbFR5cGU7XHJcblx0cHJvdGVjdGVkIF9wYWdlT2Zmc2V0VHlwZTtcclxuXHRwcm90ZWN0ZWQgX2NoaWxkU2Nyb2xsRGltO1xyXG5cdHByb3RlY3RlZCBfdHJhbnNsYXRlRGlyO1xyXG5cdHByb3RlY3RlZCBfbWFyZ2luRGlyO1xyXG5cdHByb3RlY3RlZCB1cGRhdGVEaXJlY3Rpb24oKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5ob3Jpem9udGFsKSB7XHJcblx0XHRcdHRoaXMuX2ludmlzaWJsZVBhZGRpbmdQcm9wZXJ0eSA9ICd3aWR0aCc7XHJcblx0XHRcdHRoaXMuX29mZnNldFR5cGUgPSAnb2Zmc2V0TGVmdCc7XHJcblx0XHRcdHRoaXMuX3BhZ2VPZmZzZXRUeXBlID0gJ3BhZ2VYT2Zmc2V0JztcclxuXHRcdFx0dGhpcy5fY2hpbGRTY3JvbGxEaW0gPSAnY2hpbGRXaWR0aCc7XHJcblx0XHRcdHRoaXMuX21hcmdpbkRpciA9ICdtYXJnaW4tbGVmdCc7XHJcblx0XHRcdHRoaXMuX3RyYW5zbGF0ZURpciA9ICd0cmFuc2xhdGVYJztcclxuXHRcdFx0dGhpcy5fc2Nyb2xsVHlwZSA9ICdzY3JvbGxMZWZ0JztcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9pbnZpc2libGVQYWRkaW5nUHJvcGVydHkgPSAnaGVpZ2h0JztcclxuXHRcdFx0dGhpcy5fb2Zmc2V0VHlwZSA9ICdvZmZzZXRUb3AnO1xyXG5cdFx0XHR0aGlzLl9wYWdlT2Zmc2V0VHlwZSA9ICdwYWdlWU9mZnNldCc7XHJcblx0XHRcdHRoaXMuX2NoaWxkU2Nyb2xsRGltID0gJ2NoaWxkSGVpZ2h0JztcclxuXHRcdFx0dGhpcy5fbWFyZ2luRGlyID0gJ21hcmdpbi10b3AnO1xyXG5cdFx0XHR0aGlzLl90cmFuc2xhdGVEaXIgPSAndHJhbnNsYXRlWSc7XHJcblx0XHRcdHRoaXMuX3Njcm9sbFR5cGUgPSAnc2Nyb2xsVG9wJztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBkZWJvdW5jZShmdW5jOiBGdW5jdGlvbiwgd2FpdDogbnVtYmVyKTogRnVuY3Rpb24ge1xyXG5cdFx0Y29uc3QgdGhyb3R0bGVkID0gdGhpcy50aHJvdHRsZVRyYWlsaW5nKGZ1bmMsIHdhaXQpO1xyXG5cdFx0Y29uc3QgcmVzdWx0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR0aHJvdHRsZWRbJ2NhbmNlbCddKCk7XHJcblx0XHRcdHRocm90dGxlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0fTtcclxuXHRcdHJlc3VsdFsnY2FuY2VsJ10gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRocm90dGxlZFsnY2FuY2VsJ10oKTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCB0aHJvdHRsZVRyYWlsaW5nKGZ1bmM6IEZ1bmN0aW9uLCB3YWl0OiBudW1iZXIpOiBGdW5jdGlvbiB7XHJcblx0XHRsZXQgdGltZW91dCA9IHVuZGVmaW5lZDtcclxuXHRcdGxldCBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xyXG5cdFx0Y29uc3QgcmVzdWx0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblx0XHRcdF9hcmd1bWVudHMgPSBhcmd1bWVudHNcclxuXHJcblx0XHRcdGlmICh0aW1lb3V0KSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAod2FpdCA8PSAwKSB7XHJcblx0XHRcdFx0ZnVuYy5hcHBseShfdGhpcywgX2FyZ3VtZW50cyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGltZW91dCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0XHRcdGZ1bmMuYXBwbHkoX3RoaXMsIF9hcmd1bWVudHMpO1xyXG5cdFx0XHRcdH0sIHdhaXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0cmVzdWx0WydjYW5jZWwnXSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHRpbWVvdXQpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XHJcblx0XHRcdFx0dGltZW91dCA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIGNhbGN1bGF0ZWRTY3JvbGxiYXJXaWR0aDogbnVtYmVyID0gMDtcclxuXHRwcm90ZWN0ZWQgY2FsY3VsYXRlZFNjcm9sbGJhckhlaWdodDogbnVtYmVyID0gMDtcclxuXHJcblx0cHJvdGVjdGVkIHBhZGRpbmc6IG51bWJlciA9IDA7XHJcblx0cHJvdGVjdGVkIHByZXZpb3VzVmlld1BvcnQ6IElWaWV3cG9ydCA9IDxhbnk+e307XHJcblx0cHJvdGVjdGVkIGN1cnJlbnRUd2VlbjogdHdlZW4uVHdlZW47XHJcblx0cHJvdGVjdGVkIGNhY2hlZEl0ZW1zTGVuZ3RoOiBudW1iZXI7XHJcblxyXG5cdHByb3RlY3RlZCBkaXNwb3NlU2Nyb2xsSGFuZGxlcjogKCkgPT4gdm9pZCB8IHVuZGVmaW5lZDtcclxuXHRwcm90ZWN0ZWQgZGlzcG9zZVJlc2l6ZUhhbmRsZXI6ICgpID0+IHZvaWQgfCB1bmRlZmluZWQ7XHJcblxyXG5cdHByb3RlY3RlZCByZWZyZXNoX2ludGVybmFsKGl0ZW1zQXJyYXlNb2RpZmllZDogYm9vbGVhbiwgcmVmcmVzaENvbXBsZXRlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gdW5kZWZpbmVkLCBtYXhSdW5UaW1lczogbnVtYmVyID0gMik6IHZvaWQge1xyXG5cdFx0Ly9ub3RlOiBtYXhSdW5UaW1lcyBpcyB0byBmb3JjZSBpdCB0byBrZWVwIHJlY2FsY3VsYXRpbmcgaWYgdGhlIHByZXZpb3VzIGl0ZXJhdGlvbiBjYXVzZWQgYSByZS1yZW5kZXIgKGRpZmZlcmVudCBzbGljZWQgaXRlbXMgaW4gdmlld3BvcnQgb3Igc2Nyb2xsUG9zaXRpb24gY2hhbmdlZCkuXHJcblx0XHQvL1RoZSBkZWZhdWx0IG9mIDJ4IG1heCB3aWxsIHByb2JhYmx5IGJlIGFjY3VyYXRlIGVub3VnaCB3aXRob3V0IGNhdXNpbmcgdG9vIGxhcmdlIGEgcGVyZm9ybWFuY2UgYm90dGxlbmVja1xyXG5cdFx0Ly9UaGUgY29kZSB3b3VsZCB0eXBpY2FsbHkgcXVpdCBvdXQgb24gdGhlIDJuZCBpdGVyYXRpb24gYW55d2F5cy4gVGhlIG1haW4gdGltZSBpdCdkIHRoaW5rIG1vcmUgdGhhbiAyIHJ1bnMgd291bGQgYmUgbmVjZXNzYXJ5IHdvdWxkIGJlIGZvciB2YXN0bHkgZGlmZmVyZW50IHNpemVkIGNoaWxkIGl0ZW1zIG9yIGlmIHRoaXMgaXMgdGhlIDFzdCB0aW1lIHRoZSBpdGVtcyBhcnJheSB3YXMgaW5pdGlhbGl6ZWQuXHJcblx0XHQvL1dpdGhvdXQgbWF4UnVuVGltZXMsIElmIHRoZSB1c2VyIGlzIGFjdGl2ZWx5IHNjcm9sbGluZyB0aGlzIGNvZGUgd291bGQgYmVjb21lIGFuIGluZmluaXRlIGxvb3AgdW50aWwgdGhleSBzdG9wcGVkIHNjcm9sbGluZy4gVGhpcyB3b3VsZCBiZSBva2F5LCBleGNlcHQgZWFjaCBzY3JvbGwgZXZlbnQgd291bGQgc3RhcnQgYW4gYWRkaXRpb25hbCBpbmZpbnRlIGxvb3AuIFdlIHdhbnQgdG8gc2hvcnQtY2lyY3VpdCBpdCB0byBwcmV2ZW50IHRoaXMuXHJcblxyXG5cdFx0aWYgKGl0ZW1zQXJyYXlNb2RpZmllZCAmJiB0aGlzLnByZXZpb3VzVmlld1BvcnQgJiYgdGhpcy5wcmV2aW91c1ZpZXdQb3J0LnNjcm9sbFN0YXJ0UG9zaXRpb24gPiAwKSB7XHJcblx0XHQvL2lmIGl0ZW1zIHdlcmUgcHJlcGVuZGVkLCBzY3JvbGwgZm9yd2FyZCB0byBrZWVwIHNhbWUgaXRlbXMgdmlzaWJsZVxyXG5cdFx0XHRsZXQgb2xkVmlld1BvcnQgPSB0aGlzLnByZXZpb3VzVmlld1BvcnQ7XHJcblx0XHRcdGxldCBvbGRWaWV3UG9ydEl0ZW1zID0gdGhpcy52aWV3UG9ydEl0ZW1zO1xyXG5cdFx0XHRcclxuXHRcdFx0bGV0IG9sZFJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjayA9IHJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjaztcclxuXHRcdFx0cmVmcmVzaENvbXBsZXRlZENhbGxiYWNrID0gKCkgPT4ge1xyXG5cdFx0XHRcdGxldCBzY3JvbGxMZW5ndGhEZWx0YSA9IHRoaXMucHJldmlvdXNWaWV3UG9ydC5zY3JvbGxMZW5ndGggLSBvbGRWaWV3UG9ydC5zY3JvbGxMZW5ndGg7XHJcblx0XHRcdFx0aWYgKHNjcm9sbExlbmd0aERlbHRhID4gMCAmJiB0aGlzLnZpZXdQb3J0SXRlbXMpIHtcclxuXHRcdFx0XHRcdGxldCBvbGRTdGFydEl0ZW0gPSBvbGRWaWV3UG9ydEl0ZW1zWzBdO1xyXG5cdFx0XHRcdFx0bGV0IG9sZFN0YXJ0SXRlbUluZGV4ID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoeCA9PiB0aGlzLmNvbXBhcmVJdGVtcyhvbGRTdGFydEl0ZW0sIHgpKTtcclxuXHRcdFx0XHRcdGlmIChvbGRTdGFydEl0ZW1JbmRleCA+IHRoaXMucHJldmlvdXNWaWV3UG9ydC5zdGFydEluZGV4V2l0aEJ1ZmZlcikge1xyXG5cdFx0XHRcdFx0XHRsZXQgaXRlbU9yZGVyQ2hhbmdlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMudmlld1BvcnRJdGVtcy5sZW5ndGg7ICsraSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghdGhpcy5jb21wYXJlSXRlbXModGhpcy5pdGVtc1tvbGRTdGFydEl0ZW1JbmRleCArIGldLCBvbGRWaWV3UG9ydEl0ZW1zW2ldKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbU9yZGVyQ2hhbmdlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGlmICghaXRlbU9yZGVyQ2hhbmdlZCkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuc2Nyb2xsVG9Qb3NpdGlvbih0aGlzLnByZXZpb3VzVmlld1BvcnQuc2Nyb2xsU3RhcnRQb3NpdGlvbiArIHNjcm9sbExlbmd0aERlbHRhICwgMCwgb2xkUmVmcmVzaENvbXBsZXRlZENhbGxiYWNrKTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKG9sZFJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjaykge1xyXG5cdFx0XHRcdFx0b2xkUmVmcmVzaENvbXBsZXRlZENhbGxiYWNrKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fVx0XHRcdFxyXG5cclxuXHRcdHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcblx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XHJcblxyXG5cdFx0XHRcdGlmIChpdGVtc0FycmF5TW9kaWZpZWQpIHtcclxuXHRcdFx0XHRcdHRoaXMucmVzZXRXcmFwR3JvdXBEaW1lbnNpb25zKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGxldCB2aWV3cG9ydCA9IHRoaXMuY2FsY3VsYXRlVmlld3BvcnQoKTtcclxuXHJcblx0XHRcdFx0bGV0IHN0YXJ0Q2hhbmdlZCA9IGl0ZW1zQXJyYXlNb2RpZmllZCB8fCB2aWV3cG9ydC5zdGFydEluZGV4ICE9PSB0aGlzLnByZXZpb3VzVmlld1BvcnQuc3RhcnRJbmRleDtcclxuXHRcdFx0XHRsZXQgZW5kQ2hhbmdlZCA9IGl0ZW1zQXJyYXlNb2RpZmllZCB8fCB2aWV3cG9ydC5lbmRJbmRleCAhPT0gdGhpcy5wcmV2aW91c1ZpZXdQb3J0LmVuZEluZGV4O1xyXG5cdFx0XHRcdGxldCBzY3JvbGxMZW5ndGhDaGFuZ2VkID0gdmlld3BvcnQuc2Nyb2xsTGVuZ3RoICE9PSB0aGlzLnByZXZpb3VzVmlld1BvcnQuc2Nyb2xsTGVuZ3RoO1xyXG5cdFx0XHRcdGxldCBwYWRkaW5nQ2hhbmdlZCA9IHZpZXdwb3J0LnBhZGRpbmcgIT09IHRoaXMucHJldmlvdXNWaWV3UG9ydC5wYWRkaW5nO1xyXG5cdFx0XHRcdGxldCBzY3JvbGxQb3NpdGlvbkNoYW5nZWQgPSB2aWV3cG9ydC5zY3JvbGxTdGFydFBvc2l0aW9uICE9PSB0aGlzLnByZXZpb3VzVmlld1BvcnQuc2Nyb2xsU3RhcnRQb3NpdGlvbiB8fCB2aWV3cG9ydC5zY3JvbGxFbmRQb3NpdGlvbiAhPT0gdGhpcy5wcmV2aW91c1ZpZXdQb3J0LnNjcm9sbEVuZFBvc2l0aW9uIHx8IHZpZXdwb3J0Lm1heFNjcm9sbFBvc2l0aW9uICE9PSB0aGlzLnByZXZpb3VzVmlld1BvcnQubWF4U2Nyb2xsUG9zaXRpb247XHJcblxyXG5cdFx0XHRcdHRoaXMucHJldmlvdXNWaWV3UG9ydCA9IHZpZXdwb3J0O1xyXG5cclxuXHRcdFx0XHRpZiAoc2Nyb2xsTGVuZ3RoQ2hhbmdlZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmludmlzaWJsZVBhZGRpbmdFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX2ludmlzaWJsZVBhZGRpbmdQcm9wZXJ0eSwgYCR7dmlld3BvcnQuc2Nyb2xsTGVuZ3RofXB4YCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAocGFkZGluZ0NoYW5nZWQpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnVzZU1hcmdpbkluc3RlYWRPZlRyYW5zbGF0ZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY29udGVudEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5fbWFyZ2luRGlyLCBgJHt2aWV3cG9ydC5wYWRkaW5nfXB4YCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNvbnRlbnRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCBgJHt0aGlzLl90cmFuc2xhdGVEaXJ9KCR7dmlld3BvcnQucGFkZGluZ31weClgKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNvbnRlbnRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd3ZWJraXRUcmFuc2Zvcm0nLCBgJHt0aGlzLl90cmFuc2xhdGVEaXJ9KCR7dmlld3BvcnQucGFkZGluZ31weClgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmhlYWRlckVsZW1lbnRSZWYpIHtcclxuXHRcdFx0XHRcdGxldCBzY3JvbGxQb3NpdGlvbiA9IHRoaXMuZ2V0U2Nyb2xsRWxlbWVudCgpW3RoaXMuX3Njcm9sbFR5cGVdO1xyXG5cdFx0XHRcdFx0bGV0IGNvbnRhaW5lck9mZnNldCA9IHRoaXMuZ2V0RWxlbWVudHNPZmZzZXQoKTtcclxuXHRcdFx0XHRcdGxldCBvZmZzZXQgPSBNYXRoLm1heChzY3JvbGxQb3NpdGlvbiAtIHZpZXdwb3J0LnBhZGRpbmcgLSBjb250YWluZXJPZmZzZXQgKyB0aGlzLmhlYWRlckVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQsIDApO1xyXG5cdFx0XHRcdFx0dGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmhlYWRlckVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsIGAke3RoaXMuX3RyYW5zbGF0ZURpcn0oJHtvZmZzZXR9cHgpYCk7XHJcblx0XHRcdFx0XHR0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuaGVhZGVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnd2Via2l0VHJhbnNmb3JtJywgYCR7dGhpcy5fdHJhbnNsYXRlRGlyfSgke29mZnNldH1weClgKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IGNoYW5nZUV2ZW50QXJnOiBJUGFnZUluZm8gPSAoc3RhcnRDaGFuZ2VkIHx8IGVuZENoYW5nZWQpID8ge1xyXG5cdFx0XHRcdFx0c3RhcnRJbmRleDogdmlld3BvcnQuc3RhcnRJbmRleCxcclxuXHRcdFx0XHRcdGVuZEluZGV4OiB2aWV3cG9ydC5lbmRJbmRleCxcclxuXHRcdFx0XHRcdHNjcm9sbFN0YXJ0UG9zaXRpb246IHZpZXdwb3J0LnNjcm9sbFN0YXJ0UG9zaXRpb24sXHJcblx0XHRcdFx0XHRzY3JvbGxFbmRQb3NpdGlvbjogdmlld3BvcnQuc2Nyb2xsRW5kUG9zaXRpb24sXHJcblx0XHRcdFx0XHRzdGFydEluZGV4V2l0aEJ1ZmZlcjogdmlld3BvcnQuc3RhcnRJbmRleFdpdGhCdWZmZXIsXHJcblx0XHRcdFx0XHRlbmRJbmRleFdpdGhCdWZmZXI6IHZpZXdwb3J0LmVuZEluZGV4V2l0aEJ1ZmZlcixcclxuXHRcdFx0XHRcdG1heFNjcm9sbFBvc2l0aW9uOiB2aWV3cG9ydC5tYXhTY3JvbGxQb3NpdGlvblxyXG5cdFx0XHRcdH0gOiB1bmRlZmluZWQ7XHJcblxyXG5cclxuXHRcdFx0XHRpZiAoc3RhcnRDaGFuZ2VkIHx8IGVuZENoYW5nZWQgfHwgc2Nyb2xsUG9zaXRpb25DaGFuZ2VkKSB7XHJcblx0XHRcdFx0XHRjb25zdCBoYW5kbGVDaGFuZ2VkID0gKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHQvLyB1cGRhdGUgdGhlIHNjcm9sbCBsaXN0IHRvIHRyaWdnZXIgcmUtcmVuZGVyIG9mIGNvbXBvbmVudHMgaW4gdmlld3BvcnRcclxuXHRcdFx0XHRcdFx0dGhpcy52aWV3UG9ydEl0ZW1zID0gdmlld3BvcnQuc3RhcnRJbmRleFdpdGhCdWZmZXIgPj0gMCAmJiB2aWV3cG9ydC5lbmRJbmRleFdpdGhCdWZmZXIgPj0gMCA/IHRoaXMuaXRlbXMuc2xpY2Uodmlld3BvcnQuc3RhcnRJbmRleFdpdGhCdWZmZXIsIHZpZXdwb3J0LmVuZEluZGV4V2l0aEJ1ZmZlciArIDEpIDogW107XHJcblx0XHRcdFx0XHRcdHRoaXMudnNVcGRhdGUuZW1pdCh0aGlzLnZpZXdQb3J0SXRlbXMpO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHN0YXJ0Q2hhbmdlZCkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMudnNTdGFydC5lbWl0KGNoYW5nZUV2ZW50QXJnKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGVuZENoYW5nZWQpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnZzRW5kLmVtaXQoY2hhbmdlRXZlbnRBcmcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoc3RhcnRDaGFuZ2VkIHx8IGVuZENoYW5nZWQpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMudnNDaGFuZ2UuZW1pdChjaGFuZ2VFdmVudEFyZyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmIChtYXhSdW5UaW1lcyA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwoZmFsc2UsIHJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjaywgbWF4UnVuVGltZXMgLSAxKTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmIChyZWZyZXNoQ29tcGxldGVkQ2FsbGJhY2spIHtcclxuXHRcdFx0XHRcdFx0XHRyZWZyZXNoQ29tcGxldGVkQ2FsbGJhY2soKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuZXhlY3V0ZVJlZnJlc2hPdXRzaWRlQW5ndWxhclpvbmUpIHtcclxuXHRcdFx0XHRcdFx0aGFuZGxlQ2hhbmdlZCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuem9uZS5ydW4oaGFuZGxlQ2hhbmdlZCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChtYXhSdW5UaW1lcyA+IDAgJiYgKHNjcm9sbExlbmd0aENoYW5nZWQgfHwgcGFkZGluZ0NoYW5nZWQpKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSwgcmVmcmVzaENvbXBsZXRlZENhbGxiYWNrLCBtYXhSdW5UaW1lcyAtIDEpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKHJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjaykge1xyXG5cdFx0XHRcdFx0XHRyZWZyZXNoQ29tcGxldGVkQ2FsbGJhY2soKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgZ2V0U2Nyb2xsRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XHJcblx0XHRyZXR1cm4gdGhpcy5wYXJlbnRTY3JvbGwgaW5zdGFuY2VvZiBXaW5kb3cgPyBkb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5IDogdGhpcy5wYXJlbnRTY3JvbGwgfHwgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgYWRkU2Nyb2xsRXZlbnRIYW5kbGVycygpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmlzQW5ndWxhclVuaXZlcnNhbFNTUikge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHNjcm9sbEVsZW1lbnQgPSB0aGlzLmdldFNjcm9sbEVsZW1lbnQoKTtcclxuXHJcblx0XHR0aGlzLnJlbW92ZVNjcm9sbEV2ZW50SGFuZGxlcnMoKTtcclxuXHJcblx0XHR0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5wYXJlbnRTY3JvbGwgaW5zdGFuY2VvZiBXaW5kb3cpIHtcclxuXHRcdFx0XHR0aGlzLmRpc3Bvc2VTY3JvbGxIYW5kbGVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ3dpbmRvdycsICdzY3JvbGwnLCB0aGlzLm9uU2Nyb2xsKTtcclxuXHRcdFx0XHR0aGlzLmRpc3Bvc2VSZXNpemVIYW5kbGVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ3dpbmRvdycsICdyZXNpemUnLCB0aGlzLm9uU2Nyb2xsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmRpc3Bvc2VTY3JvbGxIYW5kbGVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oc2Nyb2xsRWxlbWVudCwgJ3Njcm9sbCcsIHRoaXMub25TY3JvbGwpO1xyXG5cdFx0XHRcdGlmICh0aGlzLl9jaGVja1Jlc2l6ZUludGVydmFsID4gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jaGVja1Njcm9sbEVsZW1lbnRSZXNpemVkVGltZXIgPSA8YW55PnNldEludGVydmFsKCgpID0+IHsgdGhpcy5jaGVja1Njcm9sbEVsZW1lbnRSZXNpemVkKCk7IH0sIHRoaXMuX2NoZWNrUmVzaXplSW50ZXJ2YWwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgcmVtb3ZlU2Nyb2xsRXZlbnRIYW5kbGVycygpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmNoZWNrU2Nyb2xsRWxlbWVudFJlc2l6ZWRUaW1lcikge1xyXG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMuY2hlY2tTY3JvbGxFbGVtZW50UmVzaXplZFRpbWVyKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5kaXNwb3NlU2Nyb2xsSGFuZGxlcikge1xyXG5cdFx0XHR0aGlzLmRpc3Bvc2VTY3JvbGxIYW5kbGVyKCk7XHJcblx0XHRcdHRoaXMuZGlzcG9zZVNjcm9sbEhhbmRsZXIgPSB1bmRlZmluZWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuZGlzcG9zZVJlc2l6ZUhhbmRsZXIpIHtcclxuXHRcdFx0dGhpcy5kaXNwb3NlUmVzaXplSGFuZGxlcigpO1xyXG5cdFx0XHR0aGlzLmRpc3Bvc2VSZXNpemVIYW5kbGVyID0gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIGdldEVsZW1lbnRzT2Zmc2V0KCk6IG51bWJlciB7XHJcblx0XHRpZiAodGhpcy5pc0FuZ3VsYXJVbml2ZXJzYWxTU1IpIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IG9mZnNldCA9IDA7XHJcblxyXG5cdFx0aWYgKHRoaXMuY29udGFpbmVyRWxlbWVudFJlZiAmJiB0aGlzLmNvbnRhaW5lckVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkge1xyXG5cdFx0XHRvZmZzZXQgKz0gdGhpcy5jb250YWluZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRbdGhpcy5fb2Zmc2V0VHlwZV07XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMucGFyZW50U2Nyb2xsKSB7XHJcblx0XHRcdGxldCBzY3JvbGxFbGVtZW50ID0gdGhpcy5nZXRTY3JvbGxFbGVtZW50KCk7XHJcblx0XHRcdGxldCBlbGVtZW50Q2xpZW50UmVjdCA9IHRoaXMuZ2V0RWxlbWVudFNpemUodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xyXG5cdFx0XHRsZXQgc2Nyb2xsQ2xpZW50UmVjdCA9IHRoaXMuZ2V0RWxlbWVudFNpemUoc2Nyb2xsRWxlbWVudCk7XHJcblx0XHRcdGlmICh0aGlzLmhvcml6b250YWwpIHtcclxuXHRcdFx0XHRvZmZzZXQgKz0gZWxlbWVudENsaWVudFJlY3QubGVmdCAtIHNjcm9sbENsaWVudFJlY3QubGVmdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRvZmZzZXQgKz0gZWxlbWVudENsaWVudFJlY3QudG9wIC0gc2Nyb2xsQ2xpZW50UmVjdC50b3A7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghKHRoaXMucGFyZW50U2Nyb2xsIGluc3RhbmNlb2YgV2luZG93KSkge1xyXG5cdFx0XHRcdG9mZnNldCArPSBzY3JvbGxFbGVtZW50W3RoaXMuX3Njcm9sbFR5cGVdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG9mZnNldDtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBjb3VudEl0ZW1zUGVyV3JhcEdyb3VwKCk6IG51bWJlciB7XHJcblx0XHRpZiAodGhpcy5pc0FuZ3VsYXJVbml2ZXJzYWxTU1IpIHtcclxuXHRcdFx0cmV0dXJuIE1hdGgucm91bmQodGhpcy5ob3Jpem9udGFsID8gdGhpcy5zc3JWaWV3cG9ydEhlaWdodCAvIHRoaXMuc3NyQ2hpbGRIZWlnaHQgOiB0aGlzLnNzclZpZXdwb3J0V2lkdGggLyB0aGlzLnNzckNoaWxkV2lkdGgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBwcm9wZXJ0eU5hbWUgPSB0aGlzLmhvcml6b250YWwgPyAnb2Zmc2V0TGVmdCcgOiAnb2Zmc2V0VG9wJztcclxuXHRcdGxldCBjaGlsZHJlbiA9ICgodGhpcy5jb250YWluZXJFbGVtZW50UmVmICYmIHRoaXMuY29udGFpbmVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSB8fCB0aGlzLmNvbnRlbnRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLmNoaWxkcmVuO1xyXG5cclxuXHRcdGxldCBjaGlsZHJlbkxlbmd0aCA9IGNoaWxkcmVuID8gY2hpbGRyZW4ubGVuZ3RoIDogMDtcclxuXHRcdGlmIChjaGlsZHJlbkxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gMTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZmlyc3RPZmZzZXQgPSBjaGlsZHJlblswXVtwcm9wZXJ0eU5hbWVdO1xyXG5cdFx0bGV0IHJlc3VsdCA9IDE7XHJcblx0XHR3aGlsZSAocmVzdWx0IDwgY2hpbGRyZW5MZW5ndGggJiYgZmlyc3RPZmZzZXQgPT09IGNoaWxkcmVuW3Jlc3VsdF1bcHJvcGVydHlOYW1lXSkge1xyXG5cdFx0XHQrK3Jlc3VsdDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIGdldFNjcm9sbFN0YXJ0UG9zaXRpb24oKTogbnVtYmVyIHtcclxuXHRcdGxldCB3aW5kb3dTY3JvbGxWYWx1ZSA9IHVuZGVmaW5lZDtcclxuXHRcdGlmICh0aGlzLnBhcmVudFNjcm9sbCBpbnN0YW5jZW9mIFdpbmRvdykge1xyXG5cdFx0XHR3aW5kb3dTY3JvbGxWYWx1ZSA9IHdpbmRvd1t0aGlzLl9wYWdlT2Zmc2V0VHlwZV07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHdpbmRvd1Njcm9sbFZhbHVlIHx8IHRoaXMuZ2V0U2Nyb2xsRWxlbWVudCgpW3RoaXMuX3Njcm9sbFR5cGVdIHx8IDA7XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgbWluTWVhc3VyZWRDaGlsZFdpZHRoOiBudW1iZXI7XHJcblx0cHJvdGVjdGVkIG1pbk1lYXN1cmVkQ2hpbGRIZWlnaHQ6IG51bWJlcjtcclxuXHJcblx0cHJvdGVjdGVkIHdyYXBHcm91cERpbWVuc2lvbnM6IFdyYXBHcm91cERpbWVuc2lvbnM7XHJcblxyXG5cdHByb3RlY3RlZCByZXNldFdyYXBHcm91cERpbWVuc2lvbnMoKTogdm9pZCB7XHJcblx0XHRjb25zdCBvbGRXcmFwR3JvdXBEaW1lbnNpb25zID0gdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zO1xyXG5cdFx0dGhpcy5pbnZhbGlkYXRlQWxsQ2FjaGVkTWVhc3VyZW1lbnRzKCk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLmVuYWJsZVVuZXF1YWxDaGlsZHJlblNpemVzIHx8ICFvbGRXcmFwR3JvdXBEaW1lbnNpb25zIHx8IG9sZFdyYXBHcm91cERpbWVuc2lvbnMubnVtYmVyT2ZLbm93bldyYXBHcm91cENoaWxkU2l6ZXMgPT09IDApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGl0ZW1zUGVyV3JhcEdyb3VwOiBudW1iZXIgPSB0aGlzLmNvdW50SXRlbXNQZXJXcmFwR3JvdXAoKTtcclxuXHRcdGZvciAobGV0IHdyYXBHcm91cEluZGV4ID0gMDsgd3JhcEdyb3VwSW5kZXggPCBvbGRXcmFwR3JvdXBEaW1lbnNpb25zLm1heENoaWxkU2l6ZVBlcldyYXBHcm91cC5sZW5ndGg7ICsrd3JhcEdyb3VwSW5kZXgpIHtcclxuXHRcdFx0Y29uc3Qgb2xkV3JhcEdyb3VwRGltZW5zaW9uOiBXcmFwR3JvdXBEaW1lbnNpb24gPSBvbGRXcmFwR3JvdXBEaW1lbnNpb25zLm1heENoaWxkU2l6ZVBlcldyYXBHcm91cFt3cmFwR3JvdXBJbmRleF07XHJcblx0XHRcdGlmICghb2xkV3JhcEdyb3VwRGltZW5zaW9uIHx8ICFvbGRXcmFwR3JvdXBEaW1lbnNpb24uaXRlbXMgfHwgIW9sZFdyYXBHcm91cERpbWVuc2lvbi5pdGVtcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9sZFdyYXBHcm91cERpbWVuc2lvbi5pdGVtcy5sZW5ndGggIT09IGl0ZW1zUGVyV3JhcEdyb3VwKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgaXRlbXNDaGFuZ2VkID0gZmFsc2U7XHJcblx0XHRcdGxldCBhcnJheVN0YXJ0SW5kZXggPSBpdGVtc1BlcldyYXBHcm91cCAqIHdyYXBHcm91cEluZGV4O1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zUGVyV3JhcEdyb3VwOyArK2kpIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuY29tcGFyZUl0ZW1zKG9sZFdyYXBHcm91cERpbWVuc2lvbi5pdGVtc1tpXSwgdGhpcy5pdGVtc1thcnJheVN0YXJ0SW5kZXggKyBpXSkpIHtcclxuXHRcdFx0XHRcdGl0ZW1zQ2hhbmdlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghaXRlbXNDaGFuZ2VkKSB7XHJcblx0XHRcdFx0Kyt0aGlzLndyYXBHcm91cERpbWVuc2lvbnMubnVtYmVyT2ZLbm93bldyYXBHcm91cENoaWxkU2l6ZXM7XHJcblx0XHRcdFx0dGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLnN1bU9mS25vd25XcmFwR3JvdXBDaGlsZFdpZHRocyArPSBvbGRXcmFwR3JvdXBEaW1lbnNpb24uY2hpbGRXaWR0aCB8fCAwO1xyXG5cdFx0XHRcdHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5zdW1PZktub3duV3JhcEdyb3VwQ2hpbGRIZWlnaHRzICs9IG9sZFdyYXBHcm91cERpbWVuc2lvbi5jaGlsZEhlaWdodCB8fCAwO1xyXG5cdFx0XHRcdHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5tYXhDaGlsZFNpemVQZXJXcmFwR3JvdXBbd3JhcEdyb3VwSW5kZXhdID0gb2xkV3JhcEdyb3VwRGltZW5zaW9uO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgY2FsY3VsYXRlRGltZW5zaW9ucygpOiBJRGltZW5zaW9ucyB7XHJcblx0XHRsZXQgc2Nyb2xsRWxlbWVudCA9IHRoaXMuZ2V0U2Nyb2xsRWxlbWVudCgpO1xyXG5cclxuXHRcdGNvbnN0IG1heENhbGN1bGF0ZWRTY3JvbGxCYXJTaXplOiBudW1iZXIgPSAyNTsgLy8gTm90ZTogRm9ybXVsYSB0byBhdXRvLWNhbGN1bGF0ZSBkb2Vzbid0IHdvcmsgZm9yIFBhcmVudFNjcm9sbCwgc28gd2UgZGVmYXVsdCB0byB0aGlzIGlmIG5vdCBzZXQgYnkgY29uc3VtaW5nIGFwcGxpY2F0aW9uXHJcblx0XHR0aGlzLmNhbGN1bGF0ZWRTY3JvbGxiYXJIZWlnaHQgPSBNYXRoLm1heChNYXRoLm1pbihzY3JvbGxFbGVtZW50Lm9mZnNldEhlaWdodCAtIHNjcm9sbEVsZW1lbnQuY2xpZW50SGVpZ2h0LCBtYXhDYWxjdWxhdGVkU2Nyb2xsQmFyU2l6ZSksIHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhckhlaWdodCk7XHJcblx0XHR0aGlzLmNhbGN1bGF0ZWRTY3JvbGxiYXJXaWR0aCA9IE1hdGgubWF4KE1hdGgubWluKHNjcm9sbEVsZW1lbnQub2Zmc2V0V2lkdGggLSBzY3JvbGxFbGVtZW50LmNsaWVudFdpZHRoLCBtYXhDYWxjdWxhdGVkU2Nyb2xsQmFyU2l6ZSksIHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhcldpZHRoKTtcclxuXHJcblx0XHRsZXQgdmlld3BvcnRXaWR0aCA9IHNjcm9sbEVsZW1lbnQub2Zmc2V0V2lkdGggLSAodGhpcy5zY3JvbGxiYXJXaWR0aCB8fCB0aGlzLmNhbGN1bGF0ZWRTY3JvbGxiYXJXaWR0aCB8fCAodGhpcy5ob3Jpem9udGFsID8gMCA6IG1heENhbGN1bGF0ZWRTY3JvbGxCYXJTaXplKSk7XHJcblx0XHRsZXQgdmlld3BvcnRIZWlnaHQgPSBzY3JvbGxFbGVtZW50Lm9mZnNldEhlaWdodCAtICh0aGlzLnNjcm9sbGJhckhlaWdodCB8fCB0aGlzLmNhbGN1bGF0ZWRTY3JvbGxiYXJIZWlnaHQgfHwgKHRoaXMuaG9yaXpvbnRhbCA/IG1heENhbGN1bGF0ZWRTY3JvbGxCYXJTaXplIDogMCkpO1xyXG5cclxuXHRcdGxldCBjb250ZW50ID0gKHRoaXMuY29udGFpbmVyRWxlbWVudFJlZiAmJiB0aGlzLmNvbnRhaW5lckVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkgfHwgdGhpcy5jb250ZW50RWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xyXG5cclxuXHRcdGxldCBpdGVtc1BlcldyYXBHcm91cCA9IHRoaXMuY291bnRJdGVtc1BlcldyYXBHcm91cCgpO1xyXG5cdFx0bGV0IHdyYXBHcm91cHNQZXJQYWdlO1xyXG5cclxuXHRcdGxldCBkZWZhdWx0Q2hpbGRXaWR0aDtcclxuXHRcdGxldCBkZWZhdWx0Q2hpbGRIZWlnaHQ7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNBbmd1bGFyVW5pdmVyc2FsU1NSKSB7XHJcblx0XHRcdHZpZXdwb3J0V2lkdGggPSB0aGlzLnNzclZpZXdwb3J0V2lkdGg7XHJcblx0XHRcdHZpZXdwb3J0SGVpZ2h0ID0gdGhpcy5zc3JWaWV3cG9ydEhlaWdodDtcclxuXHRcdFx0ZGVmYXVsdENoaWxkV2lkdGggPSB0aGlzLnNzckNoaWxkV2lkdGg7XHJcblx0XHRcdGRlZmF1bHRDaGlsZEhlaWdodCA9IHRoaXMuc3NyQ2hpbGRIZWlnaHQ7XHJcblx0XHRcdGxldCBpdGVtc1BlclJvdyA9IE1hdGgubWF4KE1hdGguY2VpbCh2aWV3cG9ydFdpZHRoIC8gZGVmYXVsdENoaWxkV2lkdGgpLCAxKTtcclxuXHRcdFx0bGV0IGl0ZW1zUGVyQ29sID0gTWF0aC5tYXgoTWF0aC5jZWlsKHZpZXdwb3J0SGVpZ2h0IC8gZGVmYXVsdENoaWxkSGVpZ2h0KSwgMSk7XHJcblx0XHRcdHdyYXBHcm91cHNQZXJQYWdlID0gdGhpcy5ob3Jpem9udGFsID8gaXRlbXNQZXJSb3cgOiBpdGVtc1BlckNvbDtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKCF0aGlzLmVuYWJsZVVuZXF1YWxDaGlsZHJlblNpemVzKSB7XHJcblx0XHRcdGlmIChjb250ZW50LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuY2hpbGRXaWR0aCB8fCAhdGhpcy5jaGlsZEhlaWdodCkge1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLm1pbk1lYXN1cmVkQ2hpbGRXaWR0aCAmJiB2aWV3cG9ydFdpZHRoID4gMCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLm1pbk1lYXN1cmVkQ2hpbGRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMubWluTWVhc3VyZWRDaGlsZEhlaWdodCAmJiB2aWV3cG9ydEhlaWdodCA+IDApIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5taW5NZWFzdXJlZENoaWxkSGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRsZXQgY2hpbGQgPSBjb250ZW50LmNoaWxkcmVuWzBdO1xyXG5cdFx0XHRcdGxldCBjbGllbnRSZWN0ID0gdGhpcy5nZXRFbGVtZW50U2l6ZShjaGlsZCk7XHJcblx0XHRcdFx0dGhpcy5taW5NZWFzdXJlZENoaWxkV2lkdGggPSBNYXRoLm1pbih0aGlzLm1pbk1lYXN1cmVkQ2hpbGRXaWR0aCwgY2xpZW50UmVjdC53aWR0aCk7XHJcblx0XHRcdFx0dGhpcy5taW5NZWFzdXJlZENoaWxkSGVpZ2h0ID0gTWF0aC5taW4odGhpcy5taW5NZWFzdXJlZENoaWxkSGVpZ2h0LCBjbGllbnRSZWN0LmhlaWdodCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGRlZmF1bHRDaGlsZFdpZHRoID0gdGhpcy5jaGlsZFdpZHRoIHx8IHRoaXMubWluTWVhc3VyZWRDaGlsZFdpZHRoIHx8IHZpZXdwb3J0V2lkdGg7XHJcblx0XHRcdGRlZmF1bHRDaGlsZEhlaWdodCA9IHRoaXMuY2hpbGRIZWlnaHQgfHwgdGhpcy5taW5NZWFzdXJlZENoaWxkSGVpZ2h0IHx8IHZpZXdwb3J0SGVpZ2h0O1xyXG5cdFx0XHRsZXQgaXRlbXNQZXJSb3cgPSBNYXRoLm1heChNYXRoLmNlaWwodmlld3BvcnRXaWR0aCAvIGRlZmF1bHRDaGlsZFdpZHRoKSwgMSk7XHJcblx0XHRcdGxldCBpdGVtc1BlckNvbCA9IE1hdGgubWF4KE1hdGguY2VpbCh2aWV3cG9ydEhlaWdodCAvIGRlZmF1bHRDaGlsZEhlaWdodCksIDEpO1xyXG5cdFx0XHR3cmFwR3JvdXBzUGVyUGFnZSA9IHRoaXMuaG9yaXpvbnRhbCA/IGl0ZW1zUGVyUm93IDogaXRlbXNQZXJDb2w7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsZXQgc2Nyb2xsT2Zmc2V0ID0gc2Nyb2xsRWxlbWVudFt0aGlzLl9zY3JvbGxUeXBlXSAtICh0aGlzLnByZXZpb3VzVmlld1BvcnQgPyB0aGlzLnByZXZpb3VzVmlld1BvcnQucGFkZGluZyA6IDApO1xyXG5cclxuXHRcdFx0bGV0IGFycmF5U3RhcnRJbmRleCA9IHRoaXMucHJldmlvdXNWaWV3UG9ydC5zdGFydEluZGV4V2l0aEJ1ZmZlciB8fCAwO1xyXG5cdFx0XHRsZXQgd3JhcEdyb3VwSW5kZXggPSBNYXRoLmNlaWwoYXJyYXlTdGFydEluZGV4IC8gaXRlbXNQZXJXcmFwR3JvdXApO1xyXG5cclxuXHRcdFx0bGV0IG1heFdpZHRoRm9yV3JhcEdyb3VwID0gMDtcclxuXHRcdFx0bGV0IG1heEhlaWdodEZvcldyYXBHcm91cCA9IDA7XHJcblx0XHRcdGxldCBzdW1PZlZpc2libGVNYXhXaWR0aHMgPSAwO1xyXG5cdFx0XHRsZXQgc3VtT2ZWaXNpYmxlTWF4SGVpZ2h0cyA9IDA7XHJcblx0XHRcdHdyYXBHcm91cHNQZXJQYWdlID0gMDtcclxuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29udGVudC5jaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG5cdFx0XHRcdCsrYXJyYXlTdGFydEluZGV4O1xyXG5cdFx0XHRcdGxldCBjaGlsZCA9IGNvbnRlbnQuY2hpbGRyZW5baV07XHJcblx0XHRcdFx0bGV0IGNsaWVudFJlY3QgPSB0aGlzLmdldEVsZW1lbnRTaXplKGNoaWxkKTtcclxuXHJcblx0XHRcdFx0bWF4V2lkdGhGb3JXcmFwR3JvdXAgPSBNYXRoLm1heChtYXhXaWR0aEZvcldyYXBHcm91cCwgY2xpZW50UmVjdC53aWR0aCk7XHJcblx0XHRcdFx0bWF4SGVpZ2h0Rm9yV3JhcEdyb3VwID0gTWF0aC5tYXgobWF4SGVpZ2h0Rm9yV3JhcEdyb3VwLCBjbGllbnRSZWN0LmhlaWdodCk7XHJcblxyXG5cdFx0XHRcdGlmIChhcnJheVN0YXJ0SW5kZXggJSBpdGVtc1BlcldyYXBHcm91cCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0bGV0IG9sZFZhbHVlID0gdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLm1heENoaWxkU2l6ZVBlcldyYXBHcm91cFt3cmFwR3JvdXBJbmRleF07XHJcblx0XHRcdFx0XHRpZiAob2xkVmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0LS10aGlzLndyYXBHcm91cERpbWVuc2lvbnMubnVtYmVyT2ZLbm93bldyYXBHcm91cENoaWxkU2l6ZXM7XHJcblx0XHRcdFx0XHRcdHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5zdW1PZktub3duV3JhcEdyb3VwQ2hpbGRXaWR0aHMgLT0gb2xkVmFsdWUuY2hpbGRXaWR0aCB8fCAwO1xyXG5cdFx0XHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMuc3VtT2ZLbm93bldyYXBHcm91cENoaWxkSGVpZ2h0cyAtPSBvbGRWYWx1ZS5jaGlsZEhlaWdodCB8fCAwO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdCsrdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLm51bWJlck9mS25vd25XcmFwR3JvdXBDaGlsZFNpemVzO1xyXG5cdFx0XHRcdFx0Y29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKGFycmF5U3RhcnRJbmRleCAtIGl0ZW1zUGVyV3JhcEdyb3VwLCBhcnJheVN0YXJ0SW5kZXgpO1xyXG5cdFx0XHRcdFx0dGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLm1heENoaWxkU2l6ZVBlcldyYXBHcm91cFt3cmFwR3JvdXBJbmRleF0gPSB7XHJcblx0XHRcdFx0XHRcdGNoaWxkV2lkdGg6IG1heFdpZHRoRm9yV3JhcEdyb3VwLFxyXG5cdFx0XHRcdFx0XHRjaGlsZEhlaWdodDogbWF4SGVpZ2h0Rm9yV3JhcEdyb3VwLFxyXG5cdFx0XHRcdFx0XHRpdGVtczogaXRlbXNcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMuc3VtT2ZLbm93bldyYXBHcm91cENoaWxkV2lkdGhzICs9IG1heFdpZHRoRm9yV3JhcEdyb3VwO1xyXG5cdFx0XHRcdFx0dGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLnN1bU9mS25vd25XcmFwR3JvdXBDaGlsZEhlaWdodHMgKz0gbWF4SGVpZ2h0Rm9yV3JhcEdyb3VwO1xyXG5cclxuXHRcdFx0XHRcdGlmICh0aGlzLmhvcml6b250YWwpIHtcclxuXHRcdFx0XHRcdFx0bGV0IG1heFZpc2libGVXaWR0aEZvcldyYXBHcm91cCA9IE1hdGgubWluKG1heFdpZHRoRm9yV3JhcEdyb3VwLCBNYXRoLm1heCh2aWV3cG9ydFdpZHRoIC0gc3VtT2ZWaXNpYmxlTWF4V2lkdGhzLCAwKSk7XHJcblx0XHRcdFx0XHRcdGlmIChzY3JvbGxPZmZzZXQgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0bGV0IHNjcm9sbE9mZnNldFRvUmVtb3ZlID0gTWF0aC5taW4oc2Nyb2xsT2Zmc2V0LCBtYXhWaXNpYmxlV2lkdGhGb3JXcmFwR3JvdXApO1xyXG5cdFx0XHRcdFx0XHRcdG1heFZpc2libGVXaWR0aEZvcldyYXBHcm91cCAtPSBzY3JvbGxPZmZzZXRUb1JlbW92ZTtcclxuXHRcdFx0XHRcdFx0XHRzY3JvbGxPZmZzZXQgLT0gc2Nyb2xsT2Zmc2V0VG9SZW1vdmU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHN1bU9mVmlzaWJsZU1heFdpZHRocyArPSBtYXhWaXNpYmxlV2lkdGhGb3JXcmFwR3JvdXA7XHJcblx0XHRcdFx0XHRcdGlmIChtYXhWaXNpYmxlV2lkdGhGb3JXcmFwR3JvdXAgPiAwICYmIHZpZXdwb3J0V2lkdGggPj0gc3VtT2ZWaXNpYmxlTWF4V2lkdGhzKSB7XHJcblx0XHRcdFx0XHRcdFx0Kyt3cmFwR3JvdXBzUGVyUGFnZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bGV0IG1heFZpc2libGVIZWlnaHRGb3JXcmFwR3JvdXAgPSBNYXRoLm1pbihtYXhIZWlnaHRGb3JXcmFwR3JvdXAsIE1hdGgubWF4KHZpZXdwb3J0SGVpZ2h0IC0gc3VtT2ZWaXNpYmxlTWF4SGVpZ2h0cywgMCkpO1xyXG5cdFx0XHRcdFx0XHRpZiAoc2Nyb2xsT2Zmc2V0ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdGxldCBzY3JvbGxPZmZzZXRUb1JlbW92ZSA9IE1hdGgubWluKHNjcm9sbE9mZnNldCwgbWF4VmlzaWJsZUhlaWdodEZvcldyYXBHcm91cCk7XHJcblx0XHRcdFx0XHRcdFx0bWF4VmlzaWJsZUhlaWdodEZvcldyYXBHcm91cCAtPSBzY3JvbGxPZmZzZXRUb1JlbW92ZTtcclxuXHRcdFx0XHRcdFx0XHRzY3JvbGxPZmZzZXQgLT0gc2Nyb2xsT2Zmc2V0VG9SZW1vdmU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHN1bU9mVmlzaWJsZU1heEhlaWdodHMgKz0gbWF4VmlzaWJsZUhlaWdodEZvcldyYXBHcm91cDtcclxuXHRcdFx0XHRcdFx0aWYgKG1heFZpc2libGVIZWlnaHRGb3JXcmFwR3JvdXAgPiAwICYmIHZpZXdwb3J0SGVpZ2h0ID49IHN1bU9mVmlzaWJsZU1heEhlaWdodHMpIHtcclxuXHRcdFx0XHRcdFx0XHQrK3dyYXBHcm91cHNQZXJQYWdlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Kyt3cmFwR3JvdXBJbmRleDtcclxuXHJcblx0XHRcdFx0XHRtYXhXaWR0aEZvcldyYXBHcm91cCA9IDA7XHJcblx0XHRcdFx0XHRtYXhIZWlnaHRGb3JXcmFwR3JvdXAgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IGF2ZXJhZ2VDaGlsZFdpZHRoID0gdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLnN1bU9mS25vd25XcmFwR3JvdXBDaGlsZFdpZHRocyAvIHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5udW1iZXJPZktub3duV3JhcEdyb3VwQ2hpbGRTaXplcztcclxuXHRcdFx0bGV0IGF2ZXJhZ2VDaGlsZEhlaWdodCA9IHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5zdW1PZktub3duV3JhcEdyb3VwQ2hpbGRIZWlnaHRzIC8gdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLm51bWJlck9mS25vd25XcmFwR3JvdXBDaGlsZFNpemVzO1xyXG5cdFx0XHRkZWZhdWx0Q2hpbGRXaWR0aCA9IHRoaXMuY2hpbGRXaWR0aCB8fCBhdmVyYWdlQ2hpbGRXaWR0aCB8fCB2aWV3cG9ydFdpZHRoO1xyXG5cdFx0XHRkZWZhdWx0Q2hpbGRIZWlnaHQgPSB0aGlzLmNoaWxkSGVpZ2h0IHx8IGF2ZXJhZ2VDaGlsZEhlaWdodCB8fCB2aWV3cG9ydEhlaWdodDtcclxuXHJcblx0XHRcdGlmICh0aGlzLmhvcml6b250YWwpIHtcclxuXHRcdFx0XHRpZiAodmlld3BvcnRXaWR0aCA+IHN1bU9mVmlzaWJsZU1heFdpZHRocykge1xyXG5cdFx0XHRcdFx0d3JhcEdyb3Vwc1BlclBhZ2UgKz0gTWF0aC5jZWlsKCh2aWV3cG9ydFdpZHRoIC0gc3VtT2ZWaXNpYmxlTWF4V2lkdGhzKSAvIGRlZmF1bHRDaGlsZFdpZHRoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKHZpZXdwb3J0SGVpZ2h0ID4gc3VtT2ZWaXNpYmxlTWF4SGVpZ2h0cykge1xyXG5cdFx0XHRcdFx0d3JhcEdyb3Vwc1BlclBhZ2UgKz0gTWF0aC5jZWlsKCh2aWV3cG9ydEhlaWdodCAtIHN1bU9mVmlzaWJsZU1heEhlaWdodHMpIC8gZGVmYXVsdENoaWxkSGVpZ2h0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaXRlbUNvdW50ID0gdGhpcy5pdGVtcy5sZW5ndGg7XHJcblx0XHRsZXQgaXRlbXNQZXJQYWdlID0gaXRlbXNQZXJXcmFwR3JvdXAgKiB3cmFwR3JvdXBzUGVyUGFnZTtcclxuXHRcdGxldCBwYWdlQ291bnRfZnJhY3Rpb25hbCA9IGl0ZW1Db3VudCAvIGl0ZW1zUGVyUGFnZTtcclxuXHRcdGxldCBudW1iZXJPZldyYXBHcm91cHMgPSBNYXRoLmNlaWwoaXRlbUNvdW50IC8gaXRlbXNQZXJXcmFwR3JvdXApO1xyXG5cclxuXHRcdGxldCBzY3JvbGxMZW5ndGggPSAwO1xyXG5cclxuXHRcdGxldCBkZWZhdWx0U2Nyb2xsTGVuZ3RoUGVyV3JhcEdyb3VwID0gdGhpcy5ob3Jpem9udGFsID8gZGVmYXVsdENoaWxkV2lkdGggOiBkZWZhdWx0Q2hpbGRIZWlnaHQ7XHJcblx0XHRpZiAodGhpcy5lbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcykge1xyXG5cdFx0XHRsZXQgbnVtVW5rbm93bkNoaWxkU2l6ZXMgPSAwO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mV3JhcEdyb3VwczsgKytpKSB7XHJcblx0XHRcdFx0bGV0IGNoaWxkU2l6ZSA9IHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5tYXhDaGlsZFNpemVQZXJXcmFwR3JvdXBbaV0gJiYgdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLm1heENoaWxkU2l6ZVBlcldyYXBHcm91cFtpXVt0aGlzLl9jaGlsZFNjcm9sbERpbV07XHJcblx0XHRcdFx0aWYgKGNoaWxkU2l6ZSkge1xyXG5cdFx0XHRcdFx0c2Nyb2xsTGVuZ3RoICs9IGNoaWxkU2l6ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0KytudW1Vbmtub3duQ2hpbGRTaXplcztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNjcm9sbExlbmd0aCArPSBNYXRoLnJvdW5kKG51bVVua25vd25DaGlsZFNpemVzICogZGVmYXVsdFNjcm9sbExlbmd0aFBlcldyYXBHcm91cCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzY3JvbGxMZW5ndGggPSBudW1iZXJPZldyYXBHcm91cHMgKiBkZWZhdWx0U2Nyb2xsTGVuZ3RoUGVyV3JhcEdyb3VwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmhlYWRlckVsZW1lbnRSZWYpIHtcclxuXHRcdFx0c2Nyb2xsTGVuZ3RoICs9IHRoaXMuaGVhZGVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgdmlld3BvcnRMZW5ndGggPSB0aGlzLmhvcml6b250YWwgPyB2aWV3cG9ydFdpZHRoIDogdmlld3BvcnRIZWlnaHQ7XHJcblx0XHRsZXQgbWF4U2Nyb2xsUG9zaXRpb24gPSBNYXRoLm1heChzY3JvbGxMZW5ndGggLSB2aWV3cG9ydExlbmd0aCwgMCk7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aXRlbUNvdW50OiBpdGVtQ291bnQsXHJcblx0XHRcdGl0ZW1zUGVyV3JhcEdyb3VwOiBpdGVtc1BlcldyYXBHcm91cCxcclxuXHRcdFx0d3JhcEdyb3Vwc1BlclBhZ2U6IHdyYXBHcm91cHNQZXJQYWdlLFxyXG5cdFx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZSxcclxuXHRcdFx0cGFnZUNvdW50X2ZyYWN0aW9uYWw6IHBhZ2VDb3VudF9mcmFjdGlvbmFsLFxyXG5cdFx0XHRjaGlsZFdpZHRoOiBkZWZhdWx0Q2hpbGRXaWR0aCxcclxuXHRcdFx0Y2hpbGRIZWlnaHQ6IGRlZmF1bHRDaGlsZEhlaWdodCxcclxuXHRcdFx0c2Nyb2xsTGVuZ3RoOiBzY3JvbGxMZW5ndGgsXHJcblx0XHRcdHZpZXdwb3J0TGVuZ3RoOiB2aWV3cG9ydExlbmd0aCxcclxuXHRcdFx0bWF4U2Nyb2xsUG9zaXRpb246IG1heFNjcm9sbFBvc2l0aW9uXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIGNhY2hlZFBhZ2VTaXplOiBudW1iZXIgPSAwO1xyXG5cdHByb3RlY3RlZCBwcmV2aW91c1Njcm9sbE51bWJlckVsZW1lbnRzOiBudW1iZXIgPSAwO1xyXG5cclxuXHRwcm90ZWN0ZWQgY2FsY3VsYXRlUGFkZGluZyhhcnJheVN0YXJ0SW5kZXhXaXRoQnVmZmVyOiBudW1iZXIsIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zKTogbnVtYmVyIHtcclxuXHRcdGlmIChkaW1lbnNpb25zLml0ZW1Db3VudCA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgZGVmYXVsdFNjcm9sbExlbmd0aFBlcldyYXBHcm91cCA9IGRpbWVuc2lvbnNbdGhpcy5fY2hpbGRTY3JvbGxEaW1dO1xyXG5cdFx0bGV0IHN0YXJ0aW5nV3JhcEdyb3VwSW5kZXggPSBNYXRoLmZsb29yKGFycmF5U3RhcnRJbmRleFdpdGhCdWZmZXIgLyBkaW1lbnNpb25zLml0ZW1zUGVyV3JhcEdyb3VwKSB8fCAwO1xyXG5cclxuXHRcdGlmICghdGhpcy5lbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcykge1xyXG5cdFx0XHRyZXR1cm4gZGVmYXVsdFNjcm9sbExlbmd0aFBlcldyYXBHcm91cCAqIHN0YXJ0aW5nV3JhcEdyb3VwSW5kZXg7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IG51bVVua25vd25DaGlsZFNpemVzID0gMDtcclxuXHRcdGxldCByZXN1bHQgPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydGluZ1dyYXBHcm91cEluZGV4OyArK2kpIHtcclxuXHRcdFx0bGV0IGNoaWxkU2l6ZSA9IHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5tYXhDaGlsZFNpemVQZXJXcmFwR3JvdXBbaV0gJiYgdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLm1heENoaWxkU2l6ZVBlcldyYXBHcm91cFtpXVt0aGlzLl9jaGlsZFNjcm9sbERpbV07XHJcblx0XHRcdGlmIChjaGlsZFNpemUpIHtcclxuXHRcdFx0XHRyZXN1bHQgKz0gY2hpbGRTaXplO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCsrbnVtVW5rbm93bkNoaWxkU2l6ZXM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJlc3VsdCArPSBNYXRoLnJvdW5kKG51bVVua25vd25DaGlsZFNpemVzICogZGVmYXVsdFNjcm9sbExlbmd0aFBlcldyYXBHcm91cCk7XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBjYWxjdWxhdGVQYWdlSW5mbyhzY3JvbGxQb3NpdGlvbjogbnVtYmVyLCBkaW1lbnNpb25zOiBJRGltZW5zaW9ucyk6IElQYWdlSW5mbyB7XHJcblx0XHRsZXQgc2Nyb2xsUGVyY2VudGFnZSA9IDA7XHJcblx0XHRpZiAodGhpcy5lbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcykge1xyXG5cdFx0XHRjb25zdCBudW1iZXJPZldyYXBHcm91cHMgPSBNYXRoLmNlaWwoZGltZW5zaW9ucy5pdGVtQ291bnQgLyBkaW1lbnNpb25zLml0ZW1zUGVyV3JhcEdyb3VwKTtcclxuXHRcdFx0bGV0IHRvdGFsU2Nyb2xsZWRMZW5ndGggPSAwO1xyXG5cdFx0XHRsZXQgZGVmYXVsdFNjcm9sbExlbmd0aFBlcldyYXBHcm91cCA9IGRpbWVuc2lvbnNbdGhpcy5fY2hpbGRTY3JvbGxEaW1dO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mV3JhcEdyb3VwczsgKytpKSB7XHJcblx0XHRcdFx0bGV0IGNoaWxkU2l6ZSA9IHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5tYXhDaGlsZFNpemVQZXJXcmFwR3JvdXBbaV0gJiYgdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLm1heENoaWxkU2l6ZVBlcldyYXBHcm91cFtpXVt0aGlzLl9jaGlsZFNjcm9sbERpbV07XHJcblx0XHRcdFx0aWYgKGNoaWxkU2l6ZSkge1xyXG5cdFx0XHRcdFx0dG90YWxTY3JvbGxlZExlbmd0aCArPSBjaGlsZFNpemU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRvdGFsU2Nyb2xsZWRMZW5ndGggKz0gZGVmYXVsdFNjcm9sbExlbmd0aFBlcldyYXBHcm91cDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChzY3JvbGxQb3NpdGlvbiA8IHRvdGFsU2Nyb2xsZWRMZW5ndGgpIHtcclxuXHRcdFx0XHRcdHNjcm9sbFBlcmNlbnRhZ2UgPSBpIC8gbnVtYmVyT2ZXcmFwR3JvdXBzO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzY3JvbGxQZXJjZW50YWdlID0gc2Nyb2xsUG9zaXRpb24gLyBkaW1lbnNpb25zLnNjcm9sbExlbmd0aDtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgc3RhcnRpbmdBcnJheUluZGV4X2ZyYWN0aW9uYWwgPSBNYXRoLm1pbihNYXRoLm1heChzY3JvbGxQZXJjZW50YWdlICogZGltZW5zaW9ucy5wYWdlQ291bnRfZnJhY3Rpb25hbCwgMCksIGRpbWVuc2lvbnMucGFnZUNvdW50X2ZyYWN0aW9uYWwpICogZGltZW5zaW9ucy5pdGVtc1BlclBhZ2U7XHJcblxyXG5cdFx0bGV0IG1heFN0YXJ0ID0gZGltZW5zaW9ucy5pdGVtQ291bnQgLSBkaW1lbnNpb25zLml0ZW1zUGVyUGFnZSAtIDE7XHJcblx0XHRsZXQgYXJyYXlTdGFydEluZGV4ID0gTWF0aC5taW4oTWF0aC5mbG9vcihzdGFydGluZ0FycmF5SW5kZXhfZnJhY3Rpb25hbCksIG1heFN0YXJ0KTtcclxuXHRcdGFycmF5U3RhcnRJbmRleCAtPSBhcnJheVN0YXJ0SW5kZXggJSBkaW1lbnNpb25zLml0ZW1zUGVyV3JhcEdyb3VwOyAvLyByb3VuZCBkb3duIHRvIHN0YXJ0IG9mIHdyYXBHcm91cFxyXG5cclxuXHRcdGlmICh0aGlzLnN0cmlwZWRUYWJsZSkge1xyXG5cdFx0XHRsZXQgYnVmZmVyQm91bmRhcnkgPSAyICogZGltZW5zaW9ucy5pdGVtc1BlcldyYXBHcm91cDtcclxuXHRcdFx0aWYgKGFycmF5U3RhcnRJbmRleCAlIGJ1ZmZlckJvdW5kYXJ5ICE9PSAwKSB7XHJcblx0XHRcdFx0YXJyYXlTdGFydEluZGV4ID0gTWF0aC5tYXgoYXJyYXlTdGFydEluZGV4IC0gYXJyYXlTdGFydEluZGV4ICUgYnVmZmVyQm91bmRhcnksIDApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGFycmF5RW5kSW5kZXggPSBNYXRoLmNlaWwoc3RhcnRpbmdBcnJheUluZGV4X2ZyYWN0aW9uYWwpICsgZGltZW5zaW9ucy5pdGVtc1BlclBhZ2UgLSAxO1xyXG5cdFx0bGV0IGVuZEluZGV4V2l0aGluV3JhcEdyb3VwID0gKGFycmF5RW5kSW5kZXggKyAxKSAlIGRpbWVuc2lvbnMuaXRlbXNQZXJXcmFwR3JvdXA7XHJcblx0XHRpZiAoZW5kSW5kZXhXaXRoaW5XcmFwR3JvdXAgPiAwKSB7XHJcblx0XHRcdGFycmF5RW5kSW5kZXggKz0gZGltZW5zaW9ucy5pdGVtc1BlcldyYXBHcm91cCAtIGVuZEluZGV4V2l0aGluV3JhcEdyb3VwOyAvLyByb3VuZCB1cCB0byBlbmQgb2Ygd3JhcEdyb3VwXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzTmFOKGFycmF5U3RhcnRJbmRleCkpIHtcclxuXHRcdFx0YXJyYXlTdGFydEluZGV4ID0gMDtcclxuXHRcdH1cclxuXHRcdGlmIChpc05hTihhcnJheUVuZEluZGV4KSkge1xyXG5cdFx0XHRhcnJheUVuZEluZGV4ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHRhcnJheVN0YXJ0SW5kZXggPSBNYXRoLm1pbihNYXRoLm1heChhcnJheVN0YXJ0SW5kZXgsIDApLCBkaW1lbnNpb25zLml0ZW1Db3VudCAtIDEpO1xyXG5cdFx0YXJyYXlFbmRJbmRleCA9IE1hdGgubWluKE1hdGgubWF4KGFycmF5RW5kSW5kZXgsIDApLCBkaW1lbnNpb25zLml0ZW1Db3VudCAtIDEpO1xyXG5cclxuXHRcdGxldCBidWZmZXJTaXplID0gdGhpcy5idWZmZXJBbW91bnQgKiBkaW1lbnNpb25zLml0ZW1zUGVyV3JhcEdyb3VwO1xyXG5cdFx0bGV0IHN0YXJ0SW5kZXhXaXRoQnVmZmVyID0gTWF0aC5taW4oTWF0aC5tYXgoYXJyYXlTdGFydEluZGV4IC0gYnVmZmVyU2l6ZSwgMCksIGRpbWVuc2lvbnMuaXRlbUNvdW50IC0gMSk7XHJcblx0XHRsZXQgZW5kSW5kZXhXaXRoQnVmZmVyID0gTWF0aC5taW4oTWF0aC5tYXgoYXJyYXlFbmRJbmRleCArIGJ1ZmZlclNpemUsIDApLCBkaW1lbnNpb25zLml0ZW1Db3VudCAtIDEpO1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHN0YXJ0SW5kZXg6IGFycmF5U3RhcnRJbmRleCxcclxuXHRcdFx0ZW5kSW5kZXg6IGFycmF5RW5kSW5kZXgsXHJcblx0XHRcdHN0YXJ0SW5kZXhXaXRoQnVmZmVyOiBzdGFydEluZGV4V2l0aEJ1ZmZlcixcclxuXHRcdFx0ZW5kSW5kZXhXaXRoQnVmZmVyOiBlbmRJbmRleFdpdGhCdWZmZXIsXHJcblx0XHRcdHNjcm9sbFN0YXJ0UG9zaXRpb246IHNjcm9sbFBvc2l0aW9uLFxyXG5cdFx0XHRzY3JvbGxFbmRQb3NpdGlvbjogc2Nyb2xsUG9zaXRpb24gKyBkaW1lbnNpb25zLnZpZXdwb3J0TGVuZ3RoLFxyXG5cdFx0XHRtYXhTY3JvbGxQb3NpdGlvbjogZGltZW5zaW9ucy5tYXhTY3JvbGxQb3NpdGlvblxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBjYWxjdWxhdGVWaWV3cG9ydCgpOiBJVmlld3BvcnQge1xyXG5cdFx0bGV0IGRpbWVuc2lvbnMgPSB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcclxuXHRcdGxldCBvZmZzZXQgPSB0aGlzLmdldEVsZW1lbnRzT2Zmc2V0KCk7XHJcblxyXG5cdFx0bGV0IHNjcm9sbFN0YXJ0UG9zaXRpb24gPSB0aGlzLmdldFNjcm9sbFN0YXJ0UG9zaXRpb24oKTtcclxuXHRcdGlmIChzY3JvbGxTdGFydFBvc2l0aW9uID4gKGRpbWVuc2lvbnMuc2Nyb2xsTGVuZ3RoICsgb2Zmc2V0KSAmJiAhKHRoaXMucGFyZW50U2Nyb2xsIGluc3RhbmNlb2YgV2luZG93KSkge1xyXG5cdFx0XHRzY3JvbGxTdGFydFBvc2l0aW9uID0gZGltZW5zaW9ucy5zY3JvbGxMZW5ndGg7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzY3JvbGxTdGFydFBvc2l0aW9uIC09IG9mZnNldDtcclxuXHRcdH1cclxuXHRcdHNjcm9sbFN0YXJ0UG9zaXRpb24gPSBNYXRoLm1heCgwLCBzY3JvbGxTdGFydFBvc2l0aW9uKTtcclxuXHJcblx0XHRsZXQgcGFnZUluZm8gPSB0aGlzLmNhbGN1bGF0ZVBhZ2VJbmZvKHNjcm9sbFN0YXJ0UG9zaXRpb24sIGRpbWVuc2lvbnMpO1xyXG5cdFx0bGV0IG5ld1BhZGRpbmcgPSB0aGlzLmNhbGN1bGF0ZVBhZGRpbmcocGFnZUluZm8uc3RhcnRJbmRleFdpdGhCdWZmZXIsIGRpbWVuc2lvbnMpO1xyXG5cdFx0bGV0IG5ld1Njcm9sbExlbmd0aCA9IGRpbWVuc2lvbnMuc2Nyb2xsTGVuZ3RoO1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHN0YXJ0SW5kZXg6IHBhZ2VJbmZvLnN0YXJ0SW5kZXgsXHJcblx0XHRcdGVuZEluZGV4OiBwYWdlSW5mby5lbmRJbmRleCxcclxuXHRcdFx0c3RhcnRJbmRleFdpdGhCdWZmZXI6IHBhZ2VJbmZvLnN0YXJ0SW5kZXhXaXRoQnVmZmVyLFxyXG5cdFx0XHRlbmRJbmRleFdpdGhCdWZmZXI6IHBhZ2VJbmZvLmVuZEluZGV4V2l0aEJ1ZmZlcixcclxuXHRcdFx0cGFkZGluZzogTWF0aC5yb3VuZChuZXdQYWRkaW5nKSxcclxuXHRcdFx0c2Nyb2xsTGVuZ3RoOiBNYXRoLnJvdW5kKG5ld1Njcm9sbExlbmd0aCksXHJcblx0XHRcdHNjcm9sbFN0YXJ0UG9zaXRpb246IHBhZ2VJbmZvLnNjcm9sbFN0YXJ0UG9zaXRpb24sXHJcblx0XHRcdHNjcm9sbEVuZFBvc2l0aW9uOiBwYWdlSW5mby5zY3JvbGxFbmRQb3NpdGlvbixcclxuXHRcdFx0bWF4U2Nyb2xsUG9zaXRpb246IHBhZ2VJbmZvLm1heFNjcm9sbFBvc2l0aW9uXHJcblx0XHR9O1xyXG5cdH1cclxufVxyXG5cclxuQE5nTW9kdWxlKHtcclxuXHRleHBvcnRzOiBbVmlydHVhbFNjcm9sbGVyQ29tcG9uZW50XSxcclxuXHRkZWNsYXJhdGlvbnM6IFtWaXJ0dWFsU2Nyb2xsZXJDb21wb25lbnRdLFxyXG5cdGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxyXG5cdHByb3ZpZGVyczogW1xyXG5cdFx0e1xyXG5cdFx0XHRwcm92aWRlOiAndmlydHVhbC1zY3JvbGxlci1kZWZhdWx0LW9wdGlvbnMnLFxyXG5cdFx0XHR1c2VGYWN0b3J5OiBWSVJUVUFMX1NDUk9MTEVSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZXHJcblx0XHR9XHJcblx0XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVmlydHVhbFNjcm9sbGVyTW9kdWxlIHsgfSJdfQ==