# react-solid-signals
Using Signals in react to boost performance. 
```
npm i react-solid-signals
```

## Problem with react useState
```
export default function App() {
  const [count, setCounter] = useState(0);

  return (
    <div className="App">
      <h1>Hello useState </h1>
      <h3>Counter is {count}</h3>
      <button
        onClick={() => {
          setCounter((prev) => prev + 1);
        }}
      >
        Increment Counter
      </button>
      <SomeHeavyComponent />
    </div>
  );
}
```
The component `SomeHeavyComponent` is going to get re-rendered whenenver the `count` is changed. This is a big problem, that we solve on a daily basis when we consider performance as our key metric. Careful state management with many clever tricks will solve many such performance problems. But the question is what if we can avoid this problem altogether. What if we can avoid this problem without using a different JS framework like <a href="https://www.solidjs.com/">Solid JS</a> and still uisng the rich ecosystem of React JS.

Try it on codesanbox https://codesandbox.io/s/compassionate-water-jkzfib?file=/src/App.tsx

## useSignal
Usage
```
import { useSignal }  from 'react-solid-signals';

const SomeComponent = ()=>{
  const [counter, setCounter] = useSignal(0);
  
  return <>
    <div>
      Counter is {counter.jsx()}
      <br></br>
      <button onClick={()=>{
        setCounter((prev)=>prev+1)
      }}>Increment Counter</button>
    </div>
    //otherComponents 
  </>
}
```

<b>useSignal</b> returns an array, with first element as an object, which contains 2 `signalGetters` `{ value, jsx }`. Whenever you want to access the signal value inside a jsx, use `counter.jsx()` otherwise use `counter.value()`.

The second element of the returned array is a setter which is identical to the `setState` React dispatch setter we use with `useState`.

Now even when the counter value is changed continously when the user clicks on the button, none of components in the jsx tree is re-rendered, only the part `{counter.jsx}` is re-rendered.

## useEffectSignal
Standard React `useEffect` wont work with signals,to perform side effects whenever signals change, we need `useEffectSignal`.
Usage
```
import { useEffectSignal }  from 'react-solid-signals';

useEffectSignal(()=>{
  //this function will be executed whenever its dependency is changed
  console.log('counter',counter.value())
},[counter])

```

`useEffectSignal` takes a function as the first argument and a dependency array as the second argument. <b> Dependency array must be an array of signals only</b>.


## useMemoSignal
Usage
```
import { useMemoSignal }  from 'react-solid-signals';

const memosizedData = useMemoSignal(()=>{

  console.log('counter',counter.value())
  return counter.value() * 4;
},[counter])

```

`memosizedData` is also a signal and have the same two getters `{ jsx, value }`. The memosizedData signal will be updated only when the counter signal is changed. The hook also accepts a 3rd argument as `defaultValue`, if provided then the defaultValue will be used to initilize the signal.

## Show 
In React while using state we use conditional rendering like the below
```
const SomeComponent = () => {
  const [counter, setCounter] = useState(0)
  
  return <div>
    {counter ===2 ? 
      <div>Counter is 2</div>:
      <div> Counter is not 2</div>
      }
  </div>
}
```
This type of conditional rendering will not work with signals.
To achieve the same functionality using signals, we must use `Show` component provided by the library as follows:

```
import { Show, useSignal } from 'react-solid-signals';

const SomeComponent = () => {
  const [counter, setCounter] = useSignal(0)
  
  return <div>
    <Show jsxCallback={()=>{
      return count.value() === 2 ? 'Counter is 2' : 'Counter is not 2';
    }} deps={[counter]}/>
  </div>
}
```
A `jsxCallback` is a function which returns an JSX element and `deps` is an array of signals. JSX callback is again re-evaluated whenever the signals given in the dependency array is changed

## Use signals in redux
You can use react-redux `useSelector` hook, but it will again cause re-render of the components. Create the below redux hook to select signals from redux store. You must provide your store instance in `signalStoreInitializer`.
```
import { signalStoreInitializer } from "react-solid-signals";
import { store } from "./store";

export const useSignalSelector = signalStoreInitializer(store);

```

If you are using typescript then use the below hook.
```
import { store } from "./store";
import {
  TypedUseSelectorSignalHook,
  signalStoreInitializer,
} from "react-solid-signals";

export type RootState = ReturnType<typeof store.getState>

export const useSignalAppSelector: TypedUseSelectorSignalHook<RootState> =
  signalStoreInitializer(store);

```
Usage of `useSignalAppSelector`/ `useSignalSelector` in a component
```
const SomeComponent = ()=>{
  const count = useSignalAppSelector((state)=>state.main.count,0)

  return <>
    {count.jx()}
  </>
}
```
Currently you must provide a default value in the hook as the second parameter. This default value will be used unless the signal is not updated with the correct value from the store.


### There are no limitations of the getter singal.value(), all the methods, properties is possible on the data is also supported by this getter.

## Current Limitations of signal.jsx() getter.
1. Join operation on signal.jsx() is not supported (if the data is of type Array)
2. Filter operation on signal.jsx() is not supported 
3. Nested arrays are not suppported
4. null/undefined not supported

### Workaround to handle nested arrays
```
import { Show, useSignal } from 'react-solid-signals';

const SomeComponent = ()=>{
  const [complexNestedArray, setComplexNestedArray] = useSignal([ [1, 2, 3] ]);
  
  return <>
    <h2>Workaround for Nested Arrays</h2>
    <Show jsxCallback={()=>{
      const [first] = complexNestedArray.value();
      return <>
        {first.map((element)=>{
          return <div>
            Element of nested array {element}
          </div>
        })}
      </>
    }} deps={[complexNestedArray]}/>
  </>

}
```
#### I am constantly working on this limitations. Please feel free to create a PR or an issue if needed. 




