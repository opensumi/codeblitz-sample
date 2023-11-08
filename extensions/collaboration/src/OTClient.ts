import { Blocker, blocker } from './blocker';
import { TextOperation, SerializedTextOperation, Client, synchronized_ } from './ot';
import { log, logError } from './utils';

export type SendOperationResponse =
  | {
      composed_operation: SerializedTextOperation;
      revision: number;
    }
  | {};

export type SendOperation = (revision: number, operation: TextOperation) => Promise<void>;

export type ApplyOperation = (operation: TextOperation) => void;

export class OTClient extends Client {
  /*
    We need to be able to wait for a client to go intro synchronized
    state. The reason is that we want to send a "save" event when the
    client is synchronized
  */
  public awaitSynchronized: Blocker<void> | null;

  private lastAcknowledgedRevision: number = -1;

  onSendOperation: SendOperation;

  onApplyOperation: ApplyOperation;

  constructor(revision: number, onSendOperation: SendOperation, onApplyOperation: ApplyOperation) {
    super(revision);
    this.lastAcknowledgedRevision = revision - 1;
    this.onSendOperation = onSendOperation;
    this.onApplyOperation = onApplyOperation;
  }

  async sendOperation(revision: number, operation: TextOperation) {
    // Whenever we send an operation we enable the blocker
    // that lets us wait for its resolvment when moving back
    // to synchronized state
    if (!this.awaitSynchronized) {
      this.awaitSynchronized = blocker();
    }

    return this.onSendOperation(revision, operation)
      .then((result) => {
        log({
          category: 'ot',
          message: `Acknowledging ${JSON.stringify({
            revision,
            operation,
          })}`,
        });

        // TODO: 看服务端支持情况
        // if (
        //   'revision' in result &&
        //   this.revision !== result.revision &&
        //   result.composed_operation.length
        // ) {
        //   this.resync(
        //     TextOperation.fromJSON(result.composed_operation),
        //     result.revision
        //   );
        // }

        try {
          this.safeServerAck(revision);
        } catch (err) {
          logError(
            new Error(
              `Server Ack ERROR ${JSON.stringify({
                currentRevision: this.revision,
                currentState: this.state.name,
                operation,
              })}`
            )
          );
        }
      })
      .catch((error) => {
        // If an operation errors on the server we will reject
        // the blocker, as an action might be waiting for it to resolve,
        // creating a user friendly error related to trying to save
        // if (this.awaitSynchronized) {
        //   this.awaitSynchronized.reject(error);
        // }

        logError(error);

        // throw error;
      });
  }

  applyOperation(operation: TextOperation) {
    this.onApplyOperation(operation);
  }

  resetAwaitSynchronized() {
    // If we are back in synchronized state we resolve the blocker
    if (this.state === synchronized_ && this.awaitSynchronized) {
      const awaitSynchronized = this.awaitSynchronized;
      this.awaitSynchronized = null;
      awaitSynchronized.resolve();
    }
  }

  safeServerAck(revision: number) {
    // We make sure to not acknowledge the same revision twice
    if (this.lastAcknowledgedRevision < revision) {
      this.lastAcknowledgedRevision = revision;
      super.serverAck();
    }

    this.resetAwaitSynchronized();
  }

  applyClient(operation: TextOperation) {
    log({
      category: 'ot',
      message: `Apply Client ${JSON.stringify({
        currentRevision: this.revision,
        currentState: this.state.name,
        operation,
      })}`,
    });

    super.applyClient(operation);
  }

  applyServer(operation: TextOperation) {
    log({
      category: 'ot',
      message: `Apply Server ${JSON.stringify({
        currentRevision: this.revision,
        currentState: this.state.name,
        operation,
      })}`,
    });

    super.applyServer(operation);
  }

  serverReconnect() {
    super.serverReconnect();
  }

  resync(operation: TextOperation, newRevision: number) {
    this.applyServer(operation);
    this.revision = newRevision;
  }

  reset(revision: number) {
    this.revision = revision;
    this.state = synchronized_;
  }
}
