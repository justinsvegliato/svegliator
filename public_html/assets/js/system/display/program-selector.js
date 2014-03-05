function ProgramSelector() {};

ProgramSelector.template = "<li><a id='{0}'>{1}</a></li>";
ProgramSelector.programList = $("#programs");
ProgramSelector.programLinkId = "#programs a";

ProgramSelector.programs = {
    "everything 1": 
        '{ \n' +
            '    in t a\n' + 
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
            '    }$\n' +
            '\n' +
            '    string c\n' +
            '    c = \"james\"\n' +
            '    b = \"blackstone\"\n' +
            '    print(b)\n' +
        '} $'
};

ProgramSelector.initialize = function() {
    for (var key in ProgramSelector.programs) {
        ProgramSelector.programList.append(ProgramSelector.template.format(key, toTitleCase(key)));
    }
};

ProgramSelector.populateTextarea = function(programId) {
    Control.programInput.empty();
    
    var program = ProgramSelector.programs[programId];
    Control.programInput.val(program);
};
