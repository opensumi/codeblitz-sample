import { TextDocumentContentChangeEvent } from 'vscode';
import { TextOperation } from './ot/text-operation';

export function convertChangeEventToOperation(
  changeEvent: ReadonlyArray<TextDocumentContentChangeEvent>,
  liveOperationCode: string
) {
  let otOperation: TextOperation;

  let composedCode = liveOperationCode;

  // eslint-disable-next-line no-restricted-syntax
  for (const change of changeEvent) {
    const newOt = new TextOperation();

    if (change.rangeOffset !== 0) {
      newOt.retain(change.rangeOffset);
    }

    if (change.rangeLength > 0) {
      newOt.delete(change.rangeLength);
    }

    if (change.text) {
      newOt.insert(change.text);
    }

    const remaining = composedCode.length - newOt.baseLength;
    if (remaining > 0) {
      newOt.retain(remaining);
    }

    otOperation = otOperation! ? otOperation!.compose(newOt) : newOt;

    composedCode = otOperation!.apply(liveOperationCode);
  }

  return {
    operation: otOperation!,
    newCode: composedCode,
  };
}
