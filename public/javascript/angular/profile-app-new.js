/**
 * Created by Ahmed on 8/14/2016.
 */

var app = angular.module('myApp', ['ngMaterial'])

app.config(function($mdThemingProvider, $mdIconProvider){
    $mdIconProvider.icon("menu", "/svg/menu.svg", 24);
    $mdThemingProvider.theme('default').primaryPalette('cyan')
        .dark();
});

app.controller('myCtrl', function($scope,$http,$mdDialog,$mdSidenav) {

    $scope.init = function(users,user,me)
    {
        $scope.me = me;
        $scope.users = users;
        $scope.user = user;
        $scope.canEdit= (me===user.id);

        $scope.charachters = configs.images;
        $scope.showCharacters = false;
        $scope.firstTime=true;
        $scope.stages=[];

        $scope.animateCurrentCharacter();
        $scope.initializeClock();
    };

    $scope.toggleUsersList = function(){
        $mdSidenav('left').toggle();
    }

    $scope.selectUser = function(id)
    {
        $http({
            method : "GET",
            url : "/rest/user",
            params: {id:id}
        }).then(function mySuccess(response) {
            history.pushState('', 'New Page Title',response.data.id);
            $scope.user = response.data;
            $scope.canEdit = ($scope.me === $scope.user.id);
            $scope.firstTime = true;
            $scope.showCharacters = false;
            $scope.animateCurrentCharacter();
        }, function myError(response) {
            // TODO: naviagate window to user page
            alert("We are Sorry! The server is temporary unavailable and we are working on this issue. Thank you.");
        });
    };

    $scope.changeCharacter = function(characterId)
    {
        $scope.showCharacters = false;
        $scope.user.color = parseInt(characterId);
        $scope.animateCurrentCharacter();
    }

    $scope.save = function()
    {
        $http({
            method : "GET",
            url : "/rest/changeSettings",
            params: {attribute: 'color',value:$scope.user.color}
        }).then(function mySuccess(response) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#myCtrl')))
                    .clickOutsideToClose(true)
                    .title('Saved!')
                    .textContent('Your profile has been updated.')
                    .ok('OK'));
        }, function myError(response) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#myCtrl')))
                    .clickOutsideToClose(true)
                    .title('Error!')
                    .textContent('We are Sorry! The server is temporary unavailable and we are working on this issue. Thank you')
                    .ok('OK'));
        });
    }

    $scope.animateCurrentCharacter = function()
    {
        var canvas = document.getElementById("current-character-canvas");
        var stage = new createjs.Stage(canvas);
        var spriteSheetConfig = configs.getSpriteConfig($scope.user.color);
        var spriteSheet = new createjs.SpriteSheet(spriteSheetConfig);
        var grant = new createjs.Sprite(spriteSheet, "staionaryDown");

        grant.scaleY = spriteSheetConfig.scale.y ;
        grant.scaleX = spriteSheetConfig.scale.x;

        grant.x = canvas.width/2 - ((spriteSheetConfig.frames.width/2)*grant.scaleX) ;
        grant.y = canvas.height/2 - ((spriteSheetConfig.frames.height/2*grant.scaleY)) ;
        grant.gotoAndPlay("down");

        stage.addChild(grant);
        $scope.stages.push(stage);
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
            var spriteSheetConfig = configs.getSpriteConfig(i + 1);
            var spriteSheet = new createjs.SpriteSheet(spriteSheetConfig);
            var grant = new createjs.Sprite(spriteSheet, "staionaryDown");

            grant.scaleY = spriteSheetConfig.scale.y ;
            grant.scaleX = spriteSheetConfig.scale.x;
            grant.x = canvases[i].width/2 - ((spriteSheetConfig.frames.width/2)*grant.scaleX) ;
            grant.y = canvases[i].height/2 - ((spriteSheetConfig.frames.height/2*grant.scaleY)) ;

            grant.gotoAndPlay("down");
            grant.addEventListener("rollout", function(evt) {
                evt.target.gotoAndPlay("down");
            });
            grant.addEventListener("rollover", function(evt) {
                evt.target.gotoAndPlay("right");
            });
            stage.addChild(grant);
            stage.enableMouseOver(5);
            $scope.stages.push(stage);
        }
    };

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
