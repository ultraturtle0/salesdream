# GSWFP Internal Server

## /login

## /introduction
First seven questions, including:
    * scheduler for the Zoom call, using Google calendar API

## /onboarding
Currently a follow-up questionnaire - these might mostly be transitioned into the external questionnaire.

## /hiring
Hiring funnel including QBO test, background check, contractor contract, and W9, ending with thank you page.

### /QBOtest
### /thankyou

## /ledger
Will eventually be transitioned into an accounting toolkit page - a form for current credit cards and bank account information, to be compiled into a Google drive spreadsheet.

## /questionnaire/:id
The /questionnaire endpoint captures a previously-generated link with a corresponding Link object stored in our MongoDB database. The resulting form makes a POST request to [ ], which stores the questionnaire results in a json object in MongoDB.

