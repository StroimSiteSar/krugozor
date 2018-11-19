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
    
    console.dir(topNavbarBtn);
});