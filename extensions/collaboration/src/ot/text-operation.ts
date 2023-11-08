/**
 * @see https://github.com/Operational-Transformation/ot.js/blob/master/lib/text-operation.js
 */

type OP = string | number;

export type SerializedTextOperation = Array<OP>;

// Operation are essentially lists of ops. There are three types of ops:
//
// * Retain ops: Advance the cursor position by a given number of characters.
//   Represented by positive ints.
// * Insert ops: Insert a given string at the current cursor position.
//   Represented by strings.
// * Delete ops: Delete the next n characters. Represented by negative ints.
// -------------------------------------------
// 操作本质上是 opts 的列表。opts 有三种类型
//
// * 保留 ops：将光标前进到给定数量的字符。以正整数标示
// * 插入 ops：在当前光标位置插入给定的字符串。以字符串标示
// * 删除 ops：删除接下来的 n 个字符。以负整数标示

const isRetain = (op: OP): op is number => typeof op === 'number' && op > 0;
const isInsert = (op: OP): op is string => typeof op === 'string';
const isDelete = (op: OP): op is number => typeof op === 'number' && op < 0;

// Constructor for new operations.
export class TextOperation {
  static isRetain = isRetain;
  static isInsert = isInsert;
  static isDelete = isDelete;

  // When an operation is applied to an input string, you can think of this as
  // if an imaginary cursor runs over the entire string and skips over some
  // parts, deletes some parts and inserts characters at some positions. These
  // actions (skip/delete/insert) are stored as an array in the "ops" property.
  // -------------------------------------------
  // 当一个操作被应用于一个输入的字符串，你可以将其想想为一个假想的游标在整个字符串上游走，跳过某些部分，
  // 删除某些部分以及在某些位置插入字符。这些行为 （skip/delete/insert）存储在一个数组中作为 "opts" 的属性
  public ops: SerializedTextOperation = [];
  // An operation's baseLength is the length of every string the operation
  // can be applied to.
  // -------------------------------------------
  // 一个操作的 baseLength 是该操作可以被应用的每个字符串的长度
  public baseLength = 0;
  // The targetLength is the length of every string that results from applying
  // the operation on a valid input string.
  // -------------------------------------------
  // targetLength 是将操作应用于每一个有效输入字符串后产生的字符串的长度
  public targetLength = 0;

  /**
   * 比较两个 TextOperations 是否相等
   */
  equals(other: TextOperation) {
    if (this.baseLength !== other.baseLength) {
      return false;
    }
    if (this.targetLength !== other.targetLength) {
      return false;
    }
    if (this.ops.length !== other.ops.length) {
      return false;
    }
    for (let i = 0; i < this.ops.length; i++) {
      if (this.ops[i] !== other.ops[i]) {
        return false;
      }
    }
    return true;
  }

  // After an operation is constructed, the user of the library can specify the
  // actions of an operation (skip/insert/delete) with these three builder
  // methods. They all return the operation for convenient chaining.
  // -------------------------------------------
  // 在一个操作被构建后，用户可以用这三个构建器方法指定操作的行为（skip/insert/delete）
  // 它们都返回操作实例本身以方便链式调用

  // Skip over a given number of characters.
  // -------------------------------------------
  // 跳过给定数量的字符
  retain(n: number) {
    if (typeof n !== 'number') {
      throw new Error('retain expects an integer');
    }
    if (n === 0) {
      return this;
    }
    this.baseLength += n;
    this.targetLength += n;
    let lastOp = this.ops[this.ops.length - 1];
    if (isRetain(lastOp)) {
      // The last op is a retain op => we can merge them into one op.
      lastOp += n;
      this.ops[this.ops.length - 1] = lastOp;
    } else {
      // Create a new op.
      this.ops.push(n);
    }
    return this;
  }

