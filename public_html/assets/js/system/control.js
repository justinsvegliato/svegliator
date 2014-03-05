function Control() {};

Control.compileButton = $("#compile-button");
Control.programInput = $("#program-input");

Control.errorJumpButton = $("#error-jump-button");
Control.warningJumpButton = $("#warning-jump-button");
Control.scannerJumpButton = $("#scanner-jump-button");
Control.parserJumpButton = $("#parser-jump-button");

$(document).ready(function() {
    Control.programInput.linedtextarea();

    Control.compileButton.on("click", function() {
        LogDisplay.clear();
        SymbolTableDisplay.clear();
        
        var tokens = Scanner.scan(Control.programInput.val());
        if (LogDisplay.scannerErrorResults.length <= 0) {
            var concreteSyntaxTree = Parser.parse(tokens);
            if (LogDisplay.parserErrorResults.length <= 0) {
                SymbolTableDisplay.populate();
            }          
        }       
        
        LogDisplay.populate();
    });

    ProgramSelector.initialize();
    $(ProgramSelector.programLinkId).on("click", function() {
        ProgramSelector.populateTextarea($(this).attr("id"));
    });

    Control.jumpToLog = function(element) {
        if (element.length) {
            LogDisplay.displayContainer.animate({
                scrollTop: element.offset().top - LogDisplay.displayContainer.offset().top + LogDisplay.displayContainer.scrollTop()
            }, 100);
        }
    };

    Control.errorJumpButton.on("click", function() {
        Control.jumpToLog($("#error-log"));
    });
    Control.warningJumpButton.on("click", function() {
        Control.jumpToLog($("#warning-log"));
    });
    Control.scannerJumpButton.on("click", function() {
        Control.jumpToLog($("#scanner-log"));
    });
    Control.parserJumpButton.on("click", function() {
        Control.jumpToLog($("#parser-log"));
    });
});