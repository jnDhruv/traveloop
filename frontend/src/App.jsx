import { BrowserRouter, Routes, Route } from "react-router-dom";

import IntroPage from "./pages/intro/IntroPage";
import { Login } from "./pages/login/Login";
import { Signup } from "./pages/signup/Signup";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<IntroPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;