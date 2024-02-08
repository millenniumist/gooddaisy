import React, { useEffect, useState } from "react";

const Quote: React.FC = () => {
  const [i, setQuote] = useState("");

  // Step 2: Define the useEffect
  useEffect(() => {
    // Step 3: Inside the effect, fetch the data from an API
    fetch("https://api.quotable.io/random")
      .then((response) => response.json())
      .then((data) => {
        // Step 4: Update the state with the fetched quote
        setQuote(data.content);
      });
  }, []); // Step 5: Dependency array is empty, so this effect runs once on component mount

  return (
    <div>
      <h1>Random Quote:</h1>
      <p>
        {i}
      </p>
    </div>
  );
};

export default Quote