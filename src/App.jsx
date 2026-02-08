import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "@/pages/Dashboard";
import CustomerPage from "@/pages/CustomerPage";
import DeliveryPage from "@/pages/DeliveryPage";
import WorkflowStagePage from "@/pages/WorkflowStagePage";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors closeButton />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customer/:id" element={<CustomerPage />} />
          <Route path="/delivery/:id" element={<DeliveryPage />} />
          <Route path="/delivery/:id/stage/:stageId" element={<WorkflowStagePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
