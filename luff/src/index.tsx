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
    DictN,
    Dict, TOffset, TValueName, TIDNamePair
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
import {luffPop, PopLog} from "./System/Pop/Pop";


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

type Booleanish = boolean | 'true' | 'false';




namespace Luff  {
    export const createElement = React.createElement;
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
    export const State = luffState;
    export const StateArr = luffStateArr;
    export const Application = _Application;
    export const Date = luffDate;
    export type Date = LuffDate;
    export const Linq = luffLinq;
    export const Array = LibraryArray;
    export const DOM = LibraryDOM;
    export const String = LibraryString;
    export const Blob = LibraryBlob;
    export const Number = LibraryNumber;
    export const Object = LibraryObject;

    export const Culture = _Culture;
    export const Settings = AppSettings;

    export const Pop = luffPop;
    export type Pop = PopLog;
    export const RunConfirm = luffConfirm;
    export const RunConfirmPromise = luffConfirmPromise;
    export const Load = LuffLoadNative;



    export const Fragment = CasualFragmentComponent;
    export type Node = JSXElement;

























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
    export type AttributeType<T> = T | IObservableStateSimple<T>;
    export type AttributeStyleType<T> = T | Dict<IObservableStateSimple<T>> | IObservableStateSimple<Dict<T>>;

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
        'aria-activedescendant'?: string;
        /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
        'aria-atomic'?: boolean | 'false' | 'true';
        /**
         * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
         * presented if they are made.
         */
        'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
        /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
        'aria-busy'?: boolean | 'false' | 'true';
        /**
         * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
         * @see aria-pressed @see aria-selected.
         */
        'aria-checked'?: boolean | 'false' | 'mixed' | 'true';
        /**
         * Defines the total number of columns in a table, grid, or treegrid.
         * @see aria-colindex.
         */
        'aria-colcount'?: number;
        /**
         * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
         * @see aria-colcount @see aria-colspan.
         */
        'aria-colindex'?: number;
        /**
         * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-colindex @see aria-rowspan.
         */
        'aria-colspan'?: number;
        /**
         * Identifies the element (or elements) whose contents or presence are controlled by the current element.
         * @see aria-owns.
         */
        'aria-controls'?: string;
        /** Indicates the element that represents the current item within a container or set of related elements. */
        'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
        /**
         * Identifies the element (or elements) that describes the object.
         * @see aria-labelledby
         */
        'aria-describedby'?: string;
        /**
         * Identifies the element that provides a detailed, extended description for the object.
         * @see aria-describedby.
         */
        'aria-details'?: string;
        /**
         * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
         * @see aria-hidden @see aria-readonly.
         */
        'aria-disabled'?: boolean | 'false' | 'true';
        /**
         * Indicates what functions can be performed when a dragged object is released on the drop target.
         * @deprecated in ARIA 1.1
         */
        'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup';
        /**
         * Identifies the element that provides an error message for the object.
         * @see aria-invalid @see aria-describedby.
         */
        'aria-errormessage'?: string;
        /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
        'aria-expanded'?: boolean | 'false' | 'true';
        /**
         * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
         * allows assistive technology to override the general default of reading in document source order.
         */
        'aria-flowto'?: string;
        /**
         * Indicates an element's "grabbed" state in a drag-and-drop operation.
         * @deprecated in ARIA 1.1
         */
        'aria-grabbed'?: boolean | 'false' | 'true';
        /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
        'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
        /**
         * Indicates whether the element is exposed to an accessibility API.
         * @see aria-disabled.
         */
        'aria-hidden'?: boolean | 'false' | 'true';
        /**
         * Indicates the entered value does not conform to the format expected by the application.
         * @see aria-errormessage.
         */
        'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
        /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
        'aria-keyshortcuts'?: string;
        /**
         * Defines a string value that labels the current element.
         * @see aria-labelledby.
         */
        'aria-label'?: string;
        /**
         * Identifies the element (or elements) that labels the current element.
         * @see aria-describedby.
         */
        'aria-labelledby'?: string;
        /** Defines the hierarchical level of an element within a structure. */
        'aria-level'?: number;
        /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
        'aria-live'?: 'off' | 'assertive' | 'polite';
        /** Indicates whether an element is modal when displayed. */
        'aria-modal'?: boolean | 'false' | 'true';
        /** Indicates whether a text box accepts multiple lines of input or only a single line. */
        'aria-multiline'?: boolean | 'false' | 'true';
        /** Indicates that the user may select more than one item from the current selectable descendants. */
        'aria-multiselectable'?: boolean | 'false' | 'true';
        /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
        'aria-orientation'?: 'horizontal' | 'vertical';
        /**
         * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
         * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
         * @see aria-controls.
         */
        'aria-owns'?: string;
        /**
         * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
         * A hint could be a sample value or a brief description of the expected format.
         */
        'aria-placeholder'?: string;
        /**
         * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-setsize.
         */
        'aria-posinset'?: number;
        /**
         * Indicates the current "pressed" state of toggle buttons.
         * @see aria-checked @see aria-selected.
         */
        'aria-pressed'?: boolean | 'false' | 'mixed' | 'true';
        /**
         * Indicates that the element is not editable, but is otherwise operable.
         * @see aria-disabled.
         */
        'aria-readonly'?: boolean | 'false' | 'true';
        /**
         * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
         * @see aria-atomic.
         */
        'aria-relevant'?: 'additions' | 'additions text' | 'all' | 'removals' | 'text';
        /** Indicates that user input is required on the element before a form may be submitted. */
        'aria-required'?: boolean | 'false' | 'true';
        /** Defines a human-readable, author-localized description for the role of an element. */
        'aria-roledescription'?: string;
        /**
         * Defines the total number of rows in a table, grid, or treegrid.
         * @see aria-rowindex.
         */
        'aria-rowcount'?: number;
        /**
         * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
         * @see aria-rowcount @see aria-rowspan.
         */
        'aria-rowindex'?: number;
        /**
         * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-rowindex @see aria-colspan.
         */
        'aria-rowspan'?: number;
        /**
         * Indicates the current "selected" state of various widgets.
         * @see aria-checked @see aria-pressed.
         */
        'aria-selected'?: boolean | 'false' | 'true';
        /**
         * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-posinset.
         */
        'aria-setsize'?: number;
        /** Indicates if items in a table or grid are sorted in ascending or descending order. */
        'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
        /** Defines the maximum allowed value for a range widget. */
        'aria-valuemax'?: number;
        /** Defines the minimum allowed value for a range widget. */
        'aria-valuemin'?: number;
        /**
         * Defines the current value for a range widget.
         * @see aria-valuetext.
         */
        'aria-valuenow'?: number;
        /** Defines the human readable text alternative of aria-valuenow for a range widget. */
        'aria-valuetext'?: string;
    }

    export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // React-Attributes
        ref?: any;
        key?: any;

        // React-specific Attributes
        defaultChecked?: boolean;
        defaultValue?: string | number | string[];
        suppressContentEditableWarning?: boolean;
        suppressHydrationWarning?: boolean;

        // Standard HTML Attributes
        accessKey?: string;
        className?: string;
        contentEditable?: Booleanish | "inherit";
        contextMenu?: string;
        dir?: string;
        draggable?: Booleanish;
        hidden?: boolean;
        id?: string;
        lang?: string;
        placeholder?: string;
        slot?: string;
        spellCheck?: Booleanish;
        style?: string | any; //AttributeStyleType<string>; //TODO: uncomment
        tabIndex?: number;
        title?: string | IObservableStateSimple<string>;
        translate?: 'yes' | 'no';

        // Unknown
        radioGroup?: string; // <command>, <menuitem>

        // WAI-ARIA
        role?: string;

        // RDFa Attributes
        about?: any;
        datatype?: string;
        inlist?: any;
        prefix?: string;
        property?: string;
        resource?: string;
        typeof?: string;
        vocab?: string;

        // Non-standard Attributes
        autoCapitalize?: string;
        autoCorrect?: string;
        autoSave?: string;
        color?: string;
        itemProp?: string;
        itemScope?: boolean;
        itemType?: string;
        itemID?: string;
        itemRef?: string;
        results?: number;
        security?: string;
        unselectable?: 'on' | 'off';

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
        is?: string;

        isVisible?: IObservableStateSimple<boolean> | boolean;
        class?: string | IObservableStateSimple<string>;
        classDict?: Dict<IObservableStateSimple<boolean>>
        name?: string;
        permission?: string;
    }

    export interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
        download?: any;
        href?: string | IObservableStateSimple<string>;
        hrefLang?: string;
        media?: string;
        ping?: string;
        rel?: string;
        target?: string;
        type?: string;
        referrerPolicy?: string;
    }

    // tslint:disable-next-line:no-empty-interface
    export interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

    export interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string;
        coords?: string;
        download?: any;
        href?: string;
        hrefLang?: string;
        media?: string;
        rel?: string;
        shape?: string;
        target?: string;
    }

    export interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
        href?: string;
        target?: string;
    }

    export interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
    }

    export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean;
        disabled?: boolean | IObservableStateSimple<boolean>;
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        name?: string;
        type?: 'submit' | 'reset' | 'button';
        value?: string | string[] | number;
    }

    export interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string;
        width?: number | string;
    }

    export interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number;
        width?: number | string;
    }

    export interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number;
    }

    export interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | string[] | number;
    }

    export interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: boolean;
    }

    export interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
        dateTime?: string;
    }

    export interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: boolean;
    }

    export interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string;
        src?: string;
        type?: string;
        width?: number | string;
    }

    export interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean;
        form?: string;
        name?: string;
    }

    export interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
        acceptCharset?: string;
        action?: string;
        autoComplete?: string;
        encType?: string;
        method?: string;
        name?: string;
        noValidate?: boolean;
        target?: string;
    }

    export interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
        manifest?: string;
    }

    export interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
        allow?: string;
        allowFullScreen?: boolean;
        allowTransparency?: boolean;
        frameBorder?: number | string;
        height?: number | string;
        marginHeight?: number;
        marginWidth?: number;
        name?: string;
        referrerPolicy?: string;
        sandbox?: string;
        scrolling?: string;
        seamless?: boolean;
        src?: string;
        srcDoc?: string;
        width?: number | string;
    }

    export interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string | IObservableStateSimple<string>;;
        crossOrigin?: "anonymous" | "use-credentials" | "";
        decoding?: "async" | "auto" | "sync";
        height?: number | string;
        loading?: "eager" | "lazy";
        referrerPolicy?: "no-referrer" | "origin" | "unsafe-url";
        sizes?: string | IObservableStateSimple<string>;
        src?: string | IObservableStateSimple<string>;
        srcSet?: string | IObservableStateSimple<string>;
        useMap?: string | IObservableStateSimple<string>;
        width?: number | string | IObservableStateSimple<string | number>;
    }

    export interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | IObservableStateSimple<string>;
        dateTime?: string | IObservableStateSimple<string>;
    }

    export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        accept?: string | IObservableStateSimple<string>;
        alt?: string | IObservableStateSimple<string>;
        autoComplete?: string | IObservableStateSimple<string>;
        autoFocus?: boolean | IObservableStateSimple<string>;
        capture?: boolean | string; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
        checked?: boolean | IObservableStateSimple<boolean>;
        crossOrigin?: string;
        disabled?: boolean | IObservableStateSimple<boolean>;
        form?: string;
        formAction?: string;
        formEncType?: string;
        formMethod?: string;
        formNoValidate?: boolean;
        formTarget?: string;
        height?: number | string;
        list?: string;
        max?: number | string | IObservableStateSimple<number>;
        maxLength?: number | IObservableStateSimple<number>;
        min?: number | string | IObservableStateSimple<number>;
        minLength?: number;
        multiple?: boolean;
        name?: string;
        pattern?: string;
        placeholder?: string;
        readOnly?: boolean;
        required?: boolean;
        size?: number;
        src?: string | IObservableStateSimple<string>;
        step?: number | string;
        type?: string | IObservableStateSimple<string>;
        value?: string | string[] | number | IObservableStateSimple<string|number>;
        width?: number | string | IObservableStateSimple<string | number>;

        onChange?: ChangeEventHandler<T>;

        indeterminate?: IObservableStateSimple<boolean>;
        autocomplete?: string;
    }

    export interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean;
        challenge?: string;
        disabled?: boolean;
        form?: string;
        keyType?: string;
        keyParams?: string;
        name?: string;
    }

    export interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string;
        htmlFor?: string;
        for?: string;
    }

    export interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | string[] | number;
    }

    export interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
        as?: string;
        crossOrigin?: string;
        href?: string;
        hrefLang?: string;
        integrity?: string;
        media?: string;
        rel?: string;
        sizes?: string;
        type?: string;
    }

    export interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string;
    }

    export interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
        type?: string;
    }

    export interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoPlay?: boolean;
        controls?: boolean;
        controlsList?: string;
        crossOrigin?: string;
        loop?: boolean;
        mediaGroup?: string;
        muted?: boolean;
        playsinline?: boolean;
        preload?: string;
        src?: string;
    }

    export interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
        charSet?: string;
        content?: string;
        httpEquiv?: string;
        name?: string;
    }

    export interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string;
        high?: number;
        low?: number;
        max?: number | string;
        min?: number | string;
        optimum?: number;
        value?: string | string[] | number;
    }

    export interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string;
    }

    export interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
        classID?: string;
        data?: string;
        form?: string;
        height?: number | string;
        name?: string;
        type?: string;
        useMap?: string;
        width?: number | string;
        wmode?: string;
    }

    export interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
        reversed?: boolean;
        start?: number;
        type?: '1' | 'a' | 'A' | 'i' | 'I';
    }

    export interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean;
        label?: string;
    }

    export interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean;
        label?: string;
        selected?: boolean;
        value?: string | string[] | number;
    }

    export interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string;
        htmlFor?: string;
        name?: string;
    }

    export interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string;
        value?: string | string[] | number;
    }

    export interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
        max?: number | string;
        value?: string | string[] | number;
    }

    export interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
        async?: boolean;
        charSet?: string;
        crossOrigin?: string;
        defer?: boolean;
        integrity?: string;
        noModule?: boolean;
        nonce?: string;
        src?: string;
        type?: string;
    }

    export interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: string;
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        multiple?: boolean;
        name?: string;
        required?: boolean;
        size?: number;
        value?: string | string[] | number;
        onChange?: ChangeEventHandler<T>;
    }

    export interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: string;
        sizes?: string;
        src?: string;
        srcSet?: string;
        type?: string;
    }

    export interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: string;
        nonce?: string;
        scoped?: boolean;
        type?: string;
    }

    export interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
        cellPadding?: number | string;
        cellSpacing?: number | string;
        summary?: string;
    }

    export interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: string;
        autoFocus?: boolean;
        cols?: number;
        dirName?: string;
        disabled?: boolean;
        form?: string;
        maxLength?: number;
        minLength?: number;
        name?: string;
        placeholder?: string;
        readOnly?: boolean;
        required?: boolean;
        rows?: number;
        value?: string | string[] | number | IObservableStateSimple<string>;
        wrap?: string;

        onChange?: ChangeEventHandler<T>;
    }

    export interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char";
        colSpan?: number | IObservableStateSimple<number>;
        //colspan?: number;
        headers?: string;
        rowSpan?: number;
        //rowspan?: number;
        scope?: string;
        abbr?: string;
        valign?: "top" | "middle" | "bottom" | "baseline";
    }

    export interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char";
        colSpan?: number | IObservableStateSimple<number>;
        headers?: string;
        rowSpan?: number | IObservableStateSimple<number>;
        scope?: string;
        abbr?: string;
    }

    export interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
        dateTime?: string;
    }

    export interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
        default?: boolean;
        kind?: string;
        label?: string;
        src?: string;
        srcLang?: string;
    }

    export interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
        height?: number | string;
        playsInline?: boolean;
        poster?: string;
        width?: number | string;
        disablePictureInPicture?: boolean;
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
        className?: string;
        color?: string;
        height?: number | string;
        id?: string;
        lang?: string;
        max?: number | string;
        media?: string;
        method?: string;
        min?: number | string;
        name?: string;
        style?: string;
        target?: string;
        type?: string;
        width?: number | string;

        // Other HTML properties supported by SVG elements in browsers
        role?: string;
        tabIndex?: number;
        crossOrigin?: "anonymous" | "use-credentials" | "";

        // SVG Specific attributes
        accentHeight?: number | string;
        accumulate?: "none" | "sum";
        additive?: "replace" | "sum";
        alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
            "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit";
        allowReorder?: "no" | "yes";
        alphabetic?: number | string;
        amplitude?: number | string;
        arabicForm?: "initial" | "medial" | "terminal" | "isolated";
        ascent?: number | string;
        attributeName?: string;
        attributeType?: string;
        autoReverse?: Booleanish;
        azimuth?: number | string;
        baseFrequency?: number | string;
        baselineShift?: number | string;
        baseProfile?: number | string;
        bbox?: number | string;
        begin?: number | string;
        bias?: number | string;
        by?: number | string;
        calcMode?: number | string;
        capHeight?: number | string;
        clip?: number | string;
        clipPath?: string;
        clipPathUnits?: number | string;
        clipRule?: number | string;
        colorInterpolation?: number | string;
        colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit";
        colorProfile?: number | string;
        colorRendering?: number | string;
        contentScriptType?: number | string;
        contentStyleType?: number | string;
        cursor?: number | string;
        cx?: number | string;
        cy?: number | string;
        d?: string;
        decelerate?: number | string;
        descent?: number | string;
        diffuseConstant?: number | string;
        direction?: number | string;
        display?: number | string;
        divisor?: number | string;
        dominantBaseline?: number | string;
        dur?: number | string;
        dx?: number | string;
        dy?: number | string;
        edgeMode?: number | string;
        elevation?: number | string;
        enableBackground?: number | string;
        end?: number | string;
        exponent?: number | string;
        externalResourcesRequired?: Booleanish;
        fill?: string;
        fillOpacity?: number | string;
        fillRule?: "nonzero" | "evenodd" | "inherit";
        filter?: string;
        filterRes?: number | string;
        filterUnits?: number | string;
        floodColor?: number | string;
        floodOpacity?: number | string;
        focusable?: Booleanish | "auto";
        fontFamily?: string;
        fontSize?: number | string;
        fontSizeAdjust?: number | string;
        fontStretch?: number | string;
        fontStyle?: number | string;
        fontVariant?: number | string;
        fontWeight?: number | string;
        format?: number | string;
        from?: number | string;
        fx?: number | string;
        fy?: number | string;
        g1?: number | string;
        g2?: number | string;
        glyphName?: number | string;
        glyphOrientationHorizontal?: number | string;
        glyphOrientationVertical?: number | string;
        glyphRef?: number | string;
        gradientTransform?: string;
        gradientUnits?: string;
        hanging?: number | string;
        horizAdvX?: number | string;
        horizOriginX?: number | string;
        href?: string;
        ideographic?: number | string;
        imageRendering?: number | string;
        in2?: number | string;
        in?: string;
        intercept?: number | string;
        k1?: number | string;
        k2?: number | string;
        k3?: number | string;
        k4?: number | string;
        k?: number | string;
        kernelMatrix?: number | string;
        kernelUnitLength?: number | string;
        kerning?: number | string;
        keyPoints?: number | string;
        keySplines?: number | string;
        keyTimes?: number | string;
        lengthAdjust?: number | string;
        letterSpacing?: number | string;
        lightingColor?: number | string;
        limitingConeAngle?: number | string;
        local?: number | string;
        markerEnd?: string;
        markerHeight?: number | string;
        markerMid?: string;
        markerStart?: string;
        markerUnits?: number | string;
        markerWidth?: number | string;
        mask?: string;
        maskContentUnits?: number | string;
        maskUnits?: number | string;
        mathematical?: number | string;
        mode?: number | string;
        numOctaves?: number | string;
        offset?: number | string;
        opacity?: number | string;
        operator?: number | string;
        order?: number | string;
        orient?: number | string;
        orientation?: number | string;
        origin?: number | string;
        overflow?: number | string;
        overlinePosition?: number | string;
        overlineThickness?: number | string;
        paintOrder?: number | string;
        panose1?: number | string;
        path?: string;
        pathLength?: number | string;
        patternContentUnits?: string;
        patternTransform?: number | string;
        patternUnits?: string;
        pointerEvents?: number | string;
        points?: string;
        pointsAtX?: number | string;
        pointsAtY?: number | string;
        pointsAtZ?: number | string;
        preserveAlpha?: Booleanish;
        preserveAspectRatio?: string;
        primitiveUnits?: number | string;
        r?: number | string;
        radius?: number | string;
        refX?: number | string;
        refY?: number | string;
        renderingIntent?: number | string;
        repeatCount?: number | string;
        repeatDur?: number | string;
        requiredExtensions?: number | string;
        requiredFeatures?: number | string;
        restart?: number | string;
        result?: string;
        rotate?: number | string;
        rx?: number | string;
        ry?: number | string;
        scale?: number | string;
        seed?: number | string;
        shapeRendering?: number | string;
        slope?: number | string;
        spacing?: number | string;
        specularConstant?: number | string;
        specularExponent?: number | string;
        speed?: number | string;
        spreadMethod?: string;
        startOffset?: number | string;
        stdDeviation?: number | string;
        stemh?: number | string;
        stemv?: number | string;
        stitchTiles?: number | string;
        stopColor?: string;
        stopOpacity?: number | string;
        strikethroughPosition?: number | string;
        strikethroughThickness?: number | string;
        string?: number | string;
        stroke?: string;
        strokeDasharray?: string | number;
        strokeDashoffset?: string | number;
        strokeLinecap?: "butt" | "round" | "square" | "inherit";
        strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
        strokeMiterlimit?: number | string;
        strokeOpacity?: number | string;
        strokeWidth?: number | string;
        surfaceScale?: number | string;
        systemLanguage?: number | string;
        tableValues?: number | string;
        targetX?: number | string;
        targetY?: number | string;
        textAnchor?: string;
        textDecoration?: number | string;
        textLength?: number | string;
        textRendering?: number | string;
        to?: number | string;
        transform?: string;
        u1?: number | string;
        u2?: number | string;
        underlinePosition?: number | string;
        underlineThickness?: number | string;
        unicode?: number | string;
        unicodeBidi?: number | string;
        unicodeRange?: number | string;
        unitsPerEm?: number | string;
        vAlphabetic?: number | string;
        values?: string;
        vectorEffect?: number | string;
        version?: string;
        vertAdvY?: number | string;
        vertOriginX?: number | string;
        vertOriginY?: number | string;
        vHanging?: number | string;
        vIdeographic?: number | string;
        viewBox?: string;
        viewTarget?: number | string;
        visibility?: number | string;
        vMathematical?: number | string;
        widths?: number | string;
        wordSpacing?: number | string;
        writingMode?: number | string;
        x1?: number | string;
        x2?: number | string;
        x?: number | string;
        xChannelSelector?: string;
        xHeight?: number | string;
        xlinkActuate?: string;
        xlinkArcrole?: string;
        xlinkHref?: string;
        xlinkRole?: string;
        xlinkShow?: string;
        xlinkTitle?: string;
        xlinkType?: string;
        xmlBase?: string;
        xmlLang?: string;
        xmlns?: string;
        xmlnsXlink?: string;
        xmlSpace?: string;
        y1?: number | string;
        y2?: number | string;
        y?: number | string;
        yChannelSelector?: string;
        z?: number | string;
        zoomAndPan?: string;
    }
    export interface CSSProperties extends Partial<globalThis.CSSStyleDeclaration> { }
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
    luffDate, luffDate as LDate, LuffDate, LibraryArray, LibraryDOM, LibraryString, LibraryBlob, LibraryNumber, LibraryObject, _Culture as Culture, PropTypes, LuffListener, luffLinq,
    FilePicker,

    _IObservableState as IObservableState, _IObservableStateSimple as IObservableStateSimple, _IObservableStateArray as IObservableStateArray, _IObservableStateAny as IObservableStateAny, Dict, DictN,
    TPositionObject, TOffset, TValueName, TIDNamePair,
    _IContent as IContent, JSXElement, IElement, IElementBase, ElementBase, IRenderElement, ComponentFactory,
    State, StateArray, getClosestStateArray,


    //AppSettings,
    //components:
    LuffLoad
}
export default Luff;