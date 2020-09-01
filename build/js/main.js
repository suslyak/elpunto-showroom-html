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
