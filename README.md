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

## How to deploy
* Periodically I am manually getting the latest h5bp README.mdn file contents to use as the source for this application's data. It appears to get updated once every couple of months.
  * Get the raw markdown contents from https://raw.githubusercontent.com/h5bp/Front-end-Developer-Interview-Questions/master/README.md
  * Run the markdown file contents through the site, dillinger.io, and export the output to unstyled HTML.
  * Rename the resulting HTML file to h5bp_readme.html and place that file in this project's app/src folder.
* Use the instructions from https://gist.github.com/cobyism/4730490 to create a gh-pages branch based on the subdirectory, \app
  * Delete the current gh-pages branch from github
  * \# git subtree push --prefix app origin gh-pages
  * Edit the angular_front_end_interview/main/main.js file. Disable the original var interviewURL (line 14). Enable the production var interviewURL (line 16).

## Caveats

* In the current form, as a web scraper, this source code is extremely brittle and if the original questions source contributors decide to change the format of their source html page, this application may break
* (known issue) It would be better to parse the text from the main source [README.mdn](https://github.com/h5bp/Front-end-Developer-Interview-Questions) file but this is currently a little outside of my abilities. (update) I just got a suggestion from a JS.LA cohort (shout to Aaron) to look for a markup parser so I'm going to check one out - SWEEEETTT!
  * Note that in the README.mdn, there is no jQuery section and there is a Networking section but these changes have not been reflected in the project's gh-pages site (used as this application's source)

## Disclaimer

* Yeah, I could totally see you shaking your head wondering why someone would spend hours to create such an app when you could simply print out the original list and choose questions manually. Honestly, I was just curious how it would be possible to generate the data model from the current data storage (text or html).

## Resources

* Promises
  * [Concepts video by Domenic Denicola](https://www.youtube.com/watch?v=MNxnHbyzhuo)
  * [For using promises when controller depends on an async function within a service](http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/)