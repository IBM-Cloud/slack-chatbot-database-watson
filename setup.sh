# Automatically set up services and actions for tutorial on
# Database-backed Slackbot with Watson Assistant (conversation)
#
# Written by Henrik Loeser

if [ -z "$1" ]; then 
              echo usage: $0 theSecret
              exit
fi
theSecret=$1


# create Db2 Warehouse service and service credentials
# ibmcloud cf create-service dashDB Entry eventDB
# ibmcloud cf create-service-key eventDB slackbotkey

# create IBM Watson Assistant (Conversation) service
# ibmcloud cf create-service conversation free eventConversation

# create package
ibmcloud fn package create slackdemo

# create action for setup using Node.js environment
ibmcloud fn action create slackdemo/db2Setup db2-setup.js  --kind nodejs:8

# bind action to Db2 credentials
ibmcloud fn service bind dashDB slackdemo/db2Setup  --instance eventDB

# invoke actions to create table, then insert sample data
ibmcloud fn action invoke slackdemo/db2Setup -p mode "[\"setup\"]" -r
ibmcloud fn action invoke slackdemo/db2Setup -p mode "[\"sampledata\"]" -r

# action to fetch a single event by name
ibmcloud fn action create slackdemo/fetchEventByShortname eventFetch.js  --kind nodejs:8 --web true --web-secure $theSecret
ibmcloud fn service bind dashDB slackdemo/fetchEventByShortname --instance eventDB

# action to fetch a single event by dates
ibmcloud fn action create slackdemo/fetchEventByDates eventFetchDate.js  --kind nodejs:8 --web true --web-secure $theSecret
ibmcloud fn service bind dashDB slackdemo/fetchEventByDates  --instance eventDB

# action to insert a new event
ibmcloud fn action create slackdemo/eventInsert eventInsert.js  --kind nodejs:8 --web true --web-secure $theSecret
ibmcloud fn service bind dashDB slackdemo/eventInsert  --instance eventDB
