# Homework6: Weather Dashboard

* Build a weather dashboard application with search functionality to find current weather conditions and the future weather outlook for multiple cities.

* Include a search history so that users can access their past search terms. Clicking on the city name should perform a new search that returns current and future      conditions for that city. 

* Include a 5-Day Forecast below the current weather conditions. Each day for the 5-Day Forecast should display the following:

  * Date

  * Icon image (visual representation of weather conditions)

  * Temperature (mean)

  * Humidity (mean)

* Main functions:

* function currentCconditions{
       * show temp. ,humi. ,wind, date, icon and UVindex for the city where looking for
 }

* function Forecasting(city){ 
       
       * forecasting five next days and return mean of temp. and mean of humidity. why mean? because there are 8 periods of every three for each day in response.
       * response is an Array include 40 periods of time(each peried is 3 hours). These start from next daay 6AM. 
       * It means for next day we have just 6 periods but for rest days (second,third,4th and 5th) we have 8 periods for each day.
       * first day has 6 period (first loop and after that calculating avarage of temp. and humid. for first day )
       * There are 6 icons for 6 periods of the first day but I show the icon of midday.
       * second day, third day, 4th day and 5th day have 8 periods. (second loop has another loop inside itself for the rest of four day)
       * There are 8 icons for each periods of the rest four days but I show the icon of midday.
       * 6h day has just 2 periods (we dont need it)
       * total 40 periods

} 
