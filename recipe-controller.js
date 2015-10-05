var RecipeController = function(inventoryController) {
  var choices = []
    , recipes = [
      {name: "recipe1", recipe: ["a", "b", "c"], output: ["a"]},
      {name: "recipe2", recipe: ["c", "c", "c"], output: ["b", "b"]}
    ];

  function getChoicesInPot() {
    //ingredients in pot: [{name, text}];
    var potIngredients = inventoryController.getIngredientsInPot();
    choices = [];
    for(var i = 0; i < potIngredients.length; i++) {
      choices.push({
        choice: i,
        value : potIngredients[i].name
      });
    }
  }

  function getRecipeFromChoices() {
    var i = 0
      , j = 0
      , recipe
      , choice
      , isFinding;

    if (choices.length <= 0 || recipes.length <= 0) return;

    for (i=0; i < recipes.length; i++) {
      recipe = recipes[i];

      isFinding = true;
      for (j=0; j < choices.length; j++) {
        choice = choices[j];
        if (recipe.recipe[choice.choice] !== choice.value) {
          isFinding = false;
        }
      }

      if (isFinding) return recipe;
    }
  }

  function yieldRecipe(recipe) {
    var yieldedIngredients
      , usedIngredients;
    if (typeof recipe === "undefined") {
      setText("You didn't make a recipe");
      return;
    }

    yieldedIngredients = recipe.output;
    usedIngredients = recipe.recipe;

    // remove each ingredient in the pot
    inventoryController.removeIngredientsInPot();

    // increment the values for each ingredient in the tray
    for(var i = 0; i < yieldedIngredients.length; i++) {
      inventoryController.insertActiveInventory(yieldedIngredients[i]);
    }
    
    setText('You made this recipe: ' + recipe.name);
  }

  function doMake() {
    var recipe;

    getChoicesInPot();

    recipe = getRecipeFromChoices();

    yieldRecipe(recipe);
  }

  return {
    doMake: doMake
  };
};