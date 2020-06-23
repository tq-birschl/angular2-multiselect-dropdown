/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Output, EventEmitter, HostListener, Input } from '@angular/core';
var ClickOutsideDirective = /** @class */ (function () {
    function ClickOutsideDirective(_elementRef) {
        this._elementRef = _elementRef;
        this.clickOutside = new EventEmitter();
    }
    /**
     * @param {?} event
     * @param {?} targetElement
     * @return {?}
     */
    ClickOutsideDirective.prototype.onClick = /**
     * @param {?} event
     * @param {?} targetElement
     * @return {?}
     */
    function (event, targetElement) {
        if (!targetElement) {
            return;
        }
        /** @type {?} */
        var clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    };
    ClickOutsideDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[clickOutside]'
                },] }
    ];
    /** @nocollapse */
    ClickOutsideDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    ClickOutsideDirective.propDecorators = {
        clickOutside: [{ type: Output }],
        onClick: [{ type: HostListener, args: ['document:mousedown', ['$event', '$event.target'],] }, { type: HostListener, args: ['document:touchstart', ['$event', '$event.target'],] }]
    };
    return ClickOutsideDirective;
}());
export { ClickOutsideDirective };
if (false) {
    /** @type {?} */
    ClickOutsideDirective.prototype.clickOutside;
    /**
     * @type {?}
     * @private
     */
    ClickOutsideDirective.prototype._elementRef;
}
var ScrollDirective = /** @class */ (function () {
    function ScrollDirective(_elementRef) {
        this._elementRef = _elementRef;
        this.scroll = new EventEmitter();
    }
    /**
     * @param {?} event
     * @param {?} targetElement
     * @return {?}
     */
    ScrollDirective.prototype.onClick = /**
     * @param {?} event
     * @param {?} targetElement
     * @return {?}
     */
    function (event, targetElement) {
        this.scroll.emit(event);
    };
    ScrollDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[scroll]'
                },] }
    ];
    /** @nocollapse */
    ScrollDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    ScrollDirective.propDecorators = {
        scroll: [{ type: Output }],
        onClick: [{ type: HostListener, args: ['scroll', ['$event'],] }]
    };
    return ScrollDirective;
}());
export { ScrollDirective };
if (false) {
    /** @type {?} */
    ScrollDirective.prototype.scroll;
    /**
     * @type {?}
     * @private
     */
    ScrollDirective.prototype._elementRef;
}
var styleDirective = /** @class */ (function () {
    function styleDirective(el) {
        this.el = el;
    }
    /**
     * @return {?}
     */
    styleDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.el.nativeElement.style.top = this.styleVal;
    };
    /**
     * @return {?}
     */
    styleDirective.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        this.el.nativeElement.style.top = this.styleVal;
    };
    styleDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[styleProp]'
                },] }
    ];
    /** @nocollapse */
    styleDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    styleDirective.propDecorators = {
        styleVal: [{ type: Input, args: ['styleProp',] }]
    };
    return styleDirective;
}());
export { styleDirective };
if (false) {
    /** @type {?} */
    styleDirective.prototype.styleVal;
    /**
     * @type {?}
     * @private
     */
    styleDirective.prototype.el;
}
var setPosition = /** @class */ (function () {
    function setPosition(el) {
        this.el = el;
    }
    /**
     * @return {?}
     */
    setPosition.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.height) {
            this.el.nativeElement.style.bottom = parseInt(this.height + 15 + "") + 'px';
        }
    };
    /**
     * @return {?}
     */
    setPosition.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        if (this.height) {
            this.el.nativeElement.style.bottom = parseInt(this.height + 15 + "") + 'px';
        }
    };
    setPosition.decorators = [
        { type: Directive, args: [{
                    selector: '[setPosition]'
                },] }
    ];
    /** @nocollapse */
    setPosition.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    setPosition.propDecorators = {
        height: [{ type: Input, args: ['setPosition',] }]
    };
    return setPosition;
}());
export { setPosition };
if (false) {
    /** @type {?} */
    setPosition.prototype.height;
    /** @type {?} */
    setPosition.prototype.el;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2tPdXRzaWRlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItbXVsdGlzZWxlY3QtZHJvcGRvd24vIiwic291cmNlcyI6WyJsaWIvY2xpY2tPdXRzaWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sZUFBZSxDQUFDO0FBRXBIO0lBSUksK0JBQW9CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBSXBDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztJQUhyRCxDQUFDOzs7Ozs7SUFPTSx1Q0FBTzs7Ozs7SUFGZCxVQUVlLEtBQWlCLEVBQUUsYUFBMEI7UUFDeEQsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNoQixPQUFPO1NBQ1Y7O1lBRUssYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDNUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNoQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQztJQUNMLENBQUM7O2dCQXJCSixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLGdCQUFnQjtpQkFDN0I7Ozs7Z0JBSm1CLFVBQVU7OzsrQkFTekIsTUFBTTswQkFHTixZQUFZLFNBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLGNBQzlELFlBQVksU0FBQyxxQkFBcUIsRUFBRSxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUM7O0lBV3BFLDRCQUFDO0NBQUEsQUF0QkQsSUFzQkM7U0FuQlkscUJBQXFCOzs7SUFJOUIsNkNBQ3FEOzs7OztJQUp6Qyw0Q0FBK0I7O0FBb0IvQztJQUlJLHlCQUFvQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUlwQyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztJQUgvQyxDQUFDOzs7Ozs7SUFNTSxpQ0FBTzs7Ozs7SUFEZCxVQUNlLEtBQWlCLEVBQUUsYUFBMEI7UUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7Z0JBYkosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxVQUFVO2lCQUN2Qjs7OztnQkE1Qm1CLFVBQVU7Ozt5QkFpQ3pCLE1BQU07MEJBR04sWUFBWSxTQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7SUFJdEMsc0JBQUM7Q0FBQSxBQWRELElBY0M7U0FYWSxlQUFlOzs7SUFJeEIsaUNBQytDOzs7OztJQUpuQyxzQ0FBK0I7O0FBVy9DO0lBS0ksd0JBQW9CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO0lBRWxDLENBQUM7Ozs7SUFJRCxpQ0FBUTs7O0lBQVI7UUFFSSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDcEQsQ0FBQzs7OztJQUNELG9DQUFXOzs7SUFBWDtRQUNJLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNwRCxDQUFDOztnQkFqQkosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxhQUFhO2lCQUMxQjs7OztnQkEzQ21CLFVBQVU7OzsyQkFrRHpCLEtBQUssU0FBQyxXQUFXOztJQVN0QixxQkFBQztDQUFBLEFBbEJELElBa0JDO1NBZlksY0FBYzs7O0lBTXZCLGtDQUFxQzs7Ozs7SUFKekIsNEJBQXNCOztBQWdCdEM7SUFPSSxxQkFBbUIsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7SUFFakMsQ0FBQzs7OztJQUNELDhCQUFROzs7SUFBUjtRQUNJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUMvRTtJQUNMLENBQUM7Ozs7SUFDRCxpQ0FBVzs7O0lBQVg7UUFDSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDL0U7SUFDTCxDQUFDOztnQkFuQkosU0FBUyxTQUFDO29CQUNQLFFBQVEsRUFBRSxlQUFlO2lCQUM1Qjs7OztnQkFoRW1CLFVBQVU7Ozt5QkFtRXpCLEtBQUssU0FBQyxhQUFhOztJQWV4QixrQkFBQztDQUFBLEFBcEJELElBb0JDO1NBakJZLFdBQVc7OztJQUVwQiw2QkFBcUM7O0lBRXpCLHlCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgSW5wdXQsIE9uSW5pdCwgT25DaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnW2NsaWNrT3V0c2lkZV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDbGlja091dHNpZGVEaXJlY3RpdmUge1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgfVxyXG5cclxuICAgIEBPdXRwdXQoKVxyXG4gICAgcHVibGljIGNsaWNrT3V0c2lkZSA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDptb3VzZWRvd24nLCBbJyRldmVudCcsICckZXZlbnQudGFyZ2V0J10pXHJcbiAgICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDp0b3VjaHN0YXJ0JywgWyckZXZlbnQnLCAnJGV2ZW50LnRhcmdldCddKVxyXG4gICAgcHVibGljIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQsIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0YXJnZXRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNsaWNrZWRJbnNpZGUgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnModGFyZ2V0RWxlbWVudCk7XHJcbiAgICAgICAgaWYgKCFjbGlja2VkSW5zaWRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tPdXRzaWRlLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogJ1tzY3JvbGxdJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2Nyb2xsRGlyZWN0aXZlIHtcclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcclxuICAgIH1cclxuXHJcbiAgICBAT3V0cHV0KClcclxuICAgIHB1YmxpYyBzY3JvbGwgPSBuZXcgRXZlbnRFbWl0dGVyPE1vdXNlRXZlbnQ+KCk7XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignc2Nyb2xsJywgWyckZXZlbnQnXSlcclxuICAgIHB1YmxpYyBvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50LCB0YXJnZXRFbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsLmVtaXQoZXZlbnQpO1xyXG4gICAgfVxyXG59XHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc3R5bGVQcm9wXSdcclxufSlcclxuZXhwb3J0IGNsYXNzIHN0eWxlRGlyZWN0aXZlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgnc3R5bGVQcm9wJykgc3R5bGVWYWw6IG51bWJlcjtcclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnRvcCA9IHRoaXMuc3R5bGVWYWw7XHJcbiAgICB9XHJcbiAgICBuZ09uQ2hhbmdlcygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUudG9wID0gdGhpcy5zdHlsZVZhbDtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdbc2V0UG9zaXRpb25dJ1xyXG59KVxyXG5leHBvcnQgY2xhc3Mgc2V0UG9zaXRpb24gaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblxyXG4gICAgQElucHV0KCdzZXRQb3NpdGlvbicpIGhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZikge1xyXG5cclxuICAgIH1cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuYm90dG9tID0gcGFyc2VJbnQodGhpcy5oZWlnaHQgKyAxNSArIFwiXCIpICsgJ3B4JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBuZ09uQ2hhbmdlcygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLmJvdHRvbSA9IHBhcnNlSW50KHRoaXMuaGVpZ2h0ICsgMTUgKyBcIlwiKSArICdweCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19