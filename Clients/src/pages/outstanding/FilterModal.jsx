import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const FilterModal = ({
  show,
  onHide,
  onSubmit,
  selectedCustomer,
  setSelectedCustomer,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <Modal show={show} backdrop='static' keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>Filter Outstanding Report</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className='mb-3'>
            <Form.Label>Select Customer</Form.Label>
            <Form.Select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              required
            >
              <option value=''>-- Select Customer --</option>
              <option value='Ashoka Garden'>Ashoka Garden</option>
              <option value='MP Nagar'>MP Nagar</option>
              <option value='New Market'>New Market</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              // required
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              // required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' type='submit'>
            View Report
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FilterModal;
