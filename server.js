const express = require("express");
require("dotenv").config();
const https = require("https");
const bodyParser = require("body-parser");
const { dirname } = require("path");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.set("view engine","ejs");
app.get("/",function(req,res){
    res.render("main");
});
app.post("/",function(req,res){
    //weather api parameters
    const unit = "metric";
    //requesting city name
    const cityName = req.body.city;
    console.log(cityName);
    //api call
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units="+unit+"&appid="+process.env.appid;
    https.get(url,function(response){
        console.log(response.statusCode);
        console.log(response.statusMessage);
        if(response.statusCode=="200"){
            response.on("data",function(data){
                var today = new Date();
                var options={
                    weekday:"short",
                    day:"numeric"  
                }
                var day = today.toLocaleDateString("en-US",options)
                const weatherData = JSON.parse(data);
                console.log(weatherData);
                var temp = weatherData.main.temp + "°";
                var descriptions = weatherData.weather[0].description;
                var iconId = weatherData.weather[0].icon;
                var city = " "+weatherData.name+ ", "+weatherData.sys.country;
                console.log(city);
                var humidity ="  "+ weatherData.main.humidity + "%"; 
                res.render("weather",{day:day,temp:temp,descriptions:descriptions,iconId:iconId,cityName:city,humidity:humidity});
            });
        }else{
            res.send("Something went wrong!");
        }        
    }); 
});


app.listen(process.env.PORT || 3000,function(){
    console.log("Server started at pory 3000");
})