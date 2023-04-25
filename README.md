# react-solid-signals
Using Signals in react to boost performance. 


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

## Show - If
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
    <Show when={()=>{
      return count.value() === 2;
    }} deps=[counter]>
      <div>
        Counter is 2
      </div>
    </Show>
  </div>
}
```
Above `Show` component will show it's children only when the `when` function returns `true`.
Show component needs 3 props to function.
1. `deps` : A dependency array of signals, when condition will be re-calculated whenever a signal in the dependency array changes.
2. `when` : a function whose return type is boolean
3. `children` : A JSX Element should which will be displayed when the condition is true.

## Show - If - else
We can also implement `if-else` logic using the `Show` component as follows:

```
import { Show, useSignal } from 'react-solid-signals';

const SomeComponent = () => {
  const [counter, setCounter] = useSignal(0)
  
  return <div>
    <Show when={()=>{
      return count.value() === 2;
    }} deps=[counter] 
    defaultComponent={<div>Counter is not 2</div>}
    >
      <div>
        Counter is 2
      </div>
    </Show>
  </div>
}
```
If the `defaultComponent` prop is provided and if the `when` condition is false, the defaultComponent will be displayed.


## Show - If - elseIf - else
We can also implement `if-elseIf-else` logic using the `Show` component as follows:

```
import { Show, useSignal } from 'react-solid-signals';

const SomeComponent = () => {
  const [counter, setCounter] = useSignal(0)
  
  return <div>
    <Show when={()=>{
      return count.value() === 2;
    }} deps=[counter] 
    defaultComponent={<div>Counter is not 2</div>}
    elseIfs={ [ [() => counter.value()===3, <div>Counter is 3</div>] ] }
    >
      <div>
        Counter is 2
      </div>
    </Show>
  </div>
}
```
`elseIfs` prop is an array of sub-arrays. The sub-arrays will have exactly 2 elements and the following type
```
type ShowElseIfs = Array<[() => boolean, JSX.Element]>;
```
The first element in the array is a function whose return type is boolean, the second element is a JSX element.
If any of the first encountered subArray condition is true then the jsx element corresponding to that condition will be displayed.



