# Facets of software
<time>2018-04-02</time>

Something that really sets enterprise software apart from a personal project is the sheer number of competing concerns that need to be addressed during its development. It's really easy to take a user story, jump into business logic changes, move on to testing, and deploy it. That's agile, right?

However, I've found that the business logic changes are rarely the only concerns to consider. A bigger picture, which generalizes across so many of your tasks, might be an implied part of the process but rarely documented in each user story. You probably don't write "implement unit tests" in your stories, because that's not customer value and you're going to do it anyway, but what else is missing?

I think our stories too often miss the other users of software and their requirements, and this results in underestimate stories. I like to think of these extra requirement sets as "facets" which may not be immediately obvious, but exist nonetheless because of the context enterprise software exists in.

Here are some common ones I can think of:

## Testability
A good suite of set of unit and integration tests goes a long way to preventing deployed defects, but testability doesn't come for free. Aside from the time spent actually writing the test cases, the tested code needs to be architected in a way thats amenable to testing. Personally, I lean heavily on the [dependency inversion principle][2] to ensure clean decoupling between layers, and mocking dependencies to test those layers in isolation.

## Operational support
Operational issues are an inevitability. Ideally, the application handles events idempotently and can retry important operations before waking up an engineer. Only when absolutely necessary, after all attempts have failed, should the application require human intervention.

In a way, the on-call is another end user interacting with the application through an entirely different set of interfaces: logging, alerts, metrics, on-host CLI tools, etc. UX is as much a concern here as it is for a web app.

Logging should be detailed yet easily scanned. Only log at error level when you really intend for a developer to do something about it. Alerts should be actionable, with a description of what went wrong, why, and what exactly to do about it.

## Humans in the loop
Related to the above, consider which dependencies the system has on humans and what errors they can make. How does the application account for it? How can it prevent it, and is there a need for humans in the loop at all?

## Customer communication
Who are _all_ of the customers? Make sure there is due communication before changes are deployed, even if you've already been in talks with the product   owner. This especially includes any customer service team who needs to explain changes to external customers. A good test for this is, "will anyone be surprised _in a bad way_ if I deploy this?"

This may involve writing some documentation for internals, or allowing them to use a feature in a test environment to create screenshots.

## Acceptance testing
When the story's implementation is complete, you may do some acceptance testing with stakeholders. Consider how you can speed up this process--I've had success with documenting self-guided "tours" where stakeholders can follow some use cases in the test environment on their own time. Regardless, it will still take some time to set up test data and documentation.

## Deployment
When the application is deployed, will it require further authorizations and throttling configuration with its dependencies? What new values need to be configured for each environment? Is any new infrastructure required?

Besides technical concerns, the deployment schedule may depend on coordination with customer communication, another organizational events, and the risk of deploying before holidays and weekends. If possible, limit the impact of large changes by gradually rolling them out with a customer whitelist or percentage ramp-up.

## Cost and performance
Spend some time thinking about the applications current and planned access patterns and request load. Look for opportunities to parallelize, denormalize, cache, and index to reduce unnecessary latency for users and the running time of batch operations. Optimization is only premature when it does not add value, and there is definitely value in avoiding a time-consuming DB schema change and data migration later when it could have been avoided with some upfront planning.

## Code as peer-education
Plan to spend time organizing your source tree and code to aid in readability and understanding. This is an opportunity to use code to educate your peers, because [nobody's just reading your code][1]. Add commenting to justify the original context for design choices.

When it comes time to create a pull request for your changes, also spend some time to summarize the background of the story, add comments generously, and even attach diagrams. This will give reviewers the context needed to leave thoughtful feedback.

## UX and accessibility
Stories often list detailed conditions of satisfaction about _what_ the user's use cases are, but leaves the _how_ unspecified. With non-trivial UI work, plan to involve the UX team early for advise and/or mockups. This is a great way to get insight into UX best practices and to find underspecified requirements before implementation begins. Try using your web app with a screen reader and see how easy it is.

## Security
The risks in handling customer data are always present, and it must always be considered how to either avoid handling it entirely or mitigate the security risks. Beyond customer data, we need to think about our runtime environments and the infrastructure they run on. Implementing secure systems is not a constant cost, but one that recurs with ever security update required for the runtime, infrastructure, dependencies, and cryptographic standards we manage.

---

These are off the top of my head, and I probably forgot something important. Regardless, the main takeaway is that stories rarely require only code changes. Even just remembering this is sufficient to trigger a group brainstorming session in story gathering. You can imagine that some of these concerns, if forgotten, could be serious blockers to delivering!

While we need to ask the cost/benefit of any work we do, I don't believe in compromising on security and would push against compromising on the other facets above. When cost becomes too high, cut scope (stories) instead. What I've found time and time again is that we end up paying for these facets regardless, and often many times over, if they are not done right from the onset. This is especially true for operational load.

When it comes to implementing the above, do it in passes. Give some initial thought to all of them to make sure you aren't painting yourself into a corner, then begin with a business logic and testing pass. Follow it up with additional logging, then performance optimizations, and so on.

[1]: http://akkartik.name/post/comprehension
[2]: https://en.wikipedia.org/wiki/Dependency_inversion_principle
