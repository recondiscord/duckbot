var fs = require('fs');
var math = require('mathjs');
var random = require("random-js")();

try {
	var Discord = require("discord.js");
} catch (e){
	console.log(e.stack);
	console.log(process.version);
	console.log("Please run npm install and ensure it passes with no errors!");
	process.exit();
}
console.log("Starting DiscordBot\nNode version: " + process.version + "\nDiscord.js version: " + Discord.version);

try {
	var urban = require("urban");
} catch (e){
	console.log("couldn't load urban plugin!\n"+e.stack);
}

try {
	var leet = require("leet");
} catch (e){
	console.log("couldn't load leet plugin!\n"+e.stack);
}

try {
	var yt = require("./youtube_plugin");
	var youtube_plugin = new yt();
} catch(e){
	console.log("couldn't load youtube plugin!\n"+e.stack);
}

try {
	var wa = require("./wolfram_plugin");
	var wolfram_plugin = new wa();
} catch(e){
	console.log("couldn't load wolfram plugin!\n"+e.stack);
}

// Get authentication data
try {
	var AuthDetails = require("./auth.json");
} catch (e){
	console.log("Please create an auth.json like auth.json.example with a bot token or an email and password.\n"+e.stack);
	process.exit();
}

// Load custom permissions
var dangerousCommands = ["eval","pullanddeploy","setUsername"];
var Permissions = {};
try{
	Permissions = require("./permissions.json");
} catch(e){
	Permissions.global = {};
	Permissions.users = {};
}

for( var i=0; i<dangerousCommands.length;i++ ){
	var cmd = dangerousCommands[i];
	if(!Permissions.global.hasOwnProperty(cmd)){
		Permissions.global[cmd] = false;
	}
}
Permissions.checkPermission = function (user,permission){
	try {
		var allowed = true;
		try{
			if(Permissions.global.hasOwnProperty(permission)){
				allowed = Permissions.global[permission] === true;
			}
		} catch(e){}
		try{
			if(Permissions.users[user.id].hasOwnProperty(permission)){
				allowed = Permissions.users[user.id][permission] === true;
			}
		} catch(e){}
		return allowed;
	} catch(e){}
	return false;
}
fs.writeFile("./permissions.json",JSON.stringify(Permissions,null,2));

//load config data
var Config = {};
try{
	Config = require("./config.json");
} catch(e){ //no config file, use defaults
	Config.debug = false;
	Config.commandPrefix = '!';
	try{
		if(fs.lstatSync("./config.json").isFile()){
			console.log("WARNING: config.json found but we couldn't read it!\n" + e.stack);
		}
	} catch(e2){
		fs.writeFile("./config.json",JSON.stringify(Config,null,2));
	}
}
if(!Config.hasOwnProperty("commandPrefix")){
	Config.commandPrefix = '!';
}

var qs = require("querystring");

var d20 = require("d20");

var htmlToText = require('html-to-text');

var startTime = Date.now();

var giphy_config = {
    "api_key": "dc6zaTOxFJmzC",
    "rating": "r",
    "url": "http://api.giphy.com/v1/gifs/random",
    "permission": ["NORMAL"]
};


//https://api.imgflip.com/popular_meme_ids
var meme = {
	"brace": 61546,
	"mostinteresting": 61532,
	"fry": 61520,
	"onedoesnot": 61579,
	"yuno": 61527,
	"success": 61544,
	"allthethings": 61533,
	"doge": 8072285,
	"drevil": 40945639,
	"skeptical": 101711,
	"notime": 442575,
	"yodawg": 101716,
	"awkwardpenguin": 61584
};

//duckmemes - pictures/duckmemes
var duckmemes = [
    "pictures/duckmemes/duckmeme1.jpg",
    "pictures/duckmemes/duckmeme2.jpg",
    "pictures/duckmemes/duckmeme3.jpg",
    "pictures/duckmemes/duckmeme4.jpg",
    "pictures/duckmemes/duckmeme5.jpg",
    "pictures/duckmemes/duckmeme6.jpg",
    "pictures/duckmemes/duckmeme7.jpg",
    "pictures/duckmemes/duckmeme8.jpg",
    "pictures/duckmemes/duckmeme9.jpg",
    "pictures/duckmemes/duckmeme10.jpg"
];
//ragestickers - pictures/linestickers
var ragestickers = [
    "pictures/linestickers/rage/rage1.png",
    "pictures/linestickers/rage/rage2.png",
    "pictures/linestickers/rage/rage3.png",
    "pictures/linestickers/rage/rage4.png",
    "pictures/linestickers/rage/rage5.png",
    "pictures/linestickers/rage/rage6.png",
    "pictures/linestickers/rage/rage7.png",
    "pictures/linestickers/rage/rage8.png",
    "pictures/linestickers/rage/rage9.png"
];
var fridaystickers = [
"pictures/linestickers/friday1.png",
"pictures/linestickers/friday2.png"
];
var grinstickers = [
"pictures/linestickers/grin/grin1.png"
];
var hahastickers = [
"pictures/linestickers/haha/haha1.png",
"pictures/linestickers/haha/haha2.png"
];
var lolstickers = [
"pictures/linestickers/lol/lol1.png",
"pictures/linestickers/lol/lol2.png",
"pictures/linestickers/lol/lol3.png"
];
var thanksstickers = [
"pictures/linestickers/thanks/thanks1.png",
"pictures/linestickers/thanks/thanks2.png",
"pictures/linestickers/thanks/thanks3.png"
];
var yeahstickers = [
"pictures/linestickers/yeah/yeah1.png",
"pictures/linestickers/yeah/yeah2.png",
"pictures/linestickers/yeah/yeah3.png",
"pictures/linestickers/yeah/yeah4.png"
];

