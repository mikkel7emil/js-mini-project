# js-mini-project

## Links

[mLab (DB)](https://mlab.com/home)

## Mini Project
To make the technologies we are going to cover throughout the semester a bit more interesting, many of the coming exercises will be focused on a common project idea, as outlined below:

## Model/idea
The idea is to have a backend for users, as sketched in this model. 
A user can have a geo-position, which will be sent from his phone. The position will only “live” for a short time, in order to be up-to-date. If not updated before this time, it will be removed. Users can also hold several job positions (programmer, student, football trainer etc.)
Authenticated Users, can create LocationBlog-entries as sketched in the figure and, also authenticated users, can “like” an entry (once only).

The model is deliberately held very simple, and miss many parts necessary for a “real” system. The model is also meant ONLY  as initial thoughts, which should be used as inspiration during the Schema Design.

## Architecture (what it is you have to build)
This diagram illustrates what you are expected to 
build throughout the semester. This is not a single system, but rather three small demo systems with a lot of redundancy meant to try out different technologies. Having a common database + facade for all projects makes it easier to get time for all of it.

## Part-1: 
The first part represents a traditional web application, built with server-side rendering (pug, ejs or handlebars) and a MongoDB/mongoose database. Via this app, you should be able to log-in, create blog entries, and ideally also watch and like these entries.

## Part-2:
A simple friend-finder app, where you can log-in, via a phone, provide a radius to search for friends, and will be provided with a map, with the position of all your friend (inside this radius) 

## Part-3: 
Will introduce features from 1+2, but this time using Graph-QL, in order to demonstrate the advantages of this new technology