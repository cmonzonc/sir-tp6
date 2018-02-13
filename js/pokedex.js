var pokeApp = angular.module('pokedex', ['ngResource']);


pokeApp.controller("firstController", function($scope){
    $scope.nombre = "Christian";
});

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

//var app = angular.module('app',[]);

pokeApp.controller('myPokeController', function($scope){
    $scope.name = "John Doe";
    $scope.pokemonList  = [
        { id: 1, name: "Pokemon 1", level: "51" },
        { id: 2, name: "Pokemon 2", level: "27" },
        { id: 3, name: "Charmander", level: "96" },
        { id: 4, name: "Charmaleon", level: "55" }
    ];
});

pokeApp.controller('changePokemon', ['$scope', function($scope){
    $scope.count = 0;
    $scope.executeChange = function(){
        $scope.count++;
    };
}]);

pokeApp.controller('api', function($scope, $http){
    $http.get('https://pokeapi.co/api/v1/pokedex/1/').then(function(response){
        $scope.pokemonList = response.pokemon;
        console.log(descriptions);
        // https://pokeapi.co/api/v1/pokedex/1/
    });
    $http.get('https://pokeapi.co/api/v2/pokedex/1/').success(function(data) {
        $scope.apiListPokemon = data.pokemon_entries;
    }); 
});



// pokeApp.('getFromApi', function($resource)
