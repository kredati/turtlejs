### A few notes:
-   [x] Consider interpretation: the Java 3D turtle graphics package has a TurtleCommand class--construct commands (for example, using the draw() loop) rather than delivering commands directly. (DONE)
*   This lets you implement repeat() differently, and introduces interesting possibilities for undo().

### Additional thoughts:
*   Metaprogramming like this always makes me feel a little queasy, although OMG did it make writing a DSL that is a subset of Javascript nearly trivial (although man is it hard to reason about nested calls)
-   [x] Implement undo()! (Do this by, instead of erasing stack when called, save the stack.) This will mean reset() will have to be an explicit, separate binding on window (like repeat--as, of course, will undo).
-   [x] Implement origin() on turtle, which will reset the turtle's position (DONE: as home()--p5 uses origin)
-   [ ] Implement help--move help away from the turtle and to the command center. This might be the beginning of pedagogical documentation.
-   [x] Refactor command center global export--make the hard-coding (unavoidable here without something like typescript) much friendlier.
-   [x] Possible additional idears for turtle functionality, like changing line color (FUCK YEAH LINE COLOR)
-   [x] Is filling even possible? That seems like a lot of math or logic--perhaps consult the other Javascript turtle graphics item (I think this is an algorithmic problem that is best left unsolved.)
-   [x] Further consideration of mitigating the console's literalness. I feel pretty insistent that the console is where I want turtle graphics to happen (and not in a dedicated interpreter). (e.g. help(ReferenceError) as a way of getting better information?--but I want this to be fully real Javascript) (See below: the whole help system needs to be built from scratch.)
-   [x] StackOverflow may well be a way to get better information about how to manage problems with the console
-   [ ] A very small but perhaps significant item: figure out how to get the "turtle ready!" message to appear after the return value for the "command methods" (undo, redo, reset). learn() somehow works already, perhaps because of its invocation of commands?
-   [x] Perhaps a teach() or learn() function? Would that work as a transitional object for building functions? (Think also about fat arrow functions vs. function keyword: which makes sense?)--it would be trivial-ish to code (cannot bind directly to window, but can/should bind to CommandCenter prototype or auxiliary object; yay hacking!; (it should not bind to the prototype!))
-   [ ] Using the console, how do we save our work? Do input and output? This, I think, makes very good sense indeed using something like CodePen. (NOT using console, but instead using a file.) (Solution, not yet implemented: use something like the undo stack that captures commands, adds them to a stack, and then composes them into a text file for download.)
-   [x] Test whether using a plain .js file works. (It absolutely should, but just in case.) (A plain old text file does not work—the p5.js stuff doesn't run until onload. BUT: putting it in a function sure does work.)
-   [ ] Factor the module loading out into the language module. THEN:
-   [ ] Using require.js or curl.js or some other AMD package, set up command-line loading; or, possibly, if I don't want to use an external dependency, check out something like: <http://stackoverflow.com/questions/14446447/javascript-read-local-text-file>
-   [ ] Think about implementation details: Is there a way to decouple the command and the command center? Is there a way to write the turtle more functionally? Abstract graphics rendering? Is p5.js necessarily super stateful and therefore sadly imperative? Is there a way of writing pure graphics rendering functions?

(To which I can only say: turtle graphics logic is poised in between receiving commands from users and drawing graphics: these are both inherently stateful. Both the command center and the graphics rendering engines are I/O and therefore largely best to use stateful OO.)

-   [ ] What other kinds of turtles can we write? (E.g., can I write symmetrical turtles easily? What about Dynaturtles? What are Dynaturtles?)
-   [ ] How do we move from turtle graphics to p5.js? (Or, in other words, from polar to cartesian coordinates--we learn this undoes the syntonic reasoning and is a step up in abstraction)
-   [x] Refactor rendering so that only new lines are rendered (NOT DONE: the way p5.js renders, to draw the turtle in a new place or orientation, you have to call background(), which means you have to redraw all the lines. p5 apparently checks to see if we're drawing things that are already there, so it doesn't actually cost *that* much to redraw on refreshes—and yet, many repeated repeats are very slow indeed, and sometimes break the Javascript)
-   [x] Nevertheless, it's time to refactor for speed—do it! Nested repeats are a disaster. (DONE a little bit: executeStack() only calls turtle.render() if it's from the top level TurtleCommandCenter. It's still painfully slow, though.) (Additionally: every new CommandCenter (and therefore every nested repeat) was calling turtle.render() in its constructor. Speed no longer quite feels like an issue—except for animation.)
-   [x] Add a few monkeypatched helper functions, especially times() on number? Or perhaps as a function n.times(do) or times(n, do). (DONE: thank you StackOverflow for guiding me to this particular answer quickly.)
-   [x] Factor everything that addresses or messes with global context out into the language module: anything that puts anything on window should be managed by language.
-   [ ] Factor everything into a single module (kredati, turtlejs)
-   [x] Better error handling with learn: ensure no namespace collisions (users should be able to redefine their own commands but *not* overwrite any p5, turtlejs, or JS commands)
-   [ ] Develop a config system that allows for case-by-case loading of particular commands, aliases, etc. (The idea here is both that each instructor can vary the environment to their needs, and also that different lessons in the same course can modulate what's available to students.)
-   [ ] Regarding the animation system: this should be relatively easy (emphasis on relatively) using generator functions! (That means I need to understand them better.) The command stack goes to a processor which either simply executes all the commands and then renders the turtle & path, or it analyzes the movements described in the stack into segments of equal distance; then renders a stack of frames; each of which is a set of p5 instructions; this stack is simply stepped through in draw().

### "Microworlds"
*   "Original" LOGO: typing unadorned commands into the console (major concepts: giving directions, passing parameters, variables, building functions, the power of repetition)
*   oo-turtles: giving the turtle instructions directly (learn more about dot notation; teach the turtle a new thing: use `this`); (the change: expose turtle object)
*   Interaction turtles: develop KeyListener to give the turtle more specific interaction (can you make the turtle do funny things?) (the change: a KeyListener; also: introduce conditionals?—perhaps bound the turtle to the screen?)
*   Cartesian turtles: different turtle geometry means a different set of commands (do this with interaction first? arrow keys make turtle move in four directions)
*   Vector turtles: use p5.Vector objects to represent position, and also heading (introduce basic vector math); manipulate position (with interaction, with commands) on x and y and with vector math add(), sub(), etc.
*   Velocity turtles: introduce animation—velocity can be manipulated using both console commands and KeyListeners: yet another kind of abstraction
*   Acceleration turtles: introduce acceleration using interaction? (Asteroid spaceship—this is already force, but we don't know it yet)
*   Newtonian turtles: here there are a bunch of different possibilities: gravity turtles, rocket turtles, wind turtles—what ways do we have of applying forces to turtles (or other objects)

More research here—let's dig back in the archive to find interesting lessons and implement them ourselves.

### Sketching
After LOGO's various "microworlds," it seems like it's time to start thinking about using p5.js. Rerun the a curriculum very similar to ENG 7006's [coding lessons](https://github.com/ENG7006/coding-lessons). (This is largely written under the influence of Dan Shiffman's p5.js videos on YouTube, which are great.) One thing I learn from going back to those lessons is just how much ground we'll have to cover, and how difficult it is to cover it. Revising this curriculum is going to be painstaking.

### And Pencils
A few notes after looking at Pencil Code:
-   [ ] Animating the turtle is a really good idea; it heightens the syntonicity of the thing: you can *see* it move, and so you can *feel* the relation to your own embodiment
-   [ ] I don't think we need code blocks, but a meaningful palette of functions and control structures seems worthwhile.
-   [ ] Ideally, there would be some way of scaffolding the things, too (the equivalent to drag-and-drop in block coding), but the console really limits what's possible here
-   [ ] A simple (x, y) readout of the mouse position would be really helpful
-   [ ] Pencil Code allows the Turtle to do things *other* than draw lines: it will draw circles and boxes and so on. This will be a nice transition from turtle graphics to cartesian graphics?
-   [ ] Help files should be reasonably implemented in JS itself. A JSON file (or several) that contain information on usage
-   [ ] Research: Are there automatic parsers that can tell me about arguments? (This is getting close to TypeScript; but I want tools that let me introspect plain JS functions.)
-   [ ] In addition to custom help, we will also need *custom error messages*.
-   [ ] As a riff on the above: calling help() or some such after an error will provide a friendlier explanation of that error
