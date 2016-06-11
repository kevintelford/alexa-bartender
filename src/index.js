'use strict';
/**
 * The Bartender.
 *
 * Examples:
 * Dialog model:
 *  User: "..."
 *  Alexa: "<response>"
 */


////////////// INTERACTION TEXT //////////////
var CARD_TITLE = "The Bartender";

var WELCOME_TEXT = "With The Bartender, you can ask for full instructions on how to make a drink, what ingredients go into a drink, or how to mix it.  For example, you could ask: how do I make a dirty martini, <break time=\".4s\"/> what ingredients go into an old fashioned, <break time=\".4s\"/> or how do you mix a mint julep.  <break time=\".4s\"/> Now, what can I get you?";
// TODO : Amazon mods have no sense of humor
// var WELCOME_REPROMPT_TEXT = "Bueller? <break time=\"1s\"/> Bueller? <break time=\"1s\"/> Bueller? <break time=\"1.5s\"/> What can I get you?";
var WELCOME_REPROMPT_TEXT = "I'm sorry. <break time=\"1s\"/> What can I get you?";

var HELP_TEXT = "Sorry I wasn't clear.  " + WELCOME_TEXT;
// var HELP_REPROMPT_TEXT = "Bueller? <break time=\"1s\"/> Bueller? <break time=\"1s\"/> Bueller? <break time=\"1.5s\"/> What can I get you?";
var HELP_REPROMPT_TEXT = "I'm sorry. <break time=\"1s\"/> What can I get you?";

var ISSUE_TEXT = "Sorry, something went wrong.  Lets try again.  " + WELCOME_TEXT;
// var ISSUE_REPROMPT_TEXT = "Bueller? <break time=\"1s\"/> Bueller? <break time=\"1s\"/> Bueller? <break time=\"1.5s\"/> What can I get you?";
var ISSUE_REPROMPT_TEXT = "I'm sorry. <break time=\"1s\"/> What can I get you?";

// var MISSED_INTENT_TEXT = "Sorry, that guy was yelling about <phoneme alphabet=\"ipa\" ph=\"jeɪɡərˌbɒms\">jager bombs</phoneme> "
//     + "and I didn't quite catch what you said. Tell me what you would like again?";
var MISSED_INTENT_TEXT = "Sorry I didn't quite catch what you said. Tell me what you would like again?";
// var MISSED_INTENT_REPROMPT_TEXT = "Bueller? <break time=\"1s\"/> Bueller? <break time=\"1s\"/> Bueller? <break time=\"1.5s\"/> What can I get you?";
var MISSED_INTENT_REPROMPT_TEXT = "I'm sorry. <break time=\"1s\"/> What can I get you?";

var PAUSE_2S = "<break time=\"2s\"/>";

var DRINK_RESPONSE_POSTFIX_TEXT = "Would you care to hear the ingredients or mix instructions again?";
// var DRINK_RESPONSE_REPROMPT_TEXT = "Waka waka waka! <break time=\"1s\"/> Do you want to hear the ingredients or mix instructions again?";
var DRINK_RESPONSE_REPROMPT_TEXT = "Do you want to hear the ingredients or mix instructions again?";

var INGREDIENTS_RESPONSE_POSTFIX_TEXT = "Would you care to hear the ingredients or mix instructions again?";
// var INGREDIENTS_RESPONSE_REPROMPT_TEXT = "Waka waka waka! <break time=\"1s\"/> Do you want to hear the ingredients or mix instructions again?";
var INGREDIENTS_RESPONSE_REPROMPT_TEXT = "Do you want to hear the ingredients or mix instructions again?";

var INSTRUCTIONS_RESPONSE_POSTFIX_TEXT = "Would you care to hear the ingredients or mix instructions again?";
// var INSTRUCTIONS_RESPONSE_REPROMPT_TEXT = "Waka waka waka! <break time=\"1s\"/> Do you want to hear the ingredients or mix instructions again?";
var INSTRUCTIONS_RESPONSE_REPROMPT_TEXT = "Do you want to hear the ingredients or mix instructions again?";


