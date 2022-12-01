import {LibraryCSS} from "./CSS";
import {TPositionObject, TPositionObjectWithDirection} from "../interfaces";

function _IsVisible(element: Element) {
    let Style = window.getComputedStyle(element);

    let isVisible =  Style.display    !== 'none'
        && Style.visibility !== 'hidden'
        && parseFloat(Style.opacity) !== 0
        && parseFloat(Style.height) + parseFloat(Style.minHeight) !== 0
        && parseFloat(Style.width)  + parseFloat(Style.minWidth)  !== 0;
    //&& ( HTMLElement.tagName.toLowerCase() === 'body' || (HTMLElement.offsetParent !== null && Style.position !== 'fixed'))
    if (Style.position !== 'fixed' || !isVisible)
        return isVisible;

    let rect = element.getBoundingClientRect();
    return rect.left + rect.width > 0 &&  rect.left < document.body.clientWidth
        && rect.top + rect.height > 0 &&  rect.top < document.body.clientHeight;
    //&& (Style.position !== 'fixed' || (Style.position === 'fixed' && ) )
    //jquery
    //return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
}
class ClonedEvent{}


export namespace LibraryDOM {
    //import GetDurationAnimation = LibraryCSS.GetDurationAnimation;
    export const GetDurationAnimation = LibraryCSS.GetDurationAnimation;

