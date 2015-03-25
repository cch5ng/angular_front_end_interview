# Application for Front End Interview Questions

* As an entry level Front End Web Developer, I got interested in creating an application that would give random interview questions for testing myself
* [The source of these questions is under the h5bp github repo](http://h5bp.github.io/Front-end-Developer-Interview-Questions/)
* My initial idea is to create a basic application (form and output) for people who would take technical interview tests
  * I would like to add a timer to check that I'm not rambling in my responses to verbal questions or taking too long with coding problems
* A second idea would be to create another application to people who would give technical interview tests (hiring managers, lead programmers)
  * Initial feature ideas include the ability to save favorite questions (boiler plate interview questions)
  * A print stylesheet for only the interview questions
  * Ability to prioritize favorite questions (like from easiest to hardest, or other)
  * If you have additional suggestions, please open an issue/feature request

## Caveats

* In the current form, as a web scraper, this source code is extremely brittle and if the original questions source contributors decide to change the format of their source html page, this application may break
* (known issue) It would be better to parse the text from the main source README.mdn file but this is currently a little outside of my abilities

## Disclaimer

*Yeah, I could totally see you shaking your head wondering why someone would spend hours to create such an app when you could simply print out the original list and choose questions manually. Honestly, I was just curious how it would be possible to generate the data model from the current data storage (text or html).

## Resources

[For using promises when controller depends on an async function within a service] (http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/)