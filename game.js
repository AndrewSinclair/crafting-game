// the game itself
var game;
var text;
var tileSize = 80;
var inventory = [
	{name: 'a', num: 3, text: null},
	{name: 'b', num: 3, text: null},
	{name: 'c', num: 3, text: null},
	{name: 'd', num: 3, text: null},
	{name: 'e', num: 3, text: null}
];

//var activeSprites = {};

var dropzone;
var onDropzoneHandler = function(currentSprite){
	stopDrag(currentSprite, dropzone);
};


// once the window ends loading...
window.onload = function() {
     // creation of a new game
	game = new Phaser.Game(800, 800);
     // creation of "PlayGame" state
	game.state.add("PlayGame", playGame);
     // launching "PlayGame" state
	game.state.start("PlayGame");	
};

// "PlayGame" state
var playGame = function(game){};
playGame.prototype = {
	// when the state preloads...
	preload: function(){
		// preloading graphic assets
		game.load.image("field", "field.png");
		game.load.image("ingredient-a", "ingredient-a.png");
		game.load.image("ingredient-b", "ingredient-b.png");
		game.load.image("ingredient-c", "ingredient-c.png");
		game.load.image("ingredient-d", "ingredient-d.png");
		game.load.image("ingredient-e", "ingredient-e.png");
		game.load.image("dropzone", "dropzone.png");
	},
     // when the state starts...
	create: function(){
		// adding the sprite representing the game field     
		game.add.sprite(0, 0, "field");
		dropzone = game.add.sprite(240, 240, "dropzone");
		var ingredientA = game.add.sprite(80, 80, "ingredient-a");
		var ingredientB = game.add.sprite(160, 80, "ingredient-b");
		var ingredientC = game.add.sprite(240, 80, "ingredient-c");
		var ingredientD = game.add.sprite(320, 80, "ingredient-d");
		var ingredientE = game.add.sprite(400, 80, "ingredient-e");
		
		/*
		activeSprites["ingredient-a"] = [ingredientA];
		activeSprites["ingredient-b"] = [ingredientB];
		activeSprites["ingredient-c"] = [ingredientC];
		activeSprites["ingredient-d"] = [ingredientD];
		activeSprites["ingredient-e"] = [ingredientE];
		*/
		
		inventory[0].text = game.add.text(80, 0, inventory[0].num, {fill: '#000000'});
		inventory[1].text = game.add.text(160, 0, inventory[1].num, {fill: '#000000'});
		inventory[2].text = game.add.text(240, 0, inventory[2].num, {fill: '#000000'});
		inventory[3].text = game.add.text(320, 0, inventory[3].num, {fill: '#000000'});
		inventory[4].text = game.add.text(400, 0, inventory[4].num, {fill: '#000000'});
		
		text = game.add.text(250, 500, '', { fill: '#000000' });

		ingredientA.data = { value: 'a' };
		ingredientB.data = { value: 'b' };
		ingredientC.data = { value: 'c' };
		ingredientD.data = { value: 'd' };
		ingredientE.data = { value: 'e' };
		
		ingredientA.inputEnabled = true;
		ingredientB.inputEnabled = true;
		ingredientC.inputEnabled = true;
		ingredientD.inputEnabled = true;
		ingredientE.inputEnabled = true;

		ingredientA.input.enableDrag();
		ingredientA.originalPosition = ingredientA.position.clone();
		ingredientB.input.enableDrag();
		ingredientB.originalPosition = ingredientB.position.clone();
		ingredientC.input.enableDrag();
		ingredientC.originalPosition = ingredientC.position.clone();
		ingredientD.input.enableDrag();
		ingredientD.originalPosition = ingredientD.position.clone();
		ingredientE.input.enableDrag();
		ingredientE.originalPosition = ingredientE.position.clone();		
		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.enable(ingredientA);
		game.physics.arcade.enable(ingredientB);
		game.physics.arcade.enable(ingredientC);
		game.physics.arcade.enable(ingredientD);
		game.physics.arcade.enable(ingredientE);
		game.physics.arcade.enable(dropzone);

		ingredientA.input.enableSnap(tileSize, tileSize, false, true);
		ingredientB.input.enableSnap(tileSize, tileSize, false, true);
		ingredientC.input.enableSnap(tileSize, tileSize, false, true);
		ingredientD.input.enableSnap(tileSize, tileSize, false, true);
		ingredientE.input.enableSnap(tileSize, tileSize, false, true);

		ingredientA.events.onDragStart.add(startDrag);
		ingredientB.events.onDragStart.add(startDrag);
		ingredientC.events.onDragStart.add(startDrag);
		ingredientD.events.onDragStart.add(startDrag);
		ingredientE.events.onDragStart.add(startDrag);
		

		ingredientA.events.onDragStop.add(onDropzoneHandler);
		ingredientB.events.onDragStop.add(onDropzoneHandler);
		ingredientC.events.onDragStop.add(onDropzoneHandler);
		ingredientD.events.onDragStop.add(onDropzoneHandler);
		ingredientE.events.onDragStop.add(onDropzoneHandler);
	}
};

