# ObservableJs
Observables for Javascript and Typescript

A library that creates a Observable class that let's you subscribe to a value and get notified when that value changes


# Usage


## *Create an Observable*

    const  observable  =  new  Observable<T>(initalValue);

`T` - The type of the value stored in the observable




## *Change the value of an Observable*

    const  observable  =  new  Observable<T>(initalValue);
    observable.mutate(operation);

`operation:(val \<T>)=>T`  - An operation to be applied on the current value in the Observable. `Val` is the current value in that Observable. An operation should return a new value for that observable


## *Subscribing to an Observable*


    const  observable  =  new  Observable<T>(initalValue);
    observable.subscribe(handler,options?)

`handler : (value:T)=>void | Promise\<any>` - A function that is called whenever a new value (`val`) is being issued by the Observable
`options`:

 - `await`:  boolean (default: false) - Whether or not the result of the handler should be awaited, in case it returns a Promise
 - `fireOnSubscribe` : boolean (default: false) - Whether or not the hanlder should be called after the subscription
 - `Priority` : number (default: 0) - A value that determins the order in which the handlers should be executed. Greater priority means this handler will be executed sooner

