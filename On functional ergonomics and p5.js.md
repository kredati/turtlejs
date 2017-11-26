# On functional and pedagogical ergonomics

A great deal more research to do here, but a few notes for now:

* Consider building this not with p5.js but with a custom functional canvas library
* The reson for this is to avoid the impedence mismatch between p5 and better functional code.
    * The most important of these is that Processing/p5 uses all these bonkers long parameter lists (e.g. triangle(x1: num, y1: num, x2: num, y2: num, x3: num, y3: num))
    * Processing/p5 is procedural in ways that make for difficult conceptual workflows for students (i.e., chaning is weird)
    * Processing/p5 is also procedural in a way that grinds against functional programming concepts (pure & impure functions, etc.)
    * Processing/p5 use cartesian graphics as their only idiom, whereas Logo and Turle Graphics start (and are very importantly) body syntonic (polar-ish) in their geometry
    * The basic ergonomics of a sketch are different if we're taking a functional approach. In place of void seteup & draw in the same scope, we're looking at a default state object and an update function that returns the new state.
    * The base-level abstractions for a pedagogical system aren't just programming language abstractions. Not only (presumably), but for example: vectors are useful as a first-class abstraction, a core dependency for the rest of the system.
* A few notes, then:
    * The ergonomics of the sketch are likely going to be very, very close to Redux
    * Instead of createStore(), we're looking at a helper that creates shapes on screens
    * The basic model is that every geometry object will have a render method that returns the function that will draw the thing to the screen
    * Recursion is good (as long as it doesn't go very deep)
    * The state object will be (behind the scenes, at least to start) made Safe and will be Typed. (This will actually allow for development and production environments.)
    * The system will need to provide helpful patterns for modules.