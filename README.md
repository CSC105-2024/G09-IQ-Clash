Rest API
==================================================================================

For user

Post 1. localhost:3000/user/register => to signup (Require 1.Username 2. Password )
     2. localhost:3000/user/login => to login
     
Delete localhost:3000/user/:id => to delete user account

Patch localhost:3000/user/:id => to change their username


For leaderboard

Get localhost:3000/leaderboard => to get the leaderboard


For quiz

Get 1.localhost:3000/quiz => to get all quizzes in database
    2.localhost:3000/quiz/:topic => to get all quizzess according to the topic in database.
    
Post localhost:3000/quiz => to add new quiz via database (Require 1.Category 2.Question 3. options 4. answer)


For summary
Get localhost:3000/summary => to get user summary

Post localhost:3000/summary => to submit the summary to database
