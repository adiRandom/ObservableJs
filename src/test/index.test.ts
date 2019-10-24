import Observable from ".."

describe("Basic functionality with primitives", () => {
    test("Create and get value", () => {
        const observable = new Observable<number>(5);
        expect(observable.Value).toEqual(5);
    })
    test("Subscribe with initial callback", () => {
        const observable = new Observable<number>(5);
        observable.subscribe(val => expect(val).toEqual(5), true)
    })
    test("Mutate with 2 subscribers", () => {
        const observable = new Observable<number>(5);
        observable.subscribe(val => expect(val).toEqual(10))
        observable.subscribe(val => expect(val).not.toEqual(5))
        observable.mutate((val) => val + 5);
    })
})

describe("Advance features", () => {
    test("Unsubscribe", () => {
        function callback(val: number) {
            return val;
        }
        const callbackFn = jest.fn(callback);
        const observable = new Observable<number>(5);
        const subscription = observable.subscribe(callbackFn, true);
        observable.unsubscribe(subscription.id);
        observable.mutate(val => val + 5);
        expect(callbackFn).toBeCalledTimes(1);
    })
})