# Create the services
ibmcloud cf create-service dashDB Entry eventDB
ibmcloud cf create-service-key eventDB slackbotkey
ibmcloud cf create-service conversation free eventConversation
