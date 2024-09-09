import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerChangeAddressEvent from "./change-customer-address";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2.handler";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";

describe("Domain events tests", () => {
  it("should notify all customer event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const FirstHandler = new EnviaConsoleLog1Handler();
    const SecondHandler = new EnviaConsoleLog2Handler();
    const spyEventHandler1 = jest.spyOn(FirstHandler, "handle");
    const spyEventHandler2 = jest.spyOn(SecondHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", FirstHandler);
    eventDispatcher.register("CustomerCreatedEvent", SecondHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(FirstHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(SecondHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer 1",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should notify when a customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();

    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]
    ).toMatchObject(eventHandler);

    const street = "Rua das nascentes, 17"

    const customerChangeAddressEvent = new CustomerChangeAddressEvent({
      id: "1",
      name: "Customer",
      address: {
        street: street
      }
    });

    eventDispatcher.notify(customerChangeAddressEvent);

    expect(spyEventHandler).toHaveBeenCalled();
    expect(eventHandler.address).toBe(street)
  });
});
