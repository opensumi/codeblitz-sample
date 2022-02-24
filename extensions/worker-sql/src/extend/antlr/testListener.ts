// Generated from ./test.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { TodoExpressionsContext } from "./testParser";
import { AddExpressionContext } from "./testParser";
import { CompleteExpressionContext } from "./testParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `testParser`.
 */
export interface testListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `testParser.todoExpressions`.
	 * @param ctx the parse tree
	 */
	enterTodoExpressions?: (ctx: TodoExpressionsContext) => void;
	/**
	 * Exit a parse tree produced by `testParser.todoExpressions`.
	 * @param ctx the parse tree
	 */
	exitTodoExpressions?: (ctx: TodoExpressionsContext) => void;

	/**
	 * Enter a parse tree produced by `testParser.addExpression`.
	 * @param ctx the parse tree
	 */
	enterAddExpression?: (ctx: AddExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `testParser.addExpression`.
	 * @param ctx the parse tree
	 */
	exitAddExpression?: (ctx: AddExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `testParser.completeExpression`.
	 * @param ctx the parse tree
	 */
	enterCompleteExpression?: (ctx: CompleteExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `testParser.completeExpression`.
	 * @param ctx the parse tree
	 */
	exitCompleteExpression?: (ctx: CompleteExpressionContext) => void;
}

