# Create the services
ibmcloud service create dashDB Entry eventDB
ibmcloud service key-create eventDB slackbotkey
ibmcloud service create conversation free eventConversation
