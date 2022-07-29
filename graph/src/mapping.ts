import { IdentityEvent, MessageEvent } from "../generated/Echo/Echo";
import { Identity, Message } from "../generated/schema";

export function handleIdentityEvent(event: IdentityEvent): void {
  const entity = new Identity(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  entity.communicationAddress = event.params._communicationAddress;
  entity.timestamp = event.block.timestamp;
  entity.from = event.transaction.from;
  entity.save();
}

export function handleMessageEvent(event: MessageEvent): void {
  const entity = new Message(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  entity.receiver = event.params._receiver;
  entity.message = event.params._message;
  entity.timestamp = event.block.timestamp;
  entity.from = event.transaction.from;
  entity.save();
}