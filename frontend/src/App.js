import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Impact from './views/Impact';
import PartnerHub from './views/PartnerHub';
import GetInvolved from './views/GetInvolved';
import Onboarding from './views/Onboarding';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/partner-hub" element={<PartnerHub />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;