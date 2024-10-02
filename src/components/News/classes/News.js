import Widget from "./Widget.js";
import Request from "./Request.js";

import newsTemplate from "../template/newsTemplate.html";
import newsItemTemplate from "../template/newsItemTemplate.html";
import newsWorker from "../workers/webWorker.worker.js";

export default class News {
    constructor(parentNode) {
        this.parentNode = parentNode ?? document.body;
        this.request = new Request();
        this.newsWidget = new Widget("news", newsTemplate);
        this.errIntervalId = null;
        this.parentNode.appendChild(this.newsWidget.element);
        this.worker$ = new newsWorker();

        this._init();
    }

    _init() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('service-worker.js', {scope: './'}).then(registration => {
                this.serviceWorker$ = registration;
                console.log('SW зарегистрирован:', registration);
              }).catch(error => {
                console.log('Ошибка регистрации SW:', error);
              });
            });
        }

        this.worker$.addEventListener("message",  this.getWorkerMessage.bind(this));

        const btn = this.newsWidget.element.querySelector('.news__update');
        if(btn) {
            btn.addEventListener('click', this.testClick.bind(this));
        } 
    }

    getWorkerMessage(event) {
        try {
            const request = JSON.parse(event.data);

            if(request.status == 'ok') {
                this.renderNews(request.data);
            }
            
            if(request.status == 'error') {
                this.showError(request.message);
            }

        } catch (error) {
            console.log(error);
        }

        this.removeWaitingWiev();
    }

    testClick() {
        this.addWaitingWiev();
        this.worker$.postMessage({ action: 'getNews' });
    }

    renderNews(newsList) {
        //textContent
        const newsListNode = this.newsWidget.element.querySelector('.news__list:not(.pseudo)');
        newsListNode.textContent = '';

        newsList.forEach(newsItem => {
            const formattedDate = new Date(newsItem.data).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(',', '');
            const template = newsItemTemplate.replace('{{date}}', formattedDate).replace('{{desc}}', newsItem?.previewText);
            this.newsWidget.addElement(template, 'beforeend', ".news__list:not(.pseudo)");
        });
    }

    addWaitingWiev() {
        this.newsWidget.element.querySelector('.news__update').classList.add('disable');
        this.newsWidget.element.querySelector('.news__bottom').classList.add('disabled');
        this.newsWidget.addElement("<div class='news__list pseudo'></div>", "beforeend", ".news__bottom");

        for(let i = 0; i < 5; i++) {
            const template = newsItemTemplate.replace('{{date}}', '').replace('{{desc}}', '');
            this.newsWidget.addElement(template, 'beforeend', ".news__list.pseudo");
        }
    }

    showError(error) {
        if(this.errIntervalId) {
            clearInterval(this.errIntervalId);
        }

        if(this.newsWidget.element.querySelector('.err')) {
            this.newsWidget.element.querySelector('.err').remove();
        }

        this.errIntervalId = setInterval(() => {
            this.newsWidget.element.querySelector('.err').remove();
            clearInterval(this.errIntervalId);
        }, 3000);

        this.newsWidget.addElement(`<div class='err'>${error}</div>`, "beforeend", ".news__center");
    }

    removeWaitingWiev() {
        this.newsWidget.element.querySelector('.news__update').classList.remove('disable');
        this.newsWidget.element.querySelector('.news__list.pseudo').remove();
        this.newsWidget.element.querySelector('.news__bottom').classList.remove('disabled');
    }
}