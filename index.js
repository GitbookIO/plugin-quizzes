var _ = require("lodash");
var fs = require("fs");
var path = require("path");

var retro = require("./lib/retro");
var block = require("./lib/block");

var QUIZ_WEBSITE_TPL = _.template(fs.readFileSync(path.resolve(__dirname, "./assets/website_quiz.html")));
var QUIZ_EBOOK_TPL = _.template(fs.readFileSync(path.resolve(__dirname, "./assets/ebook_quiz.html")));

module.exports = {
    website: {
        assets: "./assets",
        js: [
            "quizzes.js",
        ],
        css: [
            "quizzes.css"
        ],
    },
    blocks: {
        quiz: {
            process: function(blk) {
                // Extract quiz info
                var context = block(blk.body);

                // Select appropriate template
                var tpl = (this.generator === 'ebook' ? QUIZ_EBOOK_TPL : QUIZ_WEBSITE_TPL);

                return tpl(context);
            }
        }
    },
    hooks: {
        "page:before": function(page) {
            // Skip all non markdown pages
            if(page.type != "markdown") {
                return page;
            }

            // Rewrite content (modernizing old exercises)
            page.content = retro(page.content);

            // Return modified page
            return page;
        }
    }
};
