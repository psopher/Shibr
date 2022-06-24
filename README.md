# Project 4: Shibr Inulytics

---
### Overview
---
This project is Philip's fourth and final fully developed exercise at General Assembly's Software Engineering Immersive course.

The assignment was to create a full stack website comprised of a backend that uses Django/Python to store user-generated data on an SQL database and a frontend that uses React and React-based frameworks. The project was to be completed solo within nine days.

I chose to create "Shibr Inulytics" because there are plenty of applications that allow people to post photos and get feedback on them, but none that do this for a full dating profile, and my contention is that a photo is different in the context of an entire profile than it is on its own. Moreover, doing this with Shibas is more fun than it would be for human dating profiles, though it's just the seed-data that's Shiba-related — the site could easily be switched to human dating profiles.  


Are you curious to see the end result? [Check out the site.](https://shibr.herokuapp.com/) 

---
### Brief
---
* A full stack website that stores user-generated data in an SQL database.
* A React frontend that is connected to the backend.
* User registration, login, and authentication.
* Write a readme.
* Commit early and often to Github.
* Complete it in nine days.

---
### Technologies Used
---
* HTML
* CSS
* Sass
* GoogleFonts
* JavaScript
* Git and GitHub
* Cloudinary
* React
  - React hooks: useState, useEffect, BrowserRouter, Route, Routes, useNavigate, Link, useParams
* Material UI
  - Components: Avatar, Button, CssBaseline, TextField, Link, Grid, Box, LockOutlinedIcon, Typography, Container, createTheme, AppBar, Toolbar, IconButton, Menu, Tooltip, MenuItem, AddIcon, SettingsIcon, DarkModeIcon, LockOutlinedIcon, LightModeIcon, FormControl, FormControlLabel, Select, InputLabel, Slider, Checkbox, OutlinedInput, Paper, ToggleButton, ToggleButtonGroup, PhotoCamera, styled, Accordion, AccordionSummary, AccordionDetails, Pagination, TextareaAutosize, Stack, Tabs, Tab, Divider
* Adobe
  - Illustrator
  - PhotoShop
* Axios
* Django/Python
  - psycopg2-binar
  - pylint
  - autopep8
  - djangorestframework
* SQL
* TablePlus
* Insomnia
* JSON Web Token / bcrypt
* Quick DB
* Excalidraw


---
### Frontend Interface
---
The interface includes 11 pages:
* Home.js is the root page, where users see shiba profiles, swipe right or left on them, and provide feedback.
* Login.js is where the user logs in. Users are not allowed to see the app without being logged in.
* Register.js is where a new user can register
* NotFound.js is the 404 page
* RequestError.js is the request error page
* PageNavbar.js is the navbar. It has the logo and name of the site on the left. On the right, when a user is logged in, there is a dark-mode toggle and a menu bar that allows users to click on their own account or to log out. When a user is logged out,  the righthand side is different, containing only "Login" and "Register" options that link to the respective pages
* UserAccount.js is the user's profile. It has the user profile image and information at the top, and at the bottom is a tab bar where users can toggle between their current and past profile tests and their overall inulytics for all profiles
* SingleProfile.js is where users can view their old profiles or the profiles of their social media matches. It is accessed by pressing the '>' button on the profiles list or the social media matches list
* Settings.js is where users specifiy the gender of Shibas they are interested in, the age range that interests them, whether they want to be shown on Shibr, and whether they want to exchange social media with matches
* NewProfile.js is where users create new profiles by adding images and inputting their name, age, schooling, and bio
* SocialMediaMatches.js is where users can see a list of their social media matches. It is accessed by clicking on the number next to "Social media matches" in the Inulytics tab of the UserAccount.js


---
### Backend Models and Controllers
---
The backend includes 5 models:
* User: 
  - Database fields: username, email, password, profile_image, karma, interested_in, min_age, max_age, show_me, give_social, ig, sc, tw
  - Populated fields: profiles, swipes, and matches
* Profile: 
  - Database fields: name, bio, age, images, school, gender, ownerId
  - Populated fields: owner and swipes
* Swipe:
  - Database fields: right_swipe, swiper_id, swiped_profile_id
  - Populated fields: feedback, swiper_id, swiped_profile_id
* Match:
  - Database fields: exchange_social_media, matched_users
  - Populated fields: none
* Feedback:
  - Database fields: best_image_index, best_image_comments, worst_image_index, worst_image_comments, bio_overall, bio_good_comments, bio_bad_comments, swipe_id
  - Populated fields: none

To create or update profiles the user must first get past an IsAuthenticated test that checks to see if the user's id matches the one on the jwt web token associated with the user id.

The server uses django to listen for route calls and connect to the SQL backend.

A Quick DB mockup of the backend relationships is shown [here.](/client/src/images/Quick%20DB%20Mockup.png) 

---
### Approach
---


#### Planning
The first step was to brainstorm ideas for a site. After deciding on one, I created Excalidraw mockups for the site and decided to go with Material UI as the frontend React Framework. I then created a Quick DB diagram of the backend before beginning on the coding.

#### Coding
The first bit of coding I did was to set up the Django app and all of my models and views and then make sure the Insomnia requests were hitting endpoints and doing what they were supposed to do. When this was done, I moved onto the frontend, setting up the folder structures, the Index.js, the App.js, and the PageNavBar before creating browser pages.

Once the site had all the functionality I wanted, styling became the focus. I added a dark mode, a custom color palette, and custom fonts, along with general stylistic enhancements so that it rendered well on mobile as well as on desktop


---
### Screenshots
---
![Homepage](/client/src/images/homejs.png)
![User Profile](/client/src/images/user-accountjs.png)
![Feedback](/client/src/images/feedbackjs.png)
![Inulytics](/client/src/images/inulytics.png)
![New Profile](/client/src/images/new-profilejs.png)

---
### Challenges
---
This was my first time using a Django/Python/SQL backend, so my biggest challenge was creating models that didn what I wanted them to do with the least repetition possible.

Once the backend was set up in a satisfactory way, the next challenge was to create all of the frontend pages with all of the functionality I wanted within the time allotted, as this was quite an ambitious project to complete in nine days.

As for passing data, the most complicated part was the Inulytics sections, which required complex array method manipulations to be what I wanted them to be in the end.

---
### Wins
---
The biggest win was the end result! I'm extremely proud of what I ended up with and how much I was able to do.

---
### Ideas for Future Improvements
---
The number one thing is to refactor the code so it's as efficient as possible.

Another thing I'd like to do is tinker around a bit more with the backend models to see if there is a way of structuring it that makes the inulytics array methods less complicated.

The site a good MVP, but there are a lot of small enhancements that could be made to make it better, so perhaps the next thing to do is make a list of all them and then tackle each of them one by one.