// Generated from ./test.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { testListener } from "./testListener";

export class testParser extends Parser {
	public static readonly ADD = 1;
	public static readonly TODO = 2;
	public static readonly COMPLETE = 3;
	public static readonly STRING = 4;
	public static readonly EOL = 5;
	public static readonly WS = 6;
	public static readonly RULE_todoExpressions = 0;
	public static readonly RULE_addExpression = 1;
	public static readonly RULE_completeExpression = 2;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"todoExpressions", "addExpression", "completeExpression",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'ADD'", "'TODO'", "'COMPLETE'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "ADD", "TODO", "COMPLETE", "STRING", "EOL", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(testParser._LITERAL_NAMES, testParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return testParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "test.g4"; }

	// @Override
	public get ruleNames(): string[] { return testParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return testParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(testParser._ATN, this);
	}
	// @RuleVersion(0)
	public todoExpressions(): TodoExpressionsContext {
		let _localctx: TodoExpressionsContext = new TodoExpressionsContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, testParser.RULE_todoExpressions);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 9;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === testParser.ADD) {
				{
				{
				this.state = 6;
				this.addExpression();
				}
				}
				this.state = 11;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 15;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === testParser.COMPLETE) {
				{
				{
				this.state = 12;
				this.completeExpression();
				}
				}
				this.state = 17;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public addExpression(): AddExpressionContext {
		let _localctx: AddExpressionContext = new AddExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, testParser.RULE_addExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 18;
			this.match(testParser.ADD);
			this.state = 19;
			this.match(testParser.TODO);
			this.state = 20;
			this.match(testParser.STRING);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public completeExpression(): CompleteExpressionContext {
		let _localctx: CompleteExpressionContext = new CompleteExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, testParser.RULE_completeExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 22;
			this.match(testParser.COMPLETE);
			this.state = 23;
			this.match(testParser.TODO);
			this.state = 24;
			this.match(testParser.STRING);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\b\x1D\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x03\x02\x07\x02\n\n\x02\f\x02\x0E\x02" +
		"\r\v\x02\x03\x02\x07\x02\x10\n\x02\f\x02\x0E\x02\x13\v\x02\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x02\x02\x02" +
		"\x05\x02\x02\x04\x02\x06\x02\x02\x02\x02\x1B\x02\v\x03\x02\x02\x02\x04" +
		"\x14\x03\x02\x02\x02\x06\x18\x03\x02\x02\x02\b\n\x05\x04\x03\x02\t\b\x03" +
		"\x02\x02\x02\n\r\x03\x02\x02\x02\v\t\x03\x02\x02\x02\v\f\x03\x02\x02\x02" +
		"\f\x11\x03\x02\x02\x02\r\v\x03\x02\x02\x02\x0E\x10\x05\x06\x04\x02\x0F" +
		"\x0E\x03\x02\x02\x02\x10\x13\x03\x02\x02\x02\x11\x0F\x03\x02\x02\x02\x11" +
		"\x12\x03\x02\x02\x02\x12\x03\x03\x02\x02\x02\x13\x11\x03\x02\x02\x02\x14" +
		"\x15\x07\x03\x02\x02\x15\x16\x07\x04\x02\x02\x16\x17\x07\x06\x02\x02\x17" +
		"\x05\x03\x02\x02\x02\x18\x19\x07\x05\x02\x02\x19\x1A\x07\x04\x02\x02\x1A" +
		"\x1B\x07\x06\x02\x02\x1B\x07\x03\x02\x02\x02\x04\v\x11";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!testParser.__ATN) {
			testParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(testParser._serializedATN));
		}

		return testParser.__ATN;
	}

}

export class TodoExpressionsContext extends ParserRuleContext {
	public addExpression(): AddExpressionContext[];
	public addExpression(i: number): AddExpressionContext;
	public addExpression(i?: number): AddExpressionContext | AddExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AddExpressionContext);
		} else {
			return this.getRuleContext(i, AddExpressionContext);
		}
	}
	public completeExpression(): CompleteExpressionContext[];
	public completeExpression(i: number): CompleteExpressionContext;
	public completeExpression(i?: number): CompleteExpressionContext | CompleteExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(CompleteExpressionContext);
		} else {
			return this.getRuleContext(i, CompleteExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return testParser.RULE_todoExpressions; }
	// @Override
	public enterRule(listener: testListener): void {
		if (listener.enterTodoExpressions) {
			listener.enterTodoExpressions(this);
		}
	}
	// @Override
	public exitRule(listener: testListener): void {
		if (listener.exitTodoExpressions) {
			listener.exitTodoExpressions(this);
		}
	}
}


export class AddExpressionContext extends ParserRuleContext {
	public ADD(): TerminalNode { return this.getToken(testParser.ADD, 0); }
	public TODO(): TerminalNode { return this.getToken(testParser.TODO, 0); }
	public STRING(): TerminalNode { return this.getToken(testParser.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return testParser.RULE_addExpression; }
	// @Override
	public enterRule(listener: testListener): void {
		if (listener.enterAddExpression) {
			listener.enterAddExpression(this);
		}
	}
	// @Override
	public exitRule(listener: testListener): void {
		if (listener.exitAddExpression) {
			listener.exitAddExpression(this);
		}
	}
}


export class CompleteExpressionContext extends ParserRuleContext {
	public COMPLETE(): TerminalNode { return this.getToken(testParser.COMPLETE, 0); }
	public TODO(): TerminalNode { return this.getToken(testParser.TODO, 0); }
	public STRING(): TerminalNode { return this.getToken(testParser.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return testParser.RULE_completeExpression; }
	// @Override
	public enterRule(listener: testListener): void {
		if (listener.enterCompleteExpression) {
			listener.enterCompleteExpression(this);
		}
	}
	// @Override
	public exitRule(listener: testListener): void {
		if (listener.exitCompleteExpression) {
			listener.exitCompleteExpression(this);
		}
	}
}


