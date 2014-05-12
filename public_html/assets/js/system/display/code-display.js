function CodeDisplay() {};

// This map contains information necessary to highlight the syntax of
// the generated machine code
CodeDisplay.operationMap = {
    "A9": {
        "argumentLength": 1,
        "mnemonic": "LDA"
    },
    "AD": {
        "argumentLength": 2,
        "mnemonic": "LDA"
    },
    "8D": {
        "argumentLength": 2,
        "mnemonic": "STA"
    },
    "6D": {
        "argumentLength": 2,
        "mnemonic": "ADC"
    },
    "A2": {
        "argumentLength": 1,
        "mnemonic": "LDX"
    },
    "AE": {
        "argumentLength": 2,
        "mnemonic": "LDX"
    },
    "A0": {
        "argumentLength": 1,
        "mnemonic": "LDY"
    },
    "AC": {
        "argumentLength": 2,
        "mnemonic": "LDY"
    },
    "00": {
        "argumentLength": 0,
        "mnemonic": "BRK"
    },
    "EA": {
        "argumentLength": 0,
        "mnemonic": "NOP"
    },
    "EC": {
        "argumentLength": 2,
        "mnemonic": "CPX"
    },
    "D0": {
        "argumentLength": 1,
        "mnemonic": "BNE"
    },
    "EE": {
        "argumentLength": 2,
        "mnemonic": "INC"
    },
    "FF": {
        "argumentLength": 0,
        "mnemonic": "FF"
    }
};

// The DOM elements needed to display the machine code
CodeDisplay.textbox = $("#machine-code");
CodeDisplay.template = "<strong class='{0}'>{1}</strong> ";

// Displays the specified code but makes sure to highlight instructions,
// strings, and addresses
CodeDisplay.display = function(code) {
    var html = "";
    var components = code.split(" ");
    
    // Iterates through each instruction
    for (var i = 0; i < Code.MAX_LENGTH; i++) {
        var instruction = components[i];

        // Highlights the instruction according to how many arguments it has
        var instructionData = CodeDisplay.operationMap[instruction];
        if (instructionData) {
            var modifier = "";
            if (instruction !== "00") {
                if (instructionData.argumentLength === 1) {
                    modifier = "text-danger";
                } else if (instructionData.argumentLength === 2) {
                    modifier = "text-warning";
                } else {
                    modifier = "";
                }
            } else {
                modifier = "text-muted";
            }

            // Adds the instruction to the content to be displayed
            html += CodeDisplay.template.format(modifier, instruction);

            // Iterates through the parameters of the instruction to ensure highlighting
            var startingPosition = i;
            for (var j = 1; j <= instructionData.argumentLength; j++) {
                var memoryLocation = components[j + startingPosition];
                html += CodeDisplay.template.format("text-primary", memoryLocation);
                i++;
            }
        } else {
            html += CodeDisplay.template.format("text-success", instruction.toUpperCase());
        }
    }
    CodeDisplay.textbox.html(html);
};

// Selects all text in the machine code element when the corresponding element
// is clicked
CodeDisplay.selectText = function(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
    }
};

// Clears the machine code element
CodeDisplay.clear = function() {
    CodeDisplay.textbox.html("<h6 class='lead text-center'>No machine code</h6>");
};