var aliases;
var messagebox;


var commands = {
    "duckbot": {
        description: "bull picture",
        process: function(bot,msg){msg.channel.sendFile("pictures/duckbot.png");}
    },
	"bull": {
        description: "bull picture",
        process: function(bot,msg){msg.channel.sendFile("pictures/bull.png");}
    },
	"yc": {
        description: "yc picture",
        process: function(bot,msg){msg.channel.sendFile("pictures/yc.png");}
    },
	"selfie": {
        description: "selfie picture",
        process: function(bot,msg){msg.channel.sendFile("pictures/selfie.jpg");}
    },
	"salt": {
        description: "salt picture",
        process: function(bot,msg){msg.channel.sendFile("pictures/salt.jpg");}
    },
	"duckrevolution": {
        description: "duckrevolution picture",
        process: function(bot,msg){msg.channel.sendFile("pictures/duckrevolution.png");}
    },
    "cg": {
        description: "cg's cars",
        process: function(bot,msg){msg.channel.sendFile("pictures/cg.jpg");}
    },
    "whiskey": {
        description: "whiskey",
        process: function(bot,msg){msg.channel.sendFile("pictures/bmwhiskey.gif");}
    },
    "aat1": {
        description: "sends the AAT schedule as png and countdowns to all phases",
        process: function(bot,msg){
        	var fs = require('fs');

			// file is included here:
			eval(fs.readFileSync('countdown.js')+'');
        	var args = msg.content.split(" ");
        	if (args[1]==null) {
        		msg.channel.sendMessage("In how many minutes does P1 start?");
        	}
        	else {
	        	var p1q=args[1];
	        	var p1=360;
	        	var p2=360;
	        	var p3=600;   	
	        	msg.channel.sendMessage("AAT raid started - schedule 1, see times below");
				msg.channel.sendFile("pictures/aat1.png");
	        	msg.channel.sendMessage("Countdown started. " + p1q + " minutes to P1 commit");  		
	        	countdown(p1q,"AAT P1 commit","everyone", "aat");  
	        	setTimeout(function(){countdown(p1,"AAT P2 commit","everyone", "aat")},p1q*60*1000);
	        	setTimeout(function(){countdown(p2,"AAT P3 commit","everyone", "aat")},p1q*60*1000+p1*60*1000);
	        	setTimeout(function(){countdown(p3,"AAT P4 commit","everyone", "aat")},p1q*60*1000+p1*60*1000+p2*60*1000);
        	}
    	}
    },
    "aat2": {
        description: "sends the AAT schedule as png and countdowns to all phases",
        process: function(bot,msg){
        	var fs = require('fs');

			// file is included here:
			eval(fs.readFileSync('countdown.js')+'');
        	var args = msg.content.split(" ");
        	if (args[1]==null) {
        		msg.channel.sendMessage("In how many minutes does P1 start?");
        	}
        	else {
	        	var p1q=args[1];
	        	var p1=360;
	        	var p2=360;
	        	var p3=600;   	
	        	msg.channel.sendMessage("AAT raid started - schedule 2, see times below");
				msg.channel.sendFile("pictures/aat2.png");
	        	msg.channel.sendMessage("Countdown started. " + p1q + " minutes to P1 commit");  		
	        	countdown(p1q,"AAT P1 commit","everyone", "aat");  
	        	setTimeout(function(){countdown(p1,"AAT P2 commit","everyone", "aat")},p1q*60*1000);
	        	setTimeout(function(){countdown(p2,"AAT P3 commit","everyone", "aat")},p1q*60*1000+p1*60*1000);
	        	setTimeout(function(){countdown(p3,"AAT P4 commit","everyone", "aat")},p1q*60*1000+p1*60*1000+p2*60*1000);
        	}
    	}
    },
    "aat3": {
        description: "sends the AAT schedule as png and countdowns to all phases",
        process: function(bot,msg){
        	var fs = require('fs');

			// file is included here:
			eval(fs.readFileSync('countdown.js')+'');
        	var args = msg.content.split(" ");
        	if (args[1]==null) {
        		msg.channel.sendMessage("In how many minutes does P1 start?");
        	}
        	else {
	        	var p1q=args[1];
	        	var p1=360;
	        	var p2=360;
	        	var p3=360;   	
	        	msg.channel.sendMessage("AAT raid started - schedule 3, see times below");
				msg.channel.sendFile("pictures/aat3.png");
	        	msg.channel.sendMessage("Countdown started. " + p1q + " minutes to P1 commit");  		
	        	countdown(p1q,"AAT P1 commit","everyone", "aat");  
	        	setTimeout(function(){countdown(p1,"AAT P2 commit","everyone", "aat")},p1q*60*1000);
	        	setTimeout(function(){countdown(p2,"AAT P3 commit","everyone", "aat")},p1q*60*1000+p1*60*1000);
	        	setTimeout(function(){countdown(p3,"AAT P4 commit","everyone", "aat")},p1q*60*1000+p1*60*1000+p2*60*1000);
        	}
    	}
    },
    "mcountdown": {
        description: "delayed countdown in minutes. Arg1: minutes to countdown, Arg2: Event to countdown to, Arg3: everyone it should notify everyone",
        process: function(bot,msg){
        	var args = msg.content.split(" ");
        	if(args[2]==null){
        		msg.channel.sendMessage("What do you want to countdown to?")
        	}
        	else {
        		if(args[3]==null) {
		        	function sm(message, timeout) {
		        		setTimeout(function(){msg.channel.sendMessage(message).then((message => message.delete(1000*60)));},timeout);
		        	}
		        	for(var i = 0; i<args[1];i++){
		        		var left=args[1]-i;
		        		var message=args[2] + " starts in " + left + " minutes";
		        		sm(message,i*1000*60);
		        	}
		        	setTimeout(function(){msg.channel.sendMessage(args[2] + " starts now!");},i*1000*60);	        			
        		}	
        		else {
		        	function sm(message, timeout) {
		        		setTimeout(function(){msg.channel.sendMessage(message).then((message => message.delete(1000*60)));},timeout);
		        	}
		        	for(var i = 0; i<args[1];i++){
		        		var left=args[1]-i;
		        		var message=args[2] + " starts in " + left + " minutes";
		        		sm(message,i*1000*60);
		        	}
		        	setTimeout(function(){msg.channel.sendMessage("@"+args[3] + " " + args[2] + " starts now!");},i*1000*60);	        			
        		}
        	}
        }
    },
    "countdown": {
        description: "delayed countdown in minutes. Arg1: minutes to countdown, Arg2: Event to countdown to, Arg3: everyone it should notify everyone",
        process: function(bot,msg){
        	var fs = require('fs');

			// file is included here:
			eval(fs.readFileSync('countdown.js')+'');
        	var args = msg.content.split(" ");
        	if(args[1]==null){
        		msg.channel.sendMessage("Please add how many minutes you want to countdown.")
        	}
        	if(args[2]==null){
        		msg.channel.sendMessage("Please add what you want to countdown to.")
        	} 
        	else {
	        	if(isNaN(args[1])) {
        			msg.channel.sendMessage("Please add minutes as a number.")
				}
				else {
		        	var h=math.floor(args[1]/60);
		        	var m=args[1]%60;
	        		msg.channel.sendMessage("Countdown started. "+h+"h"+m+"min to " + args[2]);
	        		if(args[3]==null) {
	        			countdown(args[1],args[2],"no","countdown");  			
	        		}	
	        		else {
			        	countdown(args[1],args[2],args[3], "countdown");  	        			
	        		}
	        	}
	        }
        }
    },
    "dcountdown": {
        description: "delayed countdown in minutes. Arg1: minutes to countdown, Arg2: Event to countdown to, Arg3: countdown delay, Arg4: everyone it should notify everyone",
        process: function(bot,msg){
        	var fs = require('fs');

			// file is included here:
			eval(fs.readFileSync('countdown.js')+'');
        	var args = msg.content.split(" ");
        	var delay=args[3];
        	if(args[1]==null){
        		msg.channel.sendMessage("Please add how many minutes you want to countdown.")
        	}
        	if(args[2]==null){
        		msg.channel.sendMessage("Please add what you want to countdown to.")
        	} 
        	else {
	        	if(args[1] != null) {
	        		msg.channel.sendMessage("Countdown will start in "+delay+" minutes");
	        		if(args[4]==null) {
	        			setTimeout(function(){countdown(args[1],args[2],"no","countdown")},1*60*1000);  			
	        		}	
	        		else {
			        	setTimeout(function(){countdown(args[1],args[2],args[4], "countdown")},1*60*1000);  	        			
	        		}
	        	}
	        }
        }
    },
    "hello": {
        description: "sends greeting message",
        process: function(bot,msg){msg.channel.sendMessage("Hello world! **Join the duck side!**");}
    },
    "bones": {
        description: "posts the bones sticker",
        process: function(bot,msg){msg.channel.sendFile("pictures/linestickers/bones.png");}
    },
    "duckmeme": {
        description: "posts a random duck meme",
        process: function(bot,msg){
            var randomMemeIndex = random.integer(0,duckmemes.length-1);
            msg.channel.sendFile(duckmemes[randomMemeIndex]);}
    },
    "rage": {
        description: "posts a random rage sticker",
        process: function(bot,msg){
            var randomRageIndex = random.integer(0,ragestickers.length-1);
            msg.channel.sendFile(ragestickers[randomRageIndex]);}
    },
    "grin": {
        description: "posts a random grin sticker",
        process: function(bot,msg){
        	var stickertype=grinstickers;
            var randomIndex = random.integer(0,stickertype.length-1);
            msg.channel.sendFile(stickertype[randomIndex]);}
    },
    "haha": {
        description: "posts a random haha sticker",
        process: function(bot,msg){
        	var stickertype=hahastickers;
            var randomIndex = random.integer(0,stickertype.length-1);
            msg.channel.sendFile(stickertype[randomIndex]);}
    },
    "lol": {
        description: "posts a random lol sticker",
        process: function(bot,msg){
        	var stickertype=lolstickers;
            var randomIndex = random.integer(0,stickertype.length-1);
            msg.channel.sendFile(stickertype[randomIndex]);}
    },
    "thanks": {
        description: "posts a random thanks sticker",
        process: function(bot,msg){
        	var stickertype=thanksstickers;
            var randomIndex = random.integer(0,stickertype.length-1);
            msg.channel.sendFile(stickertype[randomIndex]);}
    },
    "yeah": {
        description: "posts a random yeah sticker",
        process: function(bot,msg){
        	var stickertype=yeahstickers;
            var randomIndex = random.integer(0,stickertype.length-1);
            msg.channel.sendFile(stickertype[randomIndex]);}
    },
    "friday": {
        description: "posts a random friday sticker",
        process: function(bot,msg){
        	var stickertype=fridaystickers;
            var randomIndex = random.integer(0,stickertype.length-1);
            msg.channel.sendFile(stickertype[randomIndex]);}
    },
	"aliases": {
		description: "lists all recorded aliases",
		process: function(bot, msg, suffix) {
			var text = "current aliases:\n";                                                                                     for(var a in aliases){                                                                                                       if(typeof a === 'string')
				text += a + " ";
			}
			msg.channel.sendMessage(text);
		}
	},
	"gif": {
		usage: "<image tags>",
        description: "returns a random gif matching the tags passed",
		process: function(bot, msg, suffix) {
		    var tags = suffix.split(" ");
		    get_gif(tags, function(id) {
			if (typeof id !== "undefined") {
			    msg.channel.sendMessage( "http://media.giphy.com/media/" + id + "/giphy.gif [Tags: " + (tags ? tags : "Random GIF") + "]");
			}
			else {
			    msg.channel.sendMessage( "Invalid tags, try something different. [Tags: " + (tags ? tags : "Random GIF") + "]");
			}
		    });
		}
	},
    "ping": {
        description: "responds pong, useful for checking if bot is alive",
        process: function(bot, msg, suffix) {
            msg.channel.sendMessage( msg.author+" pong!");
            if(suffix){
                msg.channel.sendMessage( "note that !ping takes no arguments!");
            }
        }
    },
    "myid": {
        description: "returns the user id of the sender",
        process: function(bot,msg){msg.channel.sendMessage(msg.author.id);}
    },
    "idle": {
				usage: "[status]",
        description: "sets bot status to idle",
        process: function(bot,msg,suffix){ bot.user.setStatus("idle",suffix);}
    },
    "online": {
				usage: "[status]",
        description: "sets bot status to online",
        process: function(bot,msg,suffix){ bot.user.setStatus("online",suffix);}
    },
    "youtube": {
        usage: "<video tags>",
        description: "gets youtube video matching tags",
        process: function(bot,msg,suffix){
            youtube_plugin.respond(suffix,msg.channel,bot);
        }
    },
    "say": {
        usage: "<message>",
        description: "bot says message",
        process: function(bot,msg,suffix){ msg.channel.sendMessage(suffix);}
    },
		"announce": {
        usage: "<message>",
        description: "bot says message with text to speech",
        process: function(bot,msg,suffix){ msg.channel.sendMessage(suffix,{tts:true});}
    },
    "pullanddeploy": {
        description: "bot will perform a git pull master and restart with the new code",
        process: function(bot,msg,suffix) {
            msg.channel.sendMessage("fetching updates...").then(function(sentMsg){
                console.log("updating...");
	            var spawn = require('child_process').spawn;
                var log = function(err,stdout,stderr){
                    if(stdout){console.log(stdout);}
                    if(stderr){console.log(stderr);}
                };
                var fetch = spawn('git', ['fetch']);
                fetch.stdout.on('data',function(data){
                    console.log(data.toString());
                });
                fetch.on("close",function(code){
                    var reset = spawn('git', ['reset','--hard','origin/master']);
                    reset.stdout.on('data',function(data){
                        console.log(data.toString());
                    });
                    reset.on("close",function(code){
                        var npm = spawn('npm', ['install']);
                        npm.stdout.on('data',function(data){
                            console.log(data.toString());
                        });
                        npm.on("close",function(code){
                            console.log("goodbye");
                            sentMsg.edit("brb!").then(function(){
                                bot.destroy().then(function(){
                                    process.exit();
                                });
                            });
                        });
                    });
                });
            });
        }
    },
		"setUsername":{
			description: "sets the username of the bot. Note this can only be done twice an hour!",
			process: function(bot,msg,suffix) {
				bot.user.setUsername(suffix);
			}
		},
    "meme": {
        usage: 'meme "top text" "bottom text"',
				description: function() {
            var str = "Currently available memes:\n"
            for (var m in meme){
                str += "\t\t" + m + "\n"
            }
            return str;
        },
        process: function(bot,msg,suffix) {
            var tags = msg.content.split('"');
            var memetype = tags[0].split(" ")[1];
            //msg.channel.sendMessage(tags);
            var Imgflipper = require("imgflipper");
            var imgflipper = new Imgflipper(AuthDetails.imgflip_username, AuthDetails.imgflip_password);
            imgflipper.generateMeme(meme[memetype], tags[1]?tags[1]:"", tags[3]?tags[3]:"", function(err, image){
                //console.log(arguments);
                msg.channel.sendMessage(image);
            });
        }
    },
    "version": {
        description: "returns the git commit this bot is running",
        process: function(bot,msg,suffix) {
            var commit = require('child_process').spawn('git', ['log','-n','1']);
            commit.stdout.on('data', function(data) {
                msg.channel.sendMessage(data);
            });
            commit.on('close',function(code) {
                if( code != 0){
                    msg.channel.sendMessage("failed checking git version!");
                }
            });
        }
    },
    "log": {
        usage: "<log message>",
        description: "logs message to bot console",
        process: function(bot,msg,suffix){console.log(msg.content);}
    },
    "wiki": {
        usage: "<search terms>",
        description: "returns the summary of the first matching search result from Wikipedia",
        process: function(bot,msg,suffix) {
            var query = suffix;
            if(!query) {
                msg.channel.sendMessage("usage: " + Config.commandPrefix + "wiki search terms");
                return;
            }
            var Wiki = require('wikijs');
            new Wiki().search(query,1).then(function(data) {
                new Wiki().page(data.results[0]).then(function(page) {
                    page.summary().then(function(summary) {
                        var sumText = summary.toString().split('\n');
                        var continuation = function() {
                            var paragraph = sumText.shift();
                            if(paragraph){
                                msg.channel.sendMessage(paragraph,continuation);
                            }
                        };
                        continuation();
                    });
                });
            },function(err){
                msg.channel.sendMessage(err);
            });
        }
    },
    "create": {
        usage: "<channel name>",
        description: "creates a new text channel with the given name.",
        process: function(bot,msg,suffix) {
            msg.channel.guild.createChannel(suffix,"text").then(function(channel) {
                msg.channel.sendMessage("created " + channel);
            }).catch(function(error){
				msg.channel.sendMessage("failed to create channel: " + error);
			});
        }
    },
	"voice": {
		usage: "<channel name>",
		description: "creates a new voice channel with the give name.",
		process: function(bot,msg,suffix) {
            msg.channel.guild.createChannel(suffix,"voice").then(function(channel) {
                msg.channel.sendMessage("created " + channel.id);
				console.log("created " + channel);
            }).catch(function(error){
				msg.channel.sendMessage("failed to create channel: " + error);
			});
        }
	},
    "delete": {
        usage: "<channel name>",
        description: "deletes the specified channel",
        process: function(bot,msg,suffix) {
			var channel = bot.channels.find("id",suffix);
			if(suffix.startsWith('<#')){
				channel = bot.channels.find("id",suffix.substr(2,suffix.length-3));
			}
            if(!channel){
				var channels = msg.channel.guild.channels.findAll("name",suffix);
				if(channels.length > 1){
					var response = "Multiple channels match, please use id:";
					for(var i=0;i<channels.length;i++){
						response += channels[i] + ": " + channels[i].id;
					}
					msg.channel.sendMessage(response);
					return;
				}else if(channels.length == 1){
					channel = channels[0];
				} else {
					msg.channel.sendMessage( "Couldn't find channel " + suffix + " to delete!");
					return;
				}
			}
            msg.channel.guild.defaultChannel.sendMessage("deleting channel " + suffix + " at " +msg.author + "'s request");
            if(msg.channel.guild.defaultChannel != msg.channel){
                msg.channel.sendMessage("deleting " + channel);
            }
            channel.delete().then(function(channel){
				console.log("deleted " + suffix + " at " + msg.author + "'s request");
            }).catch(function(error){
				msg.channel.sendMessage("couldn't delete channel: " + error);
			});
        }
    },
    "stock": {
        usage: "<stock to fetch>",
        process: function(bot,msg,suffix) {
            var yahooFinance = require('yahoo-finance');
            yahooFinance.snapshot({
              symbol: suffix,
              fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
            }, function (error, snapshot) {
                if(error){
                    msg.channel.sendMessage("couldn't get stock: " + error);
                } else {
                    //msg.channel.sendMessage(JSON.stringify(snapshot));
                    msg.channel.sendMessage(snapshot.name
                        + "\nprice: $" + snapshot.lastTradePriceOnly);
                }
            });
        }
    },
	"wolfram": {
		usage: "<search terms>",
        description: "gives results from wolframalpha using search terms",
        process: function(bot,msg,suffix){
				if(!suffix){
					msg.channel.sendMessage("Usage: " + Config.commandPrefix + "wolfram <search terms> (Ex. " + Config.commandPrefix + "wolfram integrate 4x)");
				}
				msg.channel.sendMessage("*Querying Wolfram Alpha...*").then(message => {
        	wolfram_plugin.respond(suffix,msg.channel,bot,message);
				});
 	    }
	},
    "rss": {
        description: "lists available rss feeds",
        process: function(bot,msg,suffix) {
            /*var args = suffix.split(" ");
            var count = args.shift();
            var url = args.join(" ");
            rssfeed(bot,msg,url,count,full);*/
            msg.channel.sendMessage("Available feeds:").then(function(){
                for(var c in rssFeeds){
                    msg.channel.sendMessage(c + ": " + rssFeeds[c].url);
                }
            });
        }
    },
    "reddit": {
        usage: "[subreddit]",
        description: "Returns the top post on reddit. Can optionally pass a subreddit to get the top psot there instead",
        process: function(bot,msg,suffix) {
            var path = "/.rss"
            if(suffix){
                path = "/r/"+suffix+path;
            }
            rssfeed(bot,msg,"https://www.reddit.com"+path,1,false);
        }
    },
	"alias": {
		usage: "<name> <actual command>",
		description: "Creates command aliases. Useful for making simple commands on the fly",
		process: function(bot,msg,suffix) {
			var args = suffix.split(" ");
			var name = args.shift();
			if(!name){
				msg.channel.sendMessage(Config.commandPrefix + "alias " + this.usage + "\n" + this.description);
			} else if(commands[name] || name === "help"){
				msg.channel.sendMessage("overwriting commands with aliases is not allowed!");
			} else {
				var command = args.shift();
				aliases[name] = [command, args.join(" ")];
				//now save the new alias
				require("fs").writeFile("./alias.json",JSON.stringify(aliases,null,2), null);
				msg.channel.sendMessage("created alias " + name);
			}
		}
	},
	"userid": {
		usage: "[user to get id of]",
		description: "Returns the unique id of a user. This is useful for permissions.",
		process: function(bot,msg,suffix) {
			if(suffix){
				var users = msg.channel.guild.members.filter((member) => member.user.username == suffix).array();
				if(users.length == 1){
					msg.channel.sendMessage( "The id of " + users[0].user.username + " is " + users[0].user.id)
				} else if(users.length > 1){
					var response = "multiple users found:";
					for(var i=0;i<users.length;i++){
						var user = users[i];
						response += "\nThe id of <@" + user.id + "> is " + user.id;
					}
					msg.channel.sendMessage(response);
				} else {
					msg.channel.sendMessage("No user " + suffix + " found!");
				}
			} else {
				msg.channel.sendMessage( "The id of " + msg.author + " is " + msg.author.id);
			}
		}
	},
	"eval": {
		usage: "<command>",
		description: 'Executes arbitrary javascript in the bot process. User must have "eval" permission',
		process: function(bot,msg,suffix) {
			if(Permissions.checkPermission(msg.author,"eval")){
				msg.channel.sendMessage( eval(suffix,bot));
			} else {
				msg.channel.sendMessage( msg.author + " doesn't have permission to execute eval!");
			}
		}
	},
	"topic": {
		usage: "[topic]",
		description: 'Sets the topic for the channel. No topic removes the topic.',
		process: function(bot,msg,suffix) {
			msg.channel.setTopic(suffix);
		}
	},
	"roll": {
        usage: "[# of sides] or [# of dice]d[# of sides]( + [# of dice]d[# of sides] + ...)",
        description: "roll one die with x sides, or multiple dice using d20 syntax. Default value is 10",
        process: function(bot,msg,suffix) {
            if (suffix.split("d").length <= 1) {
                msg.channel.sendMessage(msg.author + " rolled a " + d20.roll(suffix || "10"));
            }
            else if (suffix.split("d").length > 1) {
                var eachDie = suffix.split("+");
                var passing = 0;
                for (var i = 0; i < eachDie.length; i++){
                    if (eachDie[i].split("d")[0] < 50) {
                        passing += 1;
                    };
                }
                if (passing == eachDie.length) {
                    msg.channel.sendMessage(msg.author + " rolled a " + d20.roll(suffix));
                }  else {
                    msg.channel.sendMessage(msg.author + " tried to roll too many dice at once!");
                }
            }
        }
    },
	"msg": {
		usage: "<user> <message to leave user>",
		description: "leaves a message for a user the next time they come online",
		process: function(bot,msg,suffix) {
			var args = suffix.split(' ');
			var user = args.shift();
			var message = args.join(' ');
			if(user.startsWith('<@')){
				user = user.substr(2,user.length-3);
			}
			var target = msg.channel.guild.members.find("id",user);
			if(!target){
				target = msg.channel.guild.members.find("username",user);
			}
			messagebox[target.id] = {
				channel: msg.channel.id,
				content: target + ", " + msg.author + " said: " + message
			};
			updateMessagebox();
			msg.channel.sendMessage("message saved.")
		}
	},
	"beam": {
		usage: "<stream>",
		description: "checks if the given Beam stream is online",
		process: function(bot,msg,suffix){
		    require("request")("https://beam.pro/api/v1/channels/"+suffix,
		    function(err,res,body){
		        var data = JSON.parse(body);
		        if(data && data.online){
		            msg.channel.sendMessage( suffix
		                +" is online"
		                +"\n"+data.thumbnail.url)
		        }else{
		            msg.channel.sendMessage( suffix+" is offline")
		        }
		    });
		}
	},
	"urban": {
			usage: "<word>",
			description: "looks up a word on Urban Dictionary",
			process: function(bot,msg,suffix){
					var targetWord = suffix == "" ? urban.random() : urban(suffix);
					targetWord.first(function(json) {
							if (json) {
								var message = "Urban Dictionary: **" +json.word + "**\n\n" + json.definition;
								if (json.example) {
										message = message + "\n\n__Example__:\n" + json.example;
								}
						    msg.channel.sendMessage( message);
							} else {
								msg.channel.sendMessage( "No matches found");
							}
					});
			}
	},
	"leet": {
		usage: "<message>",
		description: "converts boring regular text to 1337",
		process: function(bot,msg,suffix){
				msg.channel.sendMessage( leet.convert(suffix));
		}
	},
	"twitch": {
		usage: "<stream>",
		description: "checks if the given stream is online",
		process: function(bot,msg,suffix){
			require("request")("https://api.twitch.tv/kraken/streams/"+suffix,
			function(err,res,body){
				var stream = JSON.parse(body);
				if(stream.stream){
					msg.channel.sendMessage( suffix
						+" is online, playing "
						+stream.stream.game
						+"\n"+stream.stream.channel.status
						+"\n"+stream.stream.preview.large)
				}else{
					msg.channel.sendMessage( suffix+" is offline")
				}
			});
		}
	},
	"xkcd": {
		usage: "[comic number]",
		description: "displays a given xkcd comic number (or the latest if nothing specified",
		process: function(bot,msg,suffix){
			var url = "http://xkcd.com/";
			if(suffix != "") url += suffix+"/";
			url += "info.0.json";
			require("request")(url,function(err,res,body){
				try{
					var comic = JSON.parse(body);
					msg.channel.sendMessage(
						comic.title+"\n"+comic.img,function(){
							msg.channel.sendMessage(comic.alt)
					});
				}catch(e){
					msg.channel.sendMessage(
						"Couldn't fetch an XKCD for "+suffix);
				}
			});
		}
	},
    "watchtogether": {
        usage: "[video url (Youtube, Vimeo)",
        description: "Generate a watch2gether room with your video to watch with your little friends!",
        process: function(bot,msg,suffix){
            var watch2getherUrl = "https://www.watch2gether.com/go#";
            msg.channel.sendMessage(
                "watch2gether link").then(function(){
                    msg.channel.sendMessage(watch2getherUrl + suffix)
                })
        }
    },
    "uptime": {
			usage: "",
			description: "returns the amount of time since the bot started",
			process: function(bot,msg,suffix){
				var now = Date.now();
				var msec = now - startTime;
				console.log("Uptime is " + msec + " milliseconds");
				var days = Math.floor(msec / 1000 / 60 / 60 / 24);
				msec -= days * 1000 * 60 * 60 * 24;
				var hours = Math.floor(msec / 1000 / 60 / 60);
				msec -= hours * 1000 * 60 * 60;
				var mins = Math.floor(msec / 1000 / 60);
				msec -= mins * 1000 * 60;
				var secs = Math.floor(msec / 1000);
				var timestr = "";
				if(days > 0) {
					timestr += days + " days ";
				}
				if(hours > 0) {
					timestr += hours + " hours ";
				}
				if(mins > 0) {
					timestr += mins + " minutes ";
				}
				if(secs > 0) {
					timestr += secs + " seconds ";
				}
				msg.channel.sendMessage("**Uptime**: " + timestr);
			}
			}
};

