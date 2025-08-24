import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import useVisitTracker from "./hooks/useVisitTracker";

const App = () => {
  useVisitTracker(); // ✅ Activate visit tracking

  return (
    <div>
      <main>
        <Outlet />
      </main>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
