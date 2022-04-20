// This is our API key.
var key = "&appid=8c9bb7e0eeb10862d148cd62de471c05";

// Here we are building the URL we need to query the database
var url = "https://api.openweathermap.org/data/2.5/weather?q=";

// array to add cities to, to be grabbed from after search
var citiesArray = JSON.parse(localStorage.getItem("cities")) || [];

const m = moment();

$(document).ready(function documentReady () {
	var city = citiesArray[citiesArray.length - 1];
	fiveForecast(city);
	citySearch(city);
});



function citySearch(city) {
	// clear out previous city data
	$(".city").empty();
	$(".temp").empty();
	$(".humidity").empty();
	$(".wind").empty();
	$(".uvI").empty();

	var citySearch = url + city + key;

	//if there is no input default city to austin
	if (city.length == 0) {
		city = "Austin";
	}

	// ajax for searching for new city to display
	$.ajax({
		url: citySearch,
		method: "GET"
	}).then(function (response) {

		var cityInfo = response.name;

		var dateInfo = response.dt;

		var currentDate = moment.unix(dateInfo).format("L");

		var iconDummy = "https://openweathermap.org/img/wn/";
		var iconPng = "@2x.png";
		var iconWeather = response.weather[0].icon;
		var iconUrl = iconDummy + iconWeather + iconPng;
		// console.log(iconUrl);
		var iconImg = $("<img>");
		iconImg.attr("src", iconUrl);
		$(".city").append(cityInfo + " ");
		$(".city").append(currentDate + " ");
		$(".city").append(iconImg);

		var K = response.main.temp;
		console.log(K);
		var F = ((K - 273.15) * 1.8 + 32).toFixed(0);
		console.log(F);
		$(".temp").append("Temperature: " + F + " °F");

		var humidityInfo = response.main.humidity;
		$(".humidity").append("Humidity: " + humidityInfo + "%");
		
		console.log(response.wind.speed);
		var oldSpeed = response.wind.speed;
		console.log(oldSpeed);
		var newSpeed = (oldSpeed * 2.2369).toFixed(2);
		$(".wind").append("Wind Speed: " + newSpeed + " MPH");

		//grabbing latt and long
		
		var long = response.coord.long;
		var latt = response.coord.latt;

		// SEND OVER TO uvI()
		uvI(long, latt);
	});
}

function uvI(long, latt) {

	var indexURL = "https://api.openweathermap.org/data/2.5/uvi?appid=8c9bb7e0eeb10862d148cd62de471c05&latt=";
	var middle = "&long=";
	var indexSearch = indexURL + latt + middle + long;
	// console.log(indexSearch);

	$.ajax({
		url: indexSearch,
		method: "GET"
	}).then(function (response) {
		var uvFinal = response.value;

		// should be able to compare float to the numbers, try it out
		// then append button with uvFinal printed to it
		$(".uvI").append("UV Index: ");
		var uvBtn = $("<button>").text(uvFinal);
		$(".uvI").append(uvBtn);
		// then style uvFinal button with below
		if (uvFinal < 3) {
			// IF RETURN IS 0-2 SYLE GREEN
			uvBtn.attr("class", "uvGreen");
		} else if (uvFinal < 6) {
			// IF 3-5 STYLE YELLOW
			uvBtn.attr("class", "uvYellow");
		} else if (uvFinal < 8) {
			// IF 6-7 STYLE ORANGE
			uvBtn.attr("class", "uvOrange");
		} else if (uvFinal < 11) {
			// IF 8-10 STYLE RED
			uvBtn.attr("class", "uvRed");
		} else {
			// IF 11+ STYLE VIOLET
			uvBtn.attr("class", "uvPurple");
		}
	});
}


// re-rendering the button after a search is made
function renderButtons() {
	// Deleting the buttons prior to adding new movies
	$(".list-group").empty();

	// Looping through the array of cities
	for (var i = 0; i < citiesArray.length; i++) {
		// Then dynamicaly generating buttons for each
		var a = $("<li>");
		// Adding a class
		a.addClass("cityName");
		a.addClass("list-group-item");
		// Adding a data-attribute
		a.attr("data-name", citiesArray[i]);
		// Providing the initial button text
		a.text(citiesArray[i]);
		// Adding the button to the buttons-view div
		$(".list-group").append(a);
	}

	$(".cityName").on("click", function (event) {
		event.preventDefault();

		var city = $(this).data("name");
		console.log("prev searched city" + city);

		//give city info to five day forcast cards as well
		fiveForecast(city);
		//pull up the information display
		citySearch(city);
	});
}


