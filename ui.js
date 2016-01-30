var $ = require('jquery');

module.exports = {
  inputChanged: function(name, newValue) {
    $('span.value.' + name).html(newValue);
  },

  addInput: function(options) {
    $labelText = $('<span/>').html(options.label);
    $valueLabel = $('<span/>').addClass('value').addClass(options.name);
    $input = $('<input/>').val(options.initial).attr({
      type: 'range',
      min: options.min,
      max: options.max,
      step: 0.01
    });

    $container = $('<div/>')
      .addClass('ui-element')
      .append($labelText)
      .append($valueLabel)
      .append($input)
      .appendTo(document.body)
      .on('change', function() {
        this.inputChanged(options.name, $input.val());
      }.bind(this));
  }
};
