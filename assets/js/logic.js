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

//GLOBAL VARIABLES//
var database = firebase.database();
var key;
var state = {
	open: 1,
	joined: 2,
};

//FIREBASE AUTHS - CREATE ACCOUNT, LOGIN, LOGOUT, USER STATUS CHANGE//
//Create a Firebase User using Navbar-Register
$("#submitSignUp").on("click", function (user) {
	var displayName = $("#username").val().trim();
	var email = $("#email").val().trim();
	var password = $("#password").val().trim();
	console.log("USER: " + username);
	console.log("email: " + email);
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

//Firebase to listen for user status changes//
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		console.log("User Signed In");
	} else {
		console.log("User Signed Out");
	}
});

//GAME FUNCTIONS//
//Player 1 Initiates a new game and pushes to games path in Firebase
function newGame() {
	var user = firebase.auth().currentUser;
	var currentGame = {
		player1: { uid: user.uid, displayName: user.displayName, wins: 0, losses: 0, ties: 0, pick:""},
		state: state.open,
	};
	database.ref("/games").push().set(currentGame);
	console.log(currentGame);
	$("#startGame").hide();
	$("#player1Name").text(currentGame.player1.displayName);

}

//Create a variable for current game's object key 
database.ref("/games").on("child_added",function(snap){
	console.log(snap.key);
	key = snap.key;
})

//User 2 to join the existing game and push information into the current game object
function joinGame() {
	console.log("you clicked me");
	var user = firebase.auth().currentUser;
	var gameLocation = database.ref("/games").child(key);
	gameLocation.transaction(function (currentGame) {
		if (!currentGame.player2) {
			currentGame.state = state.joined;
			currentGame.player2 = { uid: user.uid, displayName: user.displayName, wins: 0, losses: 0, ties: 0, pick:""};
			$("#joinGame").hide();
			$("#player2Name").text(currentGame.player2.displayName);
		}
		return currentGame;
	})
	playGame();
}


function playGame(){
	if (state = state.joined){
		console.log("lets play!");
		pickRPS();
 }
}

function pickRPS(){
	$(".rpsButton").on("click", function (){
		var rps = $(this).val();
		console.log(rps);
	})
}

function determineWin(){
		if ((player1.pick === "r") && (player2.pick === "s")) {
			player1.wins++;
			player2.losses++;
		} else if ((player1.pick === "r") && (player2.pick === "p")) {
			player1.losses++;
			player2.wins++;
		} else if ((player1.pick === "s") && (player2.pick === "r")) {
			player1.losses++;
			player2.wins++;
		} else if ((player1.pick === "s") && (player2.pick === "p")) {
			player1.wins++;
			player2.losses++;
		} else if ((player1.pick === "p") && (player2.pick === "r")) {
			player1.wins++;
			player2.losses++;
		} else if ((player1.pick === "p") && (player2.pick === "s")) {
			player1.losses++;
			player2.wins++;
		} else if (player1.pick === player2.pick) {
			player1.ties++;
			player2.ties++;
		}
}

//Event Listeners - Call Functions//
$("#startGame").on("click", newGame);
$("#joinGame").on("click", joinGame);

//Display chat messages - still need to link to Firebase//
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