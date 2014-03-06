/** 
 * A class that contains all information regarding nonterminals
 */

function Nonterminal() {};

// An anumerated field containing the names of all kinds of nonterminals
Nonterminal.Kind = {                
    PROGRAM: {
        value: "Program"     
    },
    BLOCK: {
        value: "Block"       
    },
    STATEMENT_LIST: {
        value: "StatementList"       
    },
    STATEMENT: {
        value: "Statement"       
    },
    PRINT_STATEMENT: {
        value: "PrintStatement"       
    },
    ASSIGNMENT_STATEMENT: {
        value: "AssignmentStatement"       
    },
    VAR_DECL: {
        value: "VarDecl"       
    },
    WHILE_STATEMENT: {
        value: "WhileStatement"       
    },
    IF_STATEMENT: {
        value: "IfStatement"       
    },
    EXPR: {
        value: "Expr"       
    },
    INT_EXPR: {
        value: "IntExpr"       
    },
    STRING_EXPR: {
        value: "StringExpr"       
    },
    BOOLEAN_EXPR: {
        value: "BooleanExpr"       
    },
    ID: {
        value: "Id"       
    },
    CHAR_LIST: {
        value: "CharList"       
    }, 
    EPSILON: {
        value: "Epsilon"       
    } 
};