import SortedSet = require("collections/sorted-set");


function compareTwoSubscriptionsPriorities<T>(a: Subscription<T>, b: Subscription<T>): 1 | 0 | -1 {
    const aPriority = a.subscriptionOptions.priority || 0;
    const bPriority = b.subscriptionOptions.priority || 0;

    //If the priority value of the a Sub is is greater than the priority valuo of the b Sub
    //Then the a Sub should be executed first

    if (aPriority === bPriority)
        return a.creationTime>b.creationTime?-1:1
    else if (aPriority > bPriority)
        return -1;
    return 1;
}



export default class Observable<T>{
    private value: T;
    private subscribers: SortedSet<Subscription<T>> = new SortedSet<Subscription<T>>([], (a, b) => a.id === b.id, compareTwoSubscriptionsPriorities)

    get Subscribers(){
        return this.subscribers
    }

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    get Value() { return this.value };

    public async subscribe(handler: SubscriberHandler<T>, subscriptionOptions: SubscriptionOptions = DEFAULT_SUBSCRIPTION_OPTIONS) {
        const sub: Subscription<T> = {
            subscriptionOptions,
            handler: handler,
            id: makeid(32),
            creationTime:Date.now()
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


    /**
     * Pass in a operation and mutate the current value
     * @param op The operation to be used to mutate the current value
     */
    public mutate(op: Operation<T>) {
        const res = op(this.value);
        this.value = res;
        this.notify();
    }

    //Execute all subs handlers
    private notify() {
        Promise.all(this.subscribers.forEach(async (val: Subscription<T>) => await this.execute(val)))
    }
}

export type SubscriberHandler<T> = (value: T) => void | Promise<any>;
export type Operation<T> = (value: T) => T
export interface SubscriptionOptions {
    /**
     * Whether or not the hanlder should be called after the subscription
     */
    readonly fireOnSubscribe?: boolean,
    /**
     * If this handler returns a promise, whether or not it should be awaited
     */
    readonly await?: boolean,
    /**
     * A value that determins the order in which the handlers should be executed
     * Greater priority means this handler will be executed sooner
     */
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
    readonly id: string
    readonly handler: SubscriberHandler<T>
    readonly subscriptionOptions: SubscriptionOptions,
    readonly creationTime:number
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
