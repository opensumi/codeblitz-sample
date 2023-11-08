import * as vscode from 'vscode';
import * as colorString from 'color-string';
import type { UsersManager } from './UsersManager';

export enum NameTagVisibility {
  Never = 'Never',
  Activity = 'Activity',
  Always = 'Always',
}

export abstract class TextEditorDecoratorBase {
  protected backgroundCssColor = DecoratorUtils.toCssColor(this.color.backgroundColor);
  protected textCssColor = DecoratorUtils.toCssColor(this.color.textColor);
  protected decoration: vscode.TextEditorDecorationType | undefined;

  abstract _createDecorationStyle(
    cursorPos: vscode.Position,
    selectionRange: vscode.Range,
    lineCount?: number
  ): void;
  abstract _renderCore(
    renderInEditors: vscode.TextEditor[] | null,
    cursorPos: vscode.Position,
    selectionRange: vscode.Range
  ): void;

  constructor(private color: DecoratorColor) {}

  dispose() {
    if (this.decoration) {
      this.decoration.dispose();
    }
  }

  render(
    renderInEditors: vscode.TextEditor[] | null,
    cursorPos: vscode.Position,
    selectionRange: vscode.Range,
    lineCount?: number
  ) {
    if (this.decoration) {
      this.decoration.dispose();
      this.decoration = undefined;
    }
    if (!renderInEditors || !renderInEditors.length || !cursorPos || !selectionRange) {
      return;
    }
    this._createDecorationStyle(cursorPos, selectionRange, lineCount);
    this._renderCore(renderInEditors, cursorPos, selectionRange);
  }
}

export class CursorDecorator extends TextEditorDecoratorBase {
  constructor(color: DecoratorColor, private displayName: string) {
    super(color);
  }

  _renderCore(
    renderInEditors: vscode.TextEditor[],
    cursorPos: vscode.Position,
    selectionRange: vscode.Range
  ) {
    if (!this.decoration) {
      return;
    }
    const decoratorRange = new vscode.Range(cursorPos, cursorPos);
    const renderOptions: vscode.DecorationOptions = {
      range: decoratorRange,
    };
    if (selectionRange.isEmpty) {
      // TODO: When https://github.com/Microsoft/vscode/issues/37401 is fixed, we will also need to add a check
      // for the nameTagVisibility. If it is set to Always, then this hover message should not be shown
      // (because the name tag will already be shown).
      renderOptions.hoverMessage = this.displayName;
    }
    renderInEditors.forEach((editor) => {
      editor.setDecorations(this.decoration!, [renderOptions]);
    });
  }

  _createDecorationStyle(cursorPos: vscode.Position, selectionRange: vscode.Range) {
    const leftMarginValue = cursorPos.character === 0 ? '0.17' : '0.25';
    const cursorCssRules = {
      position: 'absolute',
      display: 'inline-block',
      top: `0`,
      'font-size': '200%',
      'font-weight': 'bold',
      'z-index': 1,
    };
    const stringifiedNameTagCss = DecoratorUtils.stringifyCssProperties(cursorCssRules);
    const decorationOptions = {
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
      before: {
        contentText: 'ᛙ',
        margin: `0px 0px 0px -${leftMarginValue}ch`,
        color: this.backgroundCssColor,
        textDecoration: `none; ${stringifiedNameTagCss}`,
      },
    };
    this.decoration = vscode.window.createTextEditorDecorationType(decorationOptions);
  }
}

export class NameTagDecorator extends TextEditorDecoratorBase {
  constructor(color: DecoratorColor, private displayName: string) {
    super(color);
  }

  updateDisplayName(name) {
    this.displayName = name;
  }

  _renderCore(
    renderInEditors: vscode.TextEditor[],
    cursorPos: vscode.Position,
    selectionRange: vscode.Range
  ) {
    if (!this.decoration) {
      return;
    }
    const decoratorRange = new vscode.Range(cursorPos, cursorPos);
    renderInEditors.forEach((editor) => {
      editor.setDecorations(this.decoration!, [decoratorRange]);
    });
  }

  _createDecorationStyle(
    cursorPos: vscode.Position,
    selectionRange: vscode.Range,
    lineCount?: number
  ) {
    let showAbove = true;
    // Name tag goes below if cursor is on 1st line or if there is a multiline, non-reversed selection.
    if (
      cursorPos.line === 0 ||
      (selectionRange &&
        !selectionRange.isEmpty &&
        !selectionRange.isSingleLine &&
        selectionRange.end.isEqual(cursorPos))
    ) {
      //if we pass in lineCount, show above if we are on the first line and there is only one line
      if (cursorPos.line === 0 && lineCount === 1) {
        showAbove = true;
      } else {
        showAbove = false;
      }
    }
    const topValue = showAbove ? -1 : 1;
    const nameTagCssRules = {
      position: 'absolute',
      top: `${topValue}rem`,
      'border-radius': '0.15rem',
      padding: '0px 0.5ch',
      display: 'inline-block',
      'pointer-events': 'none',
      color: this.textCssColor,
      'font-size': '0.7rem',
      'z-index': 1,
      'font-weight': 'bold',
    };
    const stringifiedNameTagCss = DecoratorUtils.stringifyCssProperties(nameTagCssRules);
    const decorationOptions = {
      backgroundColor: this.backgroundCssColor,
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
      textDecoration: 'none; position: relative; z-index: 1;',
      after: {
        contentText: this.displayName,
        backgroundColor: this.backgroundCssColor,
        textDecoration: `none; ${stringifiedNameTagCss}`,
      },
    };
    this.decoration = vscode.window.createTextEditorDecorationType(decorationOptions);
  }
}

