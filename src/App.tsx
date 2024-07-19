import React, { useState } from 'react';
import EmailInput from './components/EmailInput';

import TimesheetTable from './components/TimesheetTable';
// import Accordion from './components/TimeSheet/Accordion';
// import './App.css';
// import './components/TimeSheet/TimeSheet.css';

const App: React.FC = () => {
  return (
    <div className="App">      
      <h1 style = {{ textAlign: "center"}}>Timesheet Verification</h1>
      <EmailInput />      
      <TimesheetTable/>
    </div>
  );
};

export default App;
