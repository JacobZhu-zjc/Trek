![Production Deployment](https://github.com/ubc-cpsc455-2024S/project-04_trekkers/actions/workflows/deploy-production.yml/badge.svg)
![Tests](https://github.com/ubc-cpsc455-2024S/project-04_trekkers/actions/workflows/run-tests.yml/badge.svg)

<a href="#">
    <img src="images/Trek-logo-and-tagline.png" alt="Backbenchers Logo" title="Backbencers" align="right" height="60" />
</a>

# Trek

## About This Project

Have you ever tried to plan a group trip with your friends, but it never left
the group chat? Trek is designed for you, making it easy with
real-time collaboration, interactive maps, and personalized recommendations!
With Trek, you'll easily be able to create and share the perfect trip.

## Development Team (Group 4)

- **Jacob Zhu** [:octocat:](https://github.com/JacobZhu-zjc) [📧](mailto:jzhu46@student.ubc.ca) - "Too sleepy for my own good..."
- **Justin Lieu**  [:octocat: ](https://github.com/jlieu88) [📧](mailto:jlieu@student.ubc.ca) - "I love drinking coffee"
- **Kevin Xu**  [:octocat: ](https://github.com/lebeanshoe) [📧](mailto:kxu20@student.ubc.ca) - "I love cats and dogs"
- **Matthew Kang**  [:octocat:](https://github.com/kang-matthew) [📧](mailto:matt0410@students.cs.ubc.ca) - "I like software"
- **William Xiao** [:octocat:](https://github.com/Mooncey) [📧](mailto:munce@students.cs.ubc.ca) - "operating systems nerd"


## Course Team

<a href="https://www.ubc.ca/">
<img src="https://brand3.sites.olt.ubc.ca/files/2018/09/5NarrowLogo_ex_768.png" alt="Coast Capital Savings Logo" align="left" height="60" width="auto" />
</a> 

The project is facilitated and supported by the **CPSC 455** course offered by the Computer Science department of the **University of British Columbia**. The coruse is instructed by 	
**Ian McLean** and **Dr. Firas Moosvi**, and the Teaching Assistants for **Team Trek (Group 4)** are ...

## Repository Structure

Refer to the ***Trek Installation and Deployment Guide*** (to be written) on the Project Wiki for a detailed explanation of the repository structure.

```
.
├── CODE_OF_CONDUCT.md
├── LICENSE
├── README.md
├── frontend         🎨 Frontend directory
│   ├── ...
├── backend          🔙 Backend directory
│   ├── ...
├── database         🚜 Database Schema
│   ├── ...
├── tests            🧪 Tests
└── images
```

### Important Directories and Explanation

`frontend/` is where the front-end code is in.

`backend/` is where the back-end code is in.

`documentation/` is where all PDF documentations that are not in the project wiki are located in.

`database/` is where database scripts are in.

`backend/test/` and `frontend/test/` are where the tests are in.

## Task Requirements
Last Updated July 26, 2024

### Minimal
- User profiles & accounts
  - [X] Users can create, view, edit, and delete profiles
    - User profile pages
    - Authentication page (and/or other third-party integrations)
    - User settings page
    - Persistent user data storage in MongoDB
- Trips
  - [X] Users can create, manage, and modify trips
    - Trip creation / editing page
    - Page to view all the trips for a user
    - Store user trip information in Mongo when done
  - [X] Users can delete trips
  - [X] Users can share trip iternaries with others, with different access levels
  - [X] Users can use APIs to fetch destination information
  - [X] Users can display trip details and routes on a map
 
### Standard
- Users
  - [X] Users can set and update travel preferences in their profiles
  - [X] Users can set and update privacy settings
- Trips
  - [ ] Users can interact with a map to modify trip routes and details
    - (Jul 26) We are planning to complete this standard goal during our group
      work session on July 28. The design is already prepared, which gives us
      confidence we have the technical ability to accomplish it by the deadline.
- Trip Budgets
  - [ ] Users can manage trip budgets (e.g. transportation, housing. etc.) 
    - (Jul 26)
- Trip Recommendations
  - [X] Collects and stores user data for personalized trip recommendations
  - [ ] Analyzes user data using AI to identify patterns and preferences
    - (Jul 26) We already have a proof-of-concept for this, however the
      development work is not done yet. Since we have the design we are aiming
      to complete this on our work session Jul 28.
  - [ ] Generates personalized trip recommendations based on analyzed user data
    - (Jul 26) See the point above this one
### Stretch
- Trips
  - [ ] Users can duplicate existing trip itineraries for new trips
  - [ ] Users can set transportation of getting to an item of an itinerary
  - [ ] Users can see weather information of a destination
- Trip Budgets
  - [ ] Users get personalized budget alerts and recommendations to stay within a budget
- Trip Recommendations
  - [ ] Users can give feedback on generated recommendations
  - [ ] User feedback can affect future recommendations
  - [ ] Comprehensive documentation is provided to the users about how trip recommendations work
- Chatbot
  - [ ] Integrated chatbot gives users help with trip planning tasks and gives suggestions based on user input
  - [ ] Chatbot can adapt to user preferences and give personalized responses
  - [ ] Chatbot collects user feedback for continuous improvement

## Images

<!-- insert sketches here later -->
<img src="images/455 Project - Mockup for UI 1.png" width="1200px">
<img src="images/455 Project - Mockup for UI 2.png" width="1200px">
<img src="images/455 Project - Mockup for UI 3.png" width="1200px">

## References

{Add your stuff here}



