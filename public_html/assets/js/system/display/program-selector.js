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
    "correct program 1": 
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
    "correct program 2" : 
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
    "correct program with warnings" : 
        '{\n' + 
        '    boolean d\n' +
        '    int a\n' +
        '    int b\n' +
        '    int e\n' +
        '    string x\n' +
        '    \n' +
        '    d = (a == b)\n' +
        '    d = (1 == a)\n' +
        '    d = (1 != 1)\n' +
        '    d = (d != false)\n' +
        '    d = ("string" != "string")\n' +
        '    \n' +
        '    if (d == true) {\n' +
        '        int c\n' +
        '        c = 1 + a\n' +
        '        if (c == a) {\n' +
        '            print("test")\n' +
        '        }\n' +
        '    }\n' +
        '    \n' +
        '    while ("string" == x) {\n' +
        '        while (false == true) {\n' +
        '            a = 1 + 9\n' +
        '        }\n' +
        '    }\n' +
        '} $',
     "incorrect program 1" : 
        '{\n' + 
        '    boolean d\n' +
        '    string b\n' +
        '    int a\n' +
        '    a = (a == b)\n' +
        '    d = (1 == a)\n' +
        '    d = (1 != 1)\n' +
        '    b = ("string" == 1)\n' +
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
    "incorrect program 2" : 
        '{\n' + 
        '    boolean d\n' +    
        '    d = ((true == 1) != (("x" == false) == (1 != d)))\n' +    
        '\n' +
        '    int a\n' +    
        '    a = 1 + 2 + 4 + 8 + true\n' +    
        '    a = 9 + "a"\n' +    

        '    boolean x\n' +    
        '    x = true\n' +    
        '\n' +
        '    y = false\n' +    
        '} $',
    "incorrect program 3": 
        '{\n' +
        '   int a\n' +
        '   a = 1\n' +
        '   {\n' +
        '       int a\n' +
        '       {\n' +
        '           a = 6\n' +
        '           {\n' +
        '               b = 7\n' +
        '           }\n' +
        '           int b\n' +
        '           b = 5\n' +
        '       }\n' +
        '       {\n' +
        '           boolean b\n' +
        '           b = true\n' +
        '       }\n' +
        '       {}{}{}{}{{{}}}\n' +
        '       int a\n' +
        '       a = 2\n' +
        '       print(z)\n' +
        '       b = 1\n' +
        '   }\n' +
        '} $\n'
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
