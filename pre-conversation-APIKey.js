/**
 * Copyright IBM Corp. 2017
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 *
 * Extended the skeleton to retrieve the API Key for IBM Cloud Functions and
 * to split it into required components. The key is then added to the
 * JSON structure in the context section. It will be consumed by
 * Watson Conversation to invoke server actions within dialog nodes.
 *
 * Written by Henrik Loeser
 */

'use strict';

/**
 * Here the user can edit the channel input message before send to Conversation module.
 *
 * @param  {JSON} params - input JSON sent by the channel module
 * @return {JSON}        - modified input JSON to be sent to the conversation module
 */
 function main(params) {
     const returnParams = params;

     // retrieve API Key from environment and split it into user / password
     var arr=process.env['__OW_API_KEY'].split(":");
     // check if context exists
     if (typeof(returnParams.conversation.context) === 'undefined') {
         var context={context: {}}
         Object.assign(returnParams.conversation, context);
     }
     // if credentials already exists, we don't have to add them
     // else add credentials under private element in context
     if (typeof(returnParams.conversation.context.icfcreds) === 'undefined') {
         var privcontext = {"private": {icfcreds: {user: arr[0], password: arr[1]}}};
         Object.assign(returnParams.conversation.context, privcontext);
     }

     return returnParams;
 }

 module.exports = main;
