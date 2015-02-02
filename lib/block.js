var kramed = require('kramed');

var section2obj = require('./section2obj');

// Turn a section into a parsed quiz
function block(blockText) {
    var lexed = kramed.lexer(blockText);

    return section2obj(lexed);
}