/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill'),
    config = require('./config'),
    drinkApiService = require('./drinkApiService');

/**
 * App ID for the skill
 */
var APP_ID = config.production.amazon.appId;


/**
 * BartenderSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var BartenderSkill = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
BartenderSkill.prototype = Object.create(AlexaSkill.prototype);
BartenderSkill.prototype.constructor = BartenderSkill;

/**
 * Overriden to show that a subclass can override this function to initialize session state.
 */
BartenderSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("BartenderSkill onSessionStarted - requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // Any session init logic would go here.
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
BartenderSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("BartenderSkill onLaunch - requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeAskResponse(response);
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
BartenderSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("BartenderSkill onSessionEnded - requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    //Any session cleanup logic would go here.
};

BartenderSkill.prototype.intentHandlers = {


    ////////////// ROOT INTENTS //////////////

    // how do you / how to make a <drink>
    "DrinkIntent": function (intent, session, response) {
        var input = intent.slots.drinkname.value;
        console.log("BartenderSkill DrinkIntent - input: \"" + input + "\", sessionId: " + session.sessionId);
        if (input) {
            var drinkRecipe = getDrinkRecipe(input);
            getDrinkRequestAskResponse(drinkRecipe, input, session, response);
        } else {
            // TODO : do something better here?
            getDidntCaptureIntentAskResponse(response);
        }
        console.log("BartenderSkill DrinkIntent completed - sessionId: " + session.sessionId);
    },
    // what goes in / into a <drink>
    "IngredientsIntent": function (intent, session, response) {
        var input = intent.slots.drinkname.value;
        console.log("BartenderSkill IngredientsIntent - input: \"" + input + "\", sessionId: " + session.sessionId);
        if (input) {
            var drinkRecipe = getDrinkRecipe(input);
            getDrinkIngredientsAskResponse(drinkRecipe, input, session, response);
        } else {
            // TODO : do something better here?
            getDidntCaptureIntentAskResponse(response);
        }
        console.log("BartenderSkill IngredientsIntent completed - sessionId: " + session.sessionId);
    },
    // how to / do you mix a <drink>
    "InstructionsIntent": function (intent, session, response) {
        var input = intent.slots.drinkname.value;
        console.log("BartenderSkill InstructionsIntent - input: \"" + input + "\", sessionId: " + session.sessionId);
        if (input) {
            var drinkRecipe = getDrinkRecipe(input);
            getDrinkInstructionsAskResponse(drinkRecipe, input, session, response);
        } else {
            // TODO : do something better here?
            getDidntCaptureIntentAskResponse(response);
        }
        console.log("BartenderSkill InstructionsIntent completed - sessionId: " + session.sessionId);
    },



    ////////////// RESPONSE INTENTS //////////////

    // instructions / yes / list / what were the ingredients
    "IngredientsIntentResponse": function (intent, session, response) {
        if(session.attributes.drinkRecipe) {
            console.log("BartenderSkill IngredientsIntentResponse - sessionId: " + session.sessionId);
            getRepeatDrinkIngredientsAskResponse(session, response);
        } else {
            // kind of hacky, but, we need to force the "root" intents to be initialized first, however you can jump right to these intents from a new session, so... ¯\_(ツ)_/¯
            console.log("BartenderSkill IngredientsIntentResponse without root intent, redirecting to 'there was an issue' - sessionId: " + session.sessionId);
            // TODO : do something better here?
            getThereWasAnIssueAskResponse(response);
        }
    },
    // instructions / yes / list / instructions / how did / do you do it
    "InstructionsIntentResponse": function (intent, session, response) {
        if(session.attributes.drinkRecipe) {
            console.log("BartenderSkill InstructionsIntentResponse - sessionId: " + session.sessionId);
            getRepeatDrinkInstructionsAskResponse(session, response);
        } else {
            // kind of hacky, but, we need to force the "root" intents to be initialized first, however you can jump right to these intents from a new session, so... ¯\_(ツ)_/¯
            console.log("BartenderSkill InstructionsIntentResponse without root intent, redirecting to 'there was an issue' - sessionId: " + session.sessionId);
            // TODO : do something better here?
            getThereWasAnIssueAskResponse(response);
        }
    },



    ////////////// MISC INTENTS //////////////

    "AMAZON.StopIntent": function (intent, session, response) {
        console.log("BartenderSkill StopIntent - sessionId: " + session.sessionId);
        response.tell("Ok, enjoy that drink.");
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        console.log("BartenderSkill CancelIntent - sessionId: " + session.sessionId);
        response.tell("Ok, enjoy that drink.");
    },
    "AMAZON.NoIntent": function (intent, session, response) {
        console.log("BartenderSkill NoIntent - sessionId: " + session.sessionId);
        response.tell("Ok, enjoy that drink.");
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        console.log("BartenderSkill HelpIntent - sessionId: " + session.sessionId);
        getHelpAskResponse(session, response);
    }

};


////////////// DATA FUNCTIONS //////////////
function getDrinkRecipe(input) {
    console.log( "Getting drink recipe from our APIs - input: " + input );

    // query API(s)
    var drinkRecipe = drinkApiService.getBestMatch(input);

    return drinkRecipe;
}


////////////// FUNCTIONS TO HANDLE MISC RESPONSES //////////////

function getWelcomeAskResponse(response) {
    console.log( "Creating welcome ask response." );
    response.askWithCard(buildSsmlOutput(WELCOME_TEXT), buildSsmlOutput(WELCOME_REPROMPT_TEXT), CARD_TITLE, WELCOME_TEXT);
}
function getHelpAskResponse(response) {
    console.log( "Creating help ask response." );
    response.askWithCard(buildSsmlOutput(HELP_TEXT), buildSsmlOutput(HELP_REPROMPT_TEXT), CARD_TITLE, HELP_TEXT);
}
function getThereWasAnIssueAskResponse(response) {
    console.log( "Creating 'there was an issue' ask response." );
    response.askWithCard(buildSsmlOutput(ISSUE_TEXT), buildSsmlOutput(ISSUE_REPROMPT_TEXT), CARD_TITLE, ISSUE_TEXT);
}
function getDidntCaptureIntentAskResponse(response) {
    console.log( "Creating 'didnt capture intent' ask response." );
    response.askWithCard(buildSsmlOutput(MISSED_INTENT_TEXT), buildSsmlOutput(MISSED_INTENT_REPROMPT_TEXT), CARD_TITLE, MISSED_INTENT_TEXT);
}


////////////// FUNCTIONS TO HANDLE CORE RESPONSES //////////////

function getDrinkRequestAskResponse(drinkRecipe, input, session, response) {
    console.log("Creating drink ask response - input: \"" + input + "\", drinkName: " + drinkRecipe.name + ", sessionId: " + session.sessionId);

    session.attributes.drinkRecipe = drinkRecipe;

    var speechText = drinkRecipe.fullInstructions + PAUSE_2S + DRINK_RESPONSE_POSTFIX_TEXT;

    console.log("Returning ask response for a drink - input: \"" + input + "\", drinkName: " + drinkRecipe.name + ", sessionId: " + session.sessionId + ", responseText: " + drinkRecipe.fullInstructions);
    response.askWithCard(buildSsmlOutput(speechText), buildSsmlOutput(DRINK_RESPONSE_REPROMPT_TEXT), CARD_TITLE, drinkRecipe.fullInstructions);
}
function getDrinkIngredientsAskResponse(drinkRecipe, input, session, response) {
    console.log("Creating drink ingredients ask response - input: \"" + input + "\", drinkName: " + drinkRecipe.name + ", sessionId: " + session.sessionId);

    session.attributes.drinkRecipe = drinkRecipe;

    var speechText = drinkRecipe.ingredientsInstructions + PAUSE_2S + INGREDIENTS_RESPONSE_POSTFIX_TEXT;

    console.log("Returning ask response for drink ingredients - input: \"" + input + "\", drinkName: " + drinkRecipe.name + ", sessionId: " + session.sessionId + ", responseText: " + drinkRecipe.ingredientsInstructions);
    response.askWithCard(buildSsmlOutput(speechText), buildSsmlOutput(INGREDIENTS_RESPONSE_REPROMPT_TEXT), CARD_TITLE, drinkRecipe.ingredientsInstructions);
}
function getDrinkInstructionsAskResponse(drinkRecipe, input, session, response) {
    console.log("Creating drink mix instructions ask response - input: \"" + input + "\", drinkName: " + drinkRecipe.name + ", sessionId: " + session.sessionId);

    session.attributes.drinkRecipe = drinkRecipe;

    var speechText = drinkRecipe.mixInstructions + PAUSE_2S + INSTRUCTIONS_RESPONSE_POSTFIX_TEXT;

    console.log("Returning ask response for drink mix instructions - input: \"" + input + "\", drinkName: " + drinkRecipe.name + ", sessionId: " + session.sessionId + ", responseText: " + drinkRecipe.mixInstructions);
    response.askWithCard(buildSsmlOutput(speechText), buildSsmlOutput(INSTRUCTIONS_RESPONSE_REPROMPT_TEXT), CARD_TITLE, drinkRecipe.mixInstructions);
}
function getRepeatDrinkIngredientsAskResponse(session, response) {
    console.log("Getting drink ingredients from session - sessionId: " + session.sessionId);

    if(session.attributes.drinkRecipe) {
        var drinkRecipe = session.attributes.drinkRecipe;
        var speechText = drinkRecipe.ingredientsInstructions + PAUSE_2S + INGREDIENTS_RESPONSE_POSTFIX_TEXT;

        console.log("Returning ask response for drink ingredients from session - drinkName: " + drinkRecipe.name + ", sessionId: " + session.sessionId + ", responseText: " + drinkRecipe.ingredientsInstructions);
        response.askWithCard(buildSsmlOutput(speechText), buildSsmlOutput(INGREDIENTS_RESPONSE_REPROMPT_TEXT), CARD_TITLE, drinkRecipe.ingredientsInstructions);

    } else {

        console.log("Unable to get drink response from session, will reprompt use for drink - sessionId: " + session.sessionId);
        getThereWasAnIssueAskResponse();
    }
}
function getRepeatDrinkInstructionsAskResponse(session, response) {
    console.log("Getting drink mix instructions from session - sessionId: " + session.sessionId);

    if(session.attributes.drinkRecipe) {
        var drinkRecipe = session.attributes.drinkRecipe;
        var speechText = drinkRecipe.mixInstructions + PAUSE_2S + INSTRUCTIONS_RESPONSE_POSTFIX_TEXT;

        console.log("Returning ask mix instructions for drink ingredients from session - drinkName: " + drinkRecipe.name + ", sessionId: " + session.sessionId + ", responseText: " + drinkRecipe.mixInstructions);
        response.askWithCard(buildSsmlOutput(speechText), buildSsmlOutput(INSTRUCTIONS_RESPONSE_REPROMPT_TEXT), CARD_TITLE, drinkRecipe.mixInstructions);

    } else {

        console.log("Unable to get drink response from session, will reprompt use for drink - sessionId: " + session.sessionId);
        getThereWasAnIssueAskResponse();
    }
}


////////////// API FUNCTIONS //////////////
// TODO : API calls


////////////// HALPER FUNCTIONS //////////////

function buildSsmlOutput(responseText) {
    return {
        speech: "<speak>" + responseText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };

}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WiseGuy Skill.
    var skill = new BartenderSkill();
    skill.execute(event, context);
};
