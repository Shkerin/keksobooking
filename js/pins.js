'use strict';

/**
 * Модуль для отрисовки пинов и взаимодействия с ними
 */

(function () {
  var PIN_WEIGHT = 46;
  var PIN_HEIGHT = 10;

  var sourcePins = [];
  var filterPins = [];

  var addPin = function (pin) {
    sourcePins.push(pin);
  };

  var clickPinHandler = function (evt) {
    var elem = evt.currentTarget;
    window.displayCard.show(elem, filterPins);
  };

  var createPinElem = function (pin) {
    var locationX = pin.location.x - PIN_WEIGHT / 2;
    var locationY = pin.location.y - PIN_HEIGHT;
    var avatar = pin.author.avatar;

    var pinElem = document.createElement('div');
    pinElem.innerHTML =
      '<button style="left: ' + locationX + 'px; top: ' + locationY + 'px;" class="map__pin" data-uid=' + pin.uid + '>' +
      '<img src="' + avatar + '" width="40" height="40" draggable="false">' +
      '</button>';

    return pinElem.children[0];
  };

  var removePins = function () {
    var pinsElem = document.querySelector('.map__pins');
    var pins = pinsElem.querySelectorAll('.map__pin:not(.map__pin--main)');
    [].forEach.call(pins, function (pinElem) {
      pinElem.removeEventListener('click', clickPinHandler);
      pinsElem.removeChild(pinElem);
    });
  };

  var renderPins = function (pins) {
    var frag = document.createDocumentFragment();

    pins.forEach(function (value) {
      var pinElem = createPinElem(value);
      frag.appendChild(pinElem);

      pinElem.addEventListener('click', clickPinHandler);
    });

    document.querySelector('.map__pins').appendChild(frag);
  };

  var update = function () {
    removePins();
    filterPins = window.filter(sourcePins);
    renderPins(filterPins);
  };

  var loadAndRender = function () {
    var loadHandler = function (data) {
      data.forEach(function (value) {
        value.uid = window.utils.createUUID();
      });
      sourcePins = data.filter(function (value, idx) {
        return idx < 10;
      });
      filterPins = sourcePins;
      renderPins(sourcePins);
    };

    if (navigator.onLine) {
      window.backend.loadData(loadHandler, window.error.show);
    } else {
      var pins = window.data.create(8);
      loadHandler(pins);
    }
  };

  window.pins = {
    loadAndRender: loadAndRender,
    render: renderPins,
    update: update,
    add: addPin
  };
})();
