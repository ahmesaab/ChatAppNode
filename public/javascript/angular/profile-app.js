/**
 * Created by Ahmed on 5/6/2016.
 */
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope,$http) {

    $scope.currentCharacterId;
    $scope.charachters;
    $scope.showCharacters;
    $scope.firstTime
    $scope.stages;
    $scope.canEdit;

    $scope.init = function(currentCharacterId,canEdit)
    {
        $scope.currentCharacterId = currentCharacterId;
        $scope.charachters = images;
        $scope.showCharacters = false;
        $scope.firstTime=true;
        $scope.stages=[];
        $scope.canEdit=canEdit;

        $scope.animateCurrentCharacter();
        $scope.initializeClock();
    };

    $scope.changeCharacter = function(characterId)
    {
        $scope.showCharacters = false;
        $http({
            method : "GET",
            url : "/rest/changeSettings",
            params: {attribute: 'color',value:characterId}
        }).then(function mySuccess(response) {
            $scope.currentCharacterId = parseInt(characterId);
            $scope.animateCurrentCharacter();
        }, function myError(response) {
            alert("We are Sorry! The server is temporary unavailable and we are working on this issue. Thank you.");
        });
    }

    $scope.animateCurrentCharacter = function()
    {
        var canvas = document.getElementById("current-character-canvas");
        var stage = new createjs.Stage(canvas);
        var spriteSheetConfig = getSpriteConfig($scope.currentCharacterId);
        var spriteSheet = new createjs.SpriteSheet(spriteSheetConfig);
        var grant = new createjs.Sprite(spriteSheet, "staionaryDown");

        grant.scaleY = spriteSheetConfig.scale.y ;
        grant.scaleX = spriteSheetConfig.scale.x;
        canvas.width = spriteSheetConfig.frames.width * spriteSheetConfig.scale.x;
        canvas.height = spriteSheetConfig.frames.height * spriteSheetConfig.scale.y;

        grant.x = 0 ;
        grant.y = 0 ;

        stage.addChild(grant);
        $scope.stages.push(stage);
        grant.gotoAndPlay("down");
    }

    $scope.viewCharacters =  function()
    {
        if($scope.canEdit)
        {
            $scope.showCharacters = true;
            if($scope.firstTime)
            {
                $scope.animateCharacters();
                $scope.firstTime=false;
            }
        }
    }

    $scope.animateCharacters = function() {
        var canvases = document.getElementsByClassName("character");
        for (var i = 0; i < canvases.length; i++) {
            var stage = new createjs.Stage(canvases[i]);
            var spriteSheetConfig = getSpriteConfig(i + 1);
            var spriteSheet = new createjs.SpriteSheet(spriteSheetConfig);
            var grant = new createjs.Sprite(spriteSheet, "staionaryDown");

            grant.scaleY = spriteSheetConfig.scale.y ;
            grant.scaleX = spriteSheetConfig.scale.x;
            canvases[i].width = spriteSheetConfig.frames.width * spriteSheetConfig.scale.x;
            canvases[i].height = spriteSheetConfig.frames.height * spriteSheetConfig.scale.y;

            grant.x = 0 ;
            grant.y = 0 ;

            stage.addChild(grant);
            grant.gotoAndPlay("down");
            grant.addEventListener("rollout", function(evt) {
                evt.target.gotoAndPlay("down");
            });
            grant.addEventListener("rollover", function(evt) {
                evt.target.gotoAndPlay("right");
            });
            stage.enableMouseOver(5)
            $scope.stages.push(stage);
        }

    }

    $scope.initializeClock = function()
    {
        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.setInterval(30);
        createjs.Ticker.addEventListener("tick", tick);
        function tick(event)
        {
            for(var i=0;i<$scope.stages.length;i++)
                $scope.stages[i].update(event);
        }
    }

});