  // Insert a string at the current position.
  // -------------------------------------------
  // 在当前位置插入字符串
  insert(str: string) {
    if (typeof str !== 'string') {
      throw new Error('insert expects a string');
    }
    if (str === '') {
      return this;
    }
    this.targetLength += str.length;
    const { ops } = this;
    if (TextOperation.isInsert(ops[ops.length - 1])) {
      // Merge insert op.
      ops[ops.length - 1] += str;
    } else if (TextOperation.isDelete(ops[ops.length - 1])) {
      // It doesn't matter when an operation is applied whether the operation
      // is delete(3), insert("something") or insert("something"), delete(3).
      // Here we enforce that in this case, the insert op always comes first.
      // This makes all operations that have the same effect when applied to
      // a document of the right length equal in respect to the `equals` method.
      // -------------------------------------------
      // 当操作被应用时，无论是 delete(3), insert("something") 或者 insert("something"), delete(3) 都无关紧要。
      // 在这种情况下，我们强制使插入操作在最前面。
      // 这会使对于通过 `equals` 判定长度相等的文档，所有操作均有相同的效果
      if (TextOperation.isInsert(ops[ops.length - 2])) {
        ops[ops.length - 2] += str;
      } else {
        ops[ops.length] = ops[ops.length - 1];
        ops[ops.length - 2] = str;
      }
    } else {
      ops.push(str);
    }
    return this;
  }

  // Delete a string at the current position.
  // -------------------------------------------
  // 在当前位置删除字符串
  delete(n: number | string) {
    if (typeof n === 'string') {
      n = n.length;
    }
    if (typeof n !== 'number') {
      throw new Error('delete expects an integer or a string');
    }
    if (n === 0) {
      return this;
    }
    if (n > 0) {
      n = -n;
    }
    this.baseLength -= n;
    let lastOp = this.ops[this.ops.length - 1];
    if (TextOperation.isDelete(lastOp)) {
      lastOp += n;
      this.ops[this.ops.length - 1] = lastOp;
    } else {
      this.ops.push(n);
    }
    return this;
  }

  // Tests whether this operation has no effect.
  // -------------------------------------------
  // 测试操作是否无副作用
  isNoop() {
    return this.ops.length === 0 || (this.ops.length === 1 && isRetain(this.ops[0]));
  }

  // Pretty printing.
  toString() {
    return this.ops
      .map((op) => {
        if (isRetain(op)) {
          return 'retain ' + op;
        } else if (isInsert(op)) {
          return "insert '" + op + "'";
        } else {
          return 'delete ' + -op;
        }
      })
      .join(', ');
  }

  // Converts operation into a JSON value.
  toJSON() {
    return this.ops;
  }

  // Converts a plain JS object into an operation and validates it.
  static fromJSON(ops: SerializedTextOperation) {
    const o = new TextOperation();
    for (let i = 0, l = ops.length; i < l; i++) {
      const op = ops[i];
      if (isRetain(op)) {
        o.retain(op);
      } else if (isInsert(op)) {
        o.insert(op);
      } else if (isDelete(op)) {
        o.delete(op);
      } else {
        throw new Error('unknown operation: ' + JSON.stringify(op));
      }
    }
    return o;
  }

  // Apply an operation to a string, returning a new string. Throws an error if
  // there's a mismatch between the input string and the operation.
  // -------------------------------------------
  // 将操作应用到字符串，返回一个新的字符串。
  // 如果输入的字符串和操作之间不匹配，将抛出错误。
  apply(str: string) {
    const operation = this;
    if (str.length !== operation.baseLength) {
      throw new Error("The operation's base length must be equal to the string's length.");
    }
    const newStr: string[] = [];
    let j = 0;
    let strIndex = 0;
    const { ops } = this;
    for (let i = 0, l = ops.length; i < l; i++) {
      const op = ops[i];
      if (isRetain(op)) {
        if (strIndex + op > str.length) {
          throw new Error("Operation can't retain more characters than are left in the string.");
        }
        // Copy skipped part of the old string.
        newStr[j++] = str.slice(strIndex, strIndex + op);
        strIndex += op;
      } else if (isInsert(op)) {
        // Insert string.
        newStr[j++] = op;
      } else {
        // delete op
        strIndex -= op;
      }
    }
    if (strIndex !== str.length) {
      throw new Error("The operation didn't operate on the whole string.");
    }
    return newStr.join('');
  }

