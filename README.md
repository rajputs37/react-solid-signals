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
