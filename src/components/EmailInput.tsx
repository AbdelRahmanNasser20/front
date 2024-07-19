import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

const EmailInput: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(true); // Start in edit mode by default

  useEffect(() => {
    // Retrieve email from local storage on component mount
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      setIsEditing(false);
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleButtonClick = () => {
    if (isEditing) {
      // Save email to local storage
      localStorage.setItem('email', email);
      setIsEditing(false);
    } else {
      // Switch to editing mode
      setIsEditing(true);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '10vh' }}>
      <Row>
        <Col xs="auto">
          <Form className="d-flex align-items-center">
            <Form.Label className="me-2 mb-0"></Form.Label>
            {isEditing ? (
              <Form.Control
                type="email"                
                value={email}
                onChange={handleInputChange}
                style={{ width: '250px' }} // Set a fixed width for the input
                className="me-2"
              />
            ) : (
              <div className="me-2" style={{ width: '275px', lineHeight: '38px', border: '1px solid #ced4da', padding: '6px 12px', borderRadius: '.25rem' }}>
                {email}
              </div>
            )}
            <Button variant="dark" onClick={handleButtonClick}>
              {isEditing ? 'Set Email' : 'Edit Email'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EmailInput;
