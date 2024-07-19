






import React, { useState, useEffect } from 'react';
// import TimeSheetTable from './TimesheetTable';
import { Button, Container, Row, Col } from 'react-bootstrap';

const TimeSheetApp: React.FC = () => {
  return(
    <></>
  );
}

export default TimeSheetApp;

// interface TimeSheetEntry {
//   date: string;
//   hours: number;
//   location: string;
//   role: string;
// }

// const TimeSheetApp: React.FC = () => {
//   const [entries, setEntries] = useState<TimeSheetEntry[]>([]);

//   useEffect(() => {
//     const storedEntries = localStorage.getItem('timeSheetEntries');
//     if (storedEntries) {
//       setEntries(JSON.parse(storedEntries));
//     }
//   }, []);

//   const addEntry = (entry: TimeSheetEntry) => {
//     const updatedEntries = [...entries, entry];
//     setEntries(updatedEntries);
//     localStorage.setItem('timeSheetEntries', JSON.stringify(updatedEntries));
//   };

//   const deleteEntries = (indexesToDelete: number[]) => {
//     const updatedEntries = entries.filter((_, index) => !indexesToDelete.includes(index));
//     setEntries(updatedEntries);
//     localStorage.setItem('timeSheetEntries', JSON.stringify(updatedEntries));
//   };

//   const verifyTimeSheet = async () => {
//     // Send the entries to the backend
//     try {
//       const response = await fetch('/api/verify-timesheet', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(entries),
//       });
//       if (response.ok) {
//         console.log('Timesheet verified successfully');
//       } else {
//         console.error('Error verifying timesheet');
//       }
//     } catch (error) {
//       console.error('Network error:', error);
//     }
//   };

//   return (
//     <Container>
//       <Row className="justify-content-center">
//         <Col xs="auto">
//           <h1 className="text-center">Timesheet Verification</h1>
//           <TimeSheetTable entries={entries} onDeleteEntries={deleteEntries} />
//           <Button variant="secondary" onClick={() => addEntry({ date: '2024-07-11', hours: 8, location: 'Office', role: 'Developer' })}>Add Entry</Button>
//           <Button variant="primary" onClick={verifyTimeSheet}>Verify Timesheet</Button>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default TimeSheetApp;
