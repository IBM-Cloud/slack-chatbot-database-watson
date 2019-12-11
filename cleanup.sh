# Automatically clean up
#
# Written by Henrik Loeser

# Clean up database
ibmcloud fn action invoke slackdemo/db2Setup -p mode "[\"cleanup\"]" -r

# Delete IBM Cloud Functions actions and package
ibmcloud fn action delete slackdemo/db2Setup
ibmcloud fn action delete slackdemo/dispatch
ibmcloud fn package delete slackdemo

# Clean up the namespace
echo "You can delete the IAM namespace created during setup with the"
echo "following command. It will delete all objects in that namespace!"
echo ""
echo "ibmcloud fn namespace delete slackbot"
