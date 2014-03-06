/** 
 * A class that displays the token stream.
 */

function TokenStreamDisplay() {};

// The DOM element to be used throughout the code
TokenStreamDisplay.display = $("#token-stream");

// HTML elements that will be displayed to the screen
TokenStreamDisplay.tokenTemplate = '<span class="token-stream-droplet">\
                                        <small>\
                                            <strong class="text-info">{0}</strong> \
                                            <strong>:</strong> <strong class="text-danger">{1}</strong>\
                                        </small> \
                                        <span class="text-primary">[</span> {2} <span class="text-primary">]</span>\
                                    </span>';
TokenStreamDisplay.marqueeTemplate = '<marquee id="token-marquee" behavior="scroll" scrollamount="3" direction="left" width="940">{0}</marquee>';

// A variable the keeps track of the current token ids
TokenStreamDisplay.tokenId = 0;

// Populates the token stream display with tokens from the scanner
TokenStreamDisplay.populate = function(tokens) {
    // Empties out old content
    TokenStreamDisplay.display.empty();

    // Builds the entire list of tokens and displays it to the screen
    var html = "";
    for (var i = 0; i < tokens.length; i++) {
        html += TokenStreamDisplay.tokenTemplate.format(i, tokens[i].kind.name, tokens[i].value);
    }
    TokenStreamDisplay.display.append(TokenStreamDisplay.marqueeTemplate.format(html));
    
    // Registers the element as a smooth marquee with stop, start, and drag features
    $("#token-marquee").marquee('pointer').mouseover(function() {
        $(this).trigger('stop');
    }).mouseout(function() {
        $(this).trigger('start');
    }).mousemove(function(event) {
        if ($(this).data('drag') === true) {
            this.scrollLeft = $(this).data('scrollX') + ($(this).data('x') - event.clientX);
        }
    }).mousedown(function(event) {
        $(this).data('drag', true).data('x', event.clientX).data('scrollX', this.scrollLeft);
    }).mouseup(function() {
        $(this).data('drag', false);
    });
};

// Clears the token stream display
TokenStreamDisplay.clear = function() {
    TokenStreamDisplay.display.html("No tokens");
    TokenStreamDisplay.tokenId = 0;
};