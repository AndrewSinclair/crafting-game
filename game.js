var game;
var text;
var tileSize = 80;

var backGround;
var behindTrayGround;
var inventoryTrayGround;
var infrontTrayGround;

var recipeController;
var inventory;

var dropzone;

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
  preload: function(){
    game.load.image("field", "field.png");
    game.load.image("dropzone", "dropzone.png");
    game.load.image("make-button", "make.png");
    
    inventory = new InventoryController(game);
  },

  create: function(){
    backGround = game.add.group();
    behindTrayGround = game.add.group();
    inventoryTrayGround = game.add.group();
    infrontTrayGround = game.add.group();

    // game.add.sprite(0, 0, "field");
    backGround.create(0, 0, "field");
    dropzone = game.add.sprite(240, 240, "dropzone");
    backGround.add(dropzone);
    inventory.init();

    recipeController = new RecipeController(inventory);

    var makeButton = new Phaser.Button(game, 160, 640, "make-button", recipeController.doMake);
    inventoryTrayGround.add(makeButton);
    
    text = game.add.text(250, 500, '', { fill: '#000000' });
  
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(dropzone);

  }
};

/*
  FIXME
  These are global but probably shouldn't be
*/

function setText(value) {
  text.text = value;
}

function addToPot(currentSprite) {
  currentSprite.data.inPot = true;
  text.text = "You added " + currentSprite.data.value + " to the pot!";
}

function removeFromPot(currentSprite) {
  currentSprite.data.inPot = false;
  text.text = "You removed " + currentSprite.data.value + " from the pot";

  var inventoryObj = inventory.getInventoryObjByValue(currentSprite.data.value);

  inventoryObj.num++;
  inventoryObj.text.text = "" + inventoryObj.num;
}

function addOffset(currentPosition, offsetPosition) {
  return currentPosition;
}

function stopDrag(currentSprite, endSprite, pointer) {
  var inputHandler = currentSprite.input;
  if (!game.physics.arcade.overlap(currentSprite, endSprite, null, game.physics.arcade.intersects)) {
    currentSprite.position.copyFrom(currentSprite.originalPosition);
    if (currentSprite.data.inPot) {
      removeFromPot(currentSprite);
      currentSprite.destroy(true);
    } else if(Phaser.Point.distance(addOffset(currentSprite.position, inputHandler.dragOffset), pointer.position) > 0) {
      inventory.insertActiveInventory(currentSprite.data.value);
      behindTrayGround.add(currentSprite);
    }
  } else {
    if (!currentSprite.data.inPot) {
      addToPot(currentSprite);
      inventory.duplicateAtOriginalPosition(currentSprite);
      
      //if (potPositionOccupied) {
      //  removeFromPot(otherIngredient);
      //  otherIngredient.destroy();
      //}
    }
  }
}
