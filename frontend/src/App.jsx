import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3 md:ml-[4%] transition-all duration-300">
        <Outlet />
      </main>
    </>
  );
};

export default App;
