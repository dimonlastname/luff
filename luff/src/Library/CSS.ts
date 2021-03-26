export namespace LibraryCSS {
    export  function GetStylesBySelector (query: string) : CSSStyleDeclaration {
        for (let i = 0; i < document.styleSheets.length; i++){
            let Sheet = <CSSStyleSheet>document.styleSheets[i];
            if(document.styleSheets[i].href){
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
                    let Rule = <CSSStyleRule>rules[j];
                    if (Rule.selectorText === query)
                        return Rule.style;
                }
            }
        }
        return null;
    }

    export function GetDurationAnimation(CSSAnimation: string, HTMLElement : Element = null) : number {
        let isNull = false;
        if (!HTMLElement){
            isNull = true;
            HTMLElement = document.createElement('div');
            document.body.appendChild(HTMLElement);
        }
        /* Check for CSS animation or transition */
        if (CSSAnimation)
            HTMLElement.classList.add(CSSAnimation);

        let Style        = window.getComputedStyle(HTMLElement);
        let Duration     = eval(Style.transitionDuration.replace('ms', '*1').replace('s', '*1000'));
        let DurationAnim = eval(Style.animationDuration.replace('ms', '*1').replace('s', '*1000'));
        //let Duration     = parseInt(Style.transitionDuration.replace('ms', '*1').replace('s', '*1000').replace(/\*1/g, ''));
        //let DurationAnim = parseInt(Style.animationDuration.replace('ms', '*1').replace('s', '*1000').replace(/\*1/g, ''));
        if (Duration < DurationAnim)
            Duration = DurationAnim;
        if (CSSAnimation)
            HTMLElement.classList.remove(CSSAnimation);
        if (isNull)
            HTMLElement.remove();
        return Duration;
    }
}

