function TokenStreamDisplay() {
}
;

TokenStreamDisplay.display = $("#token-stream");
TokenStreamDisplay.tokenTemplate = '<span class="token-stream-droplet">\
                                        <small>\
                                            <strong class="text-info">{0}</strong> \
                                            <strong>:</strong> <strong class="text-danger">{1}</strong>\
                                        </small> \
                                        <span class="text-primary">[</span> {2} <span class="text-primary">]</span>\
                                    </span>';
TokenStreamDisplay.marqueeTemplate = '<marquee id="token-marquee" behavior="scroll" scrollamount="3" direction="left" width="940">{0}</marquee>';

TokenStreamDisplay.tokenId = 0;

TokenStreamDisplay.populate = function(tokens) {
    TokenStreamDisplay.display.empty();

    var html = "";
    for (var i = 0; i < tokens.length; i++) {
        html += TokenStreamDisplay.tokenTemplate.format(i, tokens[i].kind.name, tokens[i].value);
    }

    TokenStreamDisplay.display.append(TokenStreamDisplay.marqueeTemplate.format(html));
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

TokenStreamDisplay.clear = function() {
    TokenStreamDisplay.display.html("No tokens");
    TokenStreamDisplay.tokenId = 0;
};