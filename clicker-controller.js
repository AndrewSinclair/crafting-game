var ClickerController = function(game, inventoryController) {

  var globalConfigs = {
    'sword-shop': {
      'x' : 560,
      'y' : 80,
      'levels': [
        {'timeoutMillis': 2000, 'moneyOutput': 500, 'ingredients': ['c']},
        {'timeoutMillis': 2000, 'moneyOutput': 600, 'ingredients': ['c']}
      ]
    },
    'arrow-shop' : {
      'x' : 560,
      'y' : 160,
      'levels': [
        {'timeoutMillis': 5000, 'moneyOutput': 100, 'ingredients': ['b']},
        {'timeoutMillis': 5000, 'moneyOutput': 200, 'ingredients': ['b']}
      ]
    }
  };

  (function preload() {
    // load the images/sprites for the clicker buttons
    game.load.image('clicker', 'clicker.png');
  })();

  function getNewClicker(configKey) {
    var that = this;
    this.currentLevel = 0;
    this.configs = globalConfigs[configKey];

    this.sprite = game.add.sprite(this.configs.x, this.configs.y, 'clicker');
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(onClick);

    var getCurrentTimeoutMillis = function() {
      return this.configs.levels[this.currentLevel].timeoutMillis;
    };

    var getCurrentIngredients = function() {
      return this.configs.levels[this.currentLevel].ingredients;
    };

    var getCurrentMoneyOutput = function() {
      return this.configs.levels[this.currentLevel].moneyOutput;
    };

    this.getCurrentTimeoutMillis = getCurrentTimeoutMillis;
    this.getCurrentIngredients = getCurrentIngredients;
    this.getCurrentMoneyOutput = getCurrentMoneyOutput;

    function onClick() {
      //does some kind of animation for the sprite, and registers the timeout
      setTimeout(onClickTimeout, that.getCurrentTimeoutMillis());
    }

    function onClickTimeout() {
      var clickerIngredientYields = that.getCurrentIngredients();

      inventoryController.addMoney(that.getCurrentMoneyOutput());

      for(var i = 0; i < clickerIngredientYields.length; i++) {
        inventoryController.insertActiveInventory(clickerIngredientYields[i]);
      }
    }  

    return this;
  }

  return {
    getNewClicker: function(key) { return new getNewClicker(key); }
  };
};