export class RulerDecorator extends TextEditorDecoratorBase {
  constructor(color: DecoratorColor) {
    super(color.withBackgroundAlpha(0.6));
  }
  _renderCore(
    renderInEditors: vscode.TextEditor[],
    cursorPos: vscode.Position,
    selectionRange: vscode.Range
  ) {
    if (!this.decoration) {
      return;
    }
    const decoratorRange = new vscode.Range(cursorPos, cursorPos);
    renderInEditors.forEach((editor) => {
      editor.setDecorations(this.decoration!, [decoratorRange]);
    });
  }
  _createDecorationStyle(cursorPos: vscode.Position, selectionRange: vscode.Range) {
    this.decoration = vscode.window.createTextEditorDecorationType({
      overviewRulerLane: vscode.OverviewRulerLane.Full,
      overviewRulerColor: this.backgroundCssColor,
    });
  }
}

export class SelectionDecorator extends TextEditorDecoratorBase {
  constructor(color: DecoratorColor, private displayName: string) {
    super(color.withBackgroundAlpha(0.35));
  }

  _renderCore(
    renderInEditors: vscode.TextEditor[],
    cursorPos: vscode.Position,
    selectionRange: vscode.Range
  ) {
    if (selectionRange.isEmpty) {
      return;
    }
    const renderOptions = {
      range: selectionRange,
      hoverMessage: this.displayName,
    };
    renderInEditors.forEach((editor) => {
      editor.setDecorations(this.decoration!, [renderOptions]);
    });
  }

  _createDecorationStyle(cursorPos: vscode.Position, selectionRange: vscode.Range) {
    this.decoration = vscode.window.createTextEditorDecorationType({
      backgroundColor: this.backgroundCssColor,
      borderRadius: '0.1rem',
    });
  }
}

export class DecoratorManager {
  private clientColor = SharedColors.requestColor(this.clientId);
  private selectionDecorator = new SelectionDecorator(this.clientColor, this.clientDisplayName);
  private cursorDecorator = new CursorDecorator(this.clientColor, this.clientDisplayName);
  private nameTagDecorator = new NameTagDecorator(this.clientColor, this.clientDisplayName);
  private rulerDecorator = new RulerDecorator(this.clientColor);

  private nameTagVisibilityTimer: number | undefined;

  constructor(
    private clientId: number,
    private clientDisplayName: string,
    private nameTagVisibility: NameTagVisibility,
    private usersManager: UsersManager,
    private editor: vscode.TextEditor
  ) {}

  dispose() {
    if (this.nameTagVisibilityTimer) {
      clearTimeout(this.nameTagVisibilityTimer);
    }
    this.disposeDecorators();
  }

  updateNameTag(name: string) {
    this.nameTagDecorator.updateDisplayName(name);
  }

  updateDecorators() {
    const lastSelection = this.usersManager.getSelection(this.clientId);
    if (!lastSelection) {
      return;
    }
    lastSelection.forEach(({ range, isReversed }) => {
      const selectionRange = range;
      const cursorPosition = isReversed ? selectionRange.start : selectionRange.end;
      const renderInEditors = [this.editor];
      this.selectionDecorator.render(renderInEditors, cursorPosition, selectionRange);
      this.rulerDecorator.render(renderInEditors, cursorPosition, selectionRange);

      switch (this.nameTagVisibility) {
        case NameTagVisibility.Always:
          this.cursorDecorator.render(renderInEditors, cursorPosition, selectionRange);
          this.nameTagDecorator.render(renderInEditors, cursorPosition, selectionRange);
          break;
        case NameTagVisibility.Never:
          this.cursorDecorator.render(renderInEditors, cursorPosition, selectionRange);
          if (this.nameTagDecorator) {
            this.nameTagDecorator.dispose();
          }
          break;
        case NameTagVisibility.Activity:
        default:
          if (this.nameTagVisibilityTimer) {
            clearTimeout(this.nameTagVisibilityTimer);
          }
          this.cursorDecorator.render(renderInEditors, cursorPosition, selectionRange);
          this.nameTagDecorator.render(renderInEditors, cursorPosition, selectionRange);
          this.nameTagVisibilityTimer = self.setTimeout(() => {
            this.nameTagDecorator.dispose();
          }, 1500);
          break;
      }
    });
  }