    export function Select(query: string | HTMLElement, parent: HTMLElement|Document = document): HTMLElement{
        if (query === '' || query === null)
            return null;
        // if (query instanceof Node && query.parentNode === null)
        //     return null;
        return <HTMLElement>(query instanceof Node ? query : parent.querySelector(query));
    }
    export function SelectAll(query: string | HTMLElement | Document, parent: HTMLElement|Document = document) : HTMLElement[] {
        if (typeof query === undefined)
            return [];
        if (typeof (<HTMLElement>query).tagName !== 'undefined' || (<Document>query) === document)
            return [<HTMLElement>query];
        let nodes = parent.querySelectorAll(<string>query);
        return <HTMLElement[]>Array.from(nodes);
    }
    export function IsQuery(element: HTMLElement | Document, query: string) : boolean {
        if (!element || element === document)
            return false;
        let Elem = <Element>element.cloneNode();
        const Tag = Elem.tagName.toLowerCase();
        let TagParent = 'div';
        if (['tr, th'].indexOf(Tag) > -1 )
            TagParent = 'tr';
        else if (Tag === 'tr')
            TagParent = 'tbody';
        else if (['tbody, thead'].indexOf(Tag) > -1)
            TagParent = 'table';

        const p = document.createElement(TagParent);
        p.appendChild(Elem);
        let elem = LibraryDOM.Select(query, p);

        return elem !== null;
    }
    export function IsElement(obj: any) : boolean {
        return (typeof obj === "object") &&
            (obj.nodeType===1) &&
            (typeof obj.style === "object") &&
            (typeof obj.ownerDocument === "object");
    }
    export function ShowWithAnimation(element: HTMLElement, cssAnimation: string) : void {
        let Duration = GetDurationAnimation(cssAnimation, element);
        element.style.display = '';
        element.classList.add(cssAnimation);
        setTimeout(function () {
            element.classList.remove(cssAnimation);
        }, Duration)
    }
    export function HideWithAnimation(element: HTMLElement, cssAnimation: string) : void {
        let Duration = GetDurationAnimation(cssAnimation, element);
        element.classList.add(cssAnimation);
        setTimeout(function () {
            element.style.display = 'none';
            element.classList.remove(cssAnimation);
        }, Duration)
    }
    export function GetLineID(element: HTMLElement) : number {
        return parseInt(element.dataset['line']);
    }
    export function Print(element: HTMLElement, CSSPrint: string = '') : void {
        let MyWindow = window.open('', 'PRINT');//, 'height=800,width=1000');
        let styles = '';
        for (let i = 0; i < document.styleSheets.length; i++){
            let Sheet = <CSSStyleSheet>document.styleSheets[i];
            if(Sheet.href){
                let rules;
                if (Sheet.rules){
                    rules = Sheet.rules; //chrome
                }
                else if (Sheet.cssRules){
                    rules = Sheet.cssRules; //firefox
                }
                if (!rules){
                    continue;
                }
                for (let j = 0; j < rules.length; j++){
                    if (rules[j].cssText.indexOf("@") < 0) //skip other @media, @key-frames
                        styles += rules[j].cssText;
                }
            }
        }
        styles = `@media print{
                        ${styles}
                        .button-print{display:none!important}
                        ${CSSPrint}
                    }
                    @media screen{
                        ${styles}
                        .button-print{display:none!important}
                        ${CSSPrint}
                    }`;
        //console.log('styles', styles);
        MyWindow.document.write('<html><head><title>' + document.title  + '</title>');

        MyWindow.document.write(`<style>${styles}</style>`);
        MyWindow.document.write('</head><body>');
        MyWindow.document.write(element.innerHTML);
        MyWindow.document.write('</body></html>');

        MyWindow.document.close(); // necessary for IE >= 10
        MyWindow.focus(); // necessary for IE >= 10*/

        MyWindow.print();
        MyWindow.close();
    }
    export function Swap(element1: HTMLElement, element2: HTMLElement){
        const t = element1.parentNode.insertBefore(document.createTextNode(''), element1);
        element2.parentNode.insertBefore(element1, element2);
        t.parentNode.insertBefore(element2, t);
        t.parentNode.removeChild(t);
    }
    export function CreateElementFromString(htmlString: string, parentElementTagName: string = "div") : HTMLElement{
        let frag = document.createDocumentFragment();
        let elem = document.createElement(parentElementTagName);
        elem.innerHTML = htmlString;
        while (elem.childNodes[0]) {
            frag.appendChild(elem.childNodes[0]);
        }
        return <HTMLElement>Array.from(frag.childNodes).find(x=> x.nodeName.indexOf('text') < 0);
    }
    export function InsertAfter(element: Element, referenceNode: Element) : void {
        referenceNode.parentNode.insertBefore(element, referenceNode.nextSibling);
    }
    export function CreateElementsFromString(htmlString: string, parentElementTagName:string = "div") : HTMLElement[] {
        let frag = document.createDocumentFragment();
        let elem = document.createElement(parentElementTagName);
        elem.innerHTML = htmlString;
        while (elem.childNodes[0]) {
            frag.appendChild(elem.childNodes[0]);
        }
        if (frag.childNodes.length > 0)
        {
            let nodes = [];
            for (let i = 0; i < frag.childNodes.length; i++)
                nodes.push(frag.childNodes[i]);
            return <HTMLElement[]>nodes.filter(x => x.nodeName.indexOf('text') < 0);
        }
        return null;
    }
    export function IsDescendant(childElement: Element, ancestor: Element): boolean {
        if (childElement.isSameNode(ancestor))
            return true;
        let ParentCursor = childElement;
        while (ParentCursor){
            if (ParentCursor.isSameNode(ancestor))
                return true;
            ParentCursor = ParentCursor.parentElement;
        }
        return false;
    }
    export function IsVisible(htmlElement: HTMLElement): boolean{
        let isVisible = _IsVisible(htmlElement);
        if (isVisible){
            while (htmlElement.parentElement){
                if (!_IsVisible(htmlElement)){
                    return false;
                }
                htmlElement = htmlElement.parentElement;
            }
        }
        return isVisible;
    }
    export function Closest(element: HTMLElement, query: string): HTMLElement {
        let ElementCursor = element;
        while (ElementCursor){
            if (LibraryDOM.IsQuery(ElementCursor, query))
                return ElementCursor;
            ElementCursor = ElementCursor.parentElement;
        }
        return null;
    }
    export function EventClone(e: Event) {
        let clone:any = new ClonedEvent();
        for (let p in e) {
            let d = Object.getOwnPropertyDescriptor(e, p);
            if (d && (!d.writable || !d.configurable || !d.enumerable || d.get || d.set)) {
                Object.defineProperty(clone, p, d);
            }
            else {
                clone[p] = (<any>e)[p];
            }
        }
        Object.setPrototypeOf(clone, e);
        return clone;
    }
    export function AddEventListenerGlobal(eventName: string, selector: string, handler: (e: Event, d?: any) => void, parent: HTMLElement | Document = document, thisArg?: any ): void {
        parent.addEventListener(eventName, function(e) {
            let target = <Element>e.target;
            let isIt = false;
            let event = EventClone(e);
            let elems = parent.querySelectorAll(selector);
            if (elems[0] === target)
            {
                event.currentTarget = target;
                isIt = true;
            }
            if (!isIt){
                for (let i = 0; i < elems.length; i++){
                    if (elems[i].contains(target)){
                        isIt = true;
                        event.currentTarget = target.closest(selector);
                        break;
                    }
                }
            }
            if (event.target.classList.contains('l-edit-editor')  && eventName === 'click') {
                e.stopPropagation();
                //console.log('stopPropagation', event.target);
                return;
            }
            if (isIt){
                let p: any = {
                    ID: null,
                    LineID: null,
                };
                let ID = event.currentTarget.dataset['id'];
                let LineID = event.currentTarget.dataset['line'];
                if (ID){
                    p.ID = parseInt(ID);
                }

                if (LineID){
                    p.LineID = parseInt(LineID);
                }
                else {
                    let TemplatorLine = event.currentTarget.closest('.l-t-line');
                    if (TemplatorLine){
                        p.LineID = parseInt(TemplatorLine.dataset['line']);
                    }
                }

                handler.call(thisArg? thisArg : event.currentTarget, event, p);
            }
        });
    }

