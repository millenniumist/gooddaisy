import "./App.css";
import AppRouter from './routers/AppRouter';
import { StrictMode } from "react";

function App() {

  return (
    <StrictMode>
      <AppRouter/>
    </StrictMode>
      
  );
}

export default App;
