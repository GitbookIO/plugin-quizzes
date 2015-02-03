var _ = require('lodash');

var kramed = require('kramed');
var renderer = require('kramed-markdown-renderer');

var sections = require('./sections');
var isQuiz = require('./is_quiz');

// Get nodes
function lex(content) {
    var options = Object.create(kramed.defaults);
    options.escape = false;

    return kramed.lexer(content, options);
}

// Render lexed nodes back to markdown
function render(lexed) {
    // Options to parser
    var options = Object.create(kramed.defaults);
    options.renderer = renderer();
    options.escape = false;

    if(!lexed.links) {
        lexed.links = {};
    }

    return kramed.parser(lexed, options);
}

function quizBlock(section) {
    return [
    '{% quiz %}',
    // Render this back to markdown
    render(section),
    '{% endquiz %}',
    ].join('\n');
}

function retroSection(section) {
    // Convert to new format
    var blockCode = quizBlock(section);

    return [
        // Use a html node so it's
        // Rawly injected during rendering
        {
            type: 'html',
            text: blockCode,
        }
    ];
}

// retro takes an input markdown file
// and outputs a new markdown file
// converting in the process old quizs to new ones
function retro(content) {
    // Lex incoming markdown file
    var lexed = lex(content);

    // Break it into sections
    var newSections = sections.split(lexed)
    .map(function(section) {
        // Leave non quiz sections untouched
        if(!isQuiz(section)) {
            return section;
        }
        // Convert old section to new format
        return retroSection(section);
    });

    // Bring sections back together into a list of lexed nodes
    var newLexed = sections.join(newSections);

    // Render back to markdown
    return render(newLexed);
}

module.exports = retro;
