import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';



// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

interface AccordionItemProps {
  index: number;
  date: string;
  duration: boolean;
  location: boolean;
  position: boolean;
}

interface ReportProps {
  emailFound: boolean;
  databaseEntries: number;
  timesheetEntries: number;
  databaseHours: { [key: string]: number };
  timesheetHours: { [key: string]: number };
}

interface VerificationResultsProps {
  results: AccordionItemProps[];
}

const VerificationResultsAccordion: React.FC<VerificationResultsProps> = ({ results }) => {
  return (
    <Accordion defaultActiveKey="0">
      {results.map((entry, index) => (
        <Accordion.Item eventKey={index.toString()} key={index}>
          <Accordion.Header style={{ backgroundColor: '#f8f9fa', color: '#495057', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100% !important' }}>
            {formatDate(entry.date)}
          </Accordion.Header>
          <Accordion.Body style={{ backgroundColor: '#f8f9fa', color: '#495057' }}>
            <p>Duration is <span style={{ color: entry.duration ? 'green' : 'red' }}>{entry.duration ? 'valid' : 'invalid'}</span></p>
            <p>Location is <span style={{ color: entry.location ? 'green' : 'red' }}>{entry.location ? 'valid' : 'invalid'}</span></p>
            <p>Position is <span style={{ color: entry.position ? 'green' : 'red' }}>{entry.position ? 'valid' : 'invalid'}</span></p>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

const compareHours = (timesheetHours: { [key: string]: number }, databaseHours: { [key: string]: number }) => {
  console.log("Comparing hours:", { timesheetHours, databaseHours });

  for (const role in timesheetHours) {
    if (timesheetHours[role] !== databaseHours[role]) {
      console.log(`Mismatch found for role ${role}: Time Sheet - ${timesheetHours[role]}, Database - ${databaseHours[role] || 0}`);
      return false;
    }
  }
  return true;
};

const ReportAccordion: React.FC<{ report: ReportProps }> = ({ report }) => {
  console.log("ACcrodian ", report);
  const entriesMatch = report.databaseEntries === report.timesheetEntries;

  console.log(entriesMatch, report.databaseEntries, report.timesheetEntries);
  const hoursMatch = compareHours(report.timesheetHours, report.databaseHours);

  console.log("Report data:", report);

  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header style={{ backgroundColor: '#f8f9fa', color: '#495057', fontWeight: 'bold' }}>
          Report Summary
        </Accordion.Header>
        <Accordion.Body style={{ backgroundColor: '#f8f9fa', color: '#495057' }}>
          {report.emailFound ? (
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
                <strong>Database Entries:</strong> {report.databaseEntries}
              </div>
              <div>
                <strong>Time Sheet Entries:</strong> {report.timesheetEntries}
              </div>
              <hr />
              <h4>Reported Hours:</h4>
              {Object.entries(report.timesheetHours).map(([role, hours]) => (
                <div key={role}>
                  <strong>{role} Hours:</strong> Time Sheet - {hours}, Database - {report.databaseHours[role] || 0}
                </div>
              ))}
            </>
          ) : (
            <div>
              <strong>Email not found in the database.</strong>
            </div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export { VerificationResultsAccordion, ReportAccordion };