//five day forecast function
function fiveForecast(city) {
	var fiveFront = "https://api.openweathermap.org/data/2.5/forecast?q=";
	var fiveURL = fiveFront + city + key;
	console.log(fiveFront);

	//clear out previous data
	$(".card-text").empty();
	$(".card-title").empty();

	$.ajax({
		url: fiveURL,
		method: "GET"
	}).then(function (response) {
		//dates
		var dateOne = moment
			.unix(response.list[1].dt)
			.utc()
			.format("L");
		$(".dateOne").append(dateOne);
		var dateTwo = moment
			.unix(response.list[9].dt)
			.utc()
			.format("L");
		$(".dateTwo").append(dateTwo);
		var dateThree = moment
			.unix(response.list[17].dt)
			.utc()
			.format("L");
		$(".dateThree").append(dateThree);
		var dateFour = moment
			.unix(response.list[25].dt)
			.utc()
			.format("L");
		$(".dateFour").append(dateFour);
		var dateFive = moment
			.unix(response.list[33].dt)
			.utc()
			.format("L");
		$(".dateFive").append(dateFive);

		//icon
		var iconOne = $("<img>");
		var iconOneSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[4].weather[0].icon +
			"@2x.png";
		// console.log("card Icon line 280" + iconOneSrc);
		iconOne.attr("src", iconOneSrc);
		$(".iconOne").append(iconOne);

		var iconTwo = $("<img>");
		var iconTwoSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[12].weather[0].icon +
			"@2x.png";
		iconTwo.attr("src", iconTwoSrc);
		$(".iconTwo").append(iconTwo);

		var iconThree = $("<img>");
		var iconThreeSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[20].weather[0].icon +
			"@2x.png";
		iconThree.attr("src", iconThreeSrc);
		$(".iconThree").append(iconThree);

		var iconFour = $("<img>");
		var iconFourSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[28].weather[0].icon +
			"@2x.png";
		iconFour.attr("src", iconFourSrc);
		$(".iconFour").append(iconFour);

		var iconFive = $("<img>");
		var iconFiveSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[36].weather[0].icon +
			"@2x.png";
		iconFive.attr("src", iconFiveSrc);
		$(".iconFive").append(iconFive);

		//temp
		$(".tempOne").append("Temperature: ");
		$(".tempOne").append(
			avgTempCalc(
				response.list[2].main.temp,
				response.list[4].main.temp,
				response.list[6].main.temp
			)
		);
		$(".tempOne").append(" °F");

		$(".tempTwo").append("Temperature: ");
		$(".tempTwo").append(
			avgTempCalc(
				response.list[10].main.temp,
				response.list[12].main.temp,
				response.list[14].main.temp
			)
		);
		$(".tempTwo").append(" °F");

		$(".tempThree").append("Temperature: ");
		$(".tempThree").append(
			avgTempCalc(
				response.list[18].main.temp,
				response.list[20].main.temp,
				response.list[22].main.temp
			)
		);
		$(".tempThree").append(" °F");

		$(".tempFour").append("Temperature: ");
		$(".tempFour").append(
			avgTempCalc(
				response.list[26].main.temp,
				response.list[28].main.temp,
				response.list[30].main.temp
			)
		);
		$(".tempFour").append(" °F");

		$(".tempFive").append("Temperature: ");
		$(".tempFive").append(
			avgTempCalc(
				response.list[34].main.temp,
				response.list[36].main.temp,
				response.list[38].main.temp
			)
		);
		$(".tempFive").append(" °F");

		//humidity
		$(".humidityOne").append("Humidity: ");
		$(".humidityOne").append(
			avgHumidCalc(
				response.list[2].main.humidity,
				response.list[4].main.humidity,
				response.list[6].main.humidity
			)
		);
		$(".humidityOne").append("%");

		$(".humidityTwo").append("Humidity: ");
		$(".humidityTwo").append(
			avgHumidCalc(
				response.list[10].main.humidity,
				response.list[12].main.humidity,
				response.list[14].main.humidity
			)
		);
		$(".humidityTwo").append("%");

		$(".humidityThree").append("Humidity: ");
		$(".humidityThree").append(
			avgHumidCalc(
				response.list[18].main.humidity,
				response.list[20].main.humidity,
				response.list[22].main.humidity
			)
		);
		$(".humidityThree").append("%");

		$(".humidityFour").append("Humidity: ");
		$(".humidityFour").append(
			avgHumidCalc(
				response.list[26].main.humidity,
				response.list[28].main.humidity,
				response.list[30].main.humidity
			)
		);
		$(".humidityFour").append("%");

		$(".humidityFive").append("Humidity: ");
		$(".humidityFive").append(
			avgHumidCalc(
				response.list[34].main.humidity,
				response.list[36].main.humidity,
				response.list[38].main.humidity
			)
		);
		$(".humidityFive").append("%");
	});
}

function avgTempCalc(x, y, z) {
	var avgThree = (x + y + z) / 3.0;
	var avgReturn = ((avgThree - 273.15) * 1.8 + 32).toFixed(0);
	return avgReturn;
}

function avgHumidCalc(x, y, z) {
	var avgHum = (x + y + z) / 3.0;
	return avgHum.toFixed(0);
}


$("#add-city").on("click", function (event) {
	event.preventDefault();

	//line that grabs input from the textbox
	var city = $("#searchInput")
		.val()
		.trim();
	console.log(city);

	//push new city into the Array
	var containsCity = false;

	if (citiesArray != null) {
		$(citiesArray).each(function (x) {
			if (citiesArray[x] === city) {
				containsCity = true;
			}
		});
	}

	if (containsCity === false) {
		citiesArray.push(city);
	}

	// add to local storage
	localStorage.setItem("cities", JSON.stringify(citiesArray));

	//give city info to five day forcast cards as well
	fiveForecast(city);

	// search for the city
	citySearch(city);

	// then setting up a button that is created for each city searched for
	renderButtons();
});

renderButtons();