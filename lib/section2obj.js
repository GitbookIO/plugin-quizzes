var _ = require('lodash');
var kramed = require('kramed');

// Render a section using our custom renderer
function render(section) {
    // Copy section
    var links = section.links || {};
    section = _.toArray(section);
    section.links = links;

    return kramed.parser(section);
}

function section2obj(section) {
    var quiz = [], question, foundFeedback = false;
    var nonQuizNodes = section[0].type === 'paragraph' && section[1].type !== 'list_start' ? [section[0]] : [];
    var quizNodes = section.slice(0);
    quizNodes.splice(0, nonQuizNodes.length);

    for (var i = 0; i < quizNodes.length; i++) {
        var node = quizNodes[i];

        if (question && (((node.type === 'list_end' || node.type === 'blockquote_end') && i === quizNodes.length - 1)
                         || node.type === 'table' || (node.type === 'paragraph' && !foundFeedback))) {
            quiz.push({
                base: render(question.questionNodes, options),
                solution: render(question.solutionNodes, options),
                feedback: render(question.feedbackNodes, options)
            });
        }

        if (node.type === 'table' || (node.type === 'paragraph' && !foundFeedback)) {
            question = { questionNodes: [], solutionNodes: [], feedbackNodes: [] };
        }

        if (node.type === 'blockquote_start') {
            foundFeedback = true;
        } else if (node.type === 'blockquote_end') {
            foundFeedback = false;
        }

        if (node.type === 'table') {
            question.solutionNodes.push(_.cloneDeep(node));
            node.cells = node.cells.map(function(row) {
                return row.map(quizQuestion);
            });
            question.questionNodes.push(node);
        } else if (!/blockquote/.test(node.type)) {
            if (foundFeedback) {
                question.feedbackNodes.push(node);
            } else if (node.type === 'paragraph' || node.type === 'text'){
                question.solutionNodes.push(_.cloneDeep(node));
                quizQuestion(node);
                question.questionNodes.push(node);
            } else {
                question.solutionNodes.push(node);
                question.questionNodes.push(node);
            }
        }
    }

    return {
        content: render(nonQuizNodes, options),
        quiz: quiz
    };
}