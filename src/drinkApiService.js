'use strict';

var config = require('./config');

var drinkApiService = (function () {
    return {

        getBestMatch: function(input) {

            var drinkRecipe = {name: input, fullInstructions: 'Get ingredients and mix them son.', ingredientsInstructions: 'Get ingredients.',
                mixInstructions: 'Mix them.'};
            
            return drinkRecipe;
        }
        
    };
})();

module.exports = drinkApiService;
