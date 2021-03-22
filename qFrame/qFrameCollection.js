class qFrameCollection {
    constructor(selector) {
        if(typeof selector === "function")
            return window.addEventListener("load", selector);

        if(selector instanceof NodeList){
            selector.forEach( (e,i) => this[i] = e );
        } else if(selector instanceof Element){
            this[0] = selector;
        } else if(typeof selector === "string" && selector.includes("<")){
            let elem = document.createElement("div");
            elem.innerHTML = selector;
            elem.childNodes.forEach( (e, i) => this[i] = e);
        } else {
            document.querySelectorAll(selector).forEach( (e,i) => this[i] = e);
        }
    }


    get original(){
        return Object.values(this).filter( e => e instanceof Element);
    }
    get length(){
        return Object.keys(this).filter( e => !Number.isNaN(+e) ).length;
    }


    each(fn){
        let i = 0;
        let original = this.original;
        for(let el of original){
            fn(el, i, original);
            i++;
        }
        return this;
    }
    text(text){
        if(text !== undefined && text !== null){
            for(let el of this.original){
                el.textContent = text;
            }
            return this;
        }
        return this[0].textContent;
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
    previous(){
        return this.previousElementSibling;
    }
    last(){
        return new qFrameCollection(this[this.length - 1]);
    }
    first(){
        return new qFrameCollection(this[0]);
    }
}
export {
    qFrameCollection
};

