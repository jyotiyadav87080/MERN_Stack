import { useState } from "react";

function UseState() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>useState Hook</h1>

      <h2>Count: {count}</h2>

      <button onClick={() => setCount(count + 10)}>
        Increment
      </button>

      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>

      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default UseState;