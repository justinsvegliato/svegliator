/** 
 * A class that displays information regarding each part of the compilation.
 */

function LogDisplay() {};

// The DOM elements to be used throughout the class
LogDisplay.displayContainer = $("#log-display");
LogDisplay.display = $("#log-display table tbody");
LogDisplay.verboseButton = $("#verbose-button");
LogDisplay.errorJumpButton = $("#error-jump-button");
LogDisplay.warningJumpButton = $("#warning-jump-button");
LogDisplay.scannerJumpButton = $("#scanner-jump-button");
LogDisplay.parserJumpButton = $("#parser-jump-button");
LogDisplay.semanticAnalyzerJumpButton = $("#semantic-analyzer-jump-button");

// The HTML elements that encompass everything that can be printed to the log
LogDisplay.scannerInfoRowTemplate = "<tr>\
                                         <td><strong class='text-muted'>{0}</strong></td> \
                                         <td><strong class='text-success'>Found [ <span class='text-info'>{1}</span> ] with a value of [ <span class='text-primary'>{2}</span> ]</strong></td> \
                                     </tr>";
LogDisplay.scannerErrorRowTemplate = "<tr>\
                                          <td><strong class='text-muted'>{0}</strong></td> \
                                          <td><strong class='text-danger'>{1} with a value of [ <span class='text-primary'>{2}</span> ]</strong></td> \
                                      </tr>";
LogDisplay.scannerWarningRowTemplate = "<tr>\
                                            <td><strong class='text-muted'>{0}</strong></td> \
                                            <td><strong class='text-warning'>{1} [ <span class='text-primary'>{2}</span> ]</strong></td> \
                                        </tr>";
LogDisplay.parserInfoRowTemplate = "<tr>\
                                        <td><strong class='text-muted'>{0}</strong></td> \
                                        <td colspan='2'><strong class='text-success'>{1}</strong></td> \
                                    </tr>";
LogDisplay.parserErrorRowTemplate = "<tr>\
                                         <td><strong class='text-muted'>{0}</strong></td> \
                                         <td><strong class='text-danger'>{1} [ <span class='text-primary'>{2}</span> ]</strong></td> \
                                     </tr>";
LogDisplay.semanticAnalyzerInfoRowTemplate = "<tr>\
                                                  <td><strong class='text-muted'>{0}</strong></td> \
                                                  <td colspan='2'><strong class='text-success'>{1}</strong></td> \
                                             </tr>";
LogDisplay.semanticAnalyzerWarningRowTemplate = "<tr>\
                                                  <td><strong class='text-muted'>{0}</strong></td> \
                                                  <td><strong class='text-warning'>{1} [ <span class='text-primary'>{2}</span> ]</strong></td> \
                                             </tr>";
LogDisplay.semanticAnalyzerErrorRowTemplate = "<tr>\
                                            <td><strong class='text-muted'>{0}</strong></td> \
                                            <td><strong class='text-warning'>{1}</strong></td> \
                                        </tr>";
LogDisplay.headerRowTemplate = "<tr id='{2}' class='{1}'><th colspan='2'><strong>{0}</strong></th></tr>";
LogDisplay.subheaderRowTemplate = "<tr><th colspan='2'><small>{0}</small></th></tr>";
LogDisplay.parseSearchingCellTemplate = "Searching for [ <span class='text-primary'>{0}</span> ]";
LogDisplay.parseFoundCellTemplate = "Found [ <span class='text-primary'>{0}</span> ] with a value of [ <span class='text-primary'>{1}</span> ]";
LogDisplay.parseParsingCellTemplate = "Parsing [ <span class='text-primary'>{0} <span class='text-danger glyphicon glyphicon-arrow-right'></span> {1}</span> ]";
LogDisplay.semanticAnalyzerAddingSymbolCellTemplate = "Adding symbol [ <span class='text-primary'>{0}</span> ] of type [ <span class='text-primary'>{1}</span> ] to scope [ <span class='text-primary'>{2}</span> ]";
LogDisplay.semanticAnalyzerEnteringScopeCellTemplate = "Entering scope [ <span class='text-primary'>{0}</span> ]";
LogDisplay.semanticAnalyzerLeavingScopeCellTemplate = "Leaving scope [ <span class='text-primary'>{0}</span> ]";
LogDisplay.successfulCompletionRow = "<tr><td class='text-center' colspan='2'><span class='text-success lead'>Success</span></td></tr>";
LogDisplay.failedCompletionRow = "<tr><td class='text-center' colspan='2'><span class='text-danger lead'>Failure</span></td></tr>";
LogDisplay.typeMismatchErrorCellTemplate = "<span class='text-danger'>Type Mismatch: Cannot {0} [ <span class='text-info'>{1}</span> ] to [ <span class='text-info'>{2}</span> ] </span>";
LogDisplay.scopeErrorCellTemplate = "<span class='text-danger'>{0} [ <span class='text-info'>{1}</span> ] </span>";
LogDisplay.typeComparisonTemplate = "Checking [ <span class='text-info'>{0}</span> ] of type [ <span class='text-info'>{1}</span> ] and [ <span class='text-info'>{2}</span> ]";
LogDisplay.semanticAnalyzerInfoTemplate = "{0} [ <span class='text-info'>{1}</span> ]";