if(AuthDetails.hasOwnProperty("client_id")){
	commands["invite"] = {
		description: "generates an invite link you can use to invite the bot to your server",
		process: function(bot,msg,suffix){
			msg.channel.sendMessage("invite link: https://discordapp.com/oauth2/authorize?&client_id=" + AuthDetails.client_id + "&scope=bot&permissions=470019135");
		}
	}
}

try{
var rssFeeds = require("./rss.json");
} catch(e) {
    console.log("Couldn't load rss.json. See rss.json.example if you want rss feed commands. error: " + e);
}
function loadFeeds(){
    for(var cmd in rssFeeds){
        commands[cmd] = {
            usage: "[count]",
            description: rssFeeds[cmd].description,
            url: rssFeeds[cmd].url,
            process: function(bot,msg,suffix){
                var count = 1;
                if(suffix != null && suffix != "" && !isNaN(suffix)){
                    count = suffix;
                }
                rssfeed(bot,msg,this.url,count,false);
            }
        };
    }
}

try{
	aliases = require("./alias.json");
} catch(e) {
	//No aliases defined
	aliases = {};
}

try{
	messagebox = require("./messagebox.json");
} catch(e) {
	//no stored messages
	messagebox = {};
}
function updateMessagebox(){
	require("fs").writeFile("./messagebox.json",JSON.stringify(messagebox,null,2), null);
}

