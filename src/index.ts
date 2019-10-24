export default class Observable<T>{
    private value: T;
    private subscribers: Subscription<T>[] = [];

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    get Value() { return this.value };

    public subscribe(handler: SubscriberHandler<T>, fireForCurrent?: boolean) {
        const sub: Subscription<T> = {
            handler: handler,
            id: makeid(32)
        }
        this.subscribers.push(sub);
        if (fireForCurrent)
            handler(this.value)
        return sub
    }

    public unsubscribe(id: string) {
        this.subscribers = this.subscribers.filter(val => val.id !== id)
    }

    public async mutate(op: Operation<T>) {
        const res = op(this.value);
        this.value = res;
        this.notify();
    }

    private async notify() {
        this.subscribers.forEach(async val => val.handler(this.value))
    }
}

export type SubscriberHandler<T> = (value: T) => void;
export type Operation<T> = (value: T) => T

function isPromise(val: any): val is Promise<any> {
    return val.then;
}

type Subscription<T> = {
    id: string,
    handler: SubscriberHandler<T>
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
