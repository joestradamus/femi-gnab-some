Overview
-------

__Femi-Gnab-Some__ (working title, also thinking of Patrignarky as an alternative) is a web application designed 
to pull live Twitter data based on a given geocode (a given latitude, longitude, and radius), and analyze the
sentiment of tweets that contain text with a gendered subject. The goal is to analyze a distinction, if any, 
in the treatment of digital persons on the basis of gender. 

How it Works
------

To get a sense of what's possible, let's look at some of the steps I'm taking:
 1. Get information about a tweet of a user in a given location
 2. Filter by tweets that only contain a gendered subject
 3. Do some sentiment analysis on that tweet
 4. Write these results to a file

#### Getting a Tweet

Twitter has a nicely documented[API](https://dev.twitter.com/docs)that enables developers to request data from their
servers if they follow some basic guidelines. After creating a developer account, registering my application, and 
storing my credentials in a privately kept `credentials.json` file, I can set up requests to Twitter using
a simple HTTP GET request (I use the package[Twit](https://github.com/ttezel/twit)to handle most of the heavy work for me)
 
 In the code, this looks like
 ```javascript
 const twitter = new Twit(credentials) // load authentication details
 const sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ] // the coordinates of a city
 const stream = twitter.stream('statuses/filter', { locations: sanFrancisco }) // listen for new tweets
 stream.on('tweet', (tweet) => { // when a new tweet appears
     logTweet(tweet) // call a seperate function to do something with it
 })
 ```

Here's what the server looks like in action when it's listening for tweets:
<img src="misc/start-server-demo.gif" width="500"/>

Major Packages of Interest
------

[Compromise](https://nlp-expo.firebaseapp.com/)- A syntactically intuitive natural language processing library. 
Comes with an API for parsing sentences into specific clauses, nouns, people, and topics (to name a few); it even gives 
a best-guess of inferred gender.

[Sentiment](https://github.com/thisandagain/sentiment)- A sentiment analysis library based on the AFINN-165 wordlist,
"a list of English words rated for valence with an integer between minus five (negative) and plus five (positive). 
The words have been manually labeled by Finn Årup Nielsen in 2009-2011." [Read more](http://www2.imm.dtu.dk/pubdb/views/publication_details.php?id=6010)

Tech Stack Used
------

Major Frameworks
* Node and Express for the server routes (and API endpoints eventually)
* React for the view engine (using the fantastic tool [create-react-app](https://github.com/facebookincubator/create-react-app))
* SCSS for CSS pre-processing

