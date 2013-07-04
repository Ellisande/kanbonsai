'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('standupServices', []).
  value('MeetingService', 
  	new MeetingService()
  );

function MeetingService(){
	this.all = [new Meeting("vri","June 29, 2013 22:30:00")];
	this.add = function(meeting)
	{
		this.all.push(meeting); 
	};
	this.remove = function(meeting)
	{
		this.all.splice(this.all.indexOf(meeting));
	};
	this.get = function(name)
	{
		for (var i = this.all.length - 1; i >= 0; i--) 
		{
			if(this.all[i].name === name) return this.all[i];
		}
	};
}

function Meeting(name, startTime){
	this.name = name;
	this.startTime = new Date(startTime);
	this.available = false;
}
