# Authentication_Security

This project is built from Angela Yu's Online Web Development Course, where she goes over the 6 Levels of Authentication : See Below. 

1) Level 1 - Username and Password Only - 
   commit 1af2c5437694e589bdd9e13690230953d34fa03a

2) Level 2 - Encryption - 
   commit 699a4a6a4c0905e84accb0512b8234ce8dcc0f67

 2B) Add Environment Vars - 
   commit 0579d8db31089a79873b3241109407ac59310b3c

3) Level 3 - Hashing with md5 -
   commit 63aec6a4f3a7b0fb3452297021aba4bb91c3d56f

4) Level 4 - Hashing and Salting with bcrypt - 
   commit 4e17c1ccc1fe1ec4eeb6b4f0cace0cea6b335c8d

5) Level 5 - Cookies and Sessions - 
   commit dbe4e90ae11b3d783f46f61e531f1a8ab34be6bd

6) Level 6 - Google OAuth 2.0 Authentication - 
   commit e73794d994e362a3c901c4d6e33a4c1b76d7f261

7) Code Base for Live Deployement to Heroku using MongoDB Atlas as the Database - 
   commit 038f1079a54e5bc461fea5ada8f9e9cb469b72fb

In this project, we primarily use Node.js, EJS, MongoDB, Passport.js, & passport-google-oauth20

To view the various levels once you have cloned the project, enter into the terminal "git log" this will list all the commits as mentioned above. Enter into the terminal git checkout "the preferred commit number" to view the selected level.Level 6 demonstrates the use of the highest form of security and authentication , using Google Oauth & Passport.js. Please note for Level 2B & Level 6 you will need .env file to have the project started. Level 7 is the code base which i used to get my project running live on Heroku and interacting with MongoDB Atlas - the live link can be found here - https://my-secret-auth-app-e0e751b16de3.herokuapp.com/.

To get started:
1) Once you have cloned the project to your preferred Code Editor , make sure to "npm install" through the various levels 1-6.
2) In each level 1-6 run "nodemon app.js" , remember Level 2B & 6 will require .env file. For Level 6 you will need your own Client_ID & Client_SECRET from the google developer console.

   
