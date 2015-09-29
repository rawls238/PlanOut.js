*Changes in 1.2.3
- Exposure now only gets logged on the get function call if it is a valid parameter as defined by getParamNames() 

*Changes in 1.2
- The return value of assign now determines whether or not an exposure event will
  be automatically logged. If either a truth-y value or nothing is returned from assign, then exposure
  will be logged. If a false-y value (excluding undefined) is returned then exposure will not be logged.

-getParams(experimentName) is now a function on the namespace class 