function rssfeed(bot,msg,url,count,full){
    var FeedParser = require('feedparser');
    var feedparser = new FeedParser();
    var request = require('request');
    request(url).pipe(feedparser);
    feedparser.on('error', function(error){
        msg.channel.sendMessage("failed reading feed: " + error);
    });
    var shown = 0;
    feedparser.on('readable',function() {
        var stream = this;
        shown += 1
        if(shown > count){
            return;
        }
        var item = stream.read();
        msg.channel.sendMessage(item.title + " - " + item.link, function() {
            if(full === true){
                var text = htmlToText.fromString(item.description,{
                    wordwrap:false,
                    ignoreHref:true
                });
                msg.channel.sendMessage(text);
            }
        });
        stream.alreadyRead = true;
    });
}


var bot = new Discord.Client();

bot.on("ready", function () {
    loadFeeds();
	console.log("Logged in! Serving in " + bot.guilds.array().length + " servers");
	require("./plugins.js").init();
	console.log("type "+Config.commandPrefix+"help in Discord for a commands list.");
	bot.user.setStatus("online",Config.commandPrefix+"help");
});

bot.on("disconnected", function () {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error

});

function checkMessageForCommand(msg, isEdit) {
	//check if message is a command
	if(msg.author.id != bot.user.id && (msg.content[0] === Config.commandPrefix)){
        console.log("treating " + msg.content + " from " + msg.author + " as command");
		var cmdTxt = msg.content.split(" ")[0].substring(1);
        var suffix = msg.content.substring(cmdTxt.length+2);//add one for the ! and one for the space
        if(msg.isMentioned(bot.user)){
			try {
				cmdTxt = msg.content.split(" ")[1];
				suffix = msg.content.substring(bot.user.mention().length+cmdTxt.length+2);
			} catch(e){ //no command
				msg.channel.sendMessage("Yes?");
				return;
			}
        }
		alias = aliases[cmdTxt];
		if(alias){
			console.log(cmdTxt + " is an alias, constructed command is " + alias.join(" ") + " " + suffix);
			cmdTxt = alias[0];
			suffix = alias[1] + " " + suffix;
		}
		var cmd = commands[cmdTxt];
        if(cmdTxt === "help"){
            //help is special since it iterates over the other commands
						if(suffix){
							var cmds = suffix.split(" ").filter(function(cmd){return commands[cmd]});
							var info = "";
							for(var i=0;i<cmds.length;i++) {
								var cmd = cmds[i];
								info += "**"+Config.commandPrefix + cmd+"**";
								var usage = commands[cmd].usage;
								if(usage){
									info += " " + usage;
								}
								var description = commands[cmd].description;
								if(description instanceof Function){
									description = description();
								}
								if(description){
									info += "\n\t" + description;
								}
								info += "\n"
							}
							msg.channel.sendMessage(info);
						} else {
							msg.author.sendMessage("**Available Commands:**").then(function(){
								var batch = "";
								var sortedCommands = Object.keys(commands).sort();
								for(var i in sortedCommands) {
									var cmd = sortedCommands[i];
									var info = "**"+Config.commandPrefix + cmd+"**";
									var usage = commands[cmd].usage;
									if(usage){
										info += " " + usage;
									}
									var description = commands[cmd].description;
									if(description instanceof Function){
										description = description();
									}
									if(description){
										info += "\n\t" + description;
									}
									var newBatch = batch + "\n" + info;
									if(newBatch.length > (1024 - 8)){ //limit message length
										msg.author.sendMessage(batch);
										batch = info;
									} else {
										batch = newBatch
									}
								}
								if(batch.length > 0){
									msg.author.sendMessage(batch);
								}
						});
					}
        }
		else if(cmd) {
			if(Permissions.checkPermission(msg.author,cmdTxt)){
				try{
					cmd.process(bot,msg,suffix,isEdit);
				} catch(e){
					var msgTxt = "command " + cmdTxt + " failed :(";
					if(Config.debug){
						 msgTxt += "\n" + e.stack;
					}
					msg.channel.sendMessage(msgTxt);
				}
			} else {
				msg.channel.sendMessage("You are not allowed to run " + cmdTxt + "!");
			}
		} else {
			msg.channel.sendMessage(cmdTxt + " not recognized as a command!").then((message => message.delete(5000)))
		}
	} else {
		//message isn't a command or is from us
        //drop our own messages to prevent feedback loops
        if(msg.author == bot.user){
            return;
        }

        if (msg.author != bot.user && msg.isMentioned(bot.user)) {
                msg.channel.sendMessage(msg.author + ", you called?");
        } else {

				}
    }
}