// The results (of various types) for each compilation component
LogDisplay.scannerInfoResults = [];
LogDisplay.scannerErrorResults = [];
LogDisplay.scannerWarningResults = [];
LogDisplay.parserInfoResults = [];
LogDisplay.parserErrorResults = [];
LogDisplay.semanticAnalyzerInfoResults = [];
LogDisplay.semanticAnalyzerErrorResults = [];
LogDisplay.semanticAnalyzerWarningResults = [];

// The flag which denotes whether or not extra output should be displayed
LogDisplay.verboseMode = false;

// Logs basic information for the scanner
LogDisplay.logScannerInfoResult = function(token) {
    LogDisplay.scannerInfoResults.push(LogDisplay.scannerInfoRowTemplate.format(token.lineNumber, token.kind.name, token.value));
};

// Logs error information for the scanner
LogDisplay.logScannerErrorResult = function(message, lineNumber, lexeme) {
    // Errors are added to both the warning and information log
    var row = LogDisplay.scannerErrorRowTemplate.format(lineNumber, message, lexeme);
    LogDisplay.scannerInfoResults.push(row);
    LogDisplay.scannerErrorResults.push(row);
};

// Logs warning information for the scanner
LogDisplay.logScannerWarningResult = function(message, lineNumber, lexeme) {
    // Warnings are added to both the warning and information log
    var row = LogDisplay.scannerWarningRowTemplate.format(lineNumber, message, lexeme);
    LogDisplay.scannerWarningResults.push(row);
    LogDisplay.scannerInfoResults.push(row);
};

// Logs a searching action for the parser
LogDisplay.logParserSearchingResult = function(token, kind) {
    // Ceases to add to the log if errors occurred
    if (LogDisplay.parserErrorResults.length <= 0) {
        var cell = LogDisplay.parseSearchingCellTemplate.format(kind.name);
        LogDisplay.parserInfoResults.push(LogDisplay.parserInfoRowTemplate.format(token.lineNumber, cell));
    }
};

// Logs a found action for the parser
LogDisplay.logParserFoundResult = function(token) {
    // Ceases to add to the log if errors occurred
    if (LogDisplay.parserErrorResults.length <= 0) {
        var cell = LogDisplay.parseFoundCellTemplate.format(token.kind.name, token.value);
        LogDisplay.parserInfoResults.push(LogDisplay.parserInfoRowTemplate.format(token.lineNumber, cell));
    }
};

// Logs a parsing action for the parser
LogDisplay.logParserParsingResult = function(token, leftSide, rightSide) {
    // Ceases to add to the log if errors occurred
    if (LogDisplay.parserErrorResults.length <= 0) {
        var cell = LogDisplay.parseParsingCellTemplate.format(leftSide, rightSide);
        LogDisplay.parserInfoResults.push(LogDisplay.parserInfoRowTemplate.format(token.lineNumber, cell));
    }
};

// Logs an error for the parser
LogDisplay.logParserErrorResult = function(message, token) {
    // Only add to the log if there has not been an error yet
    if (LogDisplay.parserErrorResults.length === 0) {
        var row = LogDisplay.parserErrorRowTemplate.format(token.lineNumber, message, token.value);
        LogDisplay.parserErrorResults.push(row);
        LogDisplay.parserInfoResults.push(row);
    }
};

// Logs an adding symbol action for the semantic analyzer
LogDisplay.logSemanticAnalyzerAddingSymbolResult = function(lineNumber, identifier, type, scope) {
    // Ceases to add to the log if errors occurred
    if (LogDisplay.semanticAnalyzerErrorResults.length <= 0) {
        var cell = LogDisplay.semanticAnalyzerAddingSymbolCellTemplate.format(identifier, type, scope);
        LogDisplay.semanticAnalyzerInfoResults.push(LogDisplay.semanticAnalyzerInfoRowTemplate.format(lineNumber, cell));
    }
};

