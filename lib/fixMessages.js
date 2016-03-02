'use strict';

var Bot = require('slackbots');

// create a bot
var settings = {
    token: process.env.BOT_API_KEY,
    name: 'Stuff Fixer'
};
var bot = new Bot(settings);
var userFixes = {
    doliveira: {
        fixFn: function(data){
            if(!data || !data.text){ return; }
            var text = _fixApostrophe(data.text);
            if(text){
                bot._postFixedMessage('general', data.user, this.name, text);
            }
        }
    },
    andrefs: {
        fixFn: function(data){
            if(!data || !data.text){ return; }
            var text = _fixApostrophe(data.text);
            if(text){
                bot._postFixedMessage('general', data.user, this.name, text);
            }
        }
    },
    '*': {
        fixFn: function(data){
            if(!data || !data.text){ return; }
            var text = _fixApostrophe(data.text);
            if(text){
                bot._postFixedMessage('general', data.user, bot._userNames[data.user], text);
            }
        }
    }
};
var _fixApostrophe = function(text){
    var res = text
        .replace(/a' /,'á ').replace(/a'$/,'á')
        .replace(/e' /,'é ').replace(/e'$/,'é')
        .replace(/i' /,'í ').replace(/i'$/,'í')
        .replace(/o' /,'ó ').replace(/o'$/,'ó')
        .replace(/u' /,'ú ').replace(/u'$/,'ú')
    if(res !== text){
        return res !== text ? res : null
    }
}
bot._postFixedMessage = function(channel, userID, userName, text){
    var self = this;
    self.postMessageToChannel(channel, '', {attachments:[{
        pretext: '<@'+userID+'|'+userName+'> _was trying to say:_',
        text: text,
        color: '#439FE0',
        mrkdwn_in: ["text", "pretext"]
    }]});
}
bot._userNames     = {};
bot._userFunctions = {};

bot._onStart = function(){
    var self = this;
    //bot.postMessageToChannel('general', "Hi everyone, I'm here to fix some of the stupid stuff you say!");
    console.log("Hi everyone, I'm here to fix some of the stupid stuff you say!");
    bot._initUserFunctions();
}

bot._onMessage = function(data){
    // Not a user message
    if(!data.user){ console.log('Message without user ID, ignoring...'); return; }

    var name = bot._userNames[data.user];
    // Error, ID not found, can't fix message!
    if(!name){ console.log("User '"+name+"' ID not found!"); return; }

    if(bot._userFunctions[name]){
        console.log("Calling fix function for user '"+name+"'...");
        bot._userFunctions[name].fixFn(data);
    } else {
        console.log("Couldn't find a fix function for user '"+name+"', using default...");
        bot._userFunctions['*'].fixFn(data);
    }
}

bot._initUserFunctions = function(){
    var self = this;
    // Get users
    self.getUsers().then(function(data){
        data.members.forEach(function(user){
            // Store the map between user ID and Name
            bot._userNames[user.id] = user.name;
            // If there's a fix function for this user, index it using
            // the user name
            if(userFixes[user.name]){
                bot._userFunctions[user.name] = {
                    name  : user.name,
                    id    : user.id,
                    fixFn : userFixes[user.name].fixFn
                };
            }
        });
        bot._userFunctions['*'] = {
            fixFn: userFixes['*'].fixFn,
        };
        console.log('Got userFunctions for '+Object.keys(self._userFunctions).length+' users:', Object.keys(self._userFunctions));
    });
}

bot.on('start',   bot._onStart  );
bot.on('message', bot._onMessage);

