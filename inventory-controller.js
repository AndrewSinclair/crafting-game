var InventoryController = function(game) {
  var activeInventory = []
    , activeSprites = {}
    , globalInventory = ['a', 'b', 'c', 'd', 'e']
    , ingredientKeys = {};

  (function preload() {
    game.load.image('inventory-tray', 'inventory-tray.png');
    
    for(var i = 0; i < globalInventory.length; i++) {
      game.load.image(globalInventory[i], "ingredient-" + globalInventory[i] + ".png");
    }
  })();
  
  function init() {
    var inventoryTray
      , ingredient;

    for(var i = 0; i < globalInventory.length; i++) {
      ingredientKeys[globalInventory[i]] = 0;

      inventoryTray = game.add.sprite(tileSize, tileSize, 'inventory-tray');
      inventoryTrayGround.add(inventoryTray);
      
      ingredient = game.add.sprite(tileSize * (i + 1), tileSize, globalInventory[i]);
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
    var x = currentSprite.originalPosition.x
      , y = currentSprite.originalPosition.y;

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
    
    activeSprites[currentSprite.key].push(currentSpriteClone);
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

  function getIngredientsInPot() {
    var key
      , ingredientsOfOneKind
      , ingredientsInPot = [];

    // activeSprites {'a': [..., 'data': {'inPot': true/false}, ... ], 'b': {...} ...}
    for(var i = 0; i < globalInventory.length; i++) {
      key = globalInventory[i];
      ingredientsOfOneKind = activeSprites[key];

      for(var j = 0; j < ingredientsOfOneKind.length; j++) {
        if (ingredientsOfOneKind[j].data.inPot) {
          ingredientsInPot.push({
            name: key,
            text: key
          });
        }
      }
    }
    return ingredientsInPot;
  }

  function removeIngredientsInPot() {
    var key
      , ingredientsOfOneKind
      , isIngredientTypeInPot
      , ingredientsInPot = [];

    // activeSprites {'a': [..., 'data': {'inPot': true/false}, ... ], 'b': {...} ...}
    for(var i = 0; i < globalInventory.length; i++) {
      key = globalInventory[i];
      ingredientsOfOneKind = activeSprites[key];

      activeSprites[key] = [];
      for(var j = 0; j < ingredientsOfOneKind.length; j++) {
        if (ingredientsOfOneKind[j].data.inPot) {
          ingredientsOfOneKind[j].destroy(true);
        } else {
          activeSprites[key].push(ingredientsOfOneKind[j]);
        }
      }
    }
  }
  
  return {
    init: init,
    getInventoryObjByValue: getInventoryObjByValue,
    duplicateAtOriginalPosition: duplicateAtOriginalPosition,
    insertActiveInventory: insertActiveInventory,
    getIngredientsInPot: getIngredientsInPot,
    removeIngredientsInPot: removeIngredientsInPot
  };
};