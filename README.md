Interactive quizzes in a gitbook
==============

With this plugin, a book can contain interactive quizzes.


## How to use it?

This plugin is installed by default with gitbook 1.0.1.

To use the quizzes plugin in your Gitbook project, add the `quizzes` plugin to the `book.json` file.

```
{
    "plugins": ["quizzes"]
}
```

> If you want to use multiple plugins in your project, seperate the plugin names with a comma.  For example: `"plugins": ["quizzes", "exercises"]`.


## Quizzes format

Quizzes need to start and finish with a separation bar (```---``` or ```***```).

    ---

    Here's a quiz about Gitbook

    |                  | Good | Bad |
    | ---------------- | ---- | --- |
    | What is Gitbook? | (x)  | ( ) |

    > Gitbook is good

    What does Gitbook support?
    - [x] Table-based questions with radio buttons
    - [x] Table-based questions with checkboxes
    - [ ] Telepathy
    - [x] List-based questions with checkboxes
    - [x] List-based questions with radio buttons
    - [ ] Moon-on-a-stick

    > Gitbook supports table and list based quiz questions using either radio buttons or checkboxes.
    >
    > Gitbook is not telepathic and does not give you the moon on a stick.

    ---

