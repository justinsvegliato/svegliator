/** 
 * A class that displays the example programs and populates the editor.
 */

function ProgramSelector() {};

// The HTML elements that will be displayed to the screen
ProgramSelector.template = "<li><a id='{0}'>{1}</a></li>";

// The DOM elements used for the program selector
ProgramSelector.programList = $("#programs");
ProgramSelector.programLinkId = "#programs a";

// All the example programs
ProgramSelector.programs = {
    "complex correct program 1": 
        '{\n' +
        '    int a\n' + 
        '    a = 1\n' +
        '    {\n' +
        '        int a\n' +
        '        a = 2\n' +
        '        print(a)\n' +
        '    }\n' +
        '\n' +
        '    string b\n' +
        '    b = \"alan\"\n' +
        '    if (a == 1) {\n' +
        '        print(b)\n' +
        '    }\n' +
        '\n' +
        '    string c\n' +
        '    c = \"james\"\n' +
        '    b = \"blackstone\"\n' +
        '    print(b)\n' +
        '} $',
    "complex correct program 2" : 
        '{\n' + 
        '    int a\n' +
        '    a = 0\n' + 
        '    \n' +
        '    while (a != 9) {\n' +
        '       if (a != 5) {\n' +
        '           print("meow")\n' +
        '       }\n' +
        '       {\n' +
        '           a = 1 + a\n' +
        '           string b\n' +
        '           b = "next cat"\n' +
        '           print(b)\n' +
        '       }\n' +
        '    }\n' +
        '    \n' +
        '    {}\n' +
        '    boolean c\n' +
        '    c = true\n' +
        '    \n' + 
        '    boolean d\n' +
        '    d = (true == (true == false))\n' +
        '} $',
    "complex correct program 3" : 
        '{\n' + 
        '    boolean d\n' +
        '    d = (a == b)\n' +
        '    d = (1 == a)\n' +
        '    d = (1 != 1)\n' +
        '    d = ("string" == 1)\n' +
        '    d = (a != "string")\n' +
        '    d = ("string" != "string")\n' +
        '    \n' +
        '    if (d == true) {\n' +
        '        int c\n' +
        '        c = 1 + d\n' +
        '        if (c == 1) {\n' +
        '            print("test")\n' +
        '        }\n' +
        '    }\n' +
        '    \n' +
        '    while ("string" == a) {\n' +
        '        while (1 == true) {\n' +
        '            a = 1 + "string"\n' +
        '        }\n' +
        '    }\n' +
        '} $',
    "complex correct program 4" : 
        '{\n' + 
        '    if true {\n' +
        '        if (1 == 1) {}\n' +
        '        while ("string" == a) {\n' +
        '           while false {}\n' +
        '        }\n' +
        '        print("justin")\n' +
        '        a = ""\n' +
        '    }\n' +
        '} $',
    "simple correct program 1" :  
        '{\n' + 
        '    {{{}}}\n' +
        '} $',
    "simple correct program 2" : 
        '{\n' + 
        '} $',
    "complex incorrect program 1" : 
        '{\n' + 
        '    int a\n' +
        '    a = 0\n' + 
        '    \n' +
        '    while (a = 9) {\n' +
        '       if (a != 5) {\n' +
        '           print("meow")\n' +
        '       }\n' +
        '       {\n' +
        '           a = 1 + a\n' +
        '           string b\n' +
        '           b = "next cat"\n' +
        '           print(b)\n' +
        '       }\n' +
        '    }\n' +
        '    \n' +
        '    {}\n' +
        '    boolean c\n' +
        '    c = true\n' +
        '    \n' + 
        '    boolean d\n' +
        '    d = (true == (true == false))\n' +
        '}',
    "complex incorrect program 2" : 
        '{\n' + 
        '    if {\n' +
        '        if (1 == 1) {}\n' +
        '        while ("string" == a) {\n' +
        '           while false {}\n' +
        '        }\n' +
        '        print("justin")\n' +
        '        a = ""\n' +
        '    }\n' +
        '} $',
    "complex incorrect program 3" : 
        '{\n' + 
        '    boolean\n' +
        '    d = (a == b)\n' +
        '    d = (1 == a)\n' +
        '    d = (1 != 1)\n' +
        '    d = ("string" == 1)\n' +
        '    d = (a != "string")\n' +
        '    d = ("string" != "string")\n' +
        '    \n' +
        '    if (d == true) {\n' +
        '        int c\n' +
        '        c = 1 + d\n' +
        '        if (c == 1) {\n' +
        '            print("test")\n' +
        '        }\n' +
        '    }\n' +
        '    \n' +
        '    while ("string" == a) {\n' +
        '        while (1 == true) {\n' +
        '            a = 1 + "string"\n' +
        '        }\n' +
        '    }\n' +
        '} $',
    "complex incorrect program 4": 
        '{\n' +
        '    in#t a\n' + 
        '    a = 1\n' +
        '    {\n' +
        '        int a\n' +
        '        a = 2\n' +
        '        print(a)\n' +
        '    }\n' +
        '\n' +
        '    string b\n$' +
        '    b = \"alan\"\n' +
        '    if (a == 1) {\n' +
        '        print(b)\n' +
        '    }\n' +
        '\n' +
        '    string c\n' +
        '    c = \"james\"\n' +
        '    b = \"blackstone\"\n' +
        '    print(b)\n' +
        '} $',
    "complex incorrect program 5":
        '{\n' +
        '    if (d == true) {\n' +
        '        int c\n' +
        '        c = 1 + d\n' +
        '        if (c == 1) {\n' +
        '            print()\n' +
        '        }\n' +
        '    }\n' +
        '}$\n',
    "complex incorrect program 6":
        '{\n' +
        '    if d == true) {\n' +
        '        int c\n' +
        '        c = 1 + d\n' +
        '        if (c == 1) {\n' +
        '            print()\n' +
        '        }\n' +
        '    }\n' +
        '}$\n'
        
};

// Populates the program dropdown with all of the programs
ProgramSelector.initialize = function() {
    for (var key in ProgramSelector.programs) {
        ProgramSelector.programList.append(ProgramSelector.template.format(key, toTitleCase(key)));
    }
};

// Pushes the corresponding code to the editor
ProgramSelector.populateTextarea = function(programId) {
    Control.programInput.empty();
    
    var program = ProgramSelector.programs[programId];
    Control.programInput.val(program);
};
