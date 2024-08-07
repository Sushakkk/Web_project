// Когда html документ готов (прорисован)
$(document).ready(function () 
{
    // берем в переменную элемент разметки с id jq-notification для оповещений от ajax
    var successMessage = $("#message");

     // Ловим собыитие клика по кнопке добавить в корзину
     $(document).on("click", ".add-to-basket", function (e) {
         // Блокируем его базовое действие
         e.preventDefault();

         // Берем элемент счетчика в значке корзины и берем оттуда значение
         var goodsInBasketCount = $("#goods-in-basket-count");
         var basketCount = parseInt(goodsInBasketCount.text() || 0);

         // Получаем id товара из атрибута data-dish-id
         var dish_id = $(this).data("dish-id");
          
         // Из атрибута href берем ссылку на контроллер django
         var add_to_basket_url = $(this).attr("href");
        
         console.log("Dish ID: ", dish_id);
         // делаем post запрос через ajax не перезагружая страницу
         $.ajax({
             type: "POST",
             url: add_to_basket_url,
             data: {
                 dish_id: dish_id,
                 csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
             },
             success: function (data) {
                 // Сообщение
                 
                 successMessage.html(data.message);
                //  successMessage.fadeIn(400);
                // //  Через 7сек убираем сообщение
                //  setTimeout(function () {
                //      successMessage.fadeOut(400);
                //  }, 7000);
            

                 // Увеличиваем количество товаров в корзине (отрисовка в шаблоне)
                 basketCount++;
                 goodsInBasketCount.text(basketCount);

                 // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                 var basketItemsContainer = $("#basket-items-container");
                 basketItemsContainer.html(data.basket_items_html);

             },
             error: function (data) {
                 console.log("Ошибка при добавлении товара в корзину");
             },
         });
     });




    // Ловим собыитие клика по кнопке удалить товар из корзины
    $(document).on("click", ".remove-from-basket", function (e) {
        // Блокируем его базовое действие
        e.preventDefault();

        // Берем элемент счетчика в значке корзины и берем оттуда значение
        var goodsInBasketCount = $("#goods-in-basket-count");
        var basketCount = parseInt(goodsInBasketCount.text() || 0);

        // Получаем id корзины из атрибута data-basket-id
        var basket_id = $(this).data("basket-id");
        // Из атрибута href берем ссылку на контроллер django
        var remove_from_basket = $(this).attr("href");
    
        // делаем post запрос через ajax не перезагружая страницу
        $.ajax({

            type: "POST",
            url: remove_from_basket,
            data: {
                basket_id: basket_id,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
            success: function (data) {
                // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                // Через 7сек убираем сообщение
                setTimeout(function () {
                    successMessage.fadeOut(400);
                }, 7000);

                // Уменьшаем количество товаров в корзине (отрисовка)
                basketCount -= data.quantity_deleted;
                goodsInBasketCount.text(basketCount);

                // Меняем содержимое корзины на ответ от django (новый отрисованный фрагмент разметки корзины)
                var basketItemsContainer = $("#basket-items-container");
                basketItemsContainer.html(data.basket_items_html);

            },

            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    });




    // Теперь + - количества товара 
    // Обработчик события для уменьшения значения
    $(document).on("click", ".decrement", function () {
        // Берем ссылку на контроллер django из атрибута data-basket-change-url
        var url = $(this).data("basket-change-url");
        // Берем id корзины из атрибута data-basket-id
        var basketID = $(this).data("basket-id");
        // Ищем ближайшеий input с количеством 
        var $input = $(this).closest('.input-group').find('.number');
        // Берем значение количества товара
        var currentValue = parseInt($input.val());
        // Если количества больше одного, то только тогда делаем -1
        if (currentValue > 1) {
            $input.val(currentValue - 1);
            // Запускаем функцию определенную ниже
            // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
            updateCart(basketID, currentValue - 1, -1, url);
        }
    });

    // Обработчик события для увеличения значения
    $(document).on("click", ".increment", function () {
        // Берем ссылку на контроллер django из атрибута data-basket-change-url
        var url = $(this).data("basket-change-url");
        // Берем id корзины из атрибута data-basket-id
        var basketID = $(this).data("basket-id");
        // Ищем ближайшеий input с количеством 
        var $input = $(this).closest('.input-group').find('.number');
        // Берем значение количества товара
        var currentValue = parseInt($input.val());

        $input.val(currentValue + 1);

        // Запускаем функцию определенную ниже
        // с аргументами (id карты, новое количество, количество уменьшилось или прибавилось, url)
        updateCart(basketID, currentValue + 1, 1, url);
    });

    function updateCart(basketID, quantity, change, url) {
        $.ajax({
            type: "POST",
            url: url,
            data: {
                basket_id: basketID,
                quantity: quantity,
                csrfmiddlewaretoken: $("[name=csrfmiddlewaretoken]").val(),
            },
 
            success: function (data) {
                 // Сообщение
                successMessage.html(data.message);
                successMessage.fadeIn(400);
                 // Через 7сек убираем сообщение
                setTimeout(function () {
                     successMessage.fadeOut(400);
                }, 7000);
 
                // Изменяем количество товаров в корзине
                var goodsInBasketCount = $("#goods-in-basket-count");
                var basketCount = parseInt(goodsInBasketCount.text() || 0);
                basketCount += change;
                goodsInBasketCount.text(basketCount);

                // Меняем содержимое корзины
                var cartItemsContainer = $("#basket-items-container");
                cartItemsContainer.html(data.basket_items_html);

            },
            error: function (data) {
                console.log("Ошибка при добавлении товара в корзину");
            },
        });
    }
});

// Берем из разметки элемент по id - оповещения от django
// var notification = $('#notification');
// // И через 7 сек. убираем
// if (notification.length > 0) {
//     setTimeout(function () {
//         notification.alert('close');
//     }, 7000);
// }
// При клике по значку корзины открываем всплывающее(модальное) окно
$('#modalButton').click(function () {
    $('#exampleModal').appendTo('body');

    $('#exampleModal').modal('show');
});

// Собыите клик по кнопке закрыть окна корзины
$('#exampleModal .btn-close').click(function () {
    $('#exampleModal').modal('hide');
});
$("input[name='requires_delivery']").change(function () {
    var selectedValue = $(this).val();
    // Скрываем или отображаем input ввода адреса доставки
    if (selectedValue === "1") {
        $("#deliveryAddressField").show();
    } else {
        $("#deliveryAddressField").hide();
    }
});

// Форматирования ввода номера телефона в форме +7 (xxx)-xxx-хххx
document.getElementById('id_phone').addEventListener('input', function (e) {
    var x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = '+7' + (x[2] ? ' (' + x[2] : '') + (x[3] ? ')-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
});

// Проверяем на стороне клиента коррекность номера телефона в форме xxx-xxx-хх-хx
// $('#create_order_form').on('submit', function (event) {
//     var phoneNumber = $('#id_phone').val();
//     var regex = /^\(\d{3}\)-\d{3}-\d{4}$/;

//     if (!regex.test(phoneNumber)) {
//         $('#phone_number_error').show();
//         event.preventDefault();
//     } else {
//         $('#phone_number_error').hide();

//         // Очистка номера телефона от скобок и тире перед отправкой формы
//         var cleanedPhoneNumber = phoneNumber.replace(/[()\-\s]/g, '');
//         $('#id_phone').val(cleanedPhoneNumber);
//     }
// });
