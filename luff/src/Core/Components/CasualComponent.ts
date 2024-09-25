import {Dict, IObservableStateSimple, IObservableState, IObservableStateArray} from "../../interfaces";
import {TRawComponent} from "./IElement";
import {ComponentFactory, IRenderElement} from "../Compiler/ComponentFactory";
import {luffState, State} from "../State";
import {LibraryDOM, LibraryObject} from "../../Library";
import {CasualMountingBase} from "./CasualMountingBase";
import {ElementBase} from "./ElementBase";
import {when} from "q";

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

    private _SetClassName(className: string, isSet: boolean) : void  {
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
        if (att.LastVal !== attVal) {
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
        if (typeof attValue === 'object' && attValue.Tag && typeof attValue.Tag === 'function' && attValue.Tag.prototype instanceof ElementBase) {
            // if (attValue is IRenderElement)
            attValue = ComponentFactory.Build(attValue as IRenderElement, this, this.ParentComponent).Render();
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

    // private _CompileClassListAttribute(classes: Array<IObservableStateSimple<string>>) : void {
    //     const classList = luffState(classes.reduce((a, b) => a + ' ' + b,''));
    //     for (let st of classes) {
    //         st.AddOnChange(() => classList.SValue = classes.reduce((a, b) => a + ' ' + b,''));
    //     }
    //
    //
    //     for (let className of classNames) {
    //         let isClass = classes[className];
    //         this._CompileSingleAttribute(className, isClass, AttributeType.ClassName);
    //     }
    // }

    private _CompileClassAttributes(attributes: Dict<any>) : void {
        if (!attributes)
            return;
        //let classStaticAttValue = attributes['classStatic'] || '';
        let classAttValue = attributes['className'];
        if (!classAttValue)
            classAttValue = attributes['class'];
        classAttValue = classAttValue ? classAttValue : '';

        const classDictAttValue = attributes['classDict'] as Dict<any>;
        const classListAttValue = attributes['classList'];

        delete attributes['class'];
        delete attributes['className'];
        delete attributes['classDict'];
        delete attributes['classList'];


        if (!classDictAttValue && !classListAttValue) {
            this._CompileSingleAttribute('class', classAttValue, AttributeType.Casual);
            return;
        }

        let classState = luffState('');
        if (classAttValue instanceof State) {
            classState.SValue = classAttValue.SubState(cls => cls + '');

        } else {
            this._CompileClassDictAttribute(classDictAttValue);
        }

        let deps = [];
        function getAtt() {
            let val = '';
            if (classAttValue instanceof State) {
                val += classAttValue.SValue;
                deps.push(classAttValue);
            } else {
                val += classAttValue;
            }

            if (classDictAttValue) {
                const classNames = Object.getOwnPropertyNames(classDictAttValue);

                for (let className of classNames) {
                    let isClass = classDictAttValue[className];
                    if (!isClass)
                        continue;

                    if (isClass.SValue) {
                        val += ' ' + className;
                    }
                    deps.push(isClass);
                }
            }
            return val;
        };

        let stateClass = luffState(getAtt.call(this));
        const onChange = () => stateClass.SValue = getAtt.call(this);

        for (let dep of deps) {
            dep.AddOnChange(onChange);
        }
        this._CompileSingleAttribute('class', stateClass, AttributeType.Casual);
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
        this._CompileClassAttributes(this._RawComponent.Attributes);

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

            if (attName === 'class') {

            }
            if (attName === 'classDict') {
                this._CompileClassDictAttribute(attValue);
                continue
            }
            // if (attName === 'classList') {
            //     this._CompileClassListAttribute(attValue);
            //     continue
            // }
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
        const dom = this.DOM as HTMLInputElement;
        const tag = this.Tag;
        const type = this._AttributeByName['type']?.Gen();
        let resetValue : Function;
        if (tag === 'input') {
            switch (type) {
                case 'radio':
                case 'checkbox':
                    resetValue = function () {
                        dom.checked = this.props.checked.SValue;
                    };
                    break;
                case 'text':
                case 'number':
                    resetValue = function () { };
                    break;
                case 'password':
                case 'email':
                case 'tel':
                case 'url':
                case 'date':
                case 'datetime-local':
                case 'time':
                case 'color':
                case 'month':
                case 'search':
                case 'week':
                    resetValue = function () {
                        dom.value = this.props.value.SValue;
                    };
                    break;
                default:
                    resetValue = function () { };
                    break;
            }
        }

        for( let eventName of Object.getOwnPropertyNames(this._EventListeners)){
            let fn = this._EventListeners[eventName];


            if (eventName == 'change' && tag === 'input') {

                if (this._AttributeByName['value']) {
                    if (dom.type === 'text') {
                        const onInput = (e: KeyboardEvent) => {
                            const valuePrev = this._AttributeByName['value'].Gen();

                            let eventCloned = LibraryDOM.EventClone(e);
                            eventCloned.preventDefault = () => e.preventDefault();
                            eventCloned.stopPropagation = () => e.stopPropagation();
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
                this.DOM.addEventListener('input', (e: Event) => {
                    fn.call(this.ParentComponent, e);
                    resetValue.call(this);
                });
                continue
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