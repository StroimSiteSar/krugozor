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
//В данном счетчике используется:
//1) кнопочное переключение, 2) возможность задать стартовое значение 3) только положительные числа
//Подается: первичный итем, инпут отображения, и кнопочки итерации
//На выходе получаем самый простой счетчик, который при необходимости может отдавать команду при изменении значения
function EasyCounter(number, display, btnPlus, btnMinus) {
    Counter.apply(this, [number]);
    const that = this;

    btnPlus.onclick = function() {
        that.plus();
        that.display();
    }

    btnMinus.onclick = function() {
        that.minus();
        that.display();
    }

    this.display = function() {
        (that.getCount() >= 0) ? display.value = that.getCount() : (display.value = '0', that.setCount(0));
        display.onchange();
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

document.addEventListener('DOMContentLoaded', function () {
        
});


//Я странице с экскурсией
document.addEventListener('DOMContentLoaded', function () {
    let triggers = document.querySelectorAll('.trigger-btn');
    let switchSpaces = document.querySelectorAll('.excurs-content__item');
    
    for (let i=0; i<triggers.length; i++) {
        console.log(triggers[i]);
        triggers[i].num = i;
        console.log(switchSpaces[i]);
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
    
});