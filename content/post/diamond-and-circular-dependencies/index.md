---
date: 2018-04-01
---

# Diamond and circular dependencies

I draw a lot of dependency diagrams at work. It's a good way to tease apart concerns and question the architecture of an application. There are a couple common patterns I've come across in a service oriented architecture which can seem like dead ends, but with a perspective shift they can become tractable for refactoring.

## Diamond dependencies
Assume this diamond dependency pattern which often shows up in a SOA. Each service or component may be communicating with its dependencies through some mechanism like HTTP, or simply as libraries within a single application.

```
      A         APIs, UIs
     / \
    B   C       business logic
   / \ / \
  D   E   F     data stores
```

Service E owns some data which is needed to make decisions in services B and C, and the results of both are used to make decisions in service A.

What's nice about the above is that A is shielded from implementing calls against E. It can rely on the fact that B and C are capable of looking up E's data on their own and returning the right decisions.

However, when A needs to make a decision, there will be a duplicated calls to service E by B and C. There is nothing inherently wrong with this, but since this pattern often starts in libraries which evolve into remote services over time, this can later result in more load on E and latency for users because of the wasted remote calls.

One easy approach is introducing cacheing into E. This works well where access patterns result in low cache miss rates, but there is risk it becomes a crutch over time that encourages adding more dependencies on E.

Assuming B and C are mainly depended on for their logic, another approach is refactoring them into libraries which only accept data and removing their ability to lookup that data independently.

```
      A- - - - - .
     /|\         |
    / | \       B,C
   /  |  \
  D   E   F
```

There is now a direct dependency on E from A. It will lookup data from D, E, and F, pass it into libraries B and C, then make its own decisions based on the results. While A is no longer shielded from implementing calls to E, I would argue this has not increased the scope of A's knowledge about its dependencies since E was previously a transitive dependency whose effect on services B and C should have been part of their documented interfaces.

The result is essentially combining the scope of B and C into A.

## Circular dependencies
Sometimes you will discover that two components (or black boxes of sub-components) depend on each other:

```
  A <-----> B
```

This is a smell; a sign of responsibilities not being granular enough. I've found it's always possible to identify sub-components within one of A or B that turns the diagram into this:

```
   ______
  |      |
  |  A1  |---------------> B
  |      |                 |
  |------|                 |
  |      |                 |
  |  A2  |<----------------'
  |______|
```

A1 may depend on A2, but regardless both are deployed together or otherwise part of the same service. Because it was difficult to identify the split responsibilities of A, it's likely this will happen during development too, causing further coupling of A1 and A2.

To address this situation, split out A1 and A2 into separate services or libraries, or perform refactoring within A to clearly delineate the separation.
