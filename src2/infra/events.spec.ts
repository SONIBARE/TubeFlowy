import * as obs from "./observable";

it("having an event", () => {
  const events = obs.source<number>();

  let binding1 = obs.observer(events);
  let binding2 = obs.observer(events);

  expect(binding1.value).toBe(undefined);
  expect(binding2.value).toBe(undefined);

  events.change(2);

  expect(binding1.value).toBe(2);
  expect(binding2.value).toBe(2);

  binding1.unbind();
  events.change(3);

  expect(binding1.value).toBe(2);
  expect(binding2.value).toBe(3);

  const { subject, subscription } = obs.map(events, (v) =>
    v % 2 === 0 ? "even" : "odd"
  );

  const labelObserver = obs.observer(subject);
  expect(labelObserver.value).toBe("odd");

  events.change(4);
  expect(binding2.value).toBe(4);
  expect(labelObserver.value).toBe("even");

  subscription.unbind();
  events.change(5);
  expect(binding2.value).toBe(5);
  expect(labelObserver.value).toBe("even");
});
