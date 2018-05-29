# Automatically clean up
#
# Written by Henrik Loeser

# Clean up database
ibmcloud wsk action invoke slackdemo/db2Setup -p mode "[\"cleanup\"]" -r

# Delete IBM Cloud Functions actions and package
ibmcloud wsk action delete slackdemo/db2Setup
ibmcloud wsk action delete slackdemo/fetchEventByShortname
ibmcloud wsk action delete slackdemo/fetchEventByDates
ibmcloud wsk action delete slackdemo/eventInsert
ibmcloud wsk package delete slackdemo
