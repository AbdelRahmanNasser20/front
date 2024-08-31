import React, { useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';

const formatDate = (dateString: string): string => {  
  // Parse the input date string and convert it to UTC
  const date = new Date(dateString);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", dateString);
    return dateString; // Return the original string if the date is invalid
  }

  // Extract the date parts using the toISOString method
  const isoString = date.toISOString();
  const [year, month, day] = isoString.split('T')[0].split('-');  
  return `${month}/${day}/${year}`;
};

const compareHours = (timesheetHours: { [key: string]: number }, databaseHours: { [key: string]: number }) => {
  // console.log("Comparing hours:", { timesheetHours, databaseHours });

  for (const role in timesheetHours) {
    if (timesheetHours[role] !== databaseHours[role]) {
      // console.log(`Mismatch found for role ${role}: Time Sheet - ${timesheetHours[role]}, Database - ${databaseHours[role] || 0}`);
      return false;
    }
  }
  return true;
};

const ReportAccordion: React.FC<{ report: any }> = ({ report }) => {
  // Deconstruct the report object to extract needed values
  const {
    emailFound,
    databaseHours,
    timesheetHours,
    numberOfDatabaseEntries,
    numberOfTimesheetEntries
  } = report;

  // Compute if entries and hours match
  const entriesMatch = numberOfDatabaseEntries === numberOfTimesheetEntries;
  const hoursMatch = compareHours(timesheetHours, databaseHours);

  // console.log("Passing report as a prop:", report);  

  // useEffect(() => {
  //   if (report) {
  //     console.log("Report is now available:", report);
  //   }
  // }, [report]);

  return (
    emailFound ? (
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ backgroundColor: '#f8f9fa', color: '#495057', fontWeight: 'bold' }}>
            Report Summary
          </Accordion.Header>
          <Accordion.Body style={{ backgroundColor: '#f8f9fa', color: '#495057' }}>
            <>
              <div>
                <strong>Entry Comparison:</strong>{' '}
                {entriesMatch && hoursMatch ? (
                  <span style={{ color: 'green' }}>Match</span>
                ) : (
                  <span style={{ color: 'red' }}>Do Not Match</span>
                )}
              </div>
              <div>
                <strong>Database Entries:</strong> {numberOfDatabaseEntries}
              </div>
              <div>
                <strong>Time Sheet Entries:</strong> {numberOfTimesheetEntries}
              </div>
              <hr />
              <h4>Reported Hours:</h4>
              {Object.entries(timesheetHours).map(([role, hours]) => (
                <div key={role}>
                  <strong>{role} Hours:</strong> Time Sheet - {hours}, Database - {databaseHours[role] || 0}
                </div>
              ))}
            </>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    ) : (
      <div>
        <strong>Email not found in the database.</strong>
      </div>
    )
  );
};

// const VerificationResultsAccordion: React.FC<VerificationResultsProps> = ({ results }) => {
  const VerificationResultsAccordion: React.FC<{ invalidEntries: any[] }> = ({ invalidEntries }) => {
    
    useEffect(() => {
      // console.log("Invalid Entries:", invalidEntries);
    }, [invalidEntries]);
  
    return (
      <Accordion defaultActiveKey="0">
        {invalidEntries ? (
          invalidEntries.map((entry, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header style={{ backgroundColor: '#f8f9fa', color: '#495057', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100% !important' }}>
                {formatDate(entry.date)}                
              </Accordion.Header>
              <Accordion.Body style={{ backgroundColor: '#f8f9fa', color: '#495057' }}>
                <p>Duration is <span style={{ color: entry.hours ? 'green' : 'red' }}>{entry.hours ? 'valid' : 'invalid'}</span></p>
                <p>Location is <span style={{ color: entry.location ? 'green' : 'red' }}>{entry.location ? 'valid' : 'invalid'}</span></p>
                <p>Position is <span style={{ color: entry.position ? 'green' : 'red' }}>{entry.position ? 'valid' : 'invalid'}</span></p>
              </Accordion.Body>
            </Accordion.Item>
          ))
        ) : (
          <Accordion.Item eventKey="0">
            <Accordion.Header style={{ backgroundColor: '#f8f9fa', color: '#495057', fontWeight: 'bold' }}>
              No Invalid Entries Found
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: '#f8f9fa', color: '#495057' }}>
              All entries are valid.
            </Accordion.Body>
          </Accordion.Item>
        )}
      </Accordion>
    );
  };

// export { ReportAccordion };
export { VerificationResultsAccordion, ReportAccordion };
