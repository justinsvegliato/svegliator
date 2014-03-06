function Control() {};

Control.compileButton = $("#compile-button");
Control.programInput = $("#program-input");
Control.fadeInElement = $(".fadeIn");

$(document).ready(function() {
    Control.fadeInElement.fadeIn();
    
    Control.programInput.linedtextarea();

    Control.compileButton.on("click", function() {
        LogDisplay.clear();
        SymbolTableDisplay.clear();
        TreeDisplay.clear();
        TokenStreamDisplay.clear();
        
        var tokens = Scanner.scan(Control.programInput.val());
        if (LogDisplay.scannerErrorResults.length <= 0) {
            var concreteSyntaxTree = Parser.parse(tokens);
            if (LogDisplay.parserErrorResults.length <= 0) {
                SymbolTableDisplay.populate();
                TreeDisplay.populate(concreteSyntaxTree);
            }          
            TokenStreamDisplay.populate(tokens);
        } else {
            TokenStreamDisplay.clear();
        }
        
        LogDisplay.summarize();
        LogDisplay.populate();
    });

    ProgramSelector.initialize();
    $(ProgramSelector.programLinkId).on("click", function() {
        ProgramSelector.populateTextarea($(this).attr("id"));
    });

    LogDisplay.errorJumpButton.on("click", function() {
        LogDisplay.jumpToLog($("#error-log"));
    });
    LogDisplay.warningJumpButton.on("click", function() {
        LogDisplay.jumpToLog($("#warning-log"));
    });
    LogDisplay.scannerJumpButton.on("click", function() {
        LogDisplay.jumpToLog($("#scanner-log"));
    });
    LogDisplay.parserJumpButton.on("click", function() {
        LogDisplay.jumpToLog($("#parser-log"));
    });
    
    LogDisplay.verboseButton.on("click", function() {
        LogDisplay.changeVerboseMode();
    });   
});