/** 
 * A class that holds the generated code
 */

function Code() {
    // Houses data associated with each instruction
    this.text = [];
    this.currentAddress = 0;
    
    // Houses data associated with strings
    this.heap = [];
    this.heapAddress = 256;
    
    // Adds true and false to the heap in order to promote boolean printing
    this.addString(Code.TRUE_VALUE);
    this.addString(Code.FALSE_VALUE);
};


// Data associated with the boolean values and their corresponding location in memory
Code.TRUE_VALUE = "true";
Code.TRUE_ADDRESS = "FB";
Code.FALSE_VALUE = "false";
Code.FALSE_ADDRESS = "F5";

// Data associated with the temporary memory locations
Code.TEMPORARY_ADDRESS = "TMP1";
Code.SECONDARY_TEMPORARY_ADDRESS = "TMP2";

Code.MAX_LENGTH = 256;

// Adds an instruction to the code
Code.prototype.addInstruction = function(instruction) {
    var modifiedInstruction = "";
    var length = instruction.length / 2;    
    for (var i = 0; i < length; i++) {
        var instructionComponent = instruction.substr(2 * i, 2);
        modifiedInstruction += instructionComponent + " ";
        this.text.push(instructionComponent);
    };
    LogDisplay.logCodeGeneratorInstructionResult("Added", modifiedInstruction);
    this.currentAddress += length;
};

// Adds an instruction to the heap
Code.prototype.addString = function(string) {
    this.heap.unshift("00");
    for (var i = string.length - 1; i >= 0; i--) {
        this.heap.unshift(Code.formatCharacter(string.charAt(i)));
    }
    LogDisplay.logCodeGeneratorStringResult("Added", string, this.heapAddress);
    this.heapAddress -= string.length + 1;    
    
    return Code.formatAddress(this.heapAddress);
};

// A factory that produces 6402a instructions
Code.operations = {
    LOAD_ACCUMULATOR_WITH_CONSTANT: function(value) {
        return "A9" + Code.formatValue(value);
    },
    LOAD_ACCUMULATOR_FROM_MEMORY: function(address) {
        return "AD" + address;
    },
    ADD_WITH_CARRY: function(address) {
        return "6D" + address;
    },
    STORE_ACCUMULATOR_IN_MEMORY: function(address) {
        return "8D" + address;
    },
    LOAD_Y_REGISTER_FROM_MEMORY: function(address) {
        return "AC" + address;
    },
    LOAD_Y_REGISTER_WITH_CONSTANT: function(value) {
        return "A0" + value;
    },
    LOAD_X_REGISTER_FROM_MEMORY: function(address) {
        return "AE" + address;
    },
    LOAD_X_REGISTER_WITH_CONSTANT: function(value) {
        return "A2" + Code.formatValue(value);
    },
    COMPARE_BYTE_IN_MEMORY_TO_X_REGISTER: function(address) {
        return "EC" + address;
    },
    BRANCH_IF_Z_FLAG_EQUALS_ZERO: function(jump) {
        return "D0" + jump;
    },
    BREAK: function() {
        return "00";
    },
    SYSTEM_CALL: function() {
        return "FF";
    }
};

// Formats a specified value to be a hexidecimal equivalent
Code.formatValue = function(value) {
    return pad(toHexidecimal(parseInt(value)), 2, '0').toUpperCase();
};

// Formats a specified address to be a hexidecimal equivalent
Code.formatAddress = function(address) {
    var hex = pad(toHexidecimal(parseInt(address)), 4, '0');
    var firstComponent = hex.substr(2);
    var secondComponent = hex.substr(0,2);
    return (firstComponent + secondComponent).toUpperCase();
};

// Formats a specified character to be a hexidecimal equivalent
Code.formatCharacter = function(character) {
    return pad(toHexidecimal(character.charCodeAt(0)), 2, '0');
};