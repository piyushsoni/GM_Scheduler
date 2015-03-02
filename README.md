# GM_Scheduler
A simple Javascript Task Scheduler primarily written to run on GreaseMonkey scripts, but can be used otherwise. The scheduler makes sure it runs the task only once in the given time interval, irrespective of the number of pages it concurrently runs upon. You can use it to schedule your Tasks every few seconds/minutes/hours/days on the websites you want. Want to check the availability of your desired new product on a website? Just write a check task and run it using GM_Scheduler on all the pages you want! 

To use it, you have to provide a couple of methods which can set and get a persistent value across sessions(and an optional Log method if you prefer), just like the GM_setValue and GM_getValue methods are(. If you are not working with GreaseMonkey, other methods like offlineStorage or methods using Local database transactions would work best. 

If you are using it with GreaseMonkey, this is how you initiate and start the scheduler: 

Add this script to your userscript using the require tag, and make sure the required GM_* methods are defined-  

```javascript
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_log
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

After doing it, you can open the page on which this script runs on in as many tabs as you want, and the method should still run exactly once every n seconds. 


In case you want to run your task specific number of times, just set this before calling Start()- 

```javascript
scheduler.RunForNumberOfTimes(10);
````

Or for running it for a specific time period (in seconds)- 
```javascript
scheduler.RunForSeconds(17);
````

The given Callback method will be called every 'n' seconds but stop after the set duration (again, and can be called from multiple pages). 


To stop running all the Tasks from any instance of the script at once, call 
```javascript
scheduler.Stop();
````


In case you want to stop only a given instance of your Script (for a particular tab), you can call the same method with a *true* parameter. 
```javascript
scheduler.Stop(true);
````
