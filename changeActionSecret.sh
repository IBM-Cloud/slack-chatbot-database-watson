# simple script to set the web action secret on the
# actions used by the Slackbot

if [ -z "$1" ]; then 
              echo usage: $0 newSecret
              exit
fi
newSecret=$1

# action to fetch a single event by name
ibmcloud fn action update slackdemo/fetchEventByShortname --web true --web-secure $newSecret

# action to fetch a single event by dates
ibmcloud fn action update slackdemo/fetchEventByDates --web true --web-secure $newSecret

# action to insert a new event
ibmcloud fn action update slackdemo/eventInsert --web true --web-secure $newSecret