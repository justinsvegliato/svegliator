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
        "{\n" +
        "    int a\n" +
        "    a = 1\n" +
        "    print(a)\n" +
        "\n" +
        "    {\n" +
        "        int a\n" +
        "        a = 2\n" +
        "        print(a)\n" +
        "    }\n" +
        "\n" + 
        "    {\n" +
        "        int a\n" +
        "        a = 3\n" +
        "        print(a)\n" +
        "    }\n" +
        "\n" +
        "    string s\n" +
        "    s = \"stra\"\n" +
        "    print(s)\n" +
        "\n" +
        "    s = \"strb\"\n" +
        "    print(s)\n" +
        "\n" + 
        "    if (a != 5) {\n" +
        "        print(\"true\")\n" +
        "    }\n" +
        "\n" +
        "    if (a == 5) {\n" +
        "        print(\"false\")\n" +
        "    }\n" +
        "} $",
    "correct program 2":
       "{\n" +
       "    int a\n" +
       "    a = 3\n" +
       "    while (a == 3) {\n" +
       "        print(1 + 2 + 3 + 4 + 5)\n" +
       "        a = 1 + a\n" +
       "    }\n" +
       "    print((true == true))\n" +
       "    print((false == false))\n" +
       "} $\n",
    "correct program 3":
       "{\n" +
       "    print((false == true))\n" +
       "    print((true != true))\n" +
       "    print((false != false))\n" +
       "    print((false != true))\n" +
       "} $",
    "correct program 4":
       "{\n" +
       "    int a\n" +
       "    a = 0\n" +
       "    while (a != 5) {\n" +
       "        print(a)\n" +
       "        a = 1 + a\n" +
       "    }\n" +
       "\n" +
       "    if (\"str\" == \"str\") {\n" +
       "        print(\"they are equal\")\n" +
       "    }\n" +
       "\n" +
       "    if (\"stra\" == \"strb\") {\n" +
       "        print(\"no dice\")  \n" +
       "    }\n" +
       "\n" +
       "    print((\"a\" != \"b\"))\n" +
       "    print((\"a\" != \"a\"))\n" +
       "} $",
    "correct program 5":
        "{\n" +
        "    int a\n" +
        "    int b\n" +
        "\n" +
        "    a = 0\n" +
        "    b = 0\n" +
        "\n" +
        "    while (a != 3) {\n" +
        "        print(a)\n" +
        "        while (b != 3) {\n" +
        "            print(b)\n" +
        "            b = 1 + b\n" +
        "            if (b == 2) {\n" +
        "                print(\"meow\")\n" +
        "            }\n" +
        "        }\n" +
        "        b = 0\n" +
        "        a = 1 + a\n" +
        "    }\n" +
        "} $",
    "correct program 6":
        "{\n" +
        "    string s\n" +
        "    int a\n" +
        "    a = 1\n" +
        "    {\n" +
        "        s = \"meow\"\n" +
        "        int a\n" +
        "        a = 2\n" +
        "        print(a)\n" +
        "    }\n" +
        "    {\n" +
        "        while (a != 5) {\n" +
        "            a = 1 + a\n" +
        "            print(a)\n" +
        "        }\n" +
        "        print(3 + a)\n" +
        "        print(s)\n" +
        "    }\n" +
        "} $\n",
     "incorrect program": 
        "{\n" + 
        "    int a\n" +
        "    a = 1\n" +
        "    print(a)\n" +
        "\n" +
        "    {\n" +
        "        int a\n" +
        "        a = 2\n" +
        "        print(a)\n" +
        "    }\n" +
        "\n" +
        "    {\n" +
        "        int a\n" +
        "        a = 3\n" +
        "        print(a)\n" +
        "    }\n" +
        "\n" +
        "    string s\n" +
        "    s = \"stra\"\n" +
        "    print(s)\n" +
        "\n" +
        "    s = \"strb\"\n" +
        "    print((s == \"str\"))\n" +
        "\n" +
        "    if (a != 5) {\n" +
        "        print((true == (s == s)))\n" +
        "    }\n" +
        "\n" +
        "    if (a == 5) {\n" +
        "        print(\"false\")\n" +
        "    }\n" +
        "\n" +
        "    s = \"meowa\"\n" +
        "    s = \"meowb\"\n" +
        "    s = \"meowc\"\n" +
        "    s = \"meowd\"\n" +
        "    s = \"meowe\"\n" +
        "    s = \"meowf\"\n" +
        "\n" +
        "    int z\n" +
        "    z = 5\n" +
        "} $\n"
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
