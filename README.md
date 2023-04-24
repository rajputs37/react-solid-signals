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
The component `SomeHeavyComponent` is going to get re-rendered whenenver the `count` is changed. This is a big problem, that we solve on a daily basis when we consider performance as our key metric. Careful state management with many clever tricks will solve many such performance problems. But the question is what if we can avoid this problem altogether.

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

Now even when the counter value is changed continously when the user clicks on the button, none of components jsx tree is re-rendered, only the part `{counter.jsx}` is re-rendered.

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

`useEffectSignal` takes a function as the first argument and a dependency array as the second argument. <b> Dependency array must be an array of signalsonly</b>.


## useMemoSignal
Usage
```
import { useMemoSignal }  from 'react-solid-signals';

const memosizedData = useMemoSignal(()=>{

  console.log('counter',counter.value())
  return counter.value() * 4;
},[counter])

```

`memosizedData` is also a signal and have the 2 getters `{ jsx, value }`. The memosizedData signal will be updated only when the counter signal is changed.



