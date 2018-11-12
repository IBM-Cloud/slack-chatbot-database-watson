/**
 * Copyright 2016,2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// load configuration
require('dotenv').load();

var Botkit = require('botkit');
var express = require('express');
var middleware = require('botkit-middleware-watson')({
  iam_apikey: process.env.ASSISTANT_API_KEY,
  workspace_id: process.env.ASSISTANT_WORKSPACE_ID,
  url: process.env.ASSISTANT_GATEWAY_URL || 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2017-05-26'
});


// define our own BEFORE handling to retrieve credentials for
// IBM Cloud Functions and pass them in as context variable
middleware.before = function(message, conversationPayload, callback) {
  // Code here gets executed before making the call to Watson Assistant.

  // retrieve API Key from environment and split it into user / password
  var arr=process.env.ICF_KEY.split(":");
  // check if context exists
  if (typeof(conversationPayload.context) === 'undefined') {
      var context={context: {}}
      Object.assign(conversationPayload, context);
  }
  // if credentials already exists, we don't have to add them
  // else add credentials under private element in context
  if (typeof(conversationPayload.context.icfcreds) === 'undefined') {
     var privcontext = {"private": {icfcreds: {user: arr[0], password: arr[1]}}};
     Object.assign(conversationPayload.context, privcontext);
  }

  // log the payload structure for debugging
  // console.log(conversationPayload)
  callback(null, conversationPayload);
}

// Configure your bot.
var slackController = Botkit.slackbot({clientSigningSecret: "made with love"});
var slackBot = slackController.spawn({
  token: process.env.SLACK_TOKEN
});
slackController.hears(['.*'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  slackController.log('Slack message received');
  middleware.interpret(bot, message, function() {
    if (message.watsonError) {
      console.log(message.watsonError);
      bot.reply(message, message.watsonError.description || message.watsonError.error);
    } else if (message.watsonData && 'output' in message.watsonData) {
      bot.reply(message, message.watsonData.output.text.join('\n'));
    } else {
      console.log('Error: received message in unknown format. (Is your connection with Watson Conversation up and running?)');
      bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
    }
  });
});

slackBot.startRTM();

// Create an Express app
var app = express();
var port = process.env.PORT || 5000;
app.set('port', port);
app.listen(port, function() {
  console.log('Client server listening on port ' + port);
});
