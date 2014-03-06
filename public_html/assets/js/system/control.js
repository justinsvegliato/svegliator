/** 
 * A driver class that brings together many components of the application.
 */

function Control() {};

// The DOM elements used throughout the code
Control.compileButton = $("#compile-button");
Control.programInput = $("#program-input");
Control.fadeInElement = $(".fadeIn");

$(document).ready(function() {
    // Fades in every element with the class 'fadeIn'
    Control.fadeInElement.fadeIn();
    
    // Adds sweet styling to the text area
    Control.programInput.linedtextarea();

    // Compiles the code when the button is pressed
    Control.compileButton.on("click", function() {
        // Clears all views before doing anything
        LogDisplay.clear();
        SymbolTableDisplay.clear();
        TreeDisplay.clear();
        TokenStreamDisplay.clear();
        
        // Grabs the tokens from the scanner
        var tokens = Scanner.scan(Control.programInput.val());
        
        // Parses the code if there were no lexing errors
        if (LogDisplay.scannerErrorResults.length <= 0) {
            var concreteSyntaxTree = Parser.parse(tokens);
            
            // If there were no parsing errors, display the symbol trable and concrete syntax tree
            if (LogDisplay.parserErrorResults.length <= 0) {
                SymbolTableDisplay.populate();
                TreeDisplay.populate(concreteSyntaxTree);
            }          
            
            // Always display the token stream at this point since scanner was successful
            TokenStreamDisplay.populate(tokens);
        } else {
            // We clear the token stream if the lex failed
            TokenStreamDisplay.clear();
        }
        
        // Populates the logs after both parts of compilation have been completed
        LogDisplay.summarize();
        LogDisplay.populate();
    });

    // Populates the program selector drop down box and places code into editor
    ProgramSelector.initialize();
    $(ProgramSelector.programLinkId).on("click", function() {
        ProgramSelector.populateTextarea($(this).attr("id"));
    });

    // Jumps to the corresponding part of the log when the appropriate button is pressed
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
    
    // Switches between verbose and simple mode when the button is pressed
    LogDisplay.verboseButton.on("click", function() {
        LogDisplay.changeVerboseMode();
    });   
});