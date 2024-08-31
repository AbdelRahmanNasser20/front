import React from 'react';
import EmailInput from './components/EmailInput';
import TimesheetTable from './components/TimesheetTable';

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
