var $ = require('jquery');
  
var allOptions = [
  {
    name: 'handling',
    label: 'Handling',
    min: 1,
    max: 5,
    initial: 3,
  },
  {
    name: 'top_speed',
    label: 'Top Speed',
    min: 100,
    max: 500,
    initial: 400,
  },
  {
    name: 'acceleration',
    label: 'Acceleration',
    min: 100,
    max: 400,
    initial: 250,
  },
  {
    name: 'traction',
    label: 'Traction',
    min: 1,
    max: 8,
    initial: 2,
  },
  {
    name: 'friction',
    label: 'Friction',
    min: 0.1,
    max: 0.9,
    initial: 0.2,
  },
];

module.exports = {
  inputChanged: function(name, newValue) {
    // update the label
    $('span.value.' + name).html(newValue);

    // remove focus from the element so that driving the car doesn't change the input
    $('.ui-element input').blur();

    // if there isn't a callback, go ahead and break out
    if(this.onChangeCallback === undefined) {
      return;
    }

    // build a event object by appending all of the option fields
    var event = allOptions.reduce(function(event, option) {
      event[option.name] = Number($('.ui-element.' + option.name + ' input').val());
      return event;
    }, {});

    this.onChangeCallback(event);
  },

  addInput: function(options) {
    var $labelText = $('<span/>').html(options.label);
    var $valueLabel = $('<span/>').addClass('value').addClass(options.name);
    var $input = $('<input/>').attr({
      type: 'range',
      min: options.min,
      max: options.max,
      step: 0.01,
      value: options.initial,
    });

    return $('<div/>')
      .addClass('ui-element')
      .addClass(options.name)
      .append($labelText)
      .append($valueLabel)
      .append($input)
      .appendTo(document.body)
      .on('change', function(e) {
        this.inputChanged(options.name, $(e.target).val());
      }.bind(this));
  },

  build: function() {
    allOptions.forEach(function(option) {
      this.addInput(option);
    }.bind(this));    

    return this;
  },

  onChange: function(callback) {
    this.onChangeCallback = callback;
  },
};
