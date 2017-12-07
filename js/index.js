import $ from "jquery";
'use strict';
let currentState;
export const getInitState = _ => {
    const localFile = new XMLHttpRequest();
    localFile.open("GET", data, false);
    localFile.onreadystatechange = _ => {
        if (localFile.readyState === 4) {
            if (localFile.status === 200 || localFile.status === 0) {
                Papa.parse(localFile.responseText, {
                    complete: result => {
                        currentState = result;
                    }
                });
            }
        }
    };
    localFile.send(null);
};
export const setState = data => {

};

window.onload = () => {
    getInitState();
};
function rewriteDOMForEdit() {
    $('.table__row .table__cell').each(el => {
        console.log(el);
    });
}

