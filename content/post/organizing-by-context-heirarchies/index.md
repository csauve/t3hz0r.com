# Organizing by context hierarchies
<time>2018-05-25</time>

Do you ever spend far too long wondering where your files should live? Have you fretted over the package layout of a Java project? How about spending hours trying to organize your kitchen to save time later?

No? Must be nice! But if you're like me, you think there's an ideal way to organize most collections and feel a bit frustrating if you can't find it. When there are multiple plausible ways to organize some set of things, you know you won't be satisfied until you've found the _right_ one. I'd like to share my strategy for organization, which I call **"group by context, not type"**. But first...

## Why spend the time?
Properly organizing a collection takes some time investment, but I think it's worth it. The value is two fold: efficiency in common tasks, and not losing things.

Digitally or physically, it's a sort of index we can use to get what we need quickly and ensure we aren't forgetting something. It grows the set of things we can _effectively_ possess, and provides a system to access parts of that collection relevant to the task we're trying to accomplish. The better the organizing, the more tools at our disposal.

Neither a messy storage garage nor a single folder of thousands of images are effective, and must be searched one item at a time. So what causes a collection to grow into a dumping ground instead of a library, even if we're sometimes trying to avoid it? I think this happens when:

1. We can't find a mental model to organize by
2. The model changes over time
3. The means of organization do not match our model

## Context hierarchies
Because organizing is for the benefit of particular tasks or _contexts_, I find that **grouping by context** is effective.

This can be done recursively, with groupings created as necessary. This type of organization is common digitally (filesystems) and has good physical analogues in the way we use containers and rooms. Items or groups used together tend to be stored together, and this forms a "tree".

The goal is to minimize the time/number of steps needed to find an item in the collection. This can be done by splitting up groups when they get too big and avoiding unnecessarily deep nestings. For the computer scientists, the average case should only require `O(log n)` decisions to find an item. In other words, doubling the number of things you keep doesn't double the time taken to find something.

When an item could be used in multiple contexts, or is otherwise hard to place, I suggest placing it at the most specific level of the tree which is still general enough to. It's like how every house has one of those "stuff" drawers.

## The type trap


## Case studies

### A Java project source tree
It really doesn't matter to the compiler what your source tree looks like, so long as the imports are correct. But code's meant for humans to understand, and that goes for the source tree layout too. Maintenance of a codebase is easiest when the code we need to read and the changes we need to make are as localized as possible.

Consider the following straw man source tree:

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

This tree groups code by _type_ of operations, but this isn't usually how we approach a project to make a change. Supposing I had the task of "require users to have unique names", I would need to explore 3 different packages to find all the `User*` code. In a less contrived example, this would be hampered by a larger codebase and any poor class name choices making it harder to identify user-related code.

Instead, let's organize the tree like so:

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
  common/
    DatabaseHelpers.java
    EntityBase.java
```

By grouping classes by _context_, my user-related task is now likely localized to a single package. Any code is shared by many concerns is put in a `common` package to identify it as such, which also highlights good candidates for extraction from the project. This layout is more resilient to unconventional class naming and discourages coupling between separate concerns.

### Kitchen


### Documents

 For example, with a directory tree, there will be some number of subdirectories which is easy to scan and make a decision on which to descend into, but also large enough that the parent directory doesn't seem pointless. Consistency with sibling directories is

### Travel photos

### Backpack

### Books

### URL schemes

## Tagging
What about tagging? Lots of software supports it, and it has reasonable analogues in the real world like colour-coded sticky notes.

I see tagging as a flexible organization strategy, but ultimately too tedious without helpful tooling. Tags just aren't ubiquitous and portable enough.

Maybe AI will improve this?