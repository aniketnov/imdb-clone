import React from "react";
import ReactDOM from "react-dom/client";
// import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <App />

  // </React.StrictMode>
);

// function Text() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <>
//       <StarRating color="blue" maxrating={10} onsetRating={setMovieRating} />
//       <p>this movie rated {movieRating} stars</p>
//     </>
//   );
// }