  disposeDecorators() {
    this.selectionDecorator.dispose();
    this.cursorDecorator.dispose();
    this.nameTagDecorator.dispose();
    this.rulerDecorator.dispose();
  }
}

class DecoratorColor {
  constructor(public backgroundColor: vscode.Color, public textColor: vscode.Color) {}
  /**
   * Returns a new DecoratorColor instance based on this one, with the alpha channel set to the given value for the background.
   * @param alpha The desired transparency, from 0 (transparent) to 1 (opaque)
   */
  withBackgroundAlpha(alpha: number) {
    // Clamp alpha between 0 and 1
    alpha = Math.max(0, alpha);
    alpha = Math.min(1, alpha);
    const newBgColor = new vscode.Color(
      this.backgroundColor.red,
      this.backgroundColor.green,
      this.backgroundColor.blue,
      alpha
    );
    return new DecoratorColor(newBgColor, this.textColor);
  }
}

export class SharedColors {
  static allColors: DecoratorColor[] = [];

  static requestColor(clientId: number) {
    SharedColors._initcolors();
    return SharedColors.allColors[clientId % SharedColors.allColors.length];
  }

  static _initcolors() {
    if (SharedColors.allColors.length) {
      return;
    }
    // Colors are used in order. Earlier in the array means they will be used first.
    const defaultColors = [
      // Yellow
      ['rgba(0, 0, 0, 1)', 'rgba(255, 185, 0, 1)'],
      // Green
      ['rgba(255, 255, 255, 1)', 'rgba(16, 124, 16, 1)'],
      // Magenta
      ['rgba(255, 255, 255, 1)', 'rgba(180, 0, 158, 1)'],
      // Light green
      ['rgba(0, 0, 0, 1)', 'rgba(186, 216, 10, 1)'],
      // Light orange
      ['rgba(0, 0, 0, 1)', 'rgba(255, 140, 0, 1)'],
      // Light magenta
      ['rgba(255, 255, 255, 1)', 'rgba(227, 0, 140, 1)'],
      // Purple
      ['rgba(255, 255, 255, 1)', 'rgba(92, 45, 145, 1)'],
      // Light teal
      ['rgba(0, 0, 0, 1)', 'rgba(0, 178, 148, 1)'],
      // Light yellow
      ['rgba(0, 0, 0, 1)', 'rgba(255, 241, 0, 1)'],
      // Light purple
      ['rgba(0, 0, 0, 1)', 'rgba(180, 160, 255, 1)'],
    ];
    const colorCustomizations = vscode.workspace.getConfiguration('workbench.colorCustomizations');
    let cursorForegroundBackgroundColors =
      colorCustomizations && colorCustomizations['cascade.cursorForegroundBackgroundColors'];
    if (cursorForegroundBackgroundColors && Array.isArray(cursorForegroundBackgroundColors)) {
      SharedColors.allColors = SharedColors.parseColors(cursorForegroundBackgroundColors);
    }
    if (!SharedColors.allColors || !SharedColors.allColors.length) {
      SharedColors.allColors = SharedColors.parseColors(defaultColors);
    }
  }

  static parseColors(colorStringPairs: string[][]) {
    const parsedColors = colorStringPairs
      .map((colorPair) => {
        if (colorPair && colorPair.length === 2) {
          const foregroundColor = DecoratorUtils.toVSCodeColor(colorPair[0]);
          const backgroundColor = DecoratorUtils.toVSCodeColor(colorPair[1]);
          if (foregroundColor && backgroundColor) {
            return new DecoratorColor(backgroundColor, foregroundColor);
          }
        }
      })
      .filter((color) => !!color)
      .reverse();
    return parsedColors as DecoratorColor[];
  }
}

class DecoratorUtils {
  static stringifyCssProperties(rules: Record<string, any>) {
    return Object.keys(rules)
      .map((rule) => `${rule}: ${rules[rule]};`)
      .join(' ');
  }
  static toCssColor(color: { red: number; green: number; blue: number; alpha: number }) {
    const r = Math.round(color.red * 255);
    const g = Math.round(color.green * 255);
    const b = Math.round(color.blue * 255);
    return `rgba(${r}, ${g}, ${b}, ${color.alpha})`;
  }
  static toVSCodeColor(color: string) {
    const parsedColor = colorString.get.rgb(color);
    if (parsedColor) {
      const [r, g, b, a] = parsedColor;
      return new vscode.Color(r / 255, g / 255, b / 255, a);
    } else {
      // colorString couldn't parse the color out of that string.
      return null;
    }
  }
  static isSamePosition(p1: vscode.Position, p2: vscode.Position) {
    if (p1 === null || p2 === null) {
      return false;
    }
    return p1.isEqual(p2);
  }
  static isSameRange(r1: vscode.Range, r2: vscode.Range) {
    if (r1 === null || r2 === null) {
      return false;
    }
    return r1.isEqual(r2);
  }
}
