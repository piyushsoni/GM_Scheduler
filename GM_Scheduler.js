// GM_Scheduler 
// Version 1.51
// Copyright: Piyush Soni (http://piyushsoni.com)
// License : CC BY-SA (http://creativecommons.org/licenses/by-sa/4.0/)
//----

function GM_Scheduler(methodToCall /*function*/, intervalInSeconds /*integer*/, setValueMethod /*function*/, getValueMethod /*function*/, logMethod /*function*/)
{
	//Methods
	this.GetFunctionName = function(fun)
	{
		var ret = fun.toString();
		ret = ret.substr('function '.length);
		ret = ret.substr(0, ret.indexOf('('));
		return ret;
	}
	
	this.Test = function()
	{
		if(!this.mActive)
			return;

		var guid = this.mGUID;
		var thisObject = this;

		var lastRunTime = new Date(this.GetValue(this.mGMKeyName, 0));
		var currentTime = new Date();
		var timeElapsed = (currentTime - lastRunTime)/1000.0;
		if(timeElapsed < this.mIntervalInSeconds)
		{
			this.Log(this.mGUID + ": " + this.mFuntionName + ' not executed,  ' + (this.mIntervalInSeconds - timeElapsed) + ' seconds remaining.');
			//Schedule it to run after the remaining time. 
			//Minimize race conditions. Get the same value a few times. 
			if(this.mActive && !this.GetValue(this.mGMKeyAllStopped, true) && !this.GetValue(this.mGMKeyAllStopped, true) && !this.GetValue(this.mGMKeyAllStopped, true) && !this.GetValue(this.mGMKeyAllStopped, true))
				window.setTimeout(function() { thisObject.Test();}, (this.mIntervalInSeconds - timeElapsed) * 1000);
			return;
		}
		else
		{
			//Execute
			//Minimize race conditions. Get the same value a few times. 
			if(this.mActive && !this.GetValue(this.mGMKeyAllStopped, true) && !this.GetValue(this.mGMKeyAllStopped, true) && !this.GetValue(this.mGMKeyAllStopped, true) && !this.GetValue(this.mGMKeyAllStopped, true))
			{
				this.mRunFunction();
				this.SetValue(this.mGMKeyName, currentTime);
				this.Log(this.mGUID + ": " + this.mFuntionName + ' executed.');
				window.setTimeout(function() { thisObject.Test(); }, (this.mIntervalInSeconds) * 1000);
			}
		}
	}
	
	this.Start = function(dontCallAtTimeZero /*bool - set to true to not to call the method at the beginning and wait for the interval instead*/)
	{
		//Verify input methods. 
		if(this.IsUndefined(this.GetValue))
		{
			alert("GM_Scheduler: GetValue method not set, did not start.");
			return;
		}
		if(this.IsUndefined(this.SetValue))
		{
			alert("GM_Scheduler: SetValue method not set, did not start.");
			return;
		}
		
		this.mActive = true;
		this.SetValue(this.mGMKeyAllStopped, false);
		if(dontCallAtTimeZero)
		{
			var currentTime = new Date();
			this.SetValue(this.mGMKeyName, currentTime);
		}
		this.Test();
	}
	
	this.Stop = function(doStopAllSessions)
	{
		this.mActive = false;
		if(doStopAllSessions)
			this.SetValue(this.mGMKeyAllStopped, true);
	}
	
	this.GenerateGUID = function()
	{
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});

		return uuid;
	}
	
	this.IsUndefined = function(obj)
	{
		return (typeof obj == "undefined" || !obj);
	}
	
	this.SetMethodSetValue = function(func)
	{
		this.SetValue = func;
	}
	
	this.SetMethodGetValue = function(func)
	{
		this.GetValue = func;
	}
	
	this.SetMethodLog = function(func)
	{
		this.Log = this.IsUndefined(func) ? function() {} : func;
	}
	
	//Member variables
	this.mLastRun = 0;
	this.mRunFunction = methodToCall;
	this.mIntervalInSeconds = intervalInSeconds;
	this.mCreated = new Date();
	this.mFuntionName = this.GetFunctionName(methodToCall);
	this.mGMKeyName = 'GM_Scheduler_LastRun_' + this.mFuntionName;
	this.mGMKeyAllStopped = this.mGMKeyName + '_AllSessionsStopped';
	this.mGUID = this.GenerateGUID();
	this.mActive = false;
	this.Log = this.IsUndefined(logMethod) ? function() {} : logMethod;
	this.SetValue = setValueMethod;
	this.GetValue = getValueMethod;
}