function getInvtoryObjByValue(value) {
	var currInventoryObj;
	
	for(var i = 0; i < inventory.length; i++) {
		currInventoryObj = inventory[i];
		if (currInventoryObj.name === value) {
			break;
		}
	}
	
	return currInventoryObj;
}

function addToPot(currentSprite) {
	currentSprite.data.inPot = true;
	text.text = "You added " + currentSprite.data.value + " to the pot!";
}

function removeFromPot(currentSprite) {
	currentSprite.data.inPot = false;
	text.text = "You removed " + currentSprite.data.value + " from the pot";

	var inventoryObj = getInvtoryObjByValue(currentSprite.data.value);

	inventoryObj.num++;
	inventoryObj.text.text = "" + inventoryObj.num;
}

function duplicateAtOriginalPosition(currentSprite) {
	var x = currentSprite.originalPosition.x;
	var y = currentSprite.originalPosition.y;
	currentSpriteClone = game.add.sprite(x, y, currentSprite.key);
	currentSpriteClone.data = { value: currentSprite.data.value };
	currentSpriteClone.inputEnabled = true;
	
	inventoryObj = getInvtoryObjByValue(currentSpriteClone.data.value);
	currentSpriteClone.input.enableDrag();
	
	currentSpriteClone.originalPosition = currentSpriteClone.position.clone();
	game.physics.arcade.enable(currentSpriteClone);
	currentSpriteClone.input.enableSnap(tileSize, tileSize, false, true);
	currentSpriteClone.events.onDragStart.add(startDrag);
	currentSpriteClone.events.onDragStop.add(onDropzoneHandler);
	
	//activeSprites[currentSprite.key].push(currentSpriteClone);
}

function startDrag(currentSprite){
	var inventoryObj = getInvtoryObjByValue(currentSprite.data.value);
	
	if(inventoryObj.num === 0 && !currentSprite.data.inPot) {
		currentSprite.input.boundsRect = new Phaser.Rectangle(currentSprite.x, currentSprite.y, 80, 80);
	} else {
		currentSprite.input.boundsRect = null;
		if (Phaser.Point.distance(currentSprite.position, currentSprite.originalPosition) === 0) {
			inventoryObj.num--;
			inventoryObj.text.text = "" + inventoryObj.num;
		}
	}

}

function stopDrag(currentSprite, endSprite){
	if (!game.physics.arcade.overlap(currentSprite, endSprite, null, game.physics.arcade.intersects)) {
		currentSprite.position.copyFrom(currentSprite.originalPosition);
		if (currentSprite.data.inPot) {
			removeFromPot(currentSprite);
			currentSprite.destroy(true);
		} else if(Phaser.Point.distance(currentSprite.position, currentSprite.originalPosition) > 0){
			var inventoryObj = getInvtoryObjByValue(currentSprite.data.value);

			inventoryObj.num++;
			inventoryObj.text.text = "" + inventoryObj.num;
		}
	} else {
		if (!currentSprite.data.inPot) {
			addToPot(currentSprite);
			duplicateAtOriginalPosition(currentSprite);
			
			//if (potPositionOccupied) {
			//  removeFromPot(otherIngredient);
			//  otherIngredient.destroy();
			//}
		}
	}
}
