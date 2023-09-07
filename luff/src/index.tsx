import "./CSS/Luff.scss";

import React from "./Core/Compiler/FakeReact";
import {AppSettings} from "./Core/Application/Settings";

import _Content from "./Core/Content/Content"
import {IContent as _IContent, TContentCtor} from "./Core/Content/IContent";
import {
    IObservableState as _IObservableState,
    IObservableStateSimple as _IObservableStateSimple,
    IObservableStateArray as _IObservableStateArray,
    IObservableStateAny as _IObservableStateAny,
    IObservableStateSimpleOrValue as _IObservableStateSimpleOrValue,
    DictN,
    Dict, TOffset, TValueName, TIDNamePair, IObservableOrValue
} from "./interfaces";
import _Application from "./Core/Application/Application";
import {getClosestStateArray, State, StateArray, luffState, luffStateArr} from "./Core/State";
import {
    luffLinq,
    luffDate,
    LibraryArray,
    LibraryDOM,
    LibraryString,
    LibraryBlob,
    LibraryNumber,
    LibraryObject, LuffDate, Culture as _Culture, PropTypes, LuffListener
} from "./Library/index";

import {LuffLoad} from "./System/Load/Load";
import {LuffLoadNative} from "./System/Load/LoadNative";
import {PopLog} from "./System/Pop/Pop";


import {RouteLink} from "./Core/Components/RouteLink";
import {Route} from "./Core/Application/Route";
import {Each, EachPaging} from "./Core/Components/Each/Each";
import {JSXElement, IElement} from "./Core/Components/IElement";
import {ComponentSimple as _ComponentSimple} from "./Core/Components/ComponentSimple";
import {CasualFragmentComponent} from "./Core/Components/CasualFragmentComponent";
import {IElementBase, ElementBase} from "./Core/Components/ElementBase";




import {TPositionObject} from "./interfaces";
import {ComponentFactory, IRenderElement} from "./Core/Compiler/ComponentFactory";
import {FilePicker} from "./Library/other";

import {luffConfirm, luffConfirmPromise} from "./Library/Confirm/Confirm";
import {IFilterMan} from "./Core/Components/Each/FilterManager";
import {ISortMan} from "./Core/Components/Each/EachSorter";
import {LibraryTree} from "./Library/Tree";
import {ICssStyle} from "./ICssStyle";

//type Booleanish = boolean | 'true' | 'false';




namespace Luff  {
    export const createElement = React.createElement;
    export const ComponentBuilder = ComponentFactory.Build;
    //export const React = _React;
    export const Content = _Content;
    export type Content = _Content;
    export const ComponentSimple = _ComponentSimple;
    export type ComponentSimple = _ComponentSimple;
    export type ContentCtor = TContentCtor;
    export type IContent = _IContent;
    export type IObservableState<T> = _IObservableState<T>;
    export type IObservableStateSimple<T> = _IObservableStateSimple<T>;
    export type IObservableStateArray<T> = _IObservableStateArray<T>;
    export type IObservableStateAny<T> = _IObservableStateAny<T>;
    export type IObservableStateSimpleOrValue<T> = _IObservableStateSimpleOrValue<T>;
    export const State = luffState;
    export const StateArr = luffStateArr;
    export const Application = _Application;
    export const Date = luffDate;
    export type Date = LuffDate;
    export const Linq = luffLinq;
    export const Array = LibraryArray;
    export const Tree = LibraryTree;
    export const DOM = LibraryDOM;
    export const String = LibraryString;
    export const Blob = LibraryBlob;
    export const Number = LibraryNumber;
    export const Object = LibraryObject;

    export const Culture = _Culture;
    export const Settings = AppSettings;

    export const Pop = PopLog;
    export type Pop = PopLog;
    export const RunConfirm = luffConfirm;
    export const RunConfirmPromise = luffConfirmPromise;
    export const Load = LuffLoadNative;



    export const Fragment = CasualFragmentComponent;
    export type Node = JSXElement;

    export function GetStateOrValue<T>(s: IObservableOrValue<T>, p: (v: T) => T) {
        let state = s as _IObservableStateSimple<T>;
        let val = s as T;
        if (state) {
            return state.SubState(v => p(v))
        } {
            return p(val);
        }
    }























    /*
    * ##########################
    * ##########################
    * ########################## */


    //
    // React Elements
    // ----------------------------------------------------------------------

    //
    // React Nodes
    // http://facebook.github.io/react/docs/glossary.html
    // ----------------------------------------------------------------------

    type ReactText = string | number | IObservableState<string | number>;
    type ReactChild = JSXElement | ReactText;

    interface ReactNodeArray extends Array<ReactNode> {}
    type ReactFragment = {} | ReactNodeArray;
    type ReactNode = ReactChild | ReactFragment | boolean | null | undefined;


    //
    // Event System
    // ----------------------------------------------------------------------
    /**
     * currentTarget - a reference to the element on which the event listener is registered.
     *
     * target - a reference to the element from which the event was originally dispatched.
     * This might be a child element to the element on which the event listener is registered.
     * If you thought this should be `EventTarget & T`, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/12239
     */
    interface BaseEvent<T = Element, S = any, E = any> {
        target: T;
        currentTarget: T;

        //react:
        nativeEvent: any;
        isDefaultPrevented: any;
        isPropagationStopped: any;
        persist: any;
        locale: any;
    }
    export interface KeyboardEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.KeyboardEvent, 'target'|'currentTarget'> { }
    export interface MouseEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.MouseEvent, 'target'|'currentTarget'> { }
    export interface TouchEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.TouchEvent, 'target'|'currentTarget'> { }
    export interface UIEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.UIEvent, 'target'|'currentTarget'> { }
    export interface WheelEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.WheelEvent, 'target'|'currentTarget'> { }
    export interface AnimationEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.AnimationEvent, 'target'|'currentTarget'> { }
    export interface TransitionEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.TransitionEvent, 'target'|'currentTarget'> { }
    export interface ClipboardEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.ClipboardEvent, 'target'|'currentTarget'> { }
    export interface FocusEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.FocusEvent, 'target'|'currentTarget'> { }
    export interface CompositionEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.CompositionEvent, 'target'|'currentTarget'> { }
    export interface DragEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.DragEvent, 'target'|'currentTarget'> { }
    export interface PointerEvent<T = Element> extends BaseEvent<T>, Omit<globalThis.PointerEvent, 'target'|'currentTarget'> { }

    export interface ChangeEvent<T = Element> extends KeyboardEvent<T> { }
    export interface FormEvent<T = Element> extends BaseEvent<T> { }

    //
    // Event Handler Types
    // ----------------------------------------------------------------------

