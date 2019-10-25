import SortedSet = require("collections/sorted-set");


function compareTwoSubscriptionsPriorities<T>(a: Subscription<T>, b: Subscription<T>): 1 | 0 | -1 {
    const aPriority = a.subscriptionOptions.priority || 0;
    const bPriority = b.subscriptionOptions.priority || 0;
    if (aPriority === bPriority)
        return 0;
    else if (aPriority > bPriority)
        return -1;
    return 1;
}

export default class Observable<T>{
    private value: T;
    private subscribers: SortedSet<Subscription<T>> = new SortedSet<Subscription<T>>([], (a, b) => a.id === b.id, compareTwoSubscriptionsPriorities)

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    get Value() { return this.value };

    public async subscribe(handler: SubscriberHandler<T>, subscriptionOptions: SubscriptionOptions = DEFAULT_SUBSCRIPTION_OPTIONS) {
        const sub: Subscription<T> = {
            subscriptionOptions,
            handler: handler,
            id: makeid(32),
        }
        this.subscribers.push(sub);
        if (subscriptionOptions.fireOnSubscribe)
            this.execute(sub);
        return sub
    }

    public unsubscribe(sub: Subscription<T>) {
        this.subscribers.delete(sub);
    }

    private async execute(subscription: Subscription<T>) {
        const res = subscription.handler(this.value);
        if (subscription.subscriptionOptions.await) {
            if (isPromise(res))
                await res;
        }
    }

    public async mutate(op: Operation<T>) {
        const res = op(this.value);
        this.value = res;
        this.notify();
    }

    private async notify() {
        this.subscribers.forEach(async (val: Subscription<T>) => this.execute(val))
    }
}

export type SubscriberHandler<T> = (value: T) => void | Promise<any>;
export type Operation<T> = (value: T) => T
export interface SubscriptionOptions {
    readonly fireOnSubscribe?: boolean,
    readonly await?: boolean,
    readonly priority?: number
}

const DEFAULT_SUBSCRIPTION_OPTIONS: SubscriptionOptions = {
    await: false,
    fireOnSubscribe: false,
    priority: 0
}


function isPromise(val: any): val is Promise<any> {
    return val.then;
}

type Subscription<T> = {
    readonly id: string,
    readonly handler: SubscriberHandler<T>
    readonly subscriptionOptions: SubscriptionOptions
}

function makeid(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
