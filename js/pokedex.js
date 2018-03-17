var pokeApp = angular.module('pokedex', ['ngResource']);

$(document).ready(function() {
    $('select').material_select();
  });

pokeApp.controller("firstController", function($scope){
    $scope.nombre = "Christian";
});

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

// Section to test a basic controller
pokeApp.controller('myPokeController', function($scope){
    $scope.name = "John Doe";
    $scope.pokemonList  = [
        { id: 1, name: "Pokemon 1", level: "51" },
        { id: 2, name: "Pokemon 2", level: "27" },
        { id: 3, name: "Charmander", level: "96" },
        { id: 4, name: "Charmaleon", level: "55" }
    ];
});

// Controller to test a change in a model (view)
pokeApp.controller('changePokemon', ['$scope', function($scope){
    $scope.count = 0;
    $scope.executeChange = function(){
        $scope.count++;
    };
}]);

// Filter to convert to capitalize the information of the select box
pokeApp.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

// Service to implements calls to API
pokeApp.service("pokemonService", function($http, POKEAPI){
    this.pokemonInformation = function(pokemonIdentifier){    
        var myResponseData = $http.get('https://pokeapi.co/api/v2/pokemon/' + pokemonIdentifier).then(function (response) {
            console.log(response);
            return response.data;
        });
        return myResponseData; 
    };
    this.getPokemonList = function(){
        var myResponseData = $http.get(POKEAPI + "/api/v2/pokedex/1/").then(function (response) {
            return response.data;
        });
        return myResponseData; 
    };

});

pokeApp.factory('getPokemon', function($resource, POKEAPI) {
    return $resource("https://pokeapi.co/api/v2/pokemon/:id/", {}, {
        get: { method: "GET"}});
});

pokeApp.controller("pokemonCrawler", function($scope,$log, $http, $timeout, pokemonMapping, pokemonService) {
   
    $scope.pokemons = [];
    $scope.singlePokemon = [];
    $scope.$log = $log;
    pokemonService.getPokemonList().then(function(result) {
        $scope.pokemons = result.pokemon_entries;
        console.log(result.pokemon_entries[0].entry_number)
        $scope.pokemons.forEach(function(element){
            element.id = element.entry_number;
        });
        $timeout(function () {
            angular.element(document).find('select').material_select();
        }, 500);
    });
    $scope.searchPok = function(pokemon) {
        pokemonMapping.addPokemon(pokemon.id);
    };
    $scope.updatePokemonSelection = function(selected){
        pokemonService.pokemonInformation(selected).then(function(response) {
            $scope.requestedPokemonInformation = response;
            $scope.singlePokemon.height = response.height;
            $scope.singlePokemon.weight = response.weight;
            $scope.singlePokemon.pokemonName = response.name;
            $scope.singlePokemon.pokemonIdentifier = response.id;
            $scope.singlePokemon.pokemonImage = response.sprites.front_default; 
        });
        $(".collection-bag").show();
    }
    $scope.updateSelectSection = function(){
        $timeout(function () {
            angular.element(document).find('select').material_select();
        }, 500);
    }
});

pokeApp.service("pokemonMapping", function(){
    this.addPokemon = function(id) {
        this.id = id;
    };
    this.getPokemon = function() {
        return this.id;
    };
});

pokeApp.controller("pokemonCrawlerAPI", function($scope,getPokemon,pokemonMapping){
    console.log(pokemonMapping.getPokemon());
    $scope.getItem = function() {
        $scope.poke = getPokemon.get({id: pokemonMapping.getPokemon()})
    };
    $scope.$watch('service.getPokemon()', $scope.getItem);
});
