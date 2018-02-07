# Build a database-driven Slackbot with IBM Watson™ Conversation
Code to build a Slackbot to create and search Db2 database entries for events and conferences. The Slackbot is backed by the IBM Watson Conversation service. We integrate Slack and Conversation using the Conversation connector in a serverless way. 


Tutorial available at https://console.bluemix.net/docs/tutorials/slack-chatbot-database-watson.html, it is part of [IBM Cloud tutorials](https://console.bluemix.net/docs/tutorials/index.html) 

# Files in this repository
The files in this repository have the following purpose:
* [cleanup.sh](cleanup.sh): shell script to drop Db2 table and delete Db2-related Cloud Functions actions
* [conversation-workspace.json](conversation-workspace.json): Workspace file used with IBM Watson Conversation service
* [create-services.sh](create-services.sh): shell script which can be used to create Db2 Warehouse and Conversation services
* [db2-setup.js](db2-setup.js): code for Cloud Functions action which creates a Db2 table, fills it with sample data or cleans it up
* [eventFetch.js](eventFetch.js): code for Cloud Functions action which searches event data by identifier
* [eventFetchDate.js](eventFetchDate.js): code for Cloud Functions action which searches event data by dates
* [eventInsert.js](eventInsert.js): code for Cloud Functions action to insert a new record into a Db2 database
* [pre-conversation-APIKey.js](pre-conversation-APIKey.js): code for Cloud Functions action to customize an action of the Conversation connector
* [setup.sh](setup.sh): shell script to set up Cloud Functions actions, bind credentials, create a Db2 table and fill sample data
* [tables.sql](tables.sql): table schema
* [update-pre-conversation.sh](update-pre-conversation.sh): shell script to update the pre-conversation action


# Related Content
Chatbot-related blog posts:
* [Chatbots: Some tricks with slots in IBM Watson Conversation](https://www.ibm.com/blogs/bluemix/2018/02/chatbots-some-tricks-with-slots-in-ibm-watson-conversation/)
* [Lively chatbots: Best Practices](https://www.ibm.com/blogs/bluemix/2017/07/lively-chatbots-best-practices/)
* [Building chatbots: more tipcs and tricks](https://www.ibm.com/blogs/bluemix/2017/06/building-chatbots-tips-tricks/)

