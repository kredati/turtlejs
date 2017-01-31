A few notes:
*   Consider interpretation: the Java 3D turtle graphics package has a TurtleCommand class--construct commands (for example, using the draw() loop) rather than delivering commands directly. [DONE]
*   This lets you implement repeat() differently, and introduces interesting possibilities for undo().

Additional thoughts:
*   Metaprogramming like this always makes me feel a little queasy
*   Implement undo()! (Do this by, instead of erasing stack when called, save the stack.) This will mean reset() will have to be an explicit, separate binding on window (like repeat--as, of course, will undo).
*   Implement origin() on turtle, which will reset the turtle's position (DONE: as home()--p5 uses origin)
*   Implement help--move help away from the turtle and to the command center. This might be the beginning of pedagogical documentation.
*   Refactor command center global export--make the hard-coding (unavoidable here without something like typescript) much friendlier.
*   Possible additional idears for turtle functionality, like changing line color
*   Is filling even possible? That seems like a lot of math or logic--perhaps consult the other Javascript turtle graphics item
*   Further consideration of mitigating the console's literalness. I feel pretty insistent that the console is where I want turtle graphics to happen (and not in an interpreter). (e.g. help(ReferenceError) as a way of getting better information)
*   StackOverflow may well be a way to get better information about how to manage problems with the console
*   Perhaps a teach() or learn() function? Would that work as a transitional object for building functions? (Think also about fat arrow functions vs. function keyword: which makes sense?)--it would be trivial-ish to code [cannot bind directly to window, but can/should bind to CommandCenter prototype or auxiliary object; yay hacking!]
*   Using the console, how do we save our work? Do input and output? This, I think, makes very good sense indeed using something like CodePen. (NOT using console, but instaed using a file.)
*   Test whether using a plain .js file works. (It absolutely should, but just in case.)
*   Think about implementation details: Is there a way to decouple the command and the command center? Is there a way to write the turtle more fuctionally? Abstract graphics rendering? Is p5.js necessarily super stateful and therefore sadly imperative? 
