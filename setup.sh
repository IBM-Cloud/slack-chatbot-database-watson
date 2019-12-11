# Automatically set up services and actions for tutorial on
# Database-backed Slackbot with Watson Assistant (conversation)
#
# Written by Henrik Loeser

if [ -z "$2" ]; then 
              echo usage: $0 theSecret DB_SERVICE
              exit
fi
theSecret="$1"
DB_SERVICE="$2"


# create an IAM namespace
ibmcloud fn namespace create slackbot --description "namespace for Slackbot tutorial"

# set the new namespace as default
ibmcloud fn property set --namespace slackbot

# create package
ibmcloud fn package create slackdemo

# create action for setup using Node.js environment
ibmcloud fn action create slackdemo/db2Setup db2-setup.js  --kind nodejs:10

# bind action to Db2 credentials
ibmcloud fn service bind $DB_SERVICE slackdemo/db2Setup  --instance eventDB

# invoke actions to create table, then insert sample data
ibmcloud fn action invoke slackdemo/db2Setup -p mode "[\"setup\"]" -r
ibmcloud fn action invoke slackdemo/db2Setup -p mode "[\"sampledata\"]" -r

# dispatcher with subfunctions as single action
ibmcloud fn action create slackdemo/dispatch dispatch.js  --kind nodejs:10 --web true --web-secure $theSecret
ibmcloud fn service bind $DB_SERVICE slackdemo/dispatch --instance eventDB
