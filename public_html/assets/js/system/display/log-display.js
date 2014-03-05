function LogDisplay() {};

LogDisplay.displayContainer = $("#log-display");
LogDisplay.display = $("#log-display table tbody");

LogDisplay.headerRowTemplate = "<tr id='{2}' class='{1}'><th><strong>{0}</strong><th></tr>";

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
LogDisplay.scannerInfoResults = [];
LogDisplay.scannerErrorResults = [];
LogDisplay.scannerWarningResults = [];

LogDisplay.parserInfoRowTemplate = "<tr>\
                                        <td><strong class='text-muted'>{0}</strong></td> \
                                        <td colspan='2'><strong class='text-success'>{1}</strong></td> \
                                    </tr>";
LogDisplay.parserErrorRowTemplate = "<tr>\
                                         <td><strong class='text-muted'>{0}</strong></td> \
                                         <td><strong class='text-danger'>{1} [ <span class='text-primary'>{2}</span> ]</strong></td> \
                                     </tr>";
LogDisplay.parseSearchingCellTemplate = "Searching for [ <span class='text-primary'>{0}</span> ]";
LogDisplay.parseFoundCellTemplate = "Found [ <span class='text-primary'>{0}</span> ] with a value of [ <span class='text-primary'>{1}</span> ]";
LogDisplay.parseParsingCellTemplate = "Parsing [ <span class='text-primary'>{0} <span class='text-danger glyphicon glyphicon-arrow-right'></span> {1}</span> ]";    
LogDisplay.parserInfoResults = [];
LogDisplay.parserErrorResults = [];

LogDisplay.logScannerInfoResult = function(token) {
    LogDisplay.scannerInfoResults.push(LogDisplay.scannerInfoRowTemplate.format(token.lineNumber, token.kind.name, token.value));
};

LogDisplay.logScannerErrorResult = function(message, lineNumber, lexeme) {
    var row = LogDisplay.scannerErrorRowTemplate.format(lineNumber, message, lexeme);
    LogDisplay.scannerInfoResults.push(row);
    LogDisplay.scannerErrorResults.push(row);
};

LogDisplay.logScannerWarningResult = function(message, lineNumber, lexeme) {
    var row = LogDisplay.scannerWarningRowTemplate.format(lineNumber, message, lexeme);
    LogDisplay.scannerWarningResults.push(row);
    LogDisplay.scannerInfoResults.push(row);
};

LogDisplay.logParserSearchingResult = function(token, kind) {
    var cell = LogDisplay.parseSearchingCellTemplate.format(kind.name);
    LogDisplay.parserInfoResults.push(LogDisplay.parserInfoRowTemplate.format(token.lineNumber, cell));
};

LogDisplay.logParserFoundResult = function(token) {
    var cell = LogDisplay.parseFoundCellTemplate.format(token.kind.name, token.value);
    LogDisplay.parserInfoResults.push(LogDisplay.parserInfoRowTemplate.format(token.lineNumber, cell));
};

LogDisplay.logParserParsingResult = function(token, leftSide, rightSide) {
    var cell = LogDisplay.parseParsingCellTemplate.format(leftSide, rightSide);
    LogDisplay.parserInfoResults.push(LogDisplay.parserInfoRowTemplate.format(token.lineNumber, cell));
};

LogDisplay.logParserErrorResult = function(message, token) {
    if (LogDisplay.parserErrorResults.length === 0) {
        var row = LogDisplay.parserErrorRowTemplate.format(token.lineNumber, message, token.value);
        LogDisplay.parserErrorResults.push(row);
        LogDisplay.parserInfoResults.push(row);        
    }
};

LogDisplay.populate = function() {
    $(".jump-button").attr('disabled', true);
    LogDisplay.printResults("Error", LogDisplay.scannerErrorResults, "danger");
    LogDisplay.printResults("Error", LogDisplay.parserErrorResults, "danger");  
    LogDisplay.printResults("Warning", LogDisplay.scannerWarningResults, "warning"); 
    LogDisplay.printResults("Scanner", LogDisplay.scannerInfoResults, "success");
    LogDisplay.printResults("Parser", LogDisplay.parserInfoResults, "success");
};

LogDisplay.printResults = function(header, results, severity) {
    if (results.length > 0) {
        var id = header.toLowerCase();
        var buttonId = "#" + id + "-jump-button";
        $(buttonId).attr('disabled', false);        
        var logId = id + "-log";
        LogDisplay.display.append(LogDisplay.headerRowTemplate.format(header, severity, logId));        
        for (var i = 0; i < results.length; i++) {
            LogDisplay.display.append(results[i]);
        }
    }
};

LogDisplay.clear = function() {
    LogDisplay.display.empty();
    LogDisplay.scannerInfoResults = [];
    LogDisplay.scannerErrorResults = [];
    LogDisplay.scannerWarningResults = [];
    LogDisplay.parserInfoResults = [];
    LogDisplay.parserErrorResults = [];
};