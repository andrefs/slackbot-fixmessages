'use strict';

var Bot = require('slackbots');

// create a bot
var settings = {
    token: 'xoxb-23839167669-DujUHmC6ITtQvBCaUS0WgVa2',
    name: 'Fix DOliveira'
};
var bot = new Bot(settings);
var userFixes = {
    doliveira: {
        fixFn: function(data){
            if(!data || !data.text){ return; }
            var text = data.text
                .replace(/a' /,'á ').replace(/a'$/,'á')
                .replace(/e' /,'é ').replace(/e'$/,'é')
                .replace(/i' /,'í ').replace(/i'$/,'í')
                .replace(/o' /,'ó ').replace(/o'$/,'ó')
                .replace(/u' /,'ú ').replace(/u'$/,'ú')
            if(text !== data.text){
                //bot.postMessageToChannel('general', '_@'+this.name+' was trying to say:_\n'+text);
                bot.postMessageToChannel('general', '', {attachments:[{
                    pretext: '<@'+data.user+'|'+this.name+'> _was trying to say:_',
                    text: text,
                    color: '#439FE0',
                    mrkdwn_in: ["text", "pretext"]
                }]});
            }
        }
    },
    andrefs: {
        fixFn: function(data){
            if(!data || !data.text){ return; }
            var text = data.text
                .replace(/a' /,'á ').replace(/a'$/,'á')
                .replace(/e' /,'é ').replace(/e'$/,'é')
                .replace(/i' /,'í ').replace(/i'$/,'í')
                .replace(/o' /,'ó ').replace(/o'$/,'ó')
                .replace(/u' /,'ú ').replace(/u'$/,'ú')
            if(text !== data.text){
                //bot.postMessageToChannel('general', '_@'+this.name+' was trying to say:_\n'+text);
                bot.postMessageToChannel('general', '', {attachments:[{
                    pretext: '<@'+data.user+'|'+this.name+'> _was trying to say:_',
                    text: text,
                    color: '#439FE0',
                    mrkdwn_in: ["text", "pretext"]
                }]});
            }
        }
    },
};
var userFunctions = {};

bot.on('start', function() {
    //bot.postMessageToChannel('general', "Hi everyone, I'm here to fix some of the stupid stuff you say!");
    console.log("Hi everyone, I'm here to fix some of the stupid stuff you say!");
    bot.getUsers().then(function(data){
        data.members.forEach(function(user){
            if(userFixes[user.name]){
                userFunctions[user.id] = {
                    name  : user.name,
                    id    : user.id,
                    fixFn : userFixes[user.name].fixFn
                };
            }
        });
        console.log(userFunctions);
    });
});


bot.on('message', function(data) {
    if(userFunctions[data.user]){
        userFunctions[data.user].fixFn(data);
    }
});

