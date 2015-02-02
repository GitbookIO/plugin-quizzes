var inherits = require('util').inherits;
var kramed = require('kramed');

var rendererId = 0;

function QuizRenderer(options, extra_options) {
    if(!(this instanceof QuizRenderer)) {
        return new QuizRenderer(options, extra_options);
    }
    QuizRenderer.super_.call(this, options);

    this._extra_options = extra_options;
    this.quizRowId = 0;
    this.id = rendererId++;
    this.quizIndex = 0;
}
inherits(QuizRenderer, kramed.Renderer);

QuizRenderer.prototype.tablerow = function(content) {
    this.quizRowId += 1;
    return QuizRenderer.super_.prototype.tablerow(content);
};

var fieldRegex = /^([(\[])([ x])[\])]/;
QuizRenderer.prototype._createCheckboxAndRadios = function(text) {
    var match = fieldRegex.exec(text);
    if (!match) {
        return text;
    }
    //fix radio input uncheck failed
    var quizFieldName='quiz-row-' + this.id + '-' + this.quizRowId ;
    var quizIdentifier = quizFieldName + '-' + this.quizIndex++;
    var field = "<input name='" + quizFieldName + "' id='" + quizIdentifier + "' type='";
    field += match[1] === '(' ? "radio" : "checkbox";
    field += match[2] === 'x' ? "' checked/>" : "'/>";
    var splittedText = text.split(fieldRegex);
    var length = splittedText.length;
    var label = '<label class="quiz-label" for="' + quizIdentifier + '">' + splittedText[length - 1] + '</label>';
    return text.replace(fieldRegex, field).replace(splittedText[length - 1], label);
};

QuizRenderer.prototype.tablecell = function(content, flags) {
    return QuizRenderer.super_.prototype.tablecell(this._createCheckboxAndRadios(content), flags);
};

QuizRenderer.prototype.listitem = function(text) {
    return QuizRenderer.super_.prototype.listitem(this._createCheckboxAndRadios(text));
};

// Exports
module.exports = QuizRenderer;
