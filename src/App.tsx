import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ImportCandidats from './pages/ImportCandidats';
import GenerateConvocations from './pages/GenerateConvocations';
import SendEmail from './pages/SendEmail';

// Pages d'administration
import AdminVilles from './pages/admin/AdminVilles';
import AdminAdresses from './pages/admin/AdminAdresses';
import AdminCertifications from './pages/admin/AdminCertifications';
import AdminTypesExamen from './pages/admin/AdminTypesExamen';
import AdminDurees from './pages/admin/AdminDurees';
import AdminClasses from './pages/admin/AdminClasses';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="import" element={<ImportCandidats />} />
            <Route path="generate" element={<GenerateConvocations />} />
            <Route path="email" element={<SendEmail />} />
            
            {/* Routes d'administration */}
            <Route path="admin/villes" element={<AdminVilles />} />
            <Route path="admin/adresses" element={<AdminAdresses />} />
            <Route path="admin/certifications" element={<AdminCertifications />} />
            <Route path="admin/types-examen" element={<AdminTypesExamen />} />
            <Route path="admin/durees" element={<AdminDurees />} />
            <Route path="admin/classes" element={<AdminClasses />} />
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
};

export default App;