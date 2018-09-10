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
var key;

//Create a Firebase User using Navbar-Register
$("#submitSignUp").on("click", function (user) {
	var displayName = $("#username").val().trim();
	var email = $("#email").val().trim();
	var password = $("#password").val().trim();
	console.log("USER: " + username);
	console.log("email: " + email);
	console.log("password: " + password);
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
		user.updateProfile({ displayName: displayName });
	}).catch(function (error) {
		console.log(error);
	});
});


//Sign into Firebase using Navbar-Login
$("#submitLogin").on("click", function () {
	var email = $("#loginEmail").val().trim();
	var password = $("#LoginPsw").val().trim();
	console.log("Login Successful!");
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log("Error: " + errorCode + " Message: " + errorMessage);

	});
});

//Sign out of Firebase using Navbar-Sign OUt
$("#signOut").on("click", function () {
	event.preventDefault();
	firebase.auth().signOut().then(function () {
		console.log("Sign Out Successful");
	}).catch(function (error) {
		console.log("Error Signing Out");
	});
});


$("#typeMessage").keypress(function (e) {
	if (e.which == 13) {
		var message = $("#typeMessage").val().trim();
		var displayMessage = $("<p class='chatMsg'>").html(message);
		$("#displayMessage").append(displayMessage);
		console.log(message);
		$("#typeMessage").val("");
		event.preventDefault();
	}
});

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		console.log("User Signed In");
	} else {
		console.log("User Signed Out");
	}
});

var state = {
	open: 1,
	joined: 2,
};

function newGame() {
	var user = firebase.auth().currentUser;
	var currentGame = {
		creator: { uid: user.uid, displayName: user.displayName },
		state: state.open,
	};
	database.ref("/games").push().set(currentGame);
	console.log(currentGame);
	$("#startGame").hide();
}

$("#startGame").on("click", newGame);

database.ref("/games").on("child_added",function(snap){
	console.log(snap.key);
	key = snap.key;
})

function joinGame() {
	console.log("you clicked me");
	var user = firebase.auth().currentUser;
	var gameLocation = database.ref("/games").child(key);
	gameLocation.transaction(function (currentGame) {
		if (!currentGame.joiner) {
			currentGame.state = state.joined;
			currentGame.joiner = { uid: user.uid, displayName: user.displayName };
		}
		return currentGame;
	})
}
$("#joinGame").on("click", joinGame);
