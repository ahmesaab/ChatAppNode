/**
 * Created by Ahmed on 5/16/2016.
 */

function main(gameSocketUrl)
{
    var myClient = new client(gameSocketUrl);
    $( window ).resize(function() {
        ui.repositionSideBar()
    });
}