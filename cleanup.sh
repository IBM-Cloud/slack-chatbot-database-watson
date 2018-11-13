# Automatically clean up
#
# Written by Henrik Loeser

# Clean up database
ibmcloud fn action invoke slackdemo/db2Setup -p mode "[\"cleanup\"]" -r

# Delete IBM Cloud Functions actions and package
ibmcloud fn action delete slackdemo/db2Setup
ibmcloud fn action delete slackdemo/fetchEventByShortname
ibmcloud fn action delete slackdemo/fetchEventByDates
ibmcloud fn action delete slackdemo/eventInsert
ibmcloud fn package delete slackdemo
