# Automatically set up services and actions for tutorial on
# Database-backed Slackbot with Watson conversation
#
# Written by Henrik Loeser

# create Db2 Warehouse service and service credentials
# bx service create dashDB Entry eventDB
# bx service key-create eventDB slackbotkey

# create IBM Watson Conversation service
# bx service create conversation free eventConversation

# create package
bx wsk package create slackdemo

# create action for setup using Node.js environment
bx wsk action create slackdemo/db2Setup db2-setup.js  --kind nodejs:8

# bind action to Db2 credentials
bx wsk service bind dashDB slackdemo/db2Setup  --instance eventDB

# invoke actions to create table, then insert sample data
bx wsk action invoke slackdemo/db2Setup -p mode "[\"setup\"]" -r
bx wsk action invoke slackdemo/db2Setup -p mode "[\"sampledata\"]" -r

# action to fetch a single event by name
bx wsk action create slackdemo/fetchEventByShortname eventFetch.js  --kind nodejs:8
bx wsk service bind dashDB slackdemo/fetchEventByShortname --instance eventDB

# action to fetch a single event by dates
bx wsk action create slackdemo/fetchEventByDates eventFetchDate.js  --kind nodejs:8
bx wsk service bind dashDB slackdemo/fetchEventByDates  --instance eventDB

# action to insert a new event
bx wsk action create slackdemo/eventInsert eventInsert.js  --kind nodejs:8
bx wsk service bind dashDB slackdemo/eventInsert  --instance eventDB
