# Automatically clean up
#
# Written by Henrik Loeser

# Clean up database
bx wsk action invoke slackdemo/db2Setup -p mode "[\"cleanup\"]" -r

# Delete IBM Cloud Functions actions and package
bx wsk action delete slackdemo/db2Setup
bx wsk action delete slackdemo/fetchEventByShortname
bx wsk action delete slackdemo/fetchEventByDates
bx wsk action delete slackdemo/eventInsert
bx wsk package delete slackdemo
