	"use strict";
		var MYGASFEED_JSONP_URL = "http://devapi.mygasfeed.com/";
		var MYGASFEED_API_KEY = "rfej9napna";
		var GOOGLE_JSONP_URL ="https://maps.googleapis.com/maps/api/js?key="
		var GOOGLE_API_KEY = "AIzaSyCYb_LJjF3SdU9CIbOa83JIzWw3EcLp0Ks";
    	google.maps.event.addDomListener(window, 'load', initialize);
    
    // GLOBALS
      var map,infowindow,coordinates, sortByPrice, searchDistance;
	  var markersArray = [];
      
      
      function initialize() {
		sortByPrice = true;
        var myOptions = {
          zoom: 8,
          center: new google.maps.LatLng(-34.397, 150.644),
          mapTypeId: google.maps.MapTypeId.SATELLITE
        };
        map = new google.maps.Map(document.getElementById('map_canvas'),
            myOptions);
			
		getLocation();
			
		document.querySelector("#distanceSort").onclick = setDistanceSort;	
        document.querySelector("#priceSort").onclick = setPriceSort;
		document.querySelector("#searchradius").onchange = getLocation;
		
		// react to user input
		$(document).ready(function(){
			//getLocation();
		/*	
			// when the user leaves the search bar, shrink image
			$("#searchradius").focusin(getLocation());
			$("#searchterm").focusout(function(){
				$("#content").hide(); // hide contents
				$("#search").animate({
					height: "80px",
					width: "100%",
					margin: "0",
				}, 1500 );
				$("#searchterm").animate({
					margin: "20",
				}, 1500 );
				$("#content").slideDown("slow");
			});
			// when the user leaves the radius bar, shrink image
			$("#searchradius").change(function(){
				$("#search").animate({
					height: "80px",
					width: "100%",
					margin: "0",
				}, 1500 );
				$("#searchterm").animate({
					margin: "20",
				}, 1500 );
				$("#content").slideDown("slow");
			});
			// when the user enters the search bar, enlarge image
			$("#searchterm").focusin(function(){
				$("#search").animate({
					height: "640px",
					width: "100%",
					margin: "0",
				}, 1500 );
				$("#searchterm").animate({
					margin: "310px 280px",
				}, 1500 );
				$("#content").slideUp("slow");
			});
			// if the user hits enter, duplicate leaving the search bar
			$(window).keydown(function(event){
				if(event.keyCode == 13) {
					$("#search").animate({
						height: "80px",
						width: "100%",
						margin: "0",
					}, 1500 );
					$("#searchterm").animate({
						margin: "20",
					}, 1500 );
					$("#content").slideDown("slow");
				  event.preventDefault();
				  return false;
				}
			});
		*/
		});
		
      }

     
      
      ////////// FUNCTIONS //////////////////
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		}
		else {
			// error message
			return;//event.preventDefault();
		}
	}
	
	function showPosition(position) {
		var lat=position.coords.latitude;
		var lon=position.coords.longitude;
		var pos=new google.maps.LatLng(lat, lon);

		map.setCenter(pos);
		map.setZoom(14);
		clearMarkers();
		var marker=new google.maps.Marker({position:pos,map:map,title:"You are here!"});
		markersArray.push(marker);
		if(sortByPrice){
			getData(lat, lon, document.querySelector("#searchradius").value, "reg", "price");
		} else {
			getData(lat, lon, document.querySelector("#searchradius").value, "reg", "distance");
		}
	}
	
	function showLatLon(lat,lon,name,address,num) {
		var pos=new google.maps.LatLng(lat,lon);
		/*if(num == 0) {
			map.setCenter(pos);
			map.setZoom(15);
		}*/
		//else { return; }//event.preventDefault();}
		var marker=new google.maps.Marker({position:pos,map:map,title:name + ":  " + address});
		markersArray.push(marker);
	}
	
	function clearMarkers() {
		for (var i=0;i<markersArray.length;i++) {
			markersArray[i].setMap(null);
		}
		markersArray = [];
	}
	
	// Gets data from myGasFeed API
	//lat - latitude
	//lon - longitude
	//distance - A number (miles) of the radius distance of stations according to the user's geo location
	//fuelType - Argument types: reg,mid,pre or diesel. Which type of gas prices that will be returned.
	//sortBy - Type arguments: price or distance. Gas stations will be sorted according to the argument.
	function getData(lat,lon, distance, fuelType, sortBy){
		// build up our URL string
		// /stations/radius/(Latitude)/(Longitude)/(distance)/(fuel type)/(sort by)/apikey.json?callback=?
		var url = MYGASFEED_JSONP_URL;
		url += "stations/radius/"; // searches for stations within 'distance'
		url += lat + "/" + lon + "/";
		url += distance + "/" + fuelType + "/" + sortBy + "/";
		url += MYGASFEED_API_KEY;
		url += ".json?callback=?";
		
		// call the web service, and download the file
		console.log("loading " + url);
		$.getJSON(url).done(function(data){jsonLoaded(data);});
	}
	
	// user initiated actions
	function setDistanceSort(){
		sortByPrice = false;
		getLocation();
	}
	
	function setPriceSort(){
		sortByPrice = true;
		getLocation();
	}
	
	/*
	// default data call
	function getDataAuto(lat,lon){
		var distance = 5; //A number (miles) of the radius distance of stations according to the user's geo location
		var fuelType = "reg"; //Argument types: reg,mid,pre or diesel. Which type of gas prices that will be returned.
		var sortBy = "price"; //Type arguments: price or distance. Gas stations will be sorted according to the argument.
	
		// build up our URL string
		// /stations/radius/(Latitude)/(Longitude)/(distance)/(fuel type)/(sort by)/apikey.json?callback=?
		console.log("auto run");
		var url = MYGASFEED_JSONP_URL;
		url += "stations/radius/"; // searches for stations within 'distance'
		url += lat + "/" + lon + "/";
		url += distance + "/" + fuelType + "/" + sortBy + "/";
		url += MYGASFEED_API_KEY;
		url += ".json?callback=?";
		
		// call the web service, and download the file
		console.log("loading " + url);
		$.getJSON(url).done(function(data){jsonLoaded(data);});
	}
	*/
	
	/*
	function getDataManual(){
		clearMarkers();
		// build up our URL string
		var url = MYGASFEED_JSONP_URL;
		url +=  MYGASFEED_API_KEY;
		url += "&categories=restaurant"
		
		// set search parameters
		url += "&postal_code=";
		
		// get value of form field
		var value = document.querySelector("#searchterm").value;
		
		// get rid of any leading and trailing spaces
		value = value.trim();
		
		// if there's no postal code to search then bail out of the function (return does this)
		if(value.length < 5) {
			event.preventDefault();
			return;
		}
		
		document.querySelector("#content").innerHTML = "<b>Searching for " + value + "</b>";
		
		// replace spaces the user typed in the middle of the term with %20
		// %20 is the hexadecimal value for a space
		value = encodeURI(value);
		
		// finally, add the postal code to the end of the string
		url += value;
		
		// call the web service, and download the file
		console.log("loading " + url);
		$.getJSON(url).done(function(data){jsonLoaded(data);});
	}
		*/
	function jsonLoaded(obj){
		console.log("obj = " + obj);
		console.log("obj stringified = " + JSON.stringify(obj));
		document.querySelector("#content").innerHTML = "Loading ...";
		
		if(obj == undefined){
			
				document.querySelector("#content").innerHTML = "<b>No Results Found</b>";
				console.log("not found");
		} else {
			var numStations = 0;
			var fullString = "Number of Stations: ";
			var bigString = "";
			console.log("stations = " + obj.stations.length);
			for (var i=0;i<obj.stations.length;i++)
			{
				var name = obj.stations[i].station;
				//var phone = obj.objects[i].phone;
				//var website_url = obj.objects[i].website_url;
				var address = obj.stations[i].address;
				var latitude = obj.stations[i].lat;
				var longitude = obj.stations[i].lng;
				var price = obj.stations[i].reg_price;
				var distance = obj.stations[i].distance;
				
				// if there are no values, do not show
				if(name != null && address != null && name != "" && address != "")
				{
					// set map
					showLatLon(latitude,longitude,name,address,i);
					// ALL INFO IS DISPLAYED IN AN UNORDERED LIST
					// feel free to edit and/or insert ID's for certain tags		
					var line = "<p>";
					// if any secondary values are NULL, do not show them
					line += "<b>" + name + "</b><br><ul>";
					line += "<li>" + "Address: " + address + "</li>";
					line += "<li>" + "Price: " + price + "</li>";
					line += "<li>" + "Distance: " + distance + "</li>";
					line += "</ul></p>";
					bigString += line;
					numStations++;
				}
				/*else {
					return;//event.preventDefault();
				}*/
			}
			fullString += numStations + "<br>" + bigString;
			document.querySelector("#content").innerHTML = fullString;
			document.querySelector("#loading").innerHTML = "";
		}
	}