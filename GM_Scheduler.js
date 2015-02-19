// GM_Scheduler 
// Version 2.62
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
		var currentTime = new Date();
		var currentNumberOfTimes;

		if(this.mRunForSeconds > 0)
		{
			var firstRunTime = this.GetValue(this.mGMKeyFirstStartTime, 0);
			if(firstRunTime != 0)
			{
				firstRunTime = new Date(firstRunTime);
				var totalElapsedTime = (currentTime - firstRunTime)/1000.0;
				if(totalElapsedTime >= this.mRunForSeconds)
				{
					this.Log("Time duration over, going to stop all sessions.");
					this.Stop();
					return;
				}
			}
		}
		
		if(this.mRunForNumberOfTimes > 0)
		{
			currentNumberOfTimes = this.GetValue(this.mGMKeyCurrentNumberOfTimes, 0);
			if(currentNumberOfTimes >= this.mRunForNumberOfTimes)
			{
				this.Log("Max number of calls (" + this.mRunForNumberOfTimes + ") reached, going to stop all sessions.");
				this.Stop();
				return;
			}
		}

		var lastRunTime = new Date(this.GetValue(this.mGMKeyLastRun, 0));
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
				if(this.mRunForNumberOfTimes > 0)
					this.SetValue(this.mGMKeyCurrentNumberOfTimes, (currentNumberOfTimes + 1));
				if(this.mRunForSeconds > 0 && this.GetValue(this.mGMKeyFirstStartTime, 0) == 0)
					this.SetValue(this.mGMKeyFirstStartTime, currentTime);
					
				this.SetValue(this.mGMKeyLastRun, currentTime);
				this.mRunFunction();
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
		
		if(this.GetValue(this.mGMKeyAllStopped, true))
		{
			// this.ResetCounters();
			this.SetValue(this.mGMKeyLastRun, 0);
			this.SetValue(this.mGMKeyAllStopped, false);
		}
		
		if(dontCallAtTimeZero)
		{
			var currentTime = new Date();
			this.SetValue(this.mGMKeyLastRun, currentTime);
			if(this.GetValue(this.mGMKeyFirstStartTime, 0) == 0)
				this.SetValue(this.mGMKeyFirstStartTime, currentTime);
		}
		
		this.Test();
	}
	
	this.Stop = function(stopJustThisSession /*stops all by default*/)
	{
		this.mActive = false;
		if(!stopJustThisSession)
		{
			this.SetValue(this.mGMKeyAllStopped, true);
			this.Log('Stopping all sessions.');
		}
		else
			this.Log(this.mGUID + ": " + " Stopping.");
		
		
		this.SetValue(this.mGMKeyLastRun, 0);
		//Don't reset the counters by default here. 
		// this.ResetCounters();
	}
	
	this.ResetCounters = function()
	{
		this.SetValue(this.mGMKeyFirstStartTime, 0);
		this.SetValue(this.mGMKeyLastRun, 0);
		this.SetValue(this.mGMKeyCurrentNumberOfTimes, 0);
		this.mActive = false;
	}
	
	//Start after resetting all (Time/Number) counters. Call it only once from one of the scripts. 
	this.Restart = function()
	{
		this.ResetCounters();
		this.Start();
	}
	
	this.IsRunning = function()
	{
		return !this.GetValue(this.mGMKeyAllStopped, true);
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
	
	this.RunForNumberOfTimes = function(maxTimes)
	{
		if(isNaN(maxTimes))
		{
			alert('Error: Max times is not a number');
			return;
		}
		this.mRunForNumberOfTimes = maxTimes;
		//this.SetValue(this.mGMKeyMaxNumberOfTimes, maxTimes);
	}
	
	this.RunForSeconds = function(seconds)
	{
		if(isNaN(seconds))
		{
			alert('Error: Max times is not a number');
			return;
		}
		this.mRunForSeconds = seconds;
		//this.SetValue(this.mGMKeyDurationInSeconds, seconds);
	}
	
	this.RunForMinutes = function(minutes)
	{
		this.RunForSeconds(minutes * 60);
	}
	
	this.RunForHours = function(hours)
	{
		this.RunForSeconds(hours * 3600);
	}
	
	//Member variables
	this.mLastRun = 0;
	this.mRunFunction = methodToCall;
	this.mIntervalInSeconds = intervalInSeconds;
	this.mRunForSeconds = -1;
	this.mRunForNumberOfTimes = -1;
	this.mCreated = new Date();
	this.mFuntionName = this.GetFunctionName(methodToCall);
	this.mGMKeyName = 'GM_Scheduler_' + this.mFuntionName;
	this.mGMKeyLastRun = this.mGMKeyName + '_LastRun';
	this.mGMKeyAllStopped = this.mGMKeyName + '_AllSessionsStopped';
	this.mGMKeyCurrentNumberOfTimes = this.mGMKeyName + '_CurrentCount';
	this.mGMKeyMaxNumberOfTimes = this.mGMKeyName + '_MaxCount';
	this.mGMKeyFirstStartTime = this.mGMKeyName + '_FirstStartTime';
	this.mGMKeyDurationInSeconds = this.mGMKeyName + '_Duration';
	this.mGUID = this.GenerateGUID();
	this.mActive = false;
	this.Log = this.IsUndefined(logMethod) ? function() {} : logMethod;
	this.SetValue = setValueMethod;
	this.GetValue = getValueMethod;
}
