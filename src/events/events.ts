import { SubscribeType, Publisher, Event } from 'kubets';

export { Event };

export const Events =
  process.env.ENABLE_KUBEMQ === 'true'
    ? new Publisher({
        host: process.env.KUBEMQ_HOST || 'localhost',
        port: Number(process.env.KUBEMQ_PORT) || 5000,
        channel: `internal_user_manager`,
        client: `internal_user_manager`,
        type: SubscribeType.Events,
      })
    : null;

export enum EventType {
  USER_CREATED = 1,
  USER_UPDATED = 2,
}

export const makeEvent = (type: EventType, data: any) => {
  const event = new Event();
  event.setBody(Buffer.from(JSON.stringify({ type, data })).toString('base64'));
  return event;
};

export const sendEvent = (type: EventType, data: any) => {
  if (Events) Events.send(makeEvent(type, data));
};