    type EventHandler<E extends BaseEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];

    type ReactEventHandler<T = Element> = EventHandler<BaseEvent<T>>;

    type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
    type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;

    type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
    type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
    type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
    type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
    export type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
    export type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
    type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
    type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
    type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
    type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
    type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
    type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;

    export type DetailedHTMLPropsLuff<E extends HTMLAttributes<T>, T> = E;

    export interface SVGProps<T> extends SVGAttributes<T> {

    }

    interface DOMAttributes<T> {
        children?: ReactNode;

        // Clipboard Events
        onCopy?: ClipboardEventHandler<T>;
        onCopyCapture?: ClipboardEventHandler<T>;
        onCut?: ClipboardEventHandler<T>;
        onCutCapture?: ClipboardEventHandler<T>;
        onPaste?: ClipboardEventHandler<T>;
        onPasteCapture?: ClipboardEventHandler<T>;

        // Composition Events
        onCompositionEnd?: CompositionEventHandler<T>;
        onCompositionEndCapture?: CompositionEventHandler<T>;
        onCompositionStart?: CompositionEventHandler<T>;
        onCompositionStartCapture?: CompositionEventHandler<T>;
        onCompositionUpdate?: CompositionEventHandler<T>;
        onCompositionUpdateCapture?: CompositionEventHandler<T>;

        // Focus Events
        onFocus?: FocusEventHandler<T>;
        onFocusCapture?: FocusEventHandler<T>;
        onBlur?: FocusEventHandler<T>;
        onBlurCapture?: FocusEventHandler<T>;

        // Form Events
        onChange?: FormEventHandler<T>;
        onChangeCapture?: FormEventHandler<T>;
        onBeforeInput?: FormEventHandler<T>;
        onBeforeInputCapture?: FormEventHandler<T>;
        onInput?: FormEventHandler<T>;
        onInputCapture?: FormEventHandler<T>;
        onReset?: FormEventHandler<T>;
        onResetCapture?: FormEventHandler<T>;
        onSubmit?: FormEventHandler<T>;
        onSubmitCapture?: FormEventHandler<T>;
        onInvalid?: FormEventHandler<T>;
        onInvalidCapture?: FormEventHandler<T>;

        // Image Events
        onLoad?: ReactEventHandler<T>;
        onLoadCapture?: ReactEventHandler<T>;
        onError?: ReactEventHandler<T>; // also a Media Event
        onErrorCapture?: ReactEventHandler<T>; // also a Media Event

        // Keyboard Events
        onKeyDown?: KeyboardEventHandler<T>;
        onKeyDownCapture?: KeyboardEventHandler<T>;
        onKeyPress?: KeyboardEventHandler<T>;
        onKeyPressCapture?: KeyboardEventHandler<T>;
        onKeyUp?: KeyboardEventHandler<T>;
        onKeyUpCapture?: KeyboardEventHandler<T>;

        // Media Events
        onAbort?: ReactEventHandler<T>;
        onAbortCapture?: ReactEventHandler<T>;
        onCanPlay?: ReactEventHandler<T>;
        onCanPlayCapture?: ReactEventHandler<T>;
        onCanPlayThrough?: ReactEventHandler<T>;
        onCanPlayThroughCapture?: ReactEventHandler<T>;
        onDurationChange?: ReactEventHandler<T>;
        onDurationChangeCapture?: ReactEventHandler<T>;
        onEmptied?: ReactEventHandler<T>;
        onEmptiedCapture?: ReactEventHandler<T>;
        onEncrypted?: ReactEventHandler<T>;
        onEncryptedCapture?: ReactEventHandler<T>;
        onEnded?: ReactEventHandler<T>;
        onEndedCapture?: ReactEventHandler<T>;
        onLoadedData?: ReactEventHandler<T>;
        onLoadedDataCapture?: ReactEventHandler<T>;
        onLoadedMetadata?: ReactEventHandler<T>;
        onLoadedMetadataCapture?: ReactEventHandler<T>;
        onLoadStart?: ReactEventHandler<T>;
        onLoadStartCapture?: ReactEventHandler<T>;
        onPause?: ReactEventHandler<T>;
        onPauseCapture?: ReactEventHandler<T>;
        onPlay?: ReactEventHandler<T>;
        onPlayCapture?: ReactEventHandler<T>;
        onPlaying?: ReactEventHandler<T>;
        onPlayingCapture?: ReactEventHandler<T>;
        onProgress?: ReactEventHandler<T>;
        onProgressCapture?: ReactEventHandler<T>;
        onRateChange?: ReactEventHandler<T>;
        onRateChangeCapture?: ReactEventHandler<T>;
        onSeeked?: ReactEventHandler<T>;
        onSeekedCapture?: ReactEventHandler<T>;
        onSeeking?: ReactEventHandler<T>;
        onSeekingCapture?: ReactEventHandler<T>;
        onStalled?: ReactEventHandler<T>;
        onStalledCapture?: ReactEventHandler<T>;
        onSuspend?: ReactEventHandler<T>;
        onSuspendCapture?: ReactEventHandler<T>;
        onTimeUpdate?: ReactEventHandler<T>;
        onTimeUpdateCapture?: ReactEventHandler<T>;
        onVolumeChange?: ReactEventHandler<T>;
        onVolumeChangeCapture?: ReactEventHandler<T>;
        onWaiting?: ReactEventHandler<T>;
        onWaitingCapture?: ReactEventHandler<T>;

        // MouseEvents
        onAuxClick?: MouseEventHandler<T>;
        onAuxClickCapture?: MouseEventHandler<T>;
        onClick?: MouseEventHandler<T>;
        onClickCapture?: MouseEventHandler<T>;
        onContextMenu?: MouseEventHandler<T>;
        onContextMenuCapture?: MouseEventHandler<T>;
        onDoubleClick?: MouseEventHandler<T>;
        onDoubleClickCapture?: MouseEventHandler<T>;
        onDrag?: DragEventHandler<T>;
        onDragCapture?: DragEventHandler<T>;
        onDragEnd?: DragEventHandler<T>;
        onDragEndCapture?: DragEventHandler<T>;
        onDragEnter?: DragEventHandler<T>;
        onDragEnterCapture?: DragEventHandler<T>;
        onDragExit?: DragEventHandler<T>;
        onDragExitCapture?: DragEventHandler<T>;
        onDragLeave?: DragEventHandler<T>;
        onDragLeaveCapture?: DragEventHandler<T>;
        onDragOver?: DragEventHandler<T>;
        onDragOverCapture?: DragEventHandler<T>;
        onDragStart?: DragEventHandler<T>;
        onDragStartCapture?: DragEventHandler<T>;
        onDrop?: DragEventHandler<T>;
        onDropCapture?: DragEventHandler<T>;
        onMouseDown?: MouseEventHandler<T>;
        onMouseDownCapture?: MouseEventHandler<T>;
        onMouseEnter?: MouseEventHandler<T>;
        onMouseLeave?: MouseEventHandler<T>;
        onMouseMove?: MouseEventHandler<T>;
        onMouseMoveCapture?: MouseEventHandler<T>;
        onMouseOut?: MouseEventHandler<T>;
        onMouseOutCapture?: MouseEventHandler<T>;
        onMouseOver?: MouseEventHandler<T>;
        onMouseOverCapture?: MouseEventHandler<T>;
        onMouseUp?: MouseEventHandler<T>;
        onMouseUpCapture?: MouseEventHandler<T>;

        // Selection Events
        onSelect?: ReactEventHandler<T>;
        onSelectCapture?: ReactEventHandler<T>;

        // Touch Events
        onTouchCancel?: TouchEventHandler<T>;
        onTouchCancelCapture?: TouchEventHandler<T>;
        onTouchEnd?: TouchEventHandler<T>;
        onTouchEndCapture?: TouchEventHandler<T>;
        onTouchMove?: TouchEventHandler<T>;
        onTouchMoveCapture?: TouchEventHandler<T>;
        onTouchStart?: TouchEventHandler<T>;
        onTouchStartCapture?: TouchEventHandler<T>;

        // Pointer Events
        onPointerDown?: PointerEventHandler<T>;
        onPointerDownCapture?: PointerEventHandler<T>;
        onPointerMove?: PointerEventHandler<T>;
        onPointerMoveCapture?: PointerEventHandler<T>;
        onPointerUp?: PointerEventHandler<T>;
        onPointerUpCapture?: PointerEventHandler<T>;
        onPointerCancel?: PointerEventHandler<T>;
        onPointerCancelCapture?: PointerEventHandler<T>;
        onPointerEnter?: PointerEventHandler<T>;
        onPointerEnterCapture?: PointerEventHandler<T>;
        onPointerLeave?: PointerEventHandler<T>;
        onPointerLeaveCapture?: PointerEventHandler<T>;
        onPointerOver?: PointerEventHandler<T>;
        onPointerOverCapture?: PointerEventHandler<T>;
        onPointerOut?: PointerEventHandler<T>;
        onPointerOutCapture?: PointerEventHandler<T>;
        onGotPointerCapture?: PointerEventHandler<T>;
        onGotPointerCaptureCapture?: PointerEventHandler<T>;
        onLostPointerCapture?: PointerEventHandler<T>;
        onLostPointerCaptureCapture?: PointerEventHandler<T>;

        // UI Events
        onScroll?: UIEventHandler<T>;
        onScrollCapture?: UIEventHandler<T>;

        // Wheel Events
        onWheel?: WheelEventHandler<T>;
        onWheelCapture?: WheelEventHandler<T>;

        // Animation Events
        onAnimationStart?: AnimationEventHandler<T>;
        onAnimationStartCapture?: AnimationEventHandler<T>;
        onAnimationEnd?: AnimationEventHandler<T>;
        onAnimationEndCapture?: AnimationEventHandler<T>;
        onAnimationIteration?: AnimationEventHandler<T>;
        onAnimationIterationCapture?: AnimationEventHandler<T>;

        // Transition Events
        onTransitionEnd?: TransitionEventHandler<T>;
        onTransitionEndCapture?: TransitionEventHandler<T>;
    }
    // All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
    interface AriaAttributes {
        /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
        'aria-activedescendant'?: IObservableOrValue<string>;
        /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
        'aria-atomic'?: IObservableOrValue<boolean>;
        /**
         * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
         * presented if they are made.
         */
        'aria-autocomplete'?: IObservableOrValue<'none' | 'inline' | 'list' | 'both'>;
        /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
        'aria-busy'?: IObservableOrValue<boolean>;
        /**
         * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
         * @see aria-pressed @see aria-selected.
         */
        'aria-checked'?: IObservableOrValue<boolean | 'mixed'>;
        /**
         * Defines the total number of columns in a table, grid, or treegrid.
         * @see aria-colindex.
         */
        'aria-colcount'?: IObservableOrValue<number>;
        /**
         * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
         * @see aria-colcount @see aria-colspan.
         */
        'aria-colindex'?: IObservableOrValue<number>;
        /**
         * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-colindex @see aria-rowspan.
         */
        'aria-colspan'?: IObservableOrValue<number>;
        /**
         * Identifies the element (or elements) whose contents or presence are controlled by the current element.
         * @see aria-owns.
         */
        'aria-controls'?: IObservableOrValue<string>;
        /** Indicates the element that represents the current item within a container or set of related elements. */
        'aria-current'?: IObservableOrValue<boolean | 'page' | 'step' | 'location' | 'date' | 'time'>;
        /**
         * Identifies the element (or elements) that describes the object.
         * @see aria-labelledby
         */
        'aria-describedby'?: IObservableOrValue<string>;
        /**
         * Identifies the element that provides a detailed, extended description for the object.
         * @see aria-describedby.
         */
        'aria-details'?: IObservableOrValue<string>;
        /**
         * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
         * @see aria-hidden @see aria-readonly.
         */
        'aria-disabled'?: IObservableOrValue<boolean>;
        /**
         * Indicates what functions can be performed when a dragged object is released on the drop target.
         * @deprecated in ARIA 1.1
         */
        'aria-dropeffect'?: IObservableOrValue<'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup'>;
        /**
         * Identifies the element that provides an error message for the object.
         * @see aria-invalid @see aria-describedby.
         */
        'aria-errormessage'?: IObservableOrValue<string>;
        /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
        'aria-expanded'?: IObservableOrValue<boolean>;
        /**
         * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
         * allows assistive technology to override the general default of reading in document source order.
         */
        'aria-flowto'?: IObservableOrValue<string>;
        /**
         * Indicates an element's "grabbed" state in a drag-and-drop operation.
         * @deprecated in ARIA 1.1
         */
        'aria-grabbed'?: IObservableOrValue<boolean>;
        /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
        'aria-haspopup'?: IObservableOrValue<boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'>;
        /**
         * Indicates whether the element is exposed to an accessibility API.
         * @see aria-disabled.
         */
        'aria-hidden'?: IObservableOrValue<boolean>;
        /**
         * Indicates the entered value does not conform to the format expected by the application.
         * @see aria-errormessage.
         */
        'aria-invalid'?: IObservableOrValue<boolean | 'grammar' | 'spelling'>;
        /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
        'aria-keyshortcuts'?: IObservableOrValue<string>;
        /**
         * Defines a string value that labels the current element.
         * @see aria-labelledby.
         */
        'aria-label'?: IObservableOrValue<string>;
        /**
         * Identifies the element (or elements) that labels the current element.
         * @see aria-describedby.
         */
        'aria-labelledby'?: IObservableOrValue<string>;
        /** Defines the hierarchical level of an element within a structure. */
        'aria-level'?: IObservableOrValue<number>;
        /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
        'aria-live'?: IObservableOrValue<'off' | 'assertive' | 'polite'>;
        /** Indicates whether an element is modal when displayed. */
        'aria-modal'?: IObservableOrValue<boolean>;
        /** Indicates whether a text box accepts multiple lines of input or only a single line. */
        'aria-multiline'?: IObservableOrValue<boolean>;
        /** Indicates that the user may select more than one item from the current selectable descendants. */
        'aria-multiselectable'?: IObservableOrValue<boolean>;
        /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
        'aria-orientation'?: IObservableOrValue<'horizontal' | 'vertical'>;
        /**
         * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
         * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
         * @see aria-controls.
         */
        'aria-owns'?: IObservableOrValue<string>;
        /**
         * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
         * A hint could be a sample value or a brief description of the expected format.
         */
        'aria-placeholder'?: IObservableOrValue<string>;
        /**
         * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-setsize.
         */
        'aria-posinset'?: IObservableOrValue<number>;
        /**
         * Indicates the current "pressed" state of toggle buttons.
         * @see aria-checked @see aria-selected.
         */
        'aria-pressed'?: IObservableOrValue<boolean | 'mixed'>;
        /**
         * Indicates that the element is not editable, but is otherwise operable.
         * @see aria-disabled.
         */
        'aria-readonly'?: IObservableOrValue<boolean>;
        /**
         * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
         * @see aria-atomic.
         */
        'aria-relevant'?: IObservableOrValue<'additions' | 'additions text' | 'all' | 'removals' | 'text'>;
        /** Indicates that user input is required on the element before a form may be submitted. */
        'aria-required'?: IObservableOrValue<boolean>;
        /** Defines a human-readable, author-localized description for the role of an element. */
        'aria-roledescription'?: IObservableOrValue<string>;
        /**
         * Defines the total number of rows in a table, grid, or treegrid.
         * @see aria-rowindex.
         */
        'aria-rowcount'?: IObservableOrValue<number>;
        /**
         * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
         * @see aria-rowcount @see aria-rowspan.
         */
        'aria-rowindex'?: IObservableOrValue<number>;
        /**
         * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-rowindex @see aria-colspan.
         */
        'aria-rowspan'?: IObservableOrValue<number>;
        /**
         * Indicates the current "selected" state of various widgets.
         * @see aria-checked @see aria-pressed.
         */
        'aria-selected'?: IObservableOrValue<boolean>;
        /**
         * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-posinset.
         */
        'aria-setsize'?: IObservableOrValue<number>;
        /** Indicates if items in a table or grid are sorted in ascending or descending order. */
        'aria-sort'?: IObservableOrValue<'none' | 'ascending' | 'descending' | 'other'>;
        /** Defines the maximum allowed value for a range widget. */
        'aria-valuemax'?: IObservableOrValue<number>;
        /** Defines the minimum allowed value for a range widget. */
        'aria-valuemin'?: IObservableOrValue<number>;
        /**
         * Defines the current value for a range widget.
         * @see aria-valuetext.
         */
        'aria-valuenow'?: IObservableOrValue<number>;
        /** Defines the human readable text alternative of aria-valuenow for a range widget. */
        'aria-valuetext'?: IObservableOrValue<string>;
    }
    export type CSSProperties = Partial<ICssStyle> | Dict<string>;
    export type AttributeStyleType = IObservableOrValue<string> | CSSProperties | IObservableState<CSSProperties>;

    export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // React-Attributes
        ref?: any;
        key?: any;

        // Standard HTML Attributes
        accessKey?: IObservableOrValue<string>;
        className?: IObservableOrValue<string>;
        contentEditable?: IObservableOrValue<boolean | "inherit">;
        contextMenu?: IObservableOrValue<string>;
        dir?: IObservableOrValue<string>;
        draggable?: IObservableOrValue<boolean>;
        hidden?: IObservableOrValue<boolean>;
        id?: IObservableOrValue<string>;
        lang?: IObservableOrValue<string>;
        placeholder?: IObservableOrValue<string | number>;
        slot?: IObservableOrValue<string>;
        spellCheck?: IObservableOrValue<boolean>;
        style?: AttributeStyleType;
        tabIndex?: IObservableOrValue<number>;
        title?: IObservableOrValue<string>;
        translate?: IObservableOrValue<'yes' | 'no'>;

        // Unknown
        radioGroup?: IObservableOrValue<string>; // <command>, <menuitem>

        // WAI-ARIA
        role?: IObservableOrValue<string>;

        // RDFa Attributes
        about?: any;
        datatype?: IObservableOrValue<string>;
        inlist?: any;
        prefix?: IObservableOrValue<string>;
        property?: IObservableOrValue<string>;
        resource?: IObservableOrValue<string>;
        typeof?: IObservableOrValue<string>;
        vocab?: IObservableOrValue<string>;

        // Non-standard Attributes
        autoCapitalize?: IObservableOrValue<string>;
        autoCorrect?: IObservableOrValue<string>;
        autoSave?: IObservableOrValue<string>;
        color?: IObservableOrValue<string>;
        itemProp?: IObservableOrValue<string>;
        itemScope?: IObservableOrValue<boolean>;
        itemType?: IObservableOrValue<string>;
        itemID?: IObservableOrValue<string>;
        itemRef?: IObservableOrValue<string>;
        results?: IObservableOrValue<number>;
        security?: IObservableOrValue<string>;
        unselectable?: IObservableOrValue<'on' | 'off'>;

        // Living Standard
        /**
         * Hints at the type of data that might be entered by the user while editing the element or its contents
         * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
         */
        inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
        /**
         * Specify that a standard HTML element should behave like a defined custom built-in element
         * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
         */
        is?: IObservableOrValue<string>;

        isVisible?: IObservableOrValue<boolean>;
        class?: IObservableOrValue<string>;
        classDict?: Dict<IObservableStateSimple<boolean>>
        name?: string;
        permission?: string;
    }

    export interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
        download?: any;
        href?: IObservableOrValue<string>;
        hrefLang?: IObservableOrValue<string>;
        media?: IObservableOrValue<string>;
        ping?: IObservableOrValue<string>;
        rel?: IObservableOrValue<string>;
        target?: IObservableOrValue<string>;
        type?: IObservableOrValue<string>;
        referrerPolicy?: IObservableOrValue<string>;
    }

    // tslint:disable-next-line:no-empty-interface
    export interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

    export interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: IObservableOrValue<string>;
        coords?: IObservableOrValue<string>;
        download?: any;
        href?: IObservableOrValue<string>;
        hrefLang?: IObservableOrValue<string>;
        media?: IObservableOrValue<string>;
        rel?: IObservableOrValue<string>;
        shape?: IObservableOrValue<string>;
        target?: IObservableOrValue<string>;
    }

    export interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
        href?: IObservableOrValue<string>;
        target?: IObservableOrValue<string>;
    }

    export interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: IObservableOrValue<string>;
    }

    export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean;
        disabled?: IObservableOrValue<boolean>;
        form?: IObservableOrValue<string>;
        formAction?: IObservableOrValue<string>;
        formEncType?: IObservableOrValue<string>;
        formMethod?: IObservableOrValue<string>;
        formNoValidate?: IObservableOrValue<boolean>;
        formTarget?: IObservableOrValue<string>;
        name?: string;
        type?: IObservableOrValue<'submit' | 'reset' | 'button'>;
        value?: IObservableOrValue<string | string[] | number>;
    }

    export interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: IObservableOrValue<number | string>;
        width?: IObservableOrValue<number | string>;
    }

    export interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: IObservableOrValue<number>;
        width?: IObservableOrValue<number | string>;
    }

    export interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: IObservableOrValue<number>;
    }

    export interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: IObservableOrValue<string> | string[] | number;
    }

    export interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: IObservableOrValue<boolean>;
    }

    export interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: IObservableOrValue<string>;
        dateTime?: IObservableOrValue<string>;
    }

    export interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: IObservableOrValue<boolean>;
    }

    export interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: IObservableOrValue<number | string>;
        width?: IObservableOrValue<number | string>;
        src?: IObservableOrValue<string>;
        type?: IObservableOrValue<string>;
    }

    export interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: IObservableOrValue<boolean>;
        form?: IObservableOrValue<string>;
        name?: string;
    }

    export interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
        acceptCharset?: IObservableOrValue<string>;
        action?: IObservableOrValue<string>;
        autoComplete?: IObservableOrValue<string>;
        encType?: IObservableOrValue<string>;
        method?: IObservableOrValue<string>;
        name?: string;
        noValidate?: IObservableOrValue<boolean>;
        target?: IObservableOrValue<string>;
    }

    export interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
        manifest?: IObservableOrValue<string>;
    }

    export interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
        allow?: IObservableOrValue<string>;
        allowFullScreen?: IObservableOrValue<boolean>;
        allowTransparency?: IObservableOrValue<boolean>;
        frameBorder?: IObservableOrValue<number>;
        height?: IObservableOrValue<number | string>;
        marginHeight?: IObservableOrValue<number>;
        marginWidth?: IObservableOrValue<number>;
        name?: string;
        referrerPolicy?: IObservableOrValue<string>;
        sandbox?: IObservableOrValue<string>;
        scrolling?: IObservableOrValue<string>;
        seamless?: IObservableOrValue<boolean>;
        src?: IObservableOrValue<string>;
        srcDoc?: IObservableOrValue<string>;
        width?: IObservableOrValue<number | string>;
    }

    export interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: IObservableOrValue<string>;
        crossOrigin?: IObservableOrValue<"anonymous" | "use-credentials" | "">;
        decoding?: IObservableOrValue<"async" | "auto" | "sync">;
        height?: IObservableOrValue<number | string>;
        loading?: IObservableOrValue<"eager" | "lazy">;
        referrerPolicy?: IObservableOrValue<"no-referrer" | "origin" | "unsafe-url">;
        sizes?: IObservableOrValue<string>;
        src?: IObservableOrValue<string>;
        srcSet?: IObservableOrValue<string>;
        useMap?: IObservableOrValue<string>;
        width?: IObservableOrValue<number | string>;
    }

    export interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: IObservableOrValue<string>;
        dateTime?: IObservableOrValue<string>;
    }

    export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        accept?: IObservableOrValue<string>;
        alt?: IObservableOrValue<string>;
        autoComplete?: IObservableOrValue<string>;
        autoFocus?: IObservableOrValue<boolean>;
        capture?: IObservableOrValue<string>; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
        checked?: IObservableOrValue<boolean>;
        crossOrigin?: IObservableOrValue<string>;
        disabled?: IObservableOrValue<boolean>;
        form?: IObservableOrValue<string>;
        formAction?: IObservableOrValue<string>;
        formEncType?: IObservableOrValue<string>;
        formMethod?: IObservableOrValue<string>;
        formNoValidate?: IObservableOrValue<boolean>;
        formTarget?: IObservableOrValue<string>;
        height?: IObservableOrValue<number | string>;
        list?: IObservableOrValue<string>;
        max?: IObservableOrValue<number>;
        maxLength?: IObservableOrValue<number>;
        min?: IObservableOrValue<number>;
        minLength?: IObservableOrValue<number>;
        multiple?: IObservableOrValue<boolean>;
        name?: string;
        pattern?: IObservableOrValue<string>;
        placeholder?: IObservableOrValue<string | number>;
        readOnly?: IObservableOrValue<boolean>;
        required?: IObservableOrValue<boolean>;
        size?: IObservableOrValue<number>;
        src?: IObservableOrValue<string>;
        step?: IObservableOrValue<number | string>;
        type?: IObservableOrValue<string>;
        value?: IObservableOrValue<string | string[] | number>;
        width?: IObservableOrValue<number | string>;

        onChange?: ChangeEventHandler<T>;

        indeterminate?: IObservableOrValue<boolean>;
        autocomplete?: IObservableOrValue<string>;
    }

    export interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: IObservableOrValue<boolean>;
        challenge?: IObservableOrValue<string>;
        disabled?: IObservableOrValue<boolean>;
        form?: IObservableOrValue<string>;
        keyType?: IObservableOrValue<string>;
        keyParams?: IObservableOrValue<string>;
        name?: string;
    }

    export interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: IObservableOrValue<string>;
        htmlFor?: IObservableOrValue<string>;
        for?: IObservableOrValue<string>;
    }

    export interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: IObservableOrValue<string | string[] | number>;
    }

    export interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
        as?: IObservableOrValue<string>;
        crossOrigin?: IObservableOrValue<string>;
        href?: IObservableOrValue<string>;
        hrefLang?: IObservableOrValue<string>;
        integrity?: IObservableOrValue<string>;
        media?: IObservableOrValue<string>;
        rel?: IObservableOrValue<string>;
        sizes?: IObservableOrValue<string>;
        type?: IObservableOrValue<string>;
    }

    export interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string;
    }

    export interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
        type?: IObservableOrValue<string>;
    }

    export interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoPlay?: IObservableOrValue<boolean>;
        controls?: IObservableOrValue<boolean>;
        controlsList?: IObservableOrValue<string>;
        crossOrigin?: IObservableOrValue<string>;
        loop?: IObservableOrValue<boolean>;
        mediaGroup?: IObservableOrValue<string>;
        muted?: IObservableOrValue<boolean>;
        playsinline?: IObservableOrValue<boolean>;
        preload?: IObservableOrValue<string>;
        src?: IObservableOrValue<string>;
    }

    export interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
        charSet?: IObservableOrValue<string>;
        content?: IObservableOrValue<string>;
        httpEquiv?: IObservableOrValue<string>;
        name?: string;
    }

    export interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: IObservableOrValue<string>;
        high?: IObservableOrValue<string>;
        low?: IObservableOrValue<string>;
        max?: IObservableOrValue<number>;
        min?: IObservableOrValue<number>;
        optimum?: IObservableOrValue<number>;
        value?: IObservableOrValue<string | string[] | number>;
    }

    export interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: IObservableOrValue<string>;
    }

    export interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
        classID?: IObservableOrValue<string>;
        data?: IObservableOrValue<string>;
        form?: IObservableOrValue<string>;
        height?: IObservableOrValue<number | string>;
        name?: string;
        type?: IObservableOrValue<string>;
        useMap?: IObservableOrValue<string>;
        width?: IObservableOrValue<number | string>;
        wmode?: IObservableOrValue<string>;
    }

    export interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
        reversed?: IObservableOrValue<boolean>;
        start?: IObservableOrValue<number>;
        type?: IObservableOrValue<'1' | 'a' | 'A' | 'i' | 'I'>;
    }

    export interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: IObservableOrValue<boolean>;
        label?: IObservableOrValue<string>;
    }

    export interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: IObservableOrValue<boolean>;
        label?: IObservableOrValue<string>;
        selected?: IObservableOrValue<boolean>;
        value?: IObservableOrValue<string | string[] | number>;
    }

    export interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: IObservableOrValue<string>;
        htmlFor?: IObservableOrValue<string>;
        name?: string;
    }

    export interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string;
        value?: IObservableOrValue<string | string[] | number>;
    }

    export interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
        max?: IObservableOrValue<number>;
        value?: IObservableOrValue<string | string[] | number>;
    }

    export interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
        async?: IObservableOrValue<boolean>;
        charSet?: IObservableOrValue<string>;
        crossOrigin?: IObservableOrValue<string>;
        defer?: IObservableOrValue<boolean>;
        integrity?: IObservableOrValue<string>;
        noModule?: IObservableOrValue<boolean>;
        nonce?: IObservableOrValue<string>;
        src?: IObservableOrValue<string>;
        type?: IObservableOrValue<string>;
    }

    export interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: IObservableOrValue<string>;
        autoFocus?: IObservableOrValue<boolean>;
        disabled?: IObservableOrValue<boolean>;
        form?: IObservableOrValue<string>;
        multiple?: IObservableOrValue<boolean>;
        name?: string;
        required?: IObservableOrValue<boolean>;
        size?: IObservableOrValue<number>;
        value?: IObservableOrValue<string | string[] | number>;
        onChange?: ChangeEventHandler<T>;
    }

    export interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: IObservableOrValue<string>;
        sizes?: IObservableOrValue<string>;
        src?: IObservableOrValue<string>;
        srcSet?: IObservableOrValue<string>;
        type?: IObservableOrValue<string>;
    }

    export interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: IObservableOrValue<string>;
        nonce?: IObservableOrValue<string>;
        scoped?: IObservableOrValue<boolean>;
        type?: IObservableOrValue<string>;
    }

    export interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
        cellPadding?: IObservableOrValue<number | string>;
        cellSpacing?: IObservableOrValue<number | string>;
        summary?: IObservableOrValue<string>;
    }

    export interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: IObservableOrValue<string>;
        autoFocus?: IObservableOrValue<boolean>;
        cols?: IObservableOrValue<number>;
        dirName?: IObservableOrValue<string>;
        disabled?: IObservableOrValue<boolean>;
        form?: IObservableOrValue<string>;
        maxLength?: IObservableOrValue<number>;
        minLength?: IObservableOrValue<number>;
        name?: string;
        placeholder?: IObservableOrValue<string>;
        readOnly?: IObservableOrValue<boolean>;
        required?: IObservableOrValue<boolean>;
        rows?: IObservableOrValue<number>;
        value?: IObservableOrValue<string | string[] | number>;
        wrap?: IObservableOrValue<string>;

        onChange?: ChangeEventHandler<T>;
    }

    export interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: IObservableOrValue<"left" | "center" | "right" | "justify" | "char">;
        colSpan?: IObservableOrValue<number>;
        headers?: IObservableOrValue<string>;
        rowSpan?: IObservableOrValue<number>;
        scope?: IObservableOrValue<string>;
        abbr?: IObservableOrValue<string>;
        valign?: IObservableOrValue<"top" | "middle" | "bottom" | "baseline">;
    }

    export interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: IObservableOrValue<"left" | "center" | "right" | "justify" | "char">;
        colSpan?: IObservableOrValue<number>;
        headers?: IObservableOrValue<string>;
        rowSpan?: IObservableOrValue<number>;
        scope?: IObservableOrValue<string>;
        abbr?: IObservableOrValue<string>;
    }

    export interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
        dateTime?: IObservableOrValue<string>;
    }

    export interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
        default?: IObservableOrValue<boolean>;
        kind?: IObservableOrValue<string>;
        label?: IObservableOrValue<string>;
        src?: IObservableOrValue<string>;
        srcLang?: IObservableOrValue<string>;
    }

    export interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
        height?: IObservableOrValue<number | string>;
        playsInline?: IObservableOrValue<boolean>;
        poster?: IObservableOrValue<string>;
        width?: IObservableOrValue<number | string>;
        disablePictureInPicture?: IObservableOrValue<boolean>;
    }

    // this list is "complete" in that it contains every SVG attribute
    // that React supports, but the types can be improved.
    // Full list here: https://facebook.github.io/react/docs/dom-elements.html
    //
    // The three broad type categories are (in order of restrictiveness):
    //   - "number | string"
    //   - "string"
    //   - union of string literals
    export interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // Attributes which also defined in HTMLAttributes
        // See comment in SVGDOMPropertyConfig.js
        className?: IObservableOrValue<string>;
        color?: IObservableOrValue<string>;
        height?: IObservableOrValue<number | string>;
        id?: IObservableOrValue<string>;
        lang?: IObservableOrValue<string>;
        max?: IObservableOrValue<number>;
        media?: IObservableOrValue<string>;
        method?: IObservableOrValue<string>;
        min?: IObservableOrValue<number>;
        name?: string;
        style?: IObservableOrValue<string>;
        target?: IObservableOrValue<string>;
        type?: IObservableOrValue<string>;
        width?: IObservableOrValue<number | string>;

        // Other HTML properties supported by SVG elements in browsers
        role?: IObservableOrValue<string>;
        tabIndex?: IObservableOrValue<number>;
        crossOrigin?: IObservableOrValue<"anonymous" | "use-credentials" | "">;

        // SVG Specific attributes
        accentHeight?: IObservableOrValue<number>;
        accumulate?: IObservableOrValue<"none" | "sum">;
        additive?: IObservableOrValue<"replace" | "sum">;
        alignmentBaseline?: IObservableOrValue<"auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
            "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit">;
        allowReorder?: IObservableOrValue<"no" | "yes">;
        alphabetic?: IObservableOrValue<number | string>;
        amplitude?: IObservableOrValue<number | string>;
        arabicForm?: IObservableOrValue<"initial" | "medial" | "terminal" | "isolated">;
        ascent?: IObservableOrValue<number | string>;
        attributeName?: IObservableOrValue<string>;
        attributeType?: IObservableOrValue<string>;
        autoReverse?: IObservableOrValue<boolean>;
        azimuth?: IObservableOrValue<number | string>;
        baseFrequency?: IObservableOrValue<number | string>;
        baselineShift?: IObservableOrValue<number | string>;
        baseProfile?: IObservableOrValue<number | string>;
        bbox?: IObservableOrValue<number | string>;
        begin?: IObservableOrValue<number | string>;
        bias?: IObservableOrValue<number | string>;
        by?: IObservableOrValue<number | string>;
        calcMode?: IObservableOrValue<number | string>;
        capHeight?: IObservableOrValue<number | string>;
        clip?: IObservableOrValue<number | string>;
        clipPath?: IObservableOrValue<string>;
        clipPathUnits?: IObservableOrValue<number | string>;
        clipRule?: IObservableOrValue<number | string>;
        colorInterpolation?: IObservableOrValue<number | string>;
        colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit";
        colorProfile?: IObservableOrValue<number | string>;
        colorRendering?: IObservableOrValue<number | string>;
        contentScriptType?: IObservableOrValue<number | string>;
        contentStyleType?: IObservableOrValue<number | string>;
        cursor?: IObservableOrValue<number | string>;
        cx?: IObservableOrValue<number | string>;
        cy?: IObservableOrValue<number | string>;
        d?: IObservableOrValue<string>;
        decelerate?: IObservableOrValue<number | string>;
        descent?: IObservableOrValue<number | string>;
        diffuseConstant?: IObservableOrValue<number | string>;
        direction?: IObservableOrValue<number | string>;
        display?: IObservableOrValue<number | string>;
        divisor?: IObservableOrValue<number | string>;
        dominantBaseline?: IObservableOrValue<number | string>;
        dur?: IObservableOrValue<number | string>;
        dx?: IObservableOrValue<number | string>;
        dy?: IObservableOrValue<number | string>;
        edgeMode?: IObservableOrValue<number | string>;
        elevation?: IObservableOrValue<number | string>;
        enableBackground?: IObservableOrValue<number | string>;
        end?: IObservableOrValue<number | string>;
        exponent?: IObservableOrValue<number | string>;
        externalResourcesRequired?: IObservableOrValue<boolean>;
        fill?: IObservableOrValue<string>;
        fillOpacity?: IObservableOrValue<number | string>;
        fillRule?: IObservableOrValue<"nonzero" | "evenodd" | "inherit">;
        filter?: IObservableOrValue<string>;
        filterRes?: IObservableOrValue<number | string>;
        filterUnits?: IObservableOrValue<number | string>;
        floodColor?: IObservableOrValue<number | string>;
        floodOpacity?: IObservableOrValue<number | string>;
        focusable?: IObservableOrValue<boolean | "auto">;
        fontFamily?: IObservableOrValue<string>;
        fontSize?: IObservableOrValue<number | string>;
        fontSizeAdjust?: IObservableOrValue<number | string>;
        fontStretch?: IObservableOrValue<number | string>;
        fontStyle?: IObservableOrValue<number | string>;
        fontVariant?: IObservableOrValue<number | string>;
        fontWeight?: IObservableOrValue<number | string>;
        format?: IObservableOrValue<number | string>;
        from?: IObservableOrValue<number | string>;
        fx?: IObservableOrValue<number | string>;
        fy?: IObservableOrValue<number | string>;
        g1?: IObservableOrValue<number | string>;
        g2?: IObservableOrValue<number | string>;
        glyphName?: IObservableOrValue<number | string>;
        glyphOrientationHorizontal?: IObservableOrValue<number | string>;
        glyphOrientationVertical?: IObservableOrValue<number | string>;
        glyphRef?: IObservableOrValue<number | string>;
        gradientTransform?: IObservableOrValue<string>;
        gradientUnits?: IObservableOrValue<string>;
        hanging?: IObservableOrValue<number | string>;
        horizAdvX?: IObservableOrValue<number | string>;
        horizOriginX?: IObservableOrValue<number | string>;
        href?: IObservableOrValue<string>;
        ideographic?: IObservableOrValue<number | string>;
        imageRendering?: IObservableOrValue<number | string>;
        in2?: IObservableOrValue<number | string>;
        in?: IObservableOrValue<string>;
        intercept?: IObservableOrValue<number | string>;
        k1?: IObservableOrValue<number | string>;
        k2?: IObservableOrValue<number | string>;
        k3?: IObservableOrValue<number | string>;
        k4?: IObservableOrValue<number | string>;
        k?: IObservableOrValue<number | string>;
        kernelMatrix?: IObservableOrValue<number | string>;
        kernelUnitLength?: IObservableOrValue<number | string>;
        kerning?: IObservableOrValue<number | string>;
        keyPoints?: IObservableOrValue<number | string>;
        keySplines?: IObservableOrValue<number | string>;
        keyTimes?: IObservableOrValue<number | string>;
        lengthAdjust?: IObservableOrValue<number | string>;
        letterSpacing?: IObservableOrValue<number | string>;
        lightingColor?: IObservableOrValue<number | string>;
        limitingConeAngle?: IObservableOrValue<number | string>;
        local?: IObservableOrValue<number | string>;
        markerEnd?: IObservableOrValue<string>;
        markerHeight?: IObservableOrValue<number | string>;
        markerMid?: IObservableOrValue<string>;
        markerStart?: IObservableOrValue<string>;
        markerUnits?: IObservableOrValue<number | string>;
        markerWidth?: IObservableOrValue<number | string>;
        mask?: IObservableOrValue<string>;
        maskContentUnits?: IObservableOrValue<number | string>;
        maskUnits?: IObservableOrValue<number | string>;
        mathematical?: IObservableOrValue<number | string>;
        mode?: IObservableOrValue<number | string>;
        numOctaves?: IObservableOrValue<number | string>;
        offset?: IObservableOrValue<number | string>;
        opacity?: IObservableOrValue<number | string>;
        operator?: IObservableOrValue<number | string>;
        order?: IObservableOrValue<number | string>;
        orient?: IObservableOrValue<number | string>;
        orientation?: IObservableOrValue<number | string>;
        origin?: IObservableOrValue<number | string>;
        overflow?: IObservableOrValue<number | string>;
        overlinePosition?: IObservableOrValue<number | string>;
        overlineThickness?: IObservableOrValue<number | string>;
        paintOrder?: IObservableOrValue<number | string>;
        panose1?: IObservableOrValue<number | string>;
        path?: IObservableOrValue<string>;
        pathLength?: IObservableOrValue<number | string>;
        patternContentUnits?: IObservableOrValue<string>;
        patternTransform?: IObservableOrValue<number | string>;
        patternUnits?: IObservableOrValue<string>;
        pointerEvents?: IObservableOrValue<number | string>;
        points?: IObservableOrValue<string>;
        pointsAtX?: IObservableOrValue<number | string>;
        pointsAtY?: IObservableOrValue<number | string>;
        pointsAtZ?: IObservableOrValue<number | string>;
        preserveAlpha?: IObservableOrValue<boolean>;
        preserveAspectRatio?: IObservableOrValue<string>;
        primitiveUnits?: IObservableOrValue<number | string>;
        r?: IObservableOrValue<number | string>;
        radius?: IObservableOrValue<number | string>;
        refX?: IObservableOrValue<number | string>;
        refY?: IObservableOrValue<number | string>;
        renderingIntent?: IObservableOrValue<number | string>;
        repeatCount?: IObservableOrValue<number | string>;
        repeatDur?: IObservableOrValue<number | string>;
        requiredExtensions?: IObservableOrValue<number | string>;
        requiredFeatures?: IObservableOrValue<number | string>;
        restart?: IObservableOrValue<number | string>;
        result?: IObservableOrValue<string>;
        rotate?: IObservableOrValue<number | string>;
        rx?: IObservableOrValue<number | string>;
        ry?: IObservableOrValue<number | string>;
        scale?: IObservableOrValue<number | string>;
        seed?: IObservableOrValue<number | string>;
        shapeRendering?: IObservableOrValue<number | string>;
        slope?: IObservableOrValue<number | string>;
        spacing?: IObservableOrValue<number | string>;
        specularConstant?: IObservableOrValue<number | string>;
        specularExponent?: IObservableOrValue<number | string>;
        speed?: IObservableOrValue<number | string>;
        spreadMethod?: IObservableOrValue<string>;
        startOffset?: IObservableOrValue<number | string>;
        stdDeviation?: IObservableOrValue<number | string>;
        stemh?: IObservableOrValue<number | string>;
        stemv?: IObservableOrValue<number | string>;
        stitchTiles?: IObservableOrValue<number | string>;
        stopColor?: IObservableOrValue<string>;
        stopOpacity?: IObservableOrValue<number | string>;
        strikethroughPosition?: IObservableOrValue<number | string>;
        strikethroughThickness?: IObservableOrValue<number | string>;
        string?: IObservableOrValue<number | string>;
        stroke?: IObservableOrValue<string>;
        strokeDasharray?: IObservableOrValue<string | number>;
        strokeDashoffset?: IObservableOrValue<string | number>;
        strokeLinecap?: IObservableOrValue<"butt" | "round" | "square" | "inherit">;
        strokeLinejoin?: IObservableOrValue<"miter" | "round" | "bevel" | "inherit">;
        strokeMiterlimit?: IObservableOrValue<number | string>;
        strokeOpacity?: IObservableOrValue<number | string>;
        strokeWidth?: IObservableOrValue<number | string>;
        surfaceScale?: IObservableOrValue<number | string>;
        systemLanguage?: IObservableOrValue<number | string>;
        tableValues?: IObservableOrValue<number | string>;
        targetX?: IObservableOrValue<number | string>;
        targetY?: IObservableOrValue<number | string>;
        textAnchor?: IObservableOrValue<string>;
        textDecoration?: IObservableOrValue<number | string>;
        textLength?: IObservableOrValue<number | string>;
        textRendering?: IObservableOrValue<number | string>;
        to?: IObservableOrValue<number | string>;
        transform?: IObservableOrValue<string>;
        u1?: IObservableOrValue<number | string>;
        u2?: IObservableOrValue<number | string>;
        underlinePosition?: IObservableOrValue<number | string>;
        underlineThickness?: IObservableOrValue<number | string>;
        unicode?: IObservableOrValue<number | string>;
        unicodeBidi?: IObservableOrValue<number | string>;
        unicodeRange?: IObservableOrValue<number | string>;
        unitsPerEm?: IObservableOrValue<number | string>;
        vAlphabetic?: IObservableOrValue<number | string>;
        values?: IObservableOrValue<string>;
        vectorEffect?: IObservableOrValue<number | string>;
        version?: IObservableOrValue<string>;
        vertAdvY?: IObservableOrValue<number | string>;
        vertOriginX?: IObservableOrValue<number | string>;
        vertOriginY?: IObservableOrValue<number | string>;
        vHanging?: IObservableOrValue<number | string>;
        vIdeographic?: IObservableOrValue<number | string>;
        viewBox?: IObservableOrValue<string>;
        viewTarget?: IObservableOrValue<number | string>;
        visibility?: IObservableOrValue<number | string>;
        vMathematical?: IObservableOrValue<number | string>;
        widths?: IObservableOrValue<number | string>;
        wordSpacing?: IObservableOrValue<number | string>;
        writingMode?: IObservableOrValue<number | string>;
        x1?: IObservableOrValue<number | string>;
        x2?: IObservableOrValue<number | string>;
        x?: IObservableOrValue<number | string>;
        xChannelSelector?: IObservableOrValue<string>;
        xHeight?: IObservableOrValue<number | string>;
        xlinkActuate?: IObservableOrValue<string>;
        xlinkArcrole?: IObservableOrValue<string>;
        xlinkHref?: IObservableOrValue<string>;
        xlinkRole?: IObservableOrValue<string>;
        xlinkShow?: IObservableOrValue<string>;
        xlinkTitle?: IObservableOrValue<string>;
        xlinkType?: IObservableOrValue<string>;
        xmlBase?: IObservableOrValue<string>;
        xmlLang?: IObservableOrValue<string>;
        xmlns?: IObservableOrValue<string>;
        xmlnsXlink?: IObservableOrValue<string>;
        xmlSpace?: IObservableOrValue<string>;
        y1?: IObservableOrValue<number | string>;
        y2?: IObservableOrValue<number | string>;
        y?: IObservableOrValue<number | string>;
        yChannelSelector?: IObservableOrValue<string>;
        z?: IObservableOrValue<number | string>;
        zoomAndPan?: IObservableOrValue<string>;
    }
}

