export type EventType =
  | "INITIAL-STATE"
  | "ADD-REDUCER"
  | "ADD-SIDE-EFFECT"
  | "DISPATCH-ACTION";

export type HookCallBack = (eventType: EventType, data: unknown) => void;

declare global {
  interface Window {
    __A4_STORE_HOOK__: HookCallBack;
  }
}

export const dispatchStoreEvent = (eventType: EventType, data: unknown) => {
  if (window.__A4_STORE_HOOK__) {
    window.__A4_STORE_HOOK__(eventType, data);
  }
};

export const enableConsoleLog = () => {
  const original = window.__A4_STORE_HOOK__;

  window.__A4_STORE_HOOK__ = (eventType: EventType, data: any) => {
    switch (eventType) {
      case 'DISPATCH-ACTION':
        console.log(`__A4_STORE_HOOK__  ${eventType}   ${data.type}`, data);
        break;
      default:
        console.log(`__A4_STORE_HOOK__  ${eventType}`, data);
    }
    if (original) {
      original(eventType, data);
    }
  };
};
