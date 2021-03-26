import {Dict, IObservableStateSimple, IObservableState} from "../../interfaces";
import {TRawComponent} from "./IElement";
import {ComponentFactory} from "../Compiler/ComponentFactory";
import {State} from "../State";
import {LibraryDOM, LibraryObject} from "../../Library";
import {CasualMountingBase} from "./CasualMountingBase";

const eventNames = ["onabort", "onblur", "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick", "onclose",
    "oncontextmenu", "oncuechange", "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover",
    "ondragstart", "ondrop", "ondurationchange", "onemptied", "onended", "onerror", "onfocus", "oninput", "oninvalid",
    "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata", "onloadedmetadata", "onloadstart", "onmousedown",
    "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onmousewheel",
    "onoperadetachedviewchange", "onoperadetachedviewcontrol", "onpause", "onplay", "onplaying", "onprogress",
    "onratechange", "onreset", "onresize", "onscroll", "onseeked", "onseeking", "onselect", "onstalled", "onsubmit",
    "onsuspend", "ontimeupdate", "ontoggle", "onvolumechange", "onwaiting", "onwheel", "onauxclick",
    "ongotpointercapture", "onlostpointercapture", "onpointerdown", "onpointermove", "onpointerup", "onpointercancel",
    "onpointerover", "onpointerout", "onpointerenter", "onpointerleave", "onbeforecopy", "onbeforecut", "onbeforepaste",
    "oncopy", "oncut", "onpaste", "onsearch", "onselectstart", "onwebkitfullscreenchange", "onwebkitfullscreenerror",

];
const SpecialProperties = ['value', 'checked', 'disabled', 'selected', 'indeterminate', 'defaultchecked'];
const forbidden = ['children'];

const attNativeByReact = {
    className: 'class',
    // colSpan: 'colspan',
    // rowSpan: 'rowspan',
    // onClick: 'onclick',
    // onChange: 'onchange',
    onDoubleClick: 'ondblclick',
};

enum AttributeType {
    Casual = 0,
    Property = 1,
    StyleProperty = 2,
    CSSVariable = 3,
    ClassName = 4,
}


type TAttributeItem = {
    Name: string;
    Gen: TGen;
    LastVal: string;
    Type: AttributeType;
}
type TGen = () => string

// function setCaretPosition(elem: HTMLInputElement, caretPos: number) {
//
//     if(elem != null) {
//         if(elem.createTextRange) {
//             let range = elem.createTextRange();
//             range.move('character', caretPos);
//             range.select();
//         }
//         else {
//             if(elem.selectionStart) {
//                 elem.focus();
//                 elem.setSelectionRange(caretPos, caretPos);
//             }
//             else
//                 elem.focus();
//         }
//     }
// }


class CasualComponent extends CasualMountingBase {
    private _Attributes: TAttributeItem[] = [];
    private _AttributeByName: Dict<TAttributeItem> = {};
    private _EventListeners: Dict<any> = {};
    //private PermissionAttributeName: string = null;

    private _SetClassName(className: string, isSet: boolean) : void {
        if (isSet) {
            this.DOM.classList.add(className);
        } else {
            this.DOM.classList.remove(className);
        }
    }
    private _SetAttribute(attName: string, attributeType: AttributeType, attValue: any) : void {
        if (attributeType === AttributeType.Casual)
            this.DOM.setAttribute(attName, attValue);
        else if (attributeType === AttributeType.Property)
            this.DOM[attName] = attValue;
        else if (attributeType === AttributeType.StyleProperty)
            this.DOM.style[attName] = attValue;
        else if (attributeType === AttributeType.CSSVariable)
            this.DOM.style.setProperty(attName, attValue);
        else if (attributeType === AttributeType.ClassName)
            this._SetClassName(attName, attValue);
    }
    private _RefreshAttributeValue(attName: string, attributeType: AttributeType) : void {
        if (!this.DOM) //if state updated before first render called
            return;

        let att = this._AttributeByName[attName];
        let attVal = att.Gen();
        if (att.LastVal != attVal) {
            att.LastVal = attVal;
            this._SetAttribute(attName, attributeType, attVal);
        }
    }
    private _CompileSingleAttribute(attName: string, attValue: any, attributeType: AttributeType) : void {
        let gen;

        if (eventNames.indexOf(attName.toLowerCase()) > -1) { //onclick, onchange, etc.\
            this._EventListeners[attName.substring(2).toLowerCase()] = attValue;
            return;
        }

        if (attValue instanceof State){
            let state: State = attValue as State;
            gen = () => {
                return state.SValue;
            };

            state._AddOnChange(() => this._RefreshAttributeValue(attName, attributeType));
        }
        else { // just text
            gen = () => {
                return attValue;
            }
        }
        const att : TAttributeItem = {
            Name: attName,
            Gen: gen,
            LastVal: gen(),
            Type: attributeType,
        };
        this._Attributes.push(att);
        this._AttributeByName[attName] = att;
    }
    private _CompileClassDictAttribute(classes: Dict<IObservableStateSimple<boolean>>) : void {
        const classNames = Object.getOwnPropertyNames(classes);

        for (let className of classNames) {
            let isClass = classes[className];
            this._CompileSingleAttribute(className, isClass, AttributeType.ClassName);
        }
    }