declare global {
    namespace JSX {
        interface ElementAttributesProperty { props: {}; }
        interface ElementChildrenAttribute { children: {}; }

        interface IntrinsicAttributes { }
        interface IntrinsicClassAttributes<T> { }

        interface IntrinsicElements {
            // HTML
            a: Luff.DetailedHTMLPropsLuff<Luff.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
            abbr: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            address: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            area: Luff.DetailedHTMLPropsLuff<Luff.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
            article: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            aside: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            audio: Luff.DetailedHTMLPropsLuff<Luff.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
            b: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            base: Luff.DetailedHTMLPropsLuff<Luff.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
            bdi: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            bdo: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            big: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            blockquote: Luff.DetailedHTMLPropsLuff<Luff.BlockquoteHTMLAttributes<HTMLElement>, HTMLElement>;
            body: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
            br: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
            button: Luff.DetailedHTMLPropsLuff<Luff.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            canvas: Luff.DetailedHTMLPropsLuff<Luff.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
            caption: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            cite: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            code: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            col: Luff.DetailedHTMLPropsLuff<Luff.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            colgroup: Luff.DetailedHTMLPropsLuff<Luff.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            data: Luff.DetailedHTMLPropsLuff<Luff.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
            datalist: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
            dd: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            del: Luff.DetailedHTMLPropsLuff<Luff.DelHTMLAttributes<HTMLElement>, HTMLElement>;
            details: Luff.DetailedHTMLPropsLuff<Luff.DetailsHTMLAttributes<HTMLElement>, HTMLElement>;
            dfn: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            dialog: Luff.DetailedHTMLPropsLuff<Luff.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
            div: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            dl: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
            dt: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            em: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            embed: Luff.DetailedHTMLPropsLuff<Luff.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
            fieldset: Luff.DetailedHTMLPropsLuff<Luff.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
            figcaption: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            figure: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            footer: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            form: Luff.DetailedHTMLPropsLuff<Luff.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
            h1: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h2: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h3: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h4: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h5: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h6: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            head: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
            header: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            hgroup: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            hr: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
            html: Luff.DetailedHTMLPropsLuff<Luff.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
            i: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            iframe: Luff.DetailedHTMLPropsLuff<Luff.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
            img: Luff.DetailedHTMLPropsLuff<Luff.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
            input: Luff.DetailedHTMLPropsLuff<Luff.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
            ins: Luff.DetailedHTMLPropsLuff<Luff.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
            kbd: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            keygen: Luff.DetailedHTMLPropsLuff<Luff.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
            label: Luff.DetailedHTMLPropsLuff<Luff.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
            legend: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
            li: Luff.DetailedHTMLPropsLuff<Luff.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
            link: Luff.DetailedHTMLPropsLuff<Luff.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
            main: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            map: Luff.DetailedHTMLPropsLuff<Luff.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
            mark: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            menu: Luff.DetailedHTMLPropsLuff<Luff.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
            menuitem: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            meta: Luff.DetailedHTMLPropsLuff<Luff.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
            meter: Luff.DetailedHTMLPropsLuff<Luff.MeterHTMLAttributes<HTMLElement>, HTMLElement>;
            nav: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            noindex: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            noscript: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            object: Luff.DetailedHTMLPropsLuff<Luff.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
            ol: Luff.DetailedHTMLPropsLuff<Luff.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
            optgroup: Luff.DetailedHTMLPropsLuff<Luff.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
            option: Luff.DetailedHTMLPropsLuff<Luff.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
            output: Luff.DetailedHTMLPropsLuff<Luff.OutputHTMLAttributes<HTMLElement>, HTMLElement>;
            p: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
            param: Luff.DetailedHTMLPropsLuff<Luff.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
            picture: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            pre: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
            progress: Luff.DetailedHTMLPropsLuff<Luff.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
            q: Luff.DetailedHTMLPropsLuff<Luff.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
            rp: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            rt: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            ruby: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            s: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            samp: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            script: Luff.DetailedHTMLPropsLuff<Luff.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
            section: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            select: Luff.DetailedHTMLPropsLuff<Luff.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
            small: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            source: Luff.DetailedHTMLPropsLuff<Luff.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
            span: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
            strong: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            style: Luff.DetailedHTMLPropsLuff<Luff.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
            sub: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            summary: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            sup: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            table: Luff.DetailedHTMLPropsLuff<Luff.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
            template: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
            tbody: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            td: Luff.DetailedHTMLPropsLuff<Luff.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
            textarea: Luff.DetailedHTMLPropsLuff<Luff.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
            tfoot: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            th: Luff.DetailedHTMLPropsLuff<Luff.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
            thead: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            time: Luff.DetailedHTMLPropsLuff<Luff.TimeHTMLAttributes<HTMLElement>, HTMLElement>;
            title: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
            tr: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
            track: Luff.DetailedHTMLPropsLuff<Luff.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
            u: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            ul: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
            "var": Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            video: Luff.DetailedHTMLPropsLuff<Luff.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
            wbr: Luff.DetailedHTMLPropsLuff<Luff.HTMLAttributes<HTMLElement>, HTMLElement>;
            //webview: Luff.DetailedHTMLPropsLuff<Luff.WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;

            // SVG
            svg: Luff.SVGProps<SVGSVGElement>;

            animate: Luff.SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
            animateMotion: Luff.SVGProps<SVGElement>;
            animateTransform: Luff.SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
            circle: Luff.SVGProps<SVGCircleElement>;
            clipPath: Luff.SVGProps<SVGClipPathElement>;
            defs: Luff.SVGProps<SVGDefsElement>;
            desc: Luff.SVGProps<SVGDescElement>;
            ellipse: Luff.SVGProps<SVGEllipseElement>;
            feBlend: Luff.SVGProps<SVGFEBlendElement>;
            feColorMatrix: Luff.SVGProps<SVGFEColorMatrixElement>;
            feComponentTransfer: Luff.SVGProps<SVGFEComponentTransferElement>;
            feComposite: Luff.SVGProps<SVGFECompositeElement>;
            feConvolveMatrix: Luff.SVGProps<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: Luff.SVGProps<SVGFEDiffuseLightingElement>;
            feDisplacementMap: Luff.SVGProps<SVGFEDisplacementMapElement>;
            feDistantLight: Luff.SVGProps<SVGFEDistantLightElement>;
            feDropShadow: Luff.SVGProps<SVGFEDropShadowElement>;
            feFlood: Luff.SVGProps<SVGFEFloodElement>;
            feFuncA: Luff.SVGProps<SVGFEFuncAElement>;
            feFuncB: Luff.SVGProps<SVGFEFuncBElement>;
            feFuncG: Luff.SVGProps<SVGFEFuncGElement>;
            feFuncR: Luff.SVGProps<SVGFEFuncRElement>;
            feGaussianBlur: Luff.SVGProps<SVGFEGaussianBlurElement>;
            feImage: Luff.SVGProps<SVGFEImageElement>;
            feMerge: Luff.SVGProps<SVGFEMergeElement>;
            feMergeNode: Luff.SVGProps<SVGFEMergeNodeElement>;
            feMorphology: Luff.SVGProps<SVGFEMorphologyElement>;
            feOffset: Luff.SVGProps<SVGFEOffsetElement>;
            fePointLight: Luff.SVGProps<SVGFEPointLightElement>;
            feSpecularLighting: Luff.SVGProps<SVGFESpecularLightingElement>;
            feSpotLight: Luff.SVGProps<SVGFESpotLightElement>;
            feTile: Luff.SVGProps<SVGFETileElement>;
            feTurbulence: Luff.SVGProps<SVGFETurbulenceElement>;
            filter: Luff.SVGProps<SVGFilterElement>;
            foreignObject: Luff.SVGProps<SVGForeignObjectElement>;
            g: Luff.SVGProps<SVGGElement>;
            image: Luff.SVGProps<SVGImageElement>;
            line: Luff.SVGProps<SVGLineElement>;
            linearGradient: Luff.SVGProps<SVGLinearGradientElement>;
            marker: Luff.SVGProps<SVGMarkerElement>;
            mask: Luff.SVGProps<SVGMaskElement>;
            metadata: Luff.SVGProps<SVGMetadataElement>;
            mpath: Luff.SVGProps<SVGElement>;
            path: Luff.SVGProps<SVGPathElement>;
            pattern: Luff.SVGProps<SVGPatternElement>;
            polygon: Luff.SVGProps<SVGPolygonElement>;
            polyline: Luff.SVGProps<SVGPolylineElement>;
            radialGradient: Luff.SVGProps<SVGRadialGradientElement>;
            rect: Luff.SVGProps<SVGRectElement>;
            stop: Luff.SVGProps<SVGStopElement>;
            switch: Luff.SVGProps<SVGSwitchElement>;
            symbol: Luff.SVGProps<SVGSymbolElement>;
            text: Luff.SVGProps<SVGTextElement>;
            textPath: Luff.SVGProps<SVGTextPathElement>;
            tspan: Luff.SVGProps<SVGTSpanElement>;
            use: Luff.SVGProps<SVGUseElement>;
            view: Luff.SVGProps<SVGViewElement>;
        }
    }

    const ___LuffGlobal : {
        PeriodPicker: any; //TODO PeriodPicker type
        Inputs: {
            TextBox: any,
        }
    }
}
window['___LuffGlobal'] = {
    PeriodPicker: void 0,
    Inputs: {}
};

