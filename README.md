**Note:**   
Code relating to a previous version of the tutorial that utilized Cloud Foundry organization and spaces for IBM Cloud Functions is available in the branch [CloudFoundry-based-20191114](https://github.com/IBM-Cloud/slack-chatbot-database-watson/tree/CloudFoundry-based-20191114). The current version is based on using IAM namespaces for Cloud Functions packages and actions.

An even older code version along with the related instructions is kept in the [branch v1_upto_2019_04](https://github.com/IBM-Cloud/slack-chatbot-database-watson/tree/v1_upto_2019_04).

# Build a database-driven Slackbot with IBM Watson™ Assistant

Code to build a Slackbot to create and search Db2 database entries for events and conferences. The Slackbot is backed by the IBM Watson Assistant service. As an alternative, an IBM Cloud Databases for PostgreSQL database can be used instead of Db2. The related files have an additional `.pg.` in their name. 

The tutorial with detailed step-by-step instructions is available at https://cloud.ibm.com/docs/tutorials?topic=solution-tutorials-slack-chatbot-database-watson#slack-chatbot-database-watson. The tutorial is part of the [IBM Cloud tutorials](https://cloud.ibm.com/docs/tutorials?topic=solution-tutorials-tutorials#tutorials) 

# Files in this repository
The files in this repository have the following purpose:
* [changeActionSecret.sh](changeActionSecret.sh): shell script to update (change) the secret for invoking the web actions used by the chatbot. You still need to manually update the related dialog node.
* [cleanup.sh](cleanup.sh): shell script to drop Db2 table and delete Db2-related Cloud Functions actions
* [conversation-workspace.json](conversation-workspace.json): Workspace file used with IBM Watson Assistant service
* [db2-setup.js](db2-setup.js): code for Cloud Functions action which creates a Db2 table, fills it with sample data or cleans it up
* [eventFetch.js](eventFetch.js): code for Cloud Functions action which searches event data by identifier
* [eventFetchDate.js](eventFetchDate.js): code for Cloud Functions action which searches event data by dates
* [eventInsert.js](eventInsert.js): code for Cloud Functions action to insert a new record into a Db2 database
* [setup.sh](setup.sh): shell script to set up Cloud Functions actions, bind credentials, create a Db2 table and fill sample data
* [tables.sql](tables.sql): table schema


# Files for IBM Cloud Databases for PostgreSQL
The following files are adapted versions to be used for PostgreSQL instead of Db2:
* [cleanup.pg.sh](cleanup.pg.sh): shell script to drop PostgreSQL table and delete related Cloud Functions actions
* [postgreSQL-setup.js](postgreSQL-setup.js): code for Cloud Functions action which creates a PostgreSQL table, fills it with sample data or cleans it up
* [eventFetch.pg.js](eventFetch.pg.js): code for Cloud Functions action which searches event data by identifier
* [eventFetchDate.pg.js](eventFetchDate.pg.js): code for Cloud Functions action which searches event data by dates
* [eventInsert.pg.js](eventInsert.pg.js): code for Cloud Functions action to insert a new record into a PostgreSQL database
* [setup.pg.sh](setup.pg.sh): shell script to set up Cloud Functions actions, bind credentials, create a PostgreSQL table and fill sample data

# Changes for IBM Cloud Hyper Protect DBaaS
IBM Cloud offers [Hyper Protect DBaaS](https://cloud.ibm.com/catalog/services/hyper-protect-dbaas) as highly secured data storage service. One of the options is PostgreSQL as database system. If you want to use the PostgreSQL code from the previous section, then you only need to adapt the functions in the way how credentials are passed. Replace `dbSetup` with the other function names.

```
function main({mode, __bx_creds: {'hypersecuredbaas': {url}}}) {
  	return dbSetup(dbURI=url, mode);
}
```

# Related Content
Chatbot-related blog posts:
* [Database-driven Slack chatbot with Conversation service](https://www.ibm.com/blogs/bluemix/2018/02/database-slack-chatbot-conversation/)
* [Slack Chatbot with PostgreSQL Backend](https://www.ibm.com/blogs/bluemix/2018/12/slack-chatbot-with-postgresql-backend/)
* [Chatbots: Some tricks with slots in IBM Watson Conversation](https://www.ibm.com/blogs/bluemix/2018/02/chatbots-some-tricks-with-slots-in-ibm-watson-conversation/)
* [Lively chatbots: Best Practices](https://www.ibm.com/blogs/bluemix/2017/07/lively-chatbots-best-practices/)
* [Building chatbots: more tips and tricks](https://www.ibm.com/blogs/bluemix/2017/06/building-chatbots-tips-tricks/)

