import { qFrameCollection } from "./qFrameCollection.js";


function q(selector){
    return new qFrameCollection(selector);
}

// q("div") -> qFrameCollection
// q(document.querySelectorAll("div")) -> qFrameCollection
// q("div").original -> original Array/nodeList
// q("div").each(function(a,b,c){}) a:HTMLElement, b:index, c:original Array -> q("div")
// q("div").text("hah") if arg !== null and undefined change text all divs --- else return first textContent
// q("div"). on/off --- add/remove eventListeners
// q("div").eq(number) -> choose qFrameCollection



export {
    q
}