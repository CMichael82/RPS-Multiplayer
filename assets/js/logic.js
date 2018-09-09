 // Initialize Firebase
 var config = {
	apiKey: "AIzaSyD-TfQ8GCl9Zbwe_7DjZ6EjZaQAHFyfOJE",
	authDomain: "rockpaperscissors-cf61f.firebaseapp.com",
	databaseURL: "https://rockpaperscissors-cf61f.firebaseio.com",
	projectId: "rockpaperscissors-cf61f",
	storageBucket: "rockpaperscissors-cf61f.appspot.com",
	messagingSenderId: "354779347485"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submitSignUp").on("click", function(){
	var username = $("#username").val().trim();
	var email = $("#email").val().trim();
	var password = $("#password").val().trim();
	console.log("USER: " + username);
	console.log("email: " + email);
	console.log("password: " + password);
});

$("#submitLogin").on("click", function(){
	var email = $("#loginEmail").val().trim();
	var password = $("#LoginPsw").val().trim();
	console.log("email: " + email);
	console.log("password: " + password);
});