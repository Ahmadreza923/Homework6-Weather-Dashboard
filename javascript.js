
var APIKey = "166a433c57516f51dfab1f7edaed8413";
var citysArray=[];
citysArray=["","","","","","","",""];
citysArray[0]= localStorage.getItem("citysArray0");
citysArray[1]= localStorage.getItem("citysArray1");
citysArray[2]= localStorage.getItem("citysArray2");
citysArray[3]= localStorage.getItem("citysArray3");
citysArray[4]= localStorage.getItem("citysArray4");
citysArray[5]= localStorage.getItem("citysArray5");
citysArray[6]= localStorage.getItem("citysArray6");
citysArray[7]= localStorage.getItem("citysArray7");

$(document).ready(function() {

    $("#search").on("click", function(event) { //start getting a name of city and search it 
        event.preventDefault();
        var searchCity=$("#input").val();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
        "q="+searchCity+",Burundi&units=imperial&appid=" + APIKey;
        save(searchCity);
        addRow();
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response1) {
            var latitude= response1.coord.lat;
            var longitude= response1.coord.lon;
            var queryURLUVIndex="http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey+ "&lat=" + latitude + "&lon=" + longitude;
            var UVIndex;
            $.ajax({ //only for UV index (response 2)
                url: queryURLUVIndex,
                method: "GET"
            }).then(function(response2) { 
                UVIndex= response2.value;
                currentCconditions(response1,response1.weather[0].icon,UVIndex);
                Forecasting(searchCity);
            })
        })
    })




    function save(newCity){ //save new city on the local storage and the table
        var flag;
        if (newCity===""){
            return
        }else {
            flag=$.inArray(newCity,citysArray);
            if (flag!==-1){
                citysArray[flag]=" ";
            }
            movetoDown();
            citysArray[0]=newCity;
            localStorage.setItem("citysArray0", citysArray[0]);
            localStorage.setItem("citysArray1", citysArray[1]);
            localStorage.setItem("citysArray2", citysArray[2]);
            localStorage.setItem("citysArray3", citysArray[3]);
            localStorage.setItem("citysArray4", citysArray[4]);
            localStorage.setItem("citysArray5", citysArray[5]);
            localStorage.setItem("citysArray6", citysArray[6]);
            localStorage.setItem("citysArray7", citysArray[7]);
        }
    }


    function movetoDown(){ //make empty the first room of Array and shift the rest down
        var flag;
        flag=$.inArray(" ", citysArray);
        if (flag===-1){
            for(i=7;i>0;i--){
                citysArray[i]=citysArray[i-1];
            }
        }else{
            for(i=flag;i>0;i--){
                citysArray[i]=citysArray[i-1];
            }
        }
    }


    function addRow(){  //add new row for the new city on the top
        var flag,i;
        $("#myTable").empty();
        flag=$.inArray(" ", citysArray);
        if (flag===-1){flag=7}
        for (i=0;i<=flag;i++){
            $(tableRow[i]).css({"border":"1px solid grey","height":"45px","font-size":"150%","background":"#f1f1f1"})
            $(tableRow[i]).text(citysArray[i])
        }
        $("#myTable").append(tableRow);
    }




        
    //show temp. ,humi. ,wind, date, icon and UVindex for the city where looking for
    function currentCconditions(current,icon,UV){
        var currentdate = new Date();
        var val=currentdate.getDate()+"/"+(currentdate.getMonth()+1)+"/"+currentdate.getFullYear();
        var result=$("<h>").text(current.name+" ("+val+")")
        var temperature=$("<p>").text("Temperature: "+ current.main.temp+" F");
        var humidity=$("<p>").text("Humidity: " + current.main.humidity+" %");
        var windSpeed=$("<p>").text("Wind Speed: " + current.wind.speed+ "MPH");
        var UVind=$("<p>").text("UV Index: "+UV);
        var iconPng= "http://openweathermap.org/img/w/" + icon+ ".png"; 
        var iconImage=$("<img>").attr("src",iconPng );
        $(result).css({"font-size": "200%"});
        $("#right").empty();
        $("#right").append(result,iconImage,temperature, humidity, windSpeed, UVind);
    }


    // forecasting five next days and return mean of temp. and mean of humidity. why mean? because there are 8 periods of every three for each day in response.
    function Forecasting(city){  
        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=" + APIKey + "&units=imperial";
        var iconPng  
        var meanTemperature=[0,0,0,0,0];
        var temperature=[0,0,0,0,0];
        var meanHumidity=[0,0,0,0,0];
        var humidity=[0,0,0,0,0];
        var title=$("<h>").text("5-Day Forecast:");
        $(title).css({"font-size":"200%", "margin":"20px","float":"left","width" : "100%"})
        var currentdate = new Date();
        $("#rightBottom").empty();
        $("#rightBottom").append(title); 
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            // response is an Array include 40 periods of time(each peried is 3 hours). These start from next daay 6AM. It means for next day we have just 6 periods but
            // for rest days (second,thired,4th and 5th) we have 8 periods for each day.
            // first day has 6 period (first loop and after that calculating avarage of temp. and humid. for first day )
            // second day has 8 period(second loop has another loop inside itself for the rest of four day)
            // thired day has 8 period
            // 4th day has 8 period
            // 5th day has 8 period
            // 6h day has just 2 period (we dont need it)
            // total 40 periods
            var index=0;
            for (i=0;i<6;i++){
                temperature[index]+=response.list[i].main.temp;
                humidity[index]+=response.list[i].main.humidity;
            }
            meanTemperature[index]= Math.floor(temperature[index]/6);  //result for first day
            meanHumidity[index]= Math.floor(humidity[index]/6);        //result for fisrt day
            iconPng= "http://openweathermap.org/img/w/" +response.list[2].weather[0].icon + ".png"; //There are 6 icons for 6 periods of the first day but I show the icon of midday.
            
            for (i=6;i<31;i++){      
                index++;         
                for(j=0;j<8;j++){
                    temperature[index]+=response.list[i+j].main.temp;
                    humidity[index]+=response.list[i+j].main.humidity;
                }
                meanTemperature[index]= Math.floor(temperature[index]/8);
                meanHumidity[index]= Math.floor(humidity[index]/8);
                iconPng= "http://openweathermap.org/img/w/" +response.list[i+4].weather[0].icon + ".png"; //There are 8 icons for each periods of the rest four days but I show the icon of midday.
                i+=7;
            }
            for (index=0;index<5;index++){
                var val=currentdate.getDate()+index+1+"/"+(currentdate.getMonth()+1)+"/"+currentdate.getFullYear();
                var nextDate=$("<div>").text(val);
                var temp=$("<p>").text("Temperature(mean): "+meanTemperature[index] +" F");
                var humi=$("<p>").text("Humidity(mean): " + meanHumidity[index]+" %"); 
                var box=$("<div>").text("");
                var iconImage=$("<img>").attr("src",iconPng );
                $(box).css({"background-color":"cornflowerblue", "height" : "180px", "width" : "160px", "float":"left","margin-left":"35px"})
                $(box).append(nextDate,temp,humi,iconImage)
                $("#rightBottom").append(box); 
            }
        })
    } 


    $("#clear").on("click", function(){  //clear local storage and table
    var i;
    for(i=0;i<8;i++){
        citysArray[i]="";
    }
    localStorage.setItem("citysArray0", citysArray[0]);
    localStorage.setItem("citysArray1", citysArray[1]);
    localStorage.setItem("citysArray2", citysArray[2]);
    localStorage.setItem("citysArray3", citysArray[3]);
    localStorage.setItem("citysArray4", citysArray[4]);
    localStorage.setItem("citysArray5", citysArray[5]);
    localStorage.setItem("citysArray6", citysArray[6]);
    localStorage.setItem("citysArray7", citysArray[7]);
    location.reload();
    })

    
    $("#myTable").delegate("tr", "click", function(e) {  //if you click on the each city on the table, the selected city goes to the top of tha table and show it's weather condition*
        $("#input").val($(e.currentTarget).text());
        var searchCity=$("#input").val();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
        "q="+searchCity+",Burundi&units=imperial&appid=" + APIKey;
        save(searchCity);
        addRow();
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response1) {
            var latitude= response1.coord.lat;
            var longitude= response1.coord.lon;
            var queryURLUVIndex="http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey+ "&lat=" + latitude + "&lon=" + longitude;
            var UVIndex;
            $.ajax({ //only for UV index (response 2)
                url: queryURLUVIndex,
                method: "GET"
            }).then(function(response2) { 
                UVIndex= response2.value;
                currentCconditions(response1,response1.weather[0].icon,UVIndex);
                Forecasting(searchCity);
            })
        })
    });
    
///////   MAIN 
    var tableRow=[$("<tr>"),$("<tr>"),$("<tr>"),$("<tr>"),$("<tr>"),$("<tr>"),$("<tr>"),$("<tr>")];
    var flag,i;
    $("#myTable").empty();
    flag=$.inArray("", citysArray);
    if (flag===-1){flag=7}
    if (flag!==0){
        for (i=0;i<=flag;i++){
            $(tableRow[i]).css({"border":"1px solid grey","height":"45px","font-size":"150%","background":"#f1f1f1"})
            $(tableRow[i]).text(citysArray[i])
        }
        $("#myTable").append(tableRow);
    }
    localStorage.setItem("citysArray0", citysArray[0]);
    localStorage.setItem("citysArray1", citysArray[1]);
    localStorage.setItem("citysArray2", citysArray[2]);
    localStorage.setItem("citysArray3", citysArray[3]);
    localStorage.setItem("citysArray4", citysArray[4]);
    localStorage.setItem("citysArray5", citysArray[5]);
    localStorage.setItem("citysArray6", citysArray[6]);
    localStorage.setItem("citysArray7", citysArray[7]);

})


