---
date: 2018-06-14
---

# Organizing files by context hierarchies

If you're like me, you think there's usually a "right" way to organize a bunch of files and you'll spend time to find it. Over time I have found that a simple rule of thumb, which I call **"group by context"**, works best for me.

If you embrace filesystem entropy, jump ship now! Otherwise, if you need a little convincing...

## Why spend the time?

Properly organizing a collection takes some time investment, but the benefit is two fold: efficiency in common tasks, and not losing things.

Digitally or physically, it's a sort of index we can use to get what we need quickly and ensure we aren't forgetting something. It grows the set of things we can _effectively_ possess, and provides a system to access parts of that collection relevant to the task we're trying to accomplish. The better the organizing, the more tools at our disposal.

## Context hierarchies

My basic method is that things often used together should be grouped together (group by context). This sounds obvious, but applying it consistently is key.

Firstly, the principle should be applied hierarchically, with directories themselves grouped into more general directories. Find common sets of use cases to narrow down your searches.

The goal is to minimize the time and number of steps needed to find a relevant few items in the entire collection. This can be done by splitting up directories when they get too big and avoiding unnecessarily deep nestings. Like a well balanced search tree, average case should only require [`O(log n)`][2] decisions to find an item.

When an item could be used in multiple contexts, or is otherwise hard to place, I suggest placing it at the most specific level of the tree which still contains both use cases.

## Pitfalls of placement

Again, the above might make sense in theory but in practice collections can grow into a dumping ground instead of a library. Here's a few reasons I can think of:

1. We can't quickly think of the contexts in which we'll need something, so we skip placing it
2. The contexts change over time or didn't meet our expectations
3. The means of organization are difficult
4. Grouping by _type_ is easy but doesn't scale. For example, putting all images together and all word docs together

I try to avoid these pitfalls by:

1. Not over-organizing from the start, and letting the grouping evolve naturally as I use the collection. Deep directory trees with sparse files are a smell and should be flattened or generalized to combine adjacent contexts. "Temporary" directories with files I keep coming back to are also a smell.
2. Accepting that I may need to reorganize from time to time. Keep to a rough maximum number of items in a directory which you can visually scan. If I had difficulty finding something, I ask "why?"
3. Preferring highly portable means of organization like files and directories over tagging. Take advantage of common tools like the CLI or GUI explorers to perform bulk operations or searching
4. Taking OS-provided directories like Documents, Downloads, and Pictures with a grain of salt. Just because something was downloaded from online doesn't mean it needs to live in Downloads forever, and maybe that photo of a receipt better belongs with workplace files than in Pictures

## Example: code source tree

It's often said that code is meant for humans and not compilers. The same should apply for the package/souce tree layout; maintenance of a codebase is easiest when the code we need to find for a change is localized, quick to identify, and decoupled from other code. The source tree can be a powerful tool to achieve these goals.

Consider the following example multi-user todo list project, and the task "require users to have unique emails".

```
src/
  TodoListAppMain.java
  database/
    UserStorage.java
    TodoStorage.java
    DatabaseHelpers.java
  logic/
    UserManager.java
    TodoManager.java
  entities/
    User.java
    Todo.java
    EntityBase.java
```

This tree groups code by _type_ of operations, but this isn't usually how we approach a project to make a change. I would need to explore 3 different packages to find all the `User*` code. As we know, [naming things is hard][1] and in a less contrived example this layout does not help us when text search and visual grepping fails.

Whole-project code searching helps identify files when you know what you're looking for, but we cant rely _just_ on this tool. It is time consuming and mentally taxing to search code usages and build a call graph in our heads to identify what parts of the project need attention.

Instead, let's organize the tree so we have an easy to identify bound on files relevant to a typical concern, and hide away supporting code.

```
src/
  TodoListAppMain.java
  users/
    UserStorage.java
    UserManager.java
    User.java
  todos/
    TodoStorage.java
    TodoManager.java
    Todo.java
  shared/
    DatabaseHelpers.java
    EntityBase.java
```

By grouping classes by _context_, the user-related task is more likely localized to a single package. Any code shared by multiple concerns is put in a package to identify it as such, which also highlights good candidates for extraction from the project.

## Beyond files
I find this type if organization works well in all sorts of activities, not just for files. Email filters, bookmarks, and real world organization benefit from the principle of _group by context_. I hope this post helps you in your journey to organization zen!


[1]: https://martinfowler.com/bliki/TwoHardThings.html
[2]: https://en.m.wikipedia.org/wiki/Big_O_notation