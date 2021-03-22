const ELEMENT_DATA = new WeakMap();
const HIDESHOW_ELEMENT_DATA = new WeakMap();

class qFrameCollection {


    static toNormalElem(something){

        if(typeof something === "string") return new qFrameCollection(something)[0];

        if(something instanceof qFrameCollection) return something.original[0];

        if(something instanceof Element) return something;

        if(something instanceof NodeList) return something[0];

    }

    static HIDESHOW = Symbol("HIDESHOW");

    static isNorm(something){
        return something !== null && something !== undefined;
    }

    static version = "1.0";


    constructor(selector) {
        if(typeof selector === "function")
            return window.addEventListener("load", selector);

        if(selector instanceof qFrameCollection){
            for(let key in selector){
                this[key] = selector[key];
            }
        }

        else if(selector instanceof NodeList || selector instanceof Array){
            selector.forEach( (e,i) => this[i] = e );
        }

        else if(selector instanceof Node){
            this[0] = selector;
        }

        else if(typeof selector === "string" && selector.includes("<")){
            let elem = document.createElement("div");
            elem.innerHTML = selector;
            elem.childNodes.forEach( (e, i) => this[i] = e);
        }

        else {
            document.querySelectorAll(selector).forEach( (e, i) => this[i] = e);
        }
    }


    get original(){
        return Object.values(this).filter( e => e instanceof Element);
    }
    get length(){
        return Object.keys(this).filter( e => !Number.isNaN(+e) ).length;
    }


    each(fn){
        this.original.forEach(fn);
        return this;
    }
    filter(fn){
        return new qFrameCollection(this.original.filter(fn));
    }
    sort(fn){
        return new qFrameCollection(this.original.sort(fn));
    }
    slice(start, end){
        return new qFrameCollection(this.original.slice(start, end));
    }
    findIndex(predicate, thisArgs){
        return this.original.findIndex(predicate, thisArgs);
    }



    q(selector){
        return new qFrameCollection(this[0].querySelectorAll(selector));
    }


    Ohtml(outerHTMLText){
        if(qFrameCollection.isNorm(innerHTMLText)){
            for(let el of this.original){
                el.outerHTML = outerHTMLText;
            }
            return this;
        }
        return this[0].outerHTML;
    }
    html(innerHTMLText){
        if(qFrameCollection.isNorm(innerHTMLText)){
            for(let el of this.original){
                el.innerHTML = innerHTMLText;
            }
            return this;
        }
        return this[0].innerHTML;
    }
    text(text){
        if(qFrameCollection.isNorm(text)){
            for(let el of this.original){
                el.textContent = text;
            }
            return this;
        }
        return this[0].textContent;
    }
    val(value){
        if(qFrameCollection.isNorm(value))
            return this[0].value;

        for(let el of this.original){
            el.value = value;
        }
        return this;
    }
    empty(){
        for(let el of this.original){
            el.innerHTML = "";
        }
        return this;
    }
    attr(name, value){
        let nameisNorm = qFrameCollection.isNorm(name);
        let valueisNorm = qFrameCollection.isNorm(value);

        if(nameisNorm && valueisNorm){
            for(let el of this.original){
                el.setAttribute(name, value);
            }
            return this;
        }

        else if(nameisNorm && !valueisNorm){
            return this[0].getAttribute(name);
        }

        else if(!nameisNorm && !valueisNorm){
            return this[0].getAttributeNames();
        }
    }
    data(key, value){
        let localData = ELEMENT_DATA.get(this[0]);

        if(!localData){
            localData = {};
            ELEMENT_DATA.set(this[0], localData);
        }


        if(qFrameCollection.isNorm(key) && value !== undefined){
            localData[key] = value;
            return this;
        }

        if(qFrameCollection.isNorm(key) && !qFrameCollection.isNorm(value)){
            return localData[key];
        }

        return localData;
    }


    on(type, listener, options){
        for(let el of this.original){
            el.addEventListener(type, listener, options)
        }
        return this;
    }
    off(type, listener, options){
        for(let el of this.original){
            el.removeEventListener(type, listener, options)
        }
        return this;
    }
    eq(index){
        if(index < 0) index += this.length;
        return new qFrameCollection(this[index]);
    }


    addClass(...classNames){
        for(let el of this.original){
            el.classList.add(classNames);
        }
        return this;
    }
    removeClass(...classNames){
        for(let el of this.original){
            el.classList.remove(classNames);
        }
        return this;
    }
    hasClass(className){
        return this.original.classList.inclides(className);
    }
    toggleClass(...classNames){
        for(let el of this.original){
            classNames.forEach( e =>{
                el.toggleClass(e);
            });
        }
        return this;
    }


    next(){
        return this.nextElementSibling;
    }
    prev(){
        return this.previousElementSibling;
    }
    last(){
        return new qFrameCollection(this[this.length - 1]);
    }
    first(){
        return new qFrameCollection(this[0]);
    }


    remove(){
        for(let el of this.original){
            el.remove();
        }
        return this;
    }


    width(px){
        if(qFrameCollection.isNorm(px))
            return this[0].offsetWidth;

        for(let el of this.original){
            el.style.width = `${px}px`;
        }
        return this;
    }
    height(px){
        if(qFrameCollection.isNorm(px))
            return this[0].offsetHeight;

        for(let el of this.original){
            el.style.height = `${px}px`;
        }
        return this;
    }
    css(styleObject){
        for(let el of this.original){
            for(let key in styleObject){
                el.style[key] = styleObject[key];
            }
        }
        return this;
    }
    animate(styleObject, time) {
        for(let el of this.original){
            clearTimeout(HIDESHOW_ELEMENT_DATA.get(el));

            let trans = el.style.transition;

            HIDESHOW_ELEMENT_DATA.set(el, setTimeout( () => {
                el.style.transition = trans;
            }, time));

            el.style.transition = `all ${time}ms`;
            for(let key in styleObject){
                el.style[key] = styleObject[key];
            }
        }
        this.ready = new Promise( res => {
            setTimeout( () => {
                res(this);
            }, time);
        });
        return this;
    }
    hide(ms){
        this.each( e => {
            clearTimeout(HIDESHOW_ELEMENT_DATA.get(e));

            q(e).animate({
                opacity: 0
            }, ms);


            HIDESHOW_ELEMENT_DATA.set(e, setTimeout( () => {
                e.hidden = true;
            }, ms));
        });

        this.ready = new Promise( res => {
            setTimeout( () => {
                res(this);
            }, ms);
        });

        return this;
    }
    show(ms){
        this.each( e => {
            clearTimeout(HIDESHOW_ELEMENT_DATA.get(e));
            e.hidden = false;
            e.style.opacity = "0";
            setTimeout(()=>{
                e.style.transition = `opacity ${ms}ms`;
                e.style.opacity = "1";
            }, 0);
        });

        this.ready = new Promise( res => {
            setTimeout( () => {
                res(this);
            }, ms);
        });

        return this;
    }


    appendTo(element){
        let normalElem = qFrameCollection.toNormalElem(element);
        for(let el of this.original){
            normalElem.append(el);
        }
        return this;
    }


    parent(){
        return this[0].parentElement;
    }


    clone(deep){
        return new qFrameCollection(this.original.cloneNode(deep));
    }


}
export {
    qFrameCollection
};

