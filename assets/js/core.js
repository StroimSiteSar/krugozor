"use strict";
//Функция аккордеона. Переключает класс .active между элементами, на активный
function accordeonClass(collection, item) {
    collection.forEach(function(item){
        item.classList.remove('active');
    })
    item.classList.add('active');
}

//Счетчик, на вход которого можно подавать стартовое значение
//По умолчанию стартовое значение равно нулю
function Counter(number) {
    let count = number || 0;

    this.plus = () => count++;

    this.minus = () => count--;

    this.getCount = () => count;

    this.setCount = (index) => count = index; 
}

//Класс Слайдер, на вход которого подаются: количество слайдов, стартовое значение
//Таймер: автопереключение В СЕКУНДАХ(если не нужен, просто подать 0)!!!
function Slider(quantity, number = 0) {
    Counter.apply(this);

    const that = this;

    this.setCount(number);

    this.show = () => that.getCount();

    this.check = function () {
        if (that.getCount() >= quantity) {
            that.setCount(0);
        } 
        if (that.getCount() < 0) {
            that.setCount(quantity - 1);
        }
        that.show();
    }

    this.next = function() {
        that.plus();
        that.check();
    }

    this.prev = function(){
        that.minus();
        that.check();
    }

    this.timer = (time) => setInterval(() => that.next(), time*1000);
}

//В данном слайдере используется:
//1) кнопочное переключение, 2) автопереключение 3) возможность задать стартовый итем
//Подается: коллекция слайдов, первичный слайд, таймер(в секундах), и кнопочки переключения
//На выходе получаем самый просто слайдер где один блок получает класс active, а остльное поведение описывает css
function EasySlider(items, number = 0, time, btnPrev, btnNext) {
    Slider.apply(this, [items.length, number]);
    const that = this;

    this.display = function() {
        accordeonClass(items, items[that.show()]);
    }

    btnPrev.onclick = function() {
        that.prev();
        that.display();
    }
    btnNext.onclick = function() {
        that.next();
        that.display();
    }

    if(time) {
        this.timer(time);
        setInterval(() => this.display(), time*1000);
    }
}

/*
    Dot slider:
    slider = {
        items: [], //Коллекция слайдов
        container: document.querySelector(''),  //Контейнер для точек
        dotClass: 'имя класса для точек',
        timer: num, //время автопереключения слайдов в секундах
        startWith: num //стартовый слайд
    }
*/

function DotSlider(slider) {
    let items = [...slider.items];
    let time = +slider.timer || 0;
    let number = slider.startWith || 0;
    let dots = [];
    
    Slider.apply(this, [items.length, number]);
    const that = this;
    
    this.display = function() {
        accordeonClass(items, items[that.show()]);
        accordeonClass(dots, dots[that.show()]);
    }
    
    function createDot(container, className, number) {
        let dot = document.createElement('div');
        dot.classList.add(className);
        
        dot.onclick = function(){
            that.setCount(number);
            that.display();
        }
        
        dots.push(dot);
        
        container.appendChild(dot);
        
    }
    
    for (let i=0; i<items.length; i++) {
        createDot(slider.container, slider.dotClass, i);
    }
    
    if(time) {
        this.timer(time);
        setInterval(() => this.display(), time*1000);
    }
}

//Для всех страниц
document.addEventListener('DOMContentLoaded', function () {
    let topNavbar = document.querySelector('.header-list');
    let topNavbarBtn = document.querySelector('.header-list__open');
    topNavbarBtn.status = false;
    
    topNavbarBtn.onclick = function() {
        this.status = !this.status;
        this.status ? this.innerText = 'Скрыть' : this.innerText = 'Меню';
        topNavbar.classList.toggle('active');
    }
    
    //модалка
    let modal = document.querySelector('.modal');
    let modalClose = document.querySelector('.modal-close');
    
    function closeModal() {
        modal.classList.remove('active');
        [...modal.children].forEach((item) => item.classList.remove('active'));
    }
    
    modal.onclick = closeModal;
    modalClose.onclick = closeModal;
    
    let convertingBtn = document.querySelector('.aside-converter');
    let modalConverter = document.querySelector('.modal-converter');
    
    convertingBtn.onclick = function() {
        modal.classList.add('active');
        modalConverter.classList.add('active');
    }
});

