# GM_Scheduler
A simple Javascript Task Scheduler primarily written to run on GreaseMonkey scripts, but can be used otherwise. The scheduler makes sure it runs the task only once in the given time interval.

To use it, you have to provide a couple of methods which can set and get a persistent value across sessions(and an optional Log method if you prefer), just like the GM_setValue and GM_getValue methods are. If you are not working with GreaseMonkey, other methods like offlineStorage or methods using Local database transactions would work best. 

This is how you initiate and start the Scheduler. If you are using it with GreaseMonkey, this is how it will work: 

Add this script to your userscript using the require tag : 

```javascript
// @require		https://raw.githubusercontent.com/piyushsoni/GM_Scheduler/master/GM_Scheduler.js
````


```javascript
//The callback you want to call every n seconds
function callback()  
{  
	//..  
	//..  
	//..  
}  
````

```javascript
var scheduler = new GM_Scheduler(callback, 3600 /*run every hour*/, GM_setValue, GM_getValue, GM_log);  
scheduler.Start();  
````


Irrespective of the number of pages open at a time on which this script runs, the script runs the method only once every [intervalInSeconds] seconds. 