// Logs a type checking action for the semantic analyzer
LogDisplay.logSemanticAnalyzerTypeCheckingResult = function(lineNumber, action, leftType, rightType) {
    // Ceases to add to the log if errors occurred
    if (LogDisplay.semanticAnalyzerErrorResults.length <= 0) {
        var cell = LogDisplay.typeComparisonTemplate.format(action, leftType, rightType);
        LogDisplay.semanticAnalyzerInfoResults.push(LogDisplay.semanticAnalyzerInfoRowTemplate.format(lineNumber, cell));
    }
};

// Logs a type checking action for the semantic analyzer
LogDisplay.logSemanticAnalyzerInfoResult = function(lineNumber, action, argument) {
    // Ceases to add to the log if errors occurred
    if (LogDisplay.semanticAnalyzerErrorResults.length <= 0) {
        var cell = LogDisplay.semanticAnalyzerInfoTemplate.format(action, argument);
        LogDisplay.semanticAnalyzerInfoResults.push(LogDisplay.semanticAnalyzerInfoRowTemplate.format(lineNumber, cell));
    }
};

// Logs an entering scope action for the semantic analyzer
LogDisplay.logSemanticAnalyzerEnteringScopeResult = function(lineNumber, scope) {
    // Ceases to add to the log if errors occurred
    if (LogDisplay.semanticAnalyzerErrorResults.length <= 0) {
        var cell = LogDisplay.semanticAnalyzerEnteringScopeCellTemplate.format(scope - 1);
        LogDisplay.semanticAnalyzerInfoResults.push(LogDisplay.semanticAnalyzerInfoRowTemplate.format(lineNumber, cell));
    }
};

// Logs a leaving scope action for the semantic analyzer
LogDisplay.logSemanticAnalyzerLeavingScopeResult = function(lineNumber, scope) {
    // Ceases to add to the log if errors occurred
    if (LogDisplay.semanticAnalyzerErrorResults.length <= 0) {
        var cell = LogDisplay.semanticAnalyzerLeavingScopeCellTemplate.format(scope - 1);
        LogDisplay.semanticAnalyzerInfoResults.push(LogDisplay.semanticAnalyzerInfoRowTemplate.format(lineNumber, cell));
    }
};

// Logs error information for the semantic analyzer
LogDisplay.logSemanticAnalyzerScopeErrorResult = function(message, lineNumber, lexeme) {
    // Ceases to add to the log if errors occurred
    if (LogDisplay.semanticAnalyzerErrorResults.length <= 0) {
        // Errors are added to both the warning and information log
        var cell = LogDisplay.scopeErrorCellTemplate.format(message, lexeme);
        var row = LogDisplay.semanticAnalyzerErrorRowTemplate.format(lineNumber, cell);
        LogDisplay.semanticAnalyzerInfoResults.push(row);
        LogDisplay.semanticAnalyzerErrorResults.push(row);
    }
};

// Logs error information for the semantic analyzer
LogDisplay.logSemanticAnalyzerTypeMismatchErrorResult = function(lineNumber, action, leftType, rightType) {
    // Ceases to add to the log if errors occurred
    if (LogDisplay.semanticAnalyzerErrorResults.length <= 0) {
        // Errors are added to both the warning and information log
        var cell = LogDisplay.typeMismatchErrorCellTemplate.format(action, leftType, rightType);
        var row = LogDisplay.semanticAnalyzerErrorRowTemplate.format(lineNumber, cell);
        LogDisplay.semanticAnalyzerInfoResults.push(row);
        LogDisplay.semanticAnalyzerErrorResults.push(row);
    }
};

// Logs warning information for the semantic analyzer
LogDisplay.logSemanticAnalyzerWarningResult = function(lineNumber, message, identifier) {
    // Warnings are added to both the warning and information log
    var row = LogDisplay.semanticAnalyzerWarningRowTemplate.format(lineNumber, message, identifier);
    LogDisplay.semanticAnalyzerWarningResults.push(row);
    LogDisplay.semanticAnalyzerInfoResults.push(row);
};

