'use strict';
(function () {
  var INVALID_FIELD_BACKGROUND_COLOR = '#ff8282';
  var VALID_FIELD_BACKGROUND_COLOR = '#f9fbfd';
  var bodyElement = document.querySelector('body');
  var headerElement = document.querySelector('.page-header');
  var navigationElement = headerElement.querySelector('.page-header__navigation');
  var menuElement = headerElement.querySelector('.main-menu');
  var menuLinkElements = menuElement.querySelectorAll('.main-menu__link');
  var sandwichElement = headerElement.querySelector('.page-header__sandwich');
  var logoElement = headerElement.querySelector('.logo');
  var modalCallLinkElement=document.querySelector("a[href='#login']");
  var modalElement = bodyElement.querySelector('.modal');
  var formElement = document.querySelector('.login-form');
  var pass_filed=formElement.querySelector("input[name='secret']");
  var formSubmitButtonElement = formElement.querySelector("button[type='submit']");
  var close=modalElement.querySelector(".modal__close");


  /*var formElement = document.querySelector('.form');
  var phoneInputElement = formElement.querySelector('input[type="tel"]');
  var formSubmitButton = formElement.querySelector('button[type="submit"]');
  */
  var customSubmitValidations = [];

  if (typeof window !== 'undefined' && window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  if (!HTMLInputElement.prototype.reportValidity) {
    HTMLInputElement.prototype.reportValidity = function () {
        if (this.checkValidity()) {
            return true;
        } else {
            return false;
        }
    };
  }

  headerElement.classList.remove('page-header--no-js');
  navigationElement.classList.remove('page-header__navigation--no-js');
  menuElement.classList.remove('main-menu--no-js');
  sandwichElement.classList.remove('page-header__sandwich--no-js');
  logoElement.classList.remove('logo--no-js');

  modalCallLinkElement.addEventListener("click", function(evt) {
    evt.preventDefault();
    modalElement.classList.add('modal--show');
    pass_filed.focus();
  });

  close.addEventListener("click", function(evt) {
    evt.preventDefault();
    modalElement.classList.remove("modal--show");
    modalCallLinkElement.focus();
  });

  window.addEventListener("keydown", function(evt) {
    if (evt.keyCode==27) {
      if (modalElement.classList.contains("modal--show")) {
        evt.preventDefault();
        modalElement.classList.remove('modal--show');
        modalCallLinkElement.focus();
      }
    }
  });

  /*formSubmitButtonElement.addEventListener('click', function (e) {
    e.preventDefault();
    formSubmitButtonElement.parentElement.submit();
  });*/

  formElement.addEventListener('submit', function(e) {
    e.preventDefault();
    var formObj = formElement;
    var formURL = formObj.getAttribute("action");
    var formData = new FormData(this);

    var xhr = new XMLHttpRequest();
    //xhr.responseType = window.settings.API_RESPONSE_TYPE;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        var response = xhr.response;
        formObj.innerHTML = response;
        document.location.reload();
      } else {
        formObj.innerHTML = 'Произошла ошибка. Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }
    });

    xhr.addEventListener('error', function () {
      formObj.innerHTML = 'Произошла ошибка соединения';
    });

    xhr.addEventListener('timeout', function () {
      formObj.innerHTML = 'Запрос не успел выполниться за ' + xhr.timeout + 'мс';
    });

    xhr.timeout = 10000;

    xhr.open('post', formURL, true);
    //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(formData);

  });

  var showMobileMenu = function () {
    var menuLinksElements = menuElement.querySelectorAll('a[href]');

    headerElement.classList.add('page-header--white');
    sandwichElement.classList.add('page-header__sandwich--close');
    navigationElement.classList.add('page-header__navigation--show');
    logoElement.classList.add('logo--blue');
    bodyElement.classList.add('modal-open');

    menuLinksElements.forEach(function (link) {
      link.addEventListener('click', hideMobileMenu);
    });

    sandwichElement.removeEventListener('click', showMobileMenu);
    sandwichElement.addEventListener('click', hideMobileMenu);
  };

  var hideMobileMenu = function () {
    var menuLinksElements = menuElement.querySelectorAll('a[href]');

    headerElement.classList.remove('page-header--white');
    sandwichElement.classList.remove('page-header__sandwich--close');
    navigationElement.classList.remove('page-header__navigation--show');
    bodyElement.classList.remove('modal-open');
    logoElement.classList.remove('logo--blue');

    menuLinksElements.forEach(function (link) {
      link.removeEventListener('click', hideMobileMenu);
    });

    sandwichElement.removeEventListener('click', hideMobileMenu);
    sandwichElement.addEventListener('click', showMobileMenu);
  };

  var indicateInvalidField = function (element, indicator) {
    element.style.backgroundColor = (indicator) ? INVALID_FIELD_BACKGROUND_COLOR : VALID_FIELD_BACKGROUND_COLOR;
  };

  var initRequired = function (form) {
    var inputs = form.querySelectorAll('input');
    inputs.forEach(function (input) {
      if (input.hasAttribute('custom-required')) {
        input.removeAttribute('required');
      }
    });
  };

  var customRequired = function (element) {
    var validityMessage = '';

    if (element.hasAttribute('custom-required')) {
      if (!element.value) {
        validityMessage += 'Это обязательное поле';
      }
    }

    element.setCustomValidity(validityMessage);

    indicateInvalidField(element, validityMessage);
  };

  var validateForm = function (form, validations) {
    var validity = 1;
    var inputs = form.querySelectorAll('input');

    inputs.forEach(function (input) {
      for (var i = 0; i < validations.length; i++) {
        validations[i](input);
      }

      validity *= input.checkValidity();

      input.reportValidity();
    });

    return validity;
  };

  var customSubmitForm = function (form) {
    if (validateForm(form, customSubmitValidations)) {
      form.submit();
    }
  };

  sandwichElement.addEventListener('click', showMobileMenu);
  customSubmitValidations.push(customRequired);

  menuLinkElements.forEach(function (link) {
    var loc = window.location.href.replace("http://","");

    if ((loc.substr(loc.indexOf("/"), loc.length - loc.indexOf("/")).length > 1) && (loc.substr(loc.length - 1) == "/")) {
      loc = loc.substr(0, loc.length - 1);
    }

    if (link.getAttribute("href") == loc.substr(loc.indexOf("/"), loc.length - loc.indexOf("/"))) {
      link.removeAttribute("href");
    }
  });

  /*
  phoneInputElement.addEventListener('input', function () {
    var validityMessage = '';
    if (phoneInputElement.value) {
      phoneInputElement.value = phoneInputElement.value.replace(/[^0-9-()]/, '');
    }

    phoneInputElement.setCustomValidity(validityMessage);

    indicateInvalidField(phoneInputElement, validityMessage);
  });

  initRequired(formElement);

  formSubmitButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    customSubmitForm(formElement);
  });

  formElement.addEventListener('submit', function (evt) {
    evt.preventDefault();
    customSubmitForm(formElement);
  });
  */
})();
