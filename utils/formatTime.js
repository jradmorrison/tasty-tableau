const formatTime = (inputTime) => {
    // Define a regular expression to capture the hours, minutes, and seconds
    var regex = /(\d{1,2}H)?(\d{1,2}M)?(\d{1,2}S)?/;
    var regex = /(\d{1,2}H)?(\d{1,2}M)?(\d{1,2}S)?/;

    // Use replace with a callback function to handle the replacement
    var formattedTime = inputTime.replace(regex, function (match, hours, minutes, seconds) {
        var formattedHours = hours ? hours.replace('H', ' hours') : '';
        var formattedMinutes = minutes ? minutes.replace('M', ' minutes') : '';
        var formattedSeconds = seconds ? seconds.replace('S', ' seconds') : '';

        // Create an array to filter out empty strings
        var resultArray = [formattedHours, formattedMinutes, formattedSeconds].filter(function (unit) {
            return unit !== '';
        });

        // Join the non-empty units with commas
        return resultArray.join(', ');
    });

    return formattedTime;
}

module.exports = formatTime;