//Для главной страницы
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.home-slider')){
        const homeSlider = new DotSlider({
            items: document.querySelectorAll('.home-slider__items img'),
            container: document.querySelector('.home-slider__controls'),
            dotClass: 'home-slider__controls-dot',
            timer: 3,
            startWith: 0
        });
        homeSlider.display();
    }
});

//Для страницы новостей
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.news')){
        let newsWrapper = document.querySelector('.all-news');
        let allNews = [...newsWrapper.children];
        
        function ajaxGet(url, callback) {
            var request = new XMLHttpRequest();
            
            request.onreadystatechange = function() {
                if(request.readyState == 4 && request.status){
                    callback(request.responseText)
                }
            }
            
            request.open('GET', url);
            request.send();
        }
        
        
        //функция создания тэга
        function addNode(tag, insideHtml, tagClass = [], ...newAttribute){
            let newTag = document.createElement(tag);
            newTag.innerHTML = insideHtml;
            if (!tagClass == []) {
                newTag.classList.add(...tagClass);
            }
            if (newAttribute) {
                [...newAttribute].forEach(function(attr){
                    let attrParams = attr.split('=');
                    newTag.setAttribute(attrParams[0], attrParams[1]);
                })
            }

            return newTag;
        }

        function createArticle(article){
            let gridElement = addNode('div', '', ["col-sm-6","col-lg-12","col-xl-6"]);
            let newItem = addNode('div', '', ["news-item"]);
            let imgWrap = addNode('div', '', ["news-item__img"]);
            let textWrap = addNode('div', '', ["news-item__text"]);
            
            gridElement.appendChild(newItem);
            newItem.appendChild(imgWrap);
            newItem.appendChild(textWrap);
            imgWrap.appendChild(addNode('img', '', '', `src=${article.img}`));
            textWrap.appendChild(addNode('h3', article.title, ["news-item__text-title"]));
            textWrap.appendChild(addNode('p', article.text, ["news-item__text-desc"]));
            textWrap.appendChild(addNode('a', 'подробнее', ["news-item__text-link"], `href=${article.link}`));
            
            return gridElement;
        }
        
        let openBtn = document.querySelector('.news-open-all');
        openBtn.onclick = function() {
            for(let i=0; i<6; i++){
                ajaxGet('ip.php', function(data){
                    let parsingArticle = JSON.parse(data);
                    newsWrapper.appendChild(createArticle(parsingArticle));
                });
            }
        }
    }
});


//Для страницы с турами
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.all-tours')){
        let toursWrapper = document.querySelector('.all-tours');
        let allTours = [...toursWrapper.children];
        let openBtn = document.querySelector('.tour-open-all');
        
        openBtn.onclick = function() {
            allTours.forEach(function(item) {
                item.style.display = 'block';
            });
            this.style.display = 'none';
        }
    }
});

//Для странице с экскурсией
document.addEventListener('DOMContentLoaded', function () {
    let triggers = document.querySelectorAll('.trigger-btn');
    let switchSpaces = document.querySelectorAll('.excurs-content__item');
    
    for (let i=0; i<triggers.length; i++) {
        triggers[i].num = i;
        switchSpaces[i].num = i;
        
        triggers[i].onclick = function() {
            accordeonClass(triggers, triggers[i]);
            accordeonClass(switchSpaces, switchSpaces[i]);
        }
    }
    
    
    let gallery = document.querySelector('.excurs-content__desc-gallery');
    let modal = document.querySelector('.modal');
    let modalGallery = modal.querySelector('.modal-gallery');
    let modalGalleryPull = document.querySelector('.modal-gallery__pull');
    let modalGalleryPrev = modal.querySelector('.modal-gallery__arrow-left');
    let modalGalleryNext = modal.querySelector('.modal-gallery__arrow-right');
    
    modalGallery.onclick = (event) => event.stopPropagation();
    
    if(gallery) {
        gallery.onclick = function() {
            modal.classList.add('active');
            modalGallery.classList.add('active');

            let images = [...gallery.children];

            images.forEach(function(img){
                let galleryItem = document.createElement('img');
                galleryItem.setAttribute('src', img.src);

                modalGalleryPull.appendChild(galleryItem);
            });

            modalGalleryPull.firstElementChild.classList.add('active');

            let gallerySlider = new EasySlider([...modalGalleryPull.children], 0, 3, modalGalleryPrev, modalGalleryNext)
        }
    }
});