$(document).ready(() => {
    'use strict';

    $('#number').mask('+7(999) 999-99-99');

    $('.mint-slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear'
    });

    $('.reviews').slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        responsive: [
            {
                breakpoint: 579,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
        ]
    });

    new WOW({
        animateClass: 'animate__animated'
    }).init();

    let menu = $('.menu-adaptive');
    let loader = $('.loader');
    let sent = $('#reservation-sent');
    let order = $('.order-form');

    $('#burger').click(() => {
        menu.css('display', 'flex');
    });

    $('.menu-adaptive a').click(() => {
        menu.css('display', 'none');
    });

    $('#close').click((e) => {
        if (e.target.id === 'close') {
            menu.hide();
        }
    });

    $('#reserve-button').click(() => {

        $('.reserve-error').hide();

        let name = $('#name');
        let number = $('#number');
        let time = $('#time');

        name.css('border-color', 'rgb(255, 255, 255)');
        number.css('border-color', 'rgb(255, 255, 255)');
        time.css('border-color', 'rgb(255, 255, 255)');

        let hasError = false;

        if (!name.val()) {
            name.siblings('.reserve-error').show();
            name.css('border-color', 'red');
            hasError = true;
        }
        if (!number.val()) {
            number.siblings('.reserve-error').show();
            number.css('border-color', 'red');
            hasError = true;
        }
        if (!time.val()) {
            time.siblings('.reserve-error').show();
            time.css('border-color', 'red');
            hasError = true;
        }


        if (!hasError) {
            loader.css('display', 'flex');
            $.ajax({
                type: 'post',
                url: 'https://testologia.site/checkout',
                data: {name: name.val(), number: number.val(), time: time.val()}
            })
                .done(function (message) {
                    loader.hide();
                    if (message.success) {
                        let text = $('#time').val();
                        let today = new Date();
                        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                        let todayStr = today.toLocaleDateString('ru-Ru', options);
                        $('.time-sent').text(text);
                        $('#date-time').text(todayStr);
                        order.hide();
                        sent.show();
                        $('#close-reserve').click((e) => {
                            if (e.target.id === 'close-reserve') {
                                let inputs = document.querySelectorAll('input[type=text]');
                                let inputTime = document.querySelectorAll('input[type=time]');
                                for (var i = 0;  i < inputs.length; i++) {
                                    inputs[i].value = '';
                                };
                                for (var i = 0;  i < inputTime.length; i++) {
                                    inputTime[i].value = '';
                                };
                                order.show();
                                sent.hide();
                            }
                        });
                    } else {
                        alert('Возникла ошибка при оформлении заказа, позвоните нам и сделайте заказ');
                    }
                });
        }
    });

});


// Очистка полей работает, всё отлично) Но можно сделать ещё по-другому:
// - в вёрстке <div class="order-form... заменить на <form class="order-form...
// - $('#reserve-button').click((e) => {
//     e.preventDefault(); ... (чтобы при нажатии на кнопку страница не перезагружалась)
//     - if (e.target.id === 'close-reserve') {
//         $('.order-form').trigger("reset"); (очистка формы)
//         order.show();
//         sent.hide();
//     }