bot.on("message", (msg) => checkMessageForCommand(msg, false));
bot.on("messageUpdate", (oldMessage, newMessage) => {
	checkMessageForCommand(newMessage,true);
});

//Log user status changes
bot.on("presence", function(user,status,gameId) {
	//if(status === "online"){
	//console.log("presence update");
	console.log(user+" went "+status);
	//}
	try{
	if(status != 'offline'){
		if(messagebox.hasOwnProperty(user.id)){
			console.log("found message for " + user.id);
			var message = messagebox[user.id];
			var channel = bot.channels.get("id",message.channel);
			delete messagebox[user.id];
			updateMessagebox();
			bot.sendMessage(channel,message.content);
		}
	}
	}catch(e){}
});

function get_gif(tags, func) {
        //limit=1 will only return 1 gif
        var params = {
            "api_key": giphy_config.api_key,
            "rating": giphy_config.rating,
            "format": "json",
            "limit": 1
        };
        var query = qs.stringify(params);

        if (tags !== null) {
            query += "&tag=" + tags.join('+')
        }

        //wouldnt see request lib if defined at the top for some reason:\
        var request = require("request");
        //console.log(query)
        request(giphy_config.url + "?" + query, function (error, response, body) {
            //console.log(arguments)
            if (error || response.statusCode !== 200) {
                console.error("giphy: Got error: " + body);
                console.log(error);
                //console.log(response)
            }
            else {
                try{
                    var responseObj = JSON.parse(body)
                    func(responseObj.data.id);
                }
                catch(err){
                    func(undefined);
                }
            }
        }.bind(this));
    }
exports.addCommand = function(commandName, commandObject){
    try {
        commands[commandName] = commandObject;
    } catch(err){
        console.log(err);
    }
}
exports.commandCount = function(){
    return Object.keys(commands).length;
}
if(AuthDetails.bot_token){
	console.log("logging in with token");
	bot.login(AuthDetails.bot_token);
} else {
	console.log("Logging in as a user account. Consider switching to an official bot account instead!");
	bot.login(AuthDetails.email, AuthDetails.password);
}
