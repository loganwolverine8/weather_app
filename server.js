const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const apiKey = '5293344df9ec919adb6bbe9a21f23188';
const weather = {
    weather: null,
    error: null
};

let timestamp;

const requestWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

        request(url, (err, response, body) => {
            const weatherResponse = JSON.parse(body);

            if (err) {
                let errMsg = JSON.stringify(err);
                weather.error = 'Error, please try again.';
                console.log(`${timestamp} - ${city} - error: ${errMsg}`);
                resolve();
            } else if (!weatherResponse.name || !weatherResponse.main.temp) {
                weather.error = 'Error, please try again.';
                console.log(`${timestamp} - ${city} - unexpected api output: ${body}`);
                resolve();
            } else {
                weather.weather = `Its ${weatherResponse.main.temp} degrees in ${city}.`;
                weather.error = null;
                console.log(`${timestamp} - ${city} - ${body}`);
                resolve();
            }
        });
    });
};

const clearWeather = () => {
    weather.weather = null;
    weather.error = null;
};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', weather);
});

app.post('/', (req, res) => {
    const city = req.body.city;
    timestamp = Date.now();
    console.log(`${timestamp} - ${city} - weather requested`);
    requestWeather(city).then(() => {
        res.render('index', weather);
        clearWeather();
    });
});

app.set("port", (process.env.PORT || 3000));

app.listen(app.get("port"), function() {
    console.log("Now listneing for connection on port: ", app.get("port"));
});