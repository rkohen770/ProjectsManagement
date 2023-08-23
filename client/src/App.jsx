import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api')
      .then((res) => res.text())
      .then(setData);
  }, []);

  return <div>{data}</div>;
}

export default App;
