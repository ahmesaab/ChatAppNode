/**
 * Created by Ahmed on 5/16/2016.
 */

function main(url)
{
    var game = createGame();
    var client = createClient(url,game);

    game.setEmitMovePlayer(client.emitMovePlayer);

    bindKeyboardController(client,game);

    $( window ).resize(function() {
        ui.repositionSideBar()
    });
}