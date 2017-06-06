A few thoughts/agendas re: testing:

### Test modules
That means:
—Expose an API for each module and test that
—Do not worry about internals; test behavior
—Only util, I suppose, should expose sub-sub-modules

### Consider module loading
—Can I write a module loader that uses CommonJS require-style syntax? (Or should I use require1k?—except I want things to be *readable* and pedagogical: the "deeply pedagogical" commitment means relying as little as possible on other libraries. Limited (read: brittle?) is okay(ish), actually, as long as code is readable and maintainable.)

### On the process of writing turtle.js tests
I still don't understand how the system works, and so don't know what the tests should look like. APIs are still changing, and modules are getting reworked. On the one hand, that means tests are important to ensure that changes in one part of the application don't break other functionality. At the same time, tests can be limiting here because I may want/need to refactor not only the code itself but the code that's exposed from one module/unit to the other. That said, if I do things properly (like test the hell out of units that depend on other units, and find a way to test user-facing code), then changing APIs will still be easier—as long as they're tested as well.

At this point, I suspect the thing to do is to start defining the APIs, writing the texts, and reducing and refactoring the modules.

### Pedagogical testing
How do we integrate testing (TDD, BDD) into teaching?

If the tests exist before the assignment starts, then by definition the assignments *are* TDD. (I take it, although working from imperfect information here, that BDD is simply a version of TDD.) But TDD, if you do it right, is a substantially iterative process. If I take what I know of the Metz/Owen approach seriously, then you get to shameless green first, and then refactor for other desiderata, including readability. Is it enough for students to get to shameless green? Is a process like Owen's Exercism a good idea, where you progressively add in tests, refactoring/changing at each step? But there the goal is to get to *elegant* code, not working code. And what do we want to teach our students? What do I want to teach my student?