// Summarizes all data at the end in case the log is switched to simple mode
LogDisplay.summarize = function() {
    // If there aren't any errors, display a success row 
    // for the scanner, otherwise display a failure row
    var successRow = LogDisplay.successfulCompletionRow;
    var failureRow = LogDisplay.failedCompletionRow;
    if (LogDisplay.scannerErrorResults.length === 0) {
        LogDisplay.scannerInfoResults.push(successRow);
        // If there aren't any errors, display a success row 
        // for the parser, otherwise display a failure row
        if (LogDisplay.parserErrorResults.length === 0) {
            LogDisplay.parserInfoResults.push(successRow);
            if (LogDisplay.semanticAnalyzerErrorResults.length === 0) {
                LogDisplay.semanticAnalyzerInfoResults.push(successRow);
            } else {
                LogDisplay.semanticAnalyzerInfoResults.push(failureRow);
            }
        } else {
            LogDisplay.parserInfoResults.push(failureRow);
        }
    } else {
        LogDisplay.scannerInfoResults.push(failureRow);
    }
};

// Populates the log with all error messages 
LogDisplay.populate = function() {
    // Disable all jump button in case a respective log component is not displayed
    $(".jump-button").attr('disabled', true);
    
    // Empty out old content
    LogDisplay.display.empty();

    // Displays errors and warnings first
    LogDisplay.printResults("Error", LogDisplay.scannerErrorResults, "danger");
    LogDisplay.printResults("Error", LogDisplay.parserErrorResults, "danger");
    LogDisplay.printResults("Error", LogDisplay.semanticAnalyzerErrorResults, "danger");
    LogDisplay.printResults("Warning", LogDisplay.semanticAnalyzerWarningResults, "warning");
    LogDisplay.printResults("Warning", LogDisplay.scannerWarningResults, "warning");
    
    // If simple mode is activated, display only the last row which says success or failure
    var scannerResults = LogDisplay.verboseMode ? LogDisplay.scannerInfoResults : LogDisplay.scannerInfoResults.slice(-1);    
    LogDisplay.printResults("Scanner", scannerResults, "success");
    
    // If simple mode is activated, display only the last row which says success or failure
    var parserResults = LogDisplay.verboseMode ? LogDisplay.parserInfoResults : LogDisplay.parserInfoResults.slice(-1);   
    LogDisplay.printResults("Parser", parserResults, "success");
    
    // If simple mode is activated, display only the last row which says success or failure
    var semanticAnalyzerResults = LogDisplay.verboseMode ? LogDisplay.semanticAnalyzerInfoResults : LogDisplay.semanticAnalyzerInfoResults.slice(-1);   
    LogDisplay.printResults("Semantic Analyzer", semanticAnalyzerResults, "success");
};

// Prints the results to the screen
LogDisplay.printResults = function(header, results, severity) {
    if (results.length > 0) {
        var id = header.toLowerCase().replace(/\s/, "-");
        var buttonId = "#" + id + "-jump-button";
        var logId = id + "-log";
        
        // Re-enable the button if the log exists
        $(buttonId).attr('disabled', false);
        
        LogDisplay.display.append(LogDisplay.headerRowTemplate.format(header, severity, logId));
        for (var i = 0; i < results.length; i++) {
            LogDisplay.display.append(results[i]);
        }
    }
};

// Clears out the log display
LogDisplay.clear = function() {
    LogDisplay.display.html('<tr><td class="lead text-center">A program has not yet been compiled</td></tr>');
    LogDisplay.scannerInfoResults = [];
    LogDisplay.scannerErrorResults = [];
    LogDisplay.scannerWarningResults = [];
    LogDisplay.parserInfoResults = [];
    LogDisplay.parserErrorResults = [];
    LogDisplay.semanticAnalyzerInfoResults = [];
    LogDisplay.semanticAnalyzerErrorResults = [];
    LogDisplay.semanticAnalyzerWarningResults = [];
};

// Jumps to a specific element in the log
LogDisplay.jumpToLog = function(element) {
    if (element.length) {
        LogDisplay.displayContainer.animate({
            scrollTop: element.offset().top - LogDisplay.displayContainer.offset().top + LogDisplay.displayContainer.scrollTop()
        }, 100);
    }
};

// Activates or deactivates verbose mode
LogDisplay.changeVerboseMode = function() {
    if (LogDisplay.verboseButton.hasClass("btn-primary")) {
        LogDisplay.verboseButton.removeClass("btn-primary").addClass("btn-danger");
        LogDisplay.verboseButton.html("Simple");
        LogDisplay.verboseMode = true;
    } else {
        LogDisplay.verboseButton.addClass("btn-primary").removeClass("btn-danger");
        LogDisplay.verboseButton.html("Verbose");
        LogDisplay.verboseMode = false;
    }
    
    // Make sure we populated the display after the button is clicked
    LogDisplay.populate();
};