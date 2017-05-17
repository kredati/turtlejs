# OMG use closures, dummy

Neither classes nor factories—Crockford has it right.

The idea here is that we should be making new objects in closures, but shouldn't be talking/teaching about them *as* closures per se, but *simply as functions*.

Eg:

let turtle = (some params) => {

  lets for private instance variables

  functions for functions and methods

  return {methods using magic object notations}

}

Students should be *used to* thinking about what happens in functions as black boxes, except for return values.

Some tentative thoughts on mixins: they can be done using Object.assign on the returns, as an advanced topic. (Perhaps not?) The difficulty with mixins here is that we won't be using *this* as a keyword, but that's just fine (perhaps): mixins shouldn't be accessing my internals anyway. (Probably we won't get there anyway, since inheritance *isn't* really part of the curriculum—functions are more than enough!—and we can compose/delegate instead of mixing in, in theory. We'll see how this works in practice. So probably no mixins.)

This way, we don't ever really have to muck around with inheritance, or new or class or this, or use function declarations instead of anonymous lambda arrow functions.

There are two issues I can think of: the performance hit, and the difficulty in chaining functions (which seems pretty fundamental). The performance hit is probably negligble—test it with the boids, where we're going to run into its greatest difficulty—and chaining can be fixed by applying some helper function. (*this* is unavoiable at some level, but perhaps I can hide it—try to hide as little as possible.) One possibility is something like:

```javascript
return export({an object}) // instead of just returning a single object
```

```javascript
export = obj => {
  let exports = {}
  Reflect.ownKeys(obj).forEach(key =>
    exports[key] = (...args) => {
      res = obj[key](...args)
      return res ? res : this)
    } // might not be quite right but close enough for this late-night musing
    return exports
}
```
The question to work through is whether and how I ask students to rely on my code. Support code is useful! But manipulating an object that is a turtle or whatever is, in many ways, less obtrusive and more pedagogical than "just remember to use exports() when you're making your objects." JavaScript is hard enough; APIs are sticky to objects; just memorizing something that isn't part of the language ain't great.

(Perhaps the entity currently known as TurtleCommand can be refactored to provide chaining, while actual turtle methods might have to be written line by line?)