  // Computes the inverse of an operation. The inverse of an operation is the
  // operation that reverts the effects of the operation, e.g. when you have an
  // operation 'insert("hello "); skip(6);' then the inverse is 'delete("hello ");
  // skip(6);'. The inverse should be used for implementing undo.
  // -------------------------------------------
  // 计算逆操作。
  // 逆操作是指还原操作影响的操作，例如：
  // 当执行 insert("hello ");skip(6);“，逆操作是 ”delete("hello ");skip(6);“。
  // 逆操作应用于撤销
  invert(str: string) {
    let strIndex = 0;
    const inverse = new TextOperation();
    const { ops } = this;
    for (let i = 0, l = ops.length; i < l; i++) {
      const op = ops[i];
      if (isRetain(op)) {
        inverse.retain(op);
        strIndex += op;
      } else if (isInsert(op)) {
        inverse['delete'](op.length);
      } else {
        // delete op
        inverse.insert(str.slice(strIndex, strIndex - op));
        strIndex -= op;
      }
    }
    return inverse;
  }

  // Compose merges two consecutive operations into one operation, that
  // preserves the changes of both. Or, in other words, for each input string S
  // and a pair of consecutive operations A and B,
  // apply(apply(S, A), B) = apply(S, compose(A, B)) must hold.
  // -------------------------------------------
  // Compose 合并两个连续的操作为一个操作，即
  // 保留两者的更改。或者，换句话说，对于每个输入的字符串 S
  // 和一对连续的操作 A 和 B，
  // 必须满足 apply(apply(S, A), B) = apply(S, compose(A, B))
  compose(operation2: TextOperation) {
    const operation1 = this;
    if (operation1.targetLength !== operation2.baseLength) {
      throw new Error(
        'The base length of the second operation has to be the target length of the first operation'
      );
    }

    const operation = new TextOperation(); // the combined operation
    const { ops: ops1 } = operation1;
    const { ops: ops2 } = operation2; // for fast access

    let i1 = 0;
    let i2 = 0; // current index into ops1 respectively ops2
    let op1 = ops1[i1++];
    let op2 = ops2[i2++]; // current ops
    while (true) {
      // Dispatch on the type of op1 and op2
      if (typeof op1 === 'undefined' && typeof op2 === 'undefined') {
        // end condition: both ops1 and ops2 have been processed
        break;
      }

      if (isDelete(op1)) {
        operation['delete'](op1);
        op1 = ops1[i1++];
        continue;
      }
      if (isInsert(op2)) {
        operation.insert(op2);
        op2 = ops2[i2++];
        continue;
      }

      if (typeof op1 === 'undefined') {
        throw new Error('Cannot compose operations: first operation is too short.');
      }
      if (typeof op2 === 'undefined') {
        throw new Error('Cannot compose operations: first operation is too long.');
      }

      if (isRetain(op1) && isRetain(op2)) {
        if (op1 > op2) {
          operation.retain(op2);
          op1 = op1 - op2;
          op2 = ops2[i2++];
        } else if (op1 === op2) {
          operation.retain(op1);
          op1 = ops1[i1++];
          op2 = ops2[i2++];
        } else {
          operation.retain(op1);
          op2 = op2 - op1;
          op1 = ops1[i1++];
        }
      } else if (isInsert(op1) && isDelete(op2)) {
        if (op1.length > -op2) {
          op1 = op1.slice(-op2);
          op2 = ops2[i2++];
        } else if (op1.length === -op2) {
          op1 = ops1[i1++];
          op2 = ops2[i2++];
        } else {
          op2 = op2 + op1.length;
          op1 = ops1[i1++];
        }
      } else if (isInsert(op1) && isRetain(op2)) {
        if (op1.length > op2) {
          operation.insert(op1.slice(0, op2));
          op1 = op1.slice(op2);
          op2 = ops2[i2++];
        } else if (op1.length === op2) {
          operation.insert(op1);
          op1 = ops1[i1++];
          op2 = ops2[i2++];
        } else {
          operation.insert(op1);
          op2 = op2 - op1.length;
          op1 = ops1[i1++];
        }
      } else if (isRetain(op1) && isDelete(op2)) {
        if (op1 > -op2) {
          operation['delete'](op2);
          op1 = op1 + op2;
          op2 = ops2[i2++];
        } else if (op1 === -op2) {
          operation['delete'](op2);
          op1 = ops1[i1++];
          op2 = ops2[i2++];
        } else {
          operation['delete'](op1);
          op2 = op2 + op1;
          op1 = ops1[i1++];
        }
      } else {
        throw new Error(
          "This shouldn't happen: op1: " + JSON.stringify(op1) + ', op2: ' + JSON.stringify(op2)
        );
      }
    }
    return operation;
  }

