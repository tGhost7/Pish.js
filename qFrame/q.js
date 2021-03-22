import { qFrameCollection } from "./qFrameCollection.js";


function q(selector){
    return new qFrameCollection(selector);
}


let qFrame = q;

export {
    q,
    qFrame
}