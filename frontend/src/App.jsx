import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import SchedulerLogs from './pages/SchedulerLogs';

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/scheduler-logs" element={<SchedulerLogs />} />
            </Routes>
          </main>
          <Toast />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