    private _CompileStyleAttributes(styleAttribute: Dict<string | IObservableStateSimple<string>> | IObservableState<Dict<string>>) {
        let styleProps;

        //case 1: state of value (style={Luff.State('sdf')})
        //case 2: state of object (style={Luff.State({left: '12px'})})
        //case 3: object of states (style={{left: Luff.State('12px')}})

        if (styleAttribute instanceof State) {
            if (typeof styleAttribute.SValue !== 'object') {
                //case 1
                this._CompileSingleAttribute('style', styleAttribute, AttributeType.Casual);
                return;
            }
            else {
                //case 2
                styleProps = Object.getOwnPropertyNames(styleAttribute.SValue);
            }

        }
        else {
            //case 3
            styleProps = Object.getOwnPropertyNames(styleAttribute);
        }
        for (let attName of styleProps) {
            const attValue = styleAttribute[attName];
            this._CompileSingleAttribute(attName, attValue, attName.indexOf('--') === 0 ? AttributeType.CSSVariable : AttributeType.StyleProperty);
        }
    }

    private _CompileAttributes(){
        for (let attName in this._RawComponent.Attributes) {
            if (forbidden.includes(attName))
                continue;

            let attValue = this._RawComponent.Attributes[attName];
            if (attNativeByReact[attName])
                attName = attNativeByReact[attName];

            if (attValue === void 0 || attValue === null)
                continue;


            if (attName === 'style' && typeof attValue === 'object' /*&& !(attValue instanceof State)*/) {
                this._CompileStyleAttributes(attValue);
                continue;
            }
            if (attName === 'classDict') {
                this._CompileClassDictAttribute(attValue);
                continue
            }
            let attributeType = AttributeType.Casual;
            if (SpecialProperties.includes(attName)) {
                attributeType = AttributeType.Property;
            }
            this._CompileSingleAttribute(attName, attValue, attributeType);
        }

    }

    private _CompileChildren() {

        for (let child of this._RawComponent.Children) {
            let elem = ComponentFactory.Build(child, this, this.ParentComponent);
            if (elem) {
                this.Children.push(elem);
            }

        }
    }

    private _GenerateAttributes(){
        for (let att of this._Attributes) {
            this._SetAttribute(att.Name, att.Type, att.Gen());
        }
    }
    private _GenerateEventListeners(){
        for( let eventName of Object.getOwnPropertyNames(this._EventListeners)){
            let fn = this._EventListeners[eventName];

            if (eventName == 'change' && this.Tag === 'input') {
                const dom = this.DOM as HTMLInputElement;
                if (this._AttributeByName['value']) {
                    if (dom.type === 'text') {
                        const onInput = (e: KeyboardEvent) => {
                            const valuePrev = this._AttributeByName['value'].Gen();

                            let eventCloned = LibraryDOM.EventClone(e);
                            let caretPosition = dom.selectionStart;

                            fn.call(this.ParentComponent, eventCloned);
                            const valueNew = this._AttributeByName['value'].Gen();
                            if (valuePrev === valueNew && caretPosition > 0) {
                                caretPosition--;
                            }
                            dom.value = valueNew;
                            dom.setSelectionRange(caretPosition, caretPosition);
                        };

                        this.DOM.addEventListener('input', onInput);
                        continue
                    }

                }
                eventName = 'input';
            }

            this.DOM.addEventListener(eventName, (e: Event) => {
                fn.call(this.ParentComponent, e);
            });
        }
    }
    private _GenerateChildren(){
        for (let ch of this.Children){
            if (!ch.HasPermission)
                continue; //Luff.Content permission from ctor;
            ch._GenerateDOM();
            ch._Mount(true);
        }
    }

    _Dismount() : void {
        this._IsMount = false;
        this.DOM.remove();
    }

    _HideTransitionFunction() {
        this._IsShown = false;
        this._Dismount();
    }
    _ShowTransitionFunction() {
        this._IsShown = true;
        this._Mount();
    }


    _GenerateDOM() : HTMLElement {
        super._GenerateDOM();
        this.DOM = document.createElement(this.Tag);
        this._GenerateAttributes();
        this._GenerateEventListeners();
        this._GenerateChildren();
        return this.DOM;
    }

    constructor(rawComponent: TRawComponent) {
        super(rawComponent);
        if (!this.HasPermission) {
            return;
        }
        this._CompileAttributes();
        this._CompileChildren();
    }
}

export {CasualComponent, eventNames, SpecialProperties}