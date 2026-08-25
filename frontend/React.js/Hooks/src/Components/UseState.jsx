import { UseState } from "react";

function UseState() {
  const [count, setCount] = UseState(0);
  
  console.log("Component rendered. count is:", count);
  return (
    <div>
        <h2>UseState Example</h2>
      <p>Count. {count}</p>
      <button onClick={() => setCount(count + 10)}>
        Increase Count
      </button>
    </div>
  );
}

export default UseState;
