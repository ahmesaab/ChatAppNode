/**
 * Created by Ahmed on 3/4/2016.
 */
window.onload = function() {
    $('select').on('change', function () {
        var attValue = this.value;
        var attType = $(this).attr('class');
        var urlString = '/rest/changeSettings?attribute='+attType+'&value='+attValue;
        $.ajax({
            url: urlString,
            success: function(result)
            {
                alert('changed!');
            },
            error: function()
            {
                alert("An error has occurred! Try Again!");
            }
        });
        return false;
    });
};