    export function AsyncToggle(thisArg: any, eventArg: any, targetElement: HTMLElement, before: Function, after: Function, cssBefore:string, cssAnimate:string, duration:number, timeout:any): number {
        if (timeout)
            clearTimeout(timeout);
        before.call(thisArg, eventArg);
        if (cssBefore)
            targetElement.classList.remove(cssBefore);
        if (cssBefore === cssAnimate){
            //wait for remove css
            // setTimeout(()=>{
            //     if (CSSAnimate)
            //         Target.classList.add(CSSAnimate);
            //     Timeout = setTimeout(() => {
            //         after.call(Context, Arg);
            //     }, Duration);
            // }, 2);
            //no wait (if wait prev and new content will be blinked)
            if (cssAnimate)
                targetElement.classList.add(cssAnimate);
            timeout = setTimeout(()=>{
                after.call(thisArg, eventArg);
            }, duration);

            return timeout;
        }
        if (cssAnimate)
            targetElement.classList.add(cssAnimate);
        timeout = setTimeout(() => {
            after.call(thisArg, eventArg);
        }, duration);
        return timeout;
    }

    export function GetGlobalElementPositionOverAnother(elementToPosition: HTMLElement, elementOver: HTMLElement, margin: TPositionObject = {x: 0, y: 0 }) : TPositionObjectWithDirection {
        const rectOver = elementOver.getBoundingClientRect();
        const rectPosition = elementToPosition.getBoundingClientRect();
        const rectBody = document.body.getBoundingClientRect();

        // const MIN_HEIGHT = 30;
        // if (rectPosition.height == 0) {
        //     rectPosition.height = MIN_HEIGHT;
        // }

        let x = 0;
        let xDir = "left";
        let y = 0;
        let yDir = "top";
        //x
        if (rectOver.x + rectOver.width + margin.x + rectPosition.width <= rectBody.width) {
            x = rectOver.x + rectOver.width + margin.x;
            xDir = "left";
        } else {
            x = rectOver.x - margin.x - rectPosition.width;
            xDir = "right";
        }
        //y
        if (rectOver.y + rectOver.height + margin.y + rectPosition.height <= rectBody.height - 50) {
            y = rectOver.y + rectOver.height + margin.y;
            yDir = "top";
        } else {
            y = rectOver.y - margin.y - rectPosition.height;
            yDir = "bottom";
        }
        return {
            x: x,
            y: y,
            direction: `${xDir}-${yDir}` as any
        };
    }
    export function GetGlobalElementPositionByCoords(elementToPosition: HTMLElement, pos: TPositionObject) : TPositionObjectWithDirection {
        const rectHint = elementToPosition.getBoundingClientRect();
        const rectBody = document.body.getBoundingClientRect();

        let xDir = "left";
        let yDir = "top";
        //x
        if (pos.x + rectHint.width > rectBody.width) {
            pos.x = pos.x - rectHint.width;
            xDir = "right";
        }
        //y
        if (pos.y + rectHint.height > rectBody.height) {
            pos.y = pos.y - rectHint.height;
            yDir = "bottom";
        }
        return {
            ...pos,
            direction: `${xDir}-${yDir}` as any
        };
    }
}

