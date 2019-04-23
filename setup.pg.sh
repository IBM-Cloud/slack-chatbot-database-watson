# Automatically set up services and actions for tutorial on
# Database-backed Slackbot with Watson Assistant (conversation)
#
# Written by Henrik Loeser

if [ -z "$1" ]; then 
              echo usage: $0 theSecret
              exit
fi
theSecret=$1

# create IBM Cloud Databases for PostgreSQL service and service credentials
# ibmcloud resource service-instance-create eventDB databases-for-postgresql standard us-south
# ibmcloud resource service-key-create slackbotkey Editor --instance-name eventDB

# create IBM Watson Assistant (Conversation) service
# ibmcloud service create conversation free eventConversation
# create package
ibmcloud fn package create slackdemo

# create action for setup using Node.js environment
ibmcloud fn action create slackdemo/dbSetup postgreSQL-setup.js  --kind nodejs:8

# bind action to database credentials
ibmcloud fn service bind databases-for-postgresql slackdemo/dbSetup  --instance ICD-PostgreSQL-Henrik

# invoke actions to create table, then insert sample data
ibmcloud fn action invoke slackdemo/dbSetup -p mode "[\"setup\"]" -r
ibmcloud fn action invoke slackdemo/dbSetup -p mode "[\"sampledata\"]" -r

# action to fetch a single event by name
ibmcloud fn action create slackdemo/fetchEventByShortname eventFetch.pg.js  --kind nodejs:8 --web true --web-secure $theSecret
ibmcloud fn service bind databases-for-postgresql slackdemo/fetchEventByShortname --instance ICD-PostgreSQL-Henrik

# action to fetch a single event by dates
ibmcloud fn action create slackdemo/fetchEventByDate eventFetchDate.pg.js  --kind nodejs:8 --web true --web-secure $theSecret
ibmcloud fn service bind databases-for-postgresql slackdemo/fetchEventByDate --instance ICD-PostgreSQL-Henrik

# action to insert a new event
ibmcloud fn action create slackdemo/eventInsert eventInsert.pg.js  --kind nodejs:8 --web true --web-secure $theSecret
ibmcloud fn service bind databases-for-postgresql slackdemo/eventInsert  --instance ICD-PostgreSQL-Henrik

