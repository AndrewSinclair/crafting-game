var game;
var text;
var tileSize = 80;

var backGround;
var behindTrayGround;
var inventoryTrayGround;
var infrontTrayGround;

var inventory;

var dropzone;

var InventoryController = function(game) {
  var activeInventory = [];
  var activeSprites = {};
  var globalInventory = ['a', 'b', 'c', 'd', 'e'];
  var ingredientKeys = {};

  game.load.image('inventory-tray', 'inventory-tray.png');
  
  for(var i = 0; i < globalInventory.length; i++) {
    game.load.image(globalInventory[i], "ingredient-" + globalInventory[i] + ".png");
  }
  
  function init() {
    for(var i = 0; i < globalInventory.length; i++) {
      ingredientKeys[globalInventory[i]] = 0;

      var inventoryTray = game.add.sprite(tileSize, tileSize, 'inventory-tray');
      inventoryTrayGround.add(inventoryTray);
      
      var ingredient = game.add.sprite(tileSize * (i + 1), tileSize, globalInventory[i]);
      behindTrayGround.add(ingredient);
      
      ingredient.data = {
        key: 0,
        value: globalInventory[i]
      };
      
      activeSprites[globalInventory[i]] = [ingredient];
      
      activeInventory.push({
        name: globalInventory[i],
        num: 3,
        text: game.add.text(tileSize * (i + 1), 0, 3, {fill: '#000000'})
      });
      
      ingredient.inputEnabled = true;
      ingredient.input.enableDrag();
      ingredient.originalPosition = ingredient.position.clone();
      
      game.physics.arcade.enable(ingredient);
      
      ingredient.input.enableSnap(tileSize, tileSize, false, true);
      ingredient.events.onDragStart.add(startDrag);
      ingredient.events.onDragStop.add(onDropzoneHandler);
      ingredient.events.onInputDown.add(onInputDownHandler);
    }
  }
  
  function getNextIngredientKey(value) {
    return ++(ingredientKeys[value]);
  }
  
  function insertActiveInventory(value) {
    // find the active inventory
    var inventoryObj = getInventoryObjByValue(value);
    //update it
    inventoryObj.num++;
    inventoryObj.text.text = inventoryObj.num;
  }
  
  function createIngredientSprite(value, x, y) {
    var ingredient = game.add.sprite(x, y, value);
    ingredient.data = {
      key: getNextIngredientKey(value),
      value: value
    };
    
    activeSprites[value].push(ingredient);
    insertActiveInventory(value);
    
    ingredient.inputEnabled = true;
    ingredient.input.enableDrag();
    ingredient.originalPosition = ingredient.position.clone();
    
    game.physics.arcade.enable(ingredient);
    
    ingredient.input.enableSnap(tileSize, tileSize, false, true);
    ingredient.events.onDragStart.add(startDrag);
    ingredient.events.onDragStop.add(onDropzoneHandler);

    return ingredient;
  }
  
  function getInventoryObjByValue(value) {
    var currInventoryObj;
    
    for(var i = 0; i < activeInventory.length; i++) {
      currInventoryObj = activeInventory[i];
      if (currInventoryObj.name === value) {
        break;
      }
    }
    
    return currInventoryObj;
  }
  
  function duplicateAtOriginalPosition(currentSprite) {
    var x = currentSprite.originalPosition.x;
    var y = currentSprite.originalPosition.y;
    currentSpriteClone = game.add.sprite(x, y, currentSprite.key);
    currentSpriteClone.data = { value: currentSprite.data.value };
    currentSpriteClone.inputEnabled = true;
    
    inventoryObj = inventory.getInventoryObjByValue(currentSpriteClone.data.value);
    currentSpriteClone.input.enableDrag();
    
    currentSpriteClone.originalPosition = currentSpriteClone.position.clone();
    game.physics.arcade.enable(currentSpriteClone);
    currentSpriteClone.input.enableSnap(tileSize, tileSize, false, true);
    currentSpriteClone.events.onDragStart.add(startDrag);
    currentSpriteClone.events.onDragStop.add(onDropzoneHandler);
    currentSpriteClone.events.onInputDown.add(onInputDownHandler);

    behindTrayGround.add(currentSpriteClone);
    
    //activeSprites[currentSprite.key].push(currentSpriteClone);
  }

  function onInputDownHandler(currentSprite) {
    currentSprite.bringToTop();
    infrontTrayGround.add(currentSprite);
  }


  function onDropzoneHandler(currentSprite, pointer){
    stopDrag(currentSprite, dropzone, pointer);
  }

  function startDrag(currentSprite){
    var inventoryObj = inventory.getInventoryObjByValue(currentSprite.data.value);
    
    if(inventoryObj.num === 0 && !currentSprite.data.inPot) {
      currentSprite.input.boundsRect = new Phaser.Rectangle(currentSprite.x, currentSprite.y, tileSize, tileSize);
    } else {
      currentSprite.input.boundsRect = null;
      if (Phaser.Point.distance(currentSprite.position, currentSprite.originalPosition) === 0) {
        inventoryObj.num--;
        inventoryObj.text.text = "" + inventoryObj.num;
      }
    }
  }
  
  return {
    init: init,
    getInventoryObjByValue: getInventoryObjByValue,
    duplicateAtOriginalPosition: duplicateAtOriginalPosition,
    insertActiveInventory: insertActiveInventory
  };
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
  preload: function(){
    game.load.image("field", "field.png");
    game.load.image("dropzone", "dropzone.png");
    
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
    
    text = game.add.text(250, 500, '', { fill: '#000000' });
  
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(dropzone);
  }
};


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
