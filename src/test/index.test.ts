import Observable from ".."

describe("Basic functionality with primitives", () => {
    test("Create and get value", () => {
        const observable = new Observable<number>(5);
        expect(observable.Value).toEqual(5);
    })
    test("Subscribe with initial callback", () => {
        const observable = new Observable<number>(5);
        observable.subscribe(val => { expect(val).toEqual(5) }, { fireOnSubscribe: true })
    })
    test("Mutate with 2 subscribers", () => {
        const observable = new Observable<number>(5);
        observable.subscribe(val => { expect(val).toEqual(10) })
        observable.subscribe(val => { expect(val).not.toEqual(5) })
        observable.mutate((val) => val + 5);
    })
})

describe("Advance features", () => {
    test("Unsubscribe", () => {
        function callback(val: number) {
            //Perform some action with this value

            expect(val).toEqual(5);
        }
        const callbackFn = jest.fn(callback);
        const observable = new Observable<number>(5);
        return observable.subscribe(callbackFn, { fireOnSubscribe: true }).then(sub => {
            observable.unsubscribe(sub);
            observable.mutate(val => val + 5);
            expect(callbackFn).toBeCalledTimes(1);
        });

    })
    test("Async callback", () => {
        function callback(val: number) {
            return new Promise(res => {
                setTimeout(() => {
                    expect(val).toEqual(5);
                    res()
                }, 1000)
            })
        }

        const jestFn = jest.fn(callback);
        const observable = new Observable<number>(5);
        return observable.subscribe(jestFn, {
            await: true,
            fireOnSubscribe: true
        })
    })
})