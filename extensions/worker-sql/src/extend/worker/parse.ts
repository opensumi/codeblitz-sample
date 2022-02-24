import { CharStreams, CommonTokenStream } from "antlr4ts";
import TestErrorListener, { ILangError } from "./TestErrorListeners";
import { testLexer } from '../antlr/testLexer';
import { testParser,TodoExpressionsContext } from '../antlr/testParser';
import { testListener } from '../antlr/testListener';


function parse(input){

  const chars = CharStreams.fromString(input);
  const lexer = new testLexer(chars);
  lexer.removeErrorListeners()
  const testErrorsListner = new TestErrorListener();
  lexer.addErrorListener(testErrorsListner);
  const tokens = new CommonTokenStream(lexer);
  const parser = new testParser(tokens);
  const ast = parser.todoExpressions();
  const errors: ILangError[]  = testErrorsListner.getErrors();

  return {
    ast,
    errors
  }
}

export function parseAndGetASTRoot(code: string): TodoExpressionsContext {
  const {ast} = parse(code);
  return ast;
}
export function parseAndGetSyntaxErrors(code: string): ILangError[] {
  const {errors} = parse(code);
  return errors;
}