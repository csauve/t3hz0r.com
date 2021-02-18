---
date: 2017-09-19
title: Functional JS with Ramda
---

Recently I've been writing a lot more JS in a functional style, spurred on by React best practices stateless components and immutable data structures as props. The library [Ramda](http://ramdajs.com/) has been especially helpful as a toolkit, offering [over 240](http://ramdajs.com/docs/) small pre-built and well tested functional building blocks.

It's opened my eyes to new ways of problem solving, and while I'm still no functional programming expert, I'd still like to share what I found useful.

## What is functional JS?
JavaScript is a multi-paradigm language, supporting imperative, object-oriented, and functional styles. Its functional patterns often follow from JS best practices:

* Don't extend `Array.prototype` or `Object.prototype` with nonstandard functionality; use utility functions
* Avoid shared or global state
* Prefer _pure functions_ without side-effects
* Don't mutate function parameters
* Small, simple functions are easy to understand and test
* DRY through composition

## Functional JS <3 ES6
New ES6 language features pair nicely with a functional style. In particular: arrow functions, structuring and destructuring assignment, template strings, and rest/spread operators. Here's a recap:

```js
const placings = ["Sebastian", "Valtteri", "Daniel", "Kimi", "Max", "Sergio"];
const raceDetails = {id: "12345", distance: "10km", city: "Victoria"};

const formatPlacings = ([first, second, ...others]) =>
  `1st: ${first}, 2nd: ${second} (${others.length} others)`;

const buildRenderParams = ({city, distance}, placings) => {
  const headline = `${placings[0]} wins ${city} ${distance} race`;
  return {headline, summary: formatPlacings(placings)};
};

buildRenderParams(raceDetails, placings);
/* { headline: "Sebastian wins Victoria 10km race",
     summary: "1st: Sebastian, 2nd: Valtteri (4 others)" } */
```

## Vanilla JS
Out of the box, higher order functions and built-ins like `Array.map` let you build everything you need:

```js
const add = (a, b) => a + b;
const sqr = (a) => a ** 2;

const execStep = (stack, arg) => {
  if (typeof arg === "function") {
    const funcArgs = stack.slice(-arg.length);
    const poppedStack = stack.slice(0, -arg.length);
    return [...poppedStack, arg(...funcArgs)];
  }
  return [...stack, arg];
};

const program = [1, 2, add, sqr];
const outputStack = program.reduce(execStep, []);
//=> [9]
```

## Enter Ramda
Why Ramda? I admit I didn't give some alternatives a deep dive. Ramda seemed accessible and easy to jump into, with lots of code examples on its website. Importantly for me, it offered a lot of functions for manipulating plain JS objects and arrays immutably without having to convert to and from some stricter types.

Ramda functions live as properties under an `R` object. To import them as an NPM module:
```js
//npm install --save ramda
const R = require("ramda");
```

Usage as a global in HTML:
```html
<script src="path/to/yourCopyOf/ramda.min.js"></script>
<script>/* Use `R` */</script>
```

## Composition
Here's an example of using Ramda's primitives to compose a function:
```js
const dotProduct = R.pipe(R.zipWith(R.multiply), R.sum);
dotProduct([5, 2, 3], [4, 1, 1]); //=> 25
```

Use `R.pipe` to create a single function represeting a nesting of function calls. Each argument function will be called with the return value of the last. Use `R.compose` to apply functions in the reverse order.

For example, `R.pipe(x, y, z)` returns a function which is equivalent to `(args) => z(y(x(...args)))`.


## Currying
**Curring** is an extemely powerful tool that's hard to stop using once you start! It converts a function into one which can be _partially applied_, where calling it with the first few arguments returns a new function of the remaining arguments. That is, calling `f(a, b, c, d)` is equivalent to `f(a)(b, c)(d)`.

All functions in Ramda are "curried" by default where applicable. To curry any other function, simply call `R.curry`. As a general practice, order parameters by how much they vary call-to-call.

```js
const alphanumeric = R.replace(/[^A-Z0-9]+/gi, "");
const sanitize = R.pipe(alphanumeric, R.toLower, R.take(6));
const formatUsernames = R.pipe(R.map(sanitize), R.join(", "));

const usernames = formatUsernames([
  "John Doe",
  "Leeeeeeeeeeeeeroy Jenkins!!!!!",
  "<script>window.alert(1)</script>"
]);
//=> "johndo, leeeee, script"
```

## Immutable Data Manipulation
Sometimes it's helpful to immutably update data structures, where a new reference is returned and the original data remains unmodified.

```js
const obj = {};
const obj2 = R.assocPath(
  ["x", "y", 1],
  "world",
  obj
);
const arr = R.update(0, "hello", obj2.x.y)
const arr2 = R.dropLastWhile(R.test(/^w/), arr);
//obj => {}
//obj2 => {x: {y: [null, "world"]}}
//arr => ["hello", "world"]
//arr2 => ["hello"];
```

Some use cases for this include shared state, undo history, caches, and rendering optimizations.

## Lenses
Lenses pair a getter and a setter, and can be passed to `R.over` to define the location of an operation on a data structure.

```js
const todosPath = ["data", "todos"];
const getTodos = R.pathOr([], todosPath); //default of []
const setTodos = R.assocPath(todosPath);
const todosLens = R.lens(getTodos, setTodos);
const todosOp = R.curry((op, state) => R.over(todosLens, op, state));

const addTodo = (todo, state) => todosOp(R.append(todo), state);
const reverseTodos = todosOp(R.reverse);
const sortTodos = todosOp(R.sortBy(R.toLower));
const clearTodos = todosOp(R.empty);

let state = {};
state = addTodo("walk dog", state);
state = addTodo("book hotel", state);
state = addTodo("go shopping", state);
//=> {data: {todos: ["walk dog", "book hotel", "go shopping"]}}
state = reverseTodos(state);
//=> {data: {todos: ["go shopping", "book hotel", "walk dog"]}}
state = sortTodos(state);
//=> {data: {todos: ["book hotel", "go shopping", "walk dog"]}}
state = clearTodos(state);
//=> {data: {todos: []]}}
```

## Links
* [Simple stack machine implementation](https://gist.github.com/csauve/5912c4c58a42052df8300902d4b012ea)
* [Awesome list of functional JS projects](https://github.com/stoeffel/awesome-fp-js)
