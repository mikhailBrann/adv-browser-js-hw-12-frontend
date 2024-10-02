export default class Widget {
    constructor(elementSelector="widget", template=null, elementType="div") {
        this.element = document.createElement(elementType);
        this.element.classList.add(elementSelector);

        if (template) {
            this.element.insertAdjacentHTML("afterbegin", template);
        }
    }

    addElement(html, position='beforeend', parentSelector=null) {
        if(!parentSelector) {
            this.element.insertAdjacentHTML(position, html);
            return;
        }
        
        this.element.querySelector(parentSelector).insertAdjacentHTML(position, html);
    }
}