  // When you use ctrl-z to undo your latest changes, you expect the program not
  // to undo every single keystroke but to undo your last sentence you wrote at
  // a stretch or the deletion you did by holding the backspace key down. This
  // This can be implemented by composing operations on the undo stack. This
  // method can help decide whether two operations should be composed. It
  // returns true if the operations are consecutive insert operations or both
  // operations delete text at the same position. You may want to include other
  // factors like the time since the last change in your decision.
  // -------------------------------------------
  // 当你用 ctrl-z 来撤销最新更改时，你希望程序不会撤销每一次按键而是撤销你最后写的一句话
  // 或者撤销你通过长按 backspace 键的删除操作。
  // 这个可以通过组合撤销堆栈上的操作来实现。
  // 这个方法可以帮助决定是否两个操作可以被组合。
  // 如果是连续的插入操作或两个操作都是删除同一个位置的文本，则返回 true。
  // 你可能需要考虑其它因素，例如上一个更改的事件
  shouldBeComposedWith(other: TextOperation) {
    if (this.isNoop() || other.isNoop()) {
      return true;
    }

    const startA = getStartIndex(this);
    const startB = getStartIndex(other);
    const simpleA = getSimpleOp(this);
    const simpleB = getSimpleOp(other);
    if (!simpleA || !simpleB) {
      return false;
    }

    if (isInsert(simpleA) && isInsert(simpleB)) {
      return startA + simpleA.length === startB;
    }

    if (isDelete(simpleA) && isDelete(simpleB)) {
      // there are two possibilities to delete: with backspace and with the
      // delete key.
      return startB - simpleB === startA || startA === startB;
    }

    return false;
  }

  // Decides whether two operations should be composed with each other
  // if they were inverted, that is
  // `shouldBeComposedWith(a, b) = shouldBeComposedWithInverted(b^{-1}, a^{-1})`.
  // -------------------------------------------
  // 决定是否两个逆操作应该被组合，即
  // `shouldBeComposedWith(a, b) = shouldBeComposedWithInverted(b^{-1}, a^{-1})`。
  shouldBeComposedWithInverted(other: TextOperation) {
    if (this.isNoop() || other.isNoop()) {
      return true;
    }

    const startA = getStartIndex(this);
    const startB = getStartIndex(other);
    const simpleA = getSimpleOp(this);
    const simpleB = getSimpleOp(other);
    if (!simpleA || !simpleB) {
      return false;
    }

    if (isInsert(simpleA) && isInsert(simpleB)) {
      return startA + simpleA.length === startB || startA === startB;
    }

    if (isDelete(simpleA) && isDelete(simpleB)) {
      return startB - simpleB === startA;
    }

    return false;
  }

  // Transform takes two operations A and B that happened concurrently and
  // produces two operations A' and B' (in an array) such that
  // `apply(apply(S, A), B') = apply(apply(S, B), A')`. This function is the
  // heart of OT.
  // -------------------------------------------
  // Transform 取同时发生的两个操作 A 和 B 来产生两个操作 A' 和 B' （在一个数组里），即
  // `apply(apply(S, A), B') = apply(apply(S, B), A')`
  // 该函数是 OT 的核心
  static transform(operation1: TextOperation, operation2: TextOperation) {
    if (operation1.baseLength !== operation2.baseLength) {
      throw new Error('Both operations have to have the same base length');
    }

    const operation1prime = new TextOperation();
    const operation2prime = new TextOperation();
    const { ops: ops1 } = operation1;
    const { ops: ops2 } = operation2;
    let i1 = 0;
    let i2 = 0;
    let op1 = ops1[i1++];
    let op2 = ops2[i2++];
    while (true) {
      // At every iteration of the loop, the imaginary cursor that both
      // operation1 and operation2 have that operates on the input string must
      // have the same position in the input string.
      // -------------------------------------------
      // 在每次循环迭代中，operation1 和 operation2 的假想光标对输入字符串的操作必须在相同的位置

      if (typeof op1 === 'undefined' && typeof op2 === 'undefined') {
        // end condition: both ops1 and ops2 have been processed
        break;
      }

      // next two cases: one or both ops are insert ops
      // => insert the string in the corresponding prime operation, skip it in
      // the other one. If both op1 and op2 are insert ops, prefer op1.
      if (isInsert(op1)) {
        operation1prime.insert(op1);
        operation2prime.retain(op1.length);
        op1 = ops1[i1++];
        continue;
      }
      if (isInsert(op2)) {
        operation1prime.retain(op2.length);
        operation2prime.insert(op2);
        op2 = ops2[i2++];
        continue;
      }

      if (typeof op1 === 'undefined') {
        throw new Error('Cannot compose operations: first operation is too short.');
      }
      if (typeof op2 === 'undefined') {
        throw new Error('Cannot compose operations: first operation is too long.');
      }

      let minl: number;
      if (isRetain(op1) && isRetain(op2)) {
        // Simple case: retain/retain
        if (op1 > op2) {
          minl = op2;
          op1 = op1 - op2;
          op2 = ops2[i2++];
        } else if (op1 === op2) {
          minl = op2;
          op1 = ops1[i1++];
          op2 = ops2[i2++];
        } else {
          minl = op1;
          op2 = op2 - op1;
          op1 = ops1[i1++];
        }
        operation1prime.retain(minl);
        operation2prime.retain(minl);
      } else if (isDelete(op1) && isDelete(op2)) {
        // Both operations delete the same string at the same position. We don't
        // need to produce any operations, we just skip over the delete ops and
        // handle the case that one operation deletes more than the other.
        if (-op1 > -op2) {
          op1 = op1 - op2;
          op2 = ops2[i2++];
        } else if (op1 === op2) {
          op1 = ops1[i1++];
          op2 = ops2[i2++];
        } else {
          op2 = op2 - op1;
          op1 = ops1[i1++];
        }
        // next two cases: delete/retain and retain/delete
      } else if (isDelete(op1) && isRetain(op2)) {
        if (-op1 > op2) {
          minl = op2;
          op1 = op1 + op2;
          op2 = ops2[i2++];
        } else if (-op1 === op2) {
          minl = op2;
          op1 = ops1[i1++];
          op2 = ops2[i2++];
        } else {
          minl = -op1;
          op2 = op2 + op1;
          op1 = ops1[i1++];
        }
        operation1prime['delete'](minl);
      } else if (isRetain(op1) && isDelete(op2)) {
        if (op1 > -op2) {
          minl = -op2;
          op1 = op1 + op2;
          op2 = ops2[i2++];
        } else if (op1 === -op2) {
          minl = op1;
          op1 = ops1[i1++];
          op2 = ops2[i2++];
        } else {
          minl = op1;
          op2 = op2 + op1;
          op1 = ops1[i1++];
        }
        operation2prime['delete'](minl);
      } else {
        throw new Error("The two operations aren't compatible");
      }
    }

    return [operation1prime, operation2prime];
  }
}

function getSimpleOp(operation: TextOperation) {
  const { ops } = operation;
  const { isRetain } = TextOperation;
  switch (ops.length) {
    case 1:
      return ops[0];
    case 2:
      return isRetain(ops[0]) ? ops[1] : isRetain(ops[1]) ? ops[0] : null;
    case 3:
      if (isRetain(ops[0]) && isRetain(ops[2])) {
        return ops[1];
      }
  }
  return null;
}

function getStartIndex(operation) {
  if (TextOperation.isRetain(operation.ops[0])) {
    return operation.ops[0];
  }
  return 0;
}