(function preloadImages(imageSRCs: string[]) {
    let images = [];
    for (let i = 0; i < imageSRCs.length; i++) {
        images[i] = new Image();
        images[i].src = imageSRCs[i];
    }
})(
    [
        'img/l-icon-load.svg',
        //'img/l-radio.svg',
    ]
);



export {React, luffState, luffStateArr, TContentCtor,
    _ComponentSimple as ComponentSimple,
    _Application as Application,
    Route, RouteLink, Each, EachPaging, ISortMan, IFilterMan,
    luffDate, luffDate as LDate, LuffDate, LibraryArray, LibraryTree, LibraryDOM, LibraryString, LibraryBlob, LibraryNumber, LibraryObject, _Culture as Culture, PropTypes, LuffListener, luffLinq,
    FilePicker,

    _IObservableState as IObservableState, _IObservableStateSimple as IObservableStateSimple, _IObservableStateArray as IObservableStateArray, _IObservableStateAny as IObservableStateAny, _IObservableStateSimpleOrValue as IObservableStateSimpleOrValue, Dict, DictN,
    TPositionObject, TOffset, TValueName, TIDNamePair,
    _IContent as IContent, JSXElement, IElement, IElementBase, ElementBase, IRenderElement, ComponentFactory,
    State, StateArray, getClosestStateArray, IObservableOrValue,

    //AppSettings,
    //components:
    LuffLoad
}
export default Luff;