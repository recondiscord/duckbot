			function countdown(minutes, text, mention, cdtype) {
				function sm(message, timeout, deletetime, mention) {
					if(mention=="everyone") {
						setTimeout(function(){msg.channel.sendMessage("@everyone " + message).then((message => message.delete(deletetime)));},timeout);
					}
					else {
						setTimeout(function(){msg.channel.sendMessage(message).then((message => message.delete(deletetime)));},timeout);
					}
				}
				for(var i = 0; i<minutes;i++){
					var minleft=minutes-i;
					if(minleft % 60 == 0) {
						var hleft = minleft/60;
						var message=text + " starts in " + hleft + " hours";
						sm(message,i*1000*60, 60*60*1000, "no");
					}
					if(minleft == 30) {
						var message=text + " starts in " + minleft + " minutes";
						sm(message,i*1000*60, 20*60*1000, "no");
					}
					if(minleft == 10) {
						if(cdtype=="countdown") {
							var message=text + " starts in " + minleft + " minutes";
							sm(message,i*1000*60, 10*60*1000, mention);							
						}
						if(cdtype=="aat") {
							var message=text + " starts in " + minleft + " minutes";
							sm(message,i*1000*60, 10*60*1000, "no");								
						}
					}
				}
				if(mention=="everyone") {
					setTimeout(function(){msg.channel.sendMessage("@everyone " + text + " starts now!");},i*1000*60);	
				}
				else {
					setTimeout(function(){msg.channel.sendMessage(text + " starts now!");},i*1000*60);
				}
				      			
			}