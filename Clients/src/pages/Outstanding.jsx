
// import React from "react";
// import { Table } from "react-bootstrap";

// const AshokaGardenOutstanding = () => {
//   // Mock data matching the exact structure from the image
//   const tableData = [
//     { sr: "1", invoice: "1/A000161", date: "21-06-25", partyName: "BOMBAY MEDICAL", billValue: "32885.00", paid: "26000.00", balance: "6885.00", day: "27", remark: "" },
//     { sr: "1", invoice: "2/A000233", date: "28-06-25", partyName: "KIRTI MEDICAL", billValue: "1252.00", paid: "0.00", balance: "1252.00", day: "20", remark: "" },
//     { sr: "1", invoice: "3/A000234", date: "28-06-25", partyName: "SMASITIK SUPER SALES", billValue: "1894.00", paid: "1000.00", balance: "894.00", day: "20", remark: "" },
//     { sr: "1", invoice: "4/A000235", date: "28-06-25", partyName: "VIVEK PROTEINS", billValue: "920.00", paid: "300.00", balance: "620.00", day: "20", remark: "" },
//     { sr: "1", invoice: "5/A000236", date: "28-06-25", partyName: "AMIT KIRAN", billValue: "1287.00", paid: "0.00", balance: "1287.00", day: "20", remark: "" },
//     { sr: "1", invoice: "6/A000238", date: "28-06-25", partyName: "APPU TRADERS", billValue: "1688.00", paid: "0.00", balance: "1688.00", day: "20", remark: "" },
//     { sr: "1", invoice: "7/A000239", date: "28-06-25", partyName: "SHIV SHANKAR KIRANA", billValue: "889.00", paid: "0.00", balance: "889.00", day: "20", remark: "" },
//     { sr: "1", invoice: "8/A000240", date: "28-06-25", partyName: "RAJSHRI KIRANA (A.G)", billValue: "3675.00", paid: "1500.00", balance: "2175.00", day: "20", remark: "" },
//     { sr: "1", invoice: "9/A000242", date: "28-06-25", partyName: "VIDANT KIRANA", billValue: "5838.00", paid: "0.00", balance: "5838.00", day: "20", remark: "" },

//   ];

//   return (
//     <div className="p-3" style={{ fontFamily: 'Arial, sans-serif' }}>
//       <h5 style={{ border:"2px solid rgba(8, 98, 255, 0.873)"  }} className="text-center fw-bold mb-0 py-2">SAMRIDHI ENTERPRISES</h5>

//       <h3 style={{ border:"1px solid rgba(8, 98, 255, 0.873)" }} className="text-center fw-bold mb-0 py-2">ASHOKA GARDEN OUTSTANDING AS ON 18-07-2025</h3>

//       <Table bordered responsive className="mb-0" style={{ fontSize: '14px' }}>
//           {/* Summary Row */}
//           <thead>
//   <tr  id="new-tabl" className="text-center fw-bold">
//             <th colSpan="1">TOTAL NO. </th>
//             <th colSpan="2"> BILLS : 24</th>
//             <th colSpan="2">GRAND TOTAL :</th>
//             <th>64752.00</th>
//             <th colSpan="4"></th>
//           </tr>
//           </thead>

//         <thead>
//           <tr id="new-table" className="text-center border">
//             <th style={{ width: '8%' }}>Sr No.</th>
//             <th style={{ width: '8%' }}>INVOICE</th>
//             <th style={{ width: '8%' }}>DATE</th>
//             <th style={{ whiteSpace:"nowrap" }}>PARTY NAME</th>
//             <th style={{ width: '10%' }}>BILL VALUE</th>
//             <th style={{ width: '10%' }}>PAID</th>
//             <th style={{ width: '10%' }}>BALANCE</th>
//             <th style={{ width: '5%' }}>DAY</th>
//             <th style={{ width: '12%' }}>REMARK</th>
//             <th style={{ width: '12%' }}>REMARK</th>
//           </tr>
//         </thead>
//         <tbody>


//           {/* Data Rows */}
//           {tableData.map((row, index) => (
//             <tr id="new-table1" key={index} className="text-center">
//                  <td style={{ textAlign:"right" }}>{row.sr}</td>
//               <td style={{ textAlign:"left" }}>{row.invoice}</td>
//               <td style={{ textAlign:"left" }}>{row.date}</td>
//               <td style={{ textAlign:"left" }}>{row.partyName}</td>
//               <td style={{ textAlign:"right" }}>{row.billValue}</td>
//               <td style={{ textAlign:"right" }}>{row.paid}</td>
//               <td style={{ textAlign:"right" }}>{row.balance}</td>
//               <td style={{ textAlign:"right" }}>{row.day}</td>
//               <td></td>
//               <td></td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default AshokaGardenOutstanding;

import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";

const AshokaGardenOutstanding = () => {
  const [showModal, setShowModal] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (selectedCustomer && startDate && endDate) {
      setShowModal(false);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const tableData = [
    { invoice: "1/A000161", date: "21-06-25", partyName: "BOMBAY MEDICAL", billValue: "32885.00", paid: "26000.00", balance: "6885.00", day: "27" },
    { invoice: "2/A000233", date: "28-06-25", partyName: "KIRTI MEDICAL", billValue: "1252.00", paid: "0.00", balance: "1252.00", day: "20" },
    { invoice: "3/A000234", date: "28-06-25", partyName: "SMASITIK SUPER SALES", billValue: "1894.00", paid: "1000.00", balance: "894.00", day: "20" },
    { invoice: "4/A000235", date: "28-06-25", partyName: "VIVEK PROTEINS", billValue: "920.00", paid: "300.00", balance: "620.00", day: "20" },
    { invoice: "5/A000236", date: "28-06-25", partyName: "AMIT KIRAN", billValue: "1287.00", paid: "0.00", balance: "1287.00", day: "20" },
    { invoice: "6/A000238", date: "28-06-25", partyName: "APPU TRADERS", billValue: "1688.00", paid: "0.00", balance: "1688.00", day: "20" },
    { invoice: "7/A000239", date: "28-06-25", partyName: "SHIV SHANKAR KIRANA", billValue: "889.00", paid: "0.00", balance: "889.00", day: "20" },
    { invoice: "8/A000240", date: "28-06-25", partyName: "RAJSHRI KIRANA (A.G)", billValue: "3675.00", paid: "1500.00", balance: "2175.00", day: "20" },
    { invoice: "9/A000242", date: "28-06-25", partyName: "VIDANT KIRANA", billValue: "5838.00", paid: "0.00", balance: "5838.00", day: "20" },
  ];

  return (
    <div className="p-3" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Modal Form */}
      <Modal show={showModal} backdrop="static" keyboard={false} centered>
        <Modal.Header>
          <Modal.Title>Filter Outstanding Report</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleModalSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select Customer</Form.Label>
              <Form.Select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                required
              >
                <option value="">-- Select Customer --</option>
                <option value="Ashoka Garden">Ashoka Garden</option>
                <option value="MP Nagar">MP Nagar</option>
                <option value="New Market">New Market</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              View Report
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Show Table Only After Modal Closes */}
      {!showModal && (
        <>
          <h5 style={{ border: "2px solid rgba(8, 98, 255, 0.873)" }} className="text-center fw-bold mb-0 py-2">
            SAMRIDHI ENTERPRISES
          </h5>
          <h3 style={{ border: "1px solid rgba(8, 98, 255, 0.873)" }} className="text-center fw-bold mb-0 py-2">
            ASHOKA GARDEN OUTSTANDING AS ON 18-07-2025
          </h3>

          <Table bordered responsive className="mb-0" style={{ fontSize: "14px" }}>
            <thead>
              <tr id="new-tabl" className="text-center fw-bold">
                <th colSpan="1">TOTAL NO. </th>
                <th colSpan="2">BILLS : {tableData.length}</th>
                <th colSpan="2">GRAND TOTAL :</th>
                <th>
                  {tableData.reduce((acc, row) => acc + parseFloat(row.billValue), 0).toFixed(2)}
                </th>
                <th colSpan="4"></th>
              </tr>
            </thead>
            <thead>
              <tr id="new-table" className="text-center border">
                <th style={{ width: "8%" }}>Sr No.</th>
                <th style={{ width: "8%" }}>INVOICE</th>
                <th style={{ width: "8%" }}>DATE</th>
                <th style={{ whiteSpace: "nowrap" }}>PARTY NAME</th>
                <th style={{ width: "10%" }}>BILL VALUE</th>
                <th style={{ width: "10%" }}>PAID</th>
                <th style={{ width: "10%" }}>BALANCE</th>
                <th style={{ width: "5%" }}>DAY</th>
                <th style={{ width: "12%" }}>REMARK</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr id="new-table1" key={index} className="text-center">
                  <td style={{ textAlign: "right" }}>{index + 1}</td>
                  <td style={{ textAlign: "left" }}>{row.invoice}</td>
                  <td style={{ textAlign: "left" }}>{row.date}</td>
                  <td style={{ textAlign: "left" }}>{row.partyName}</td>
                  <td style={{ textAlign: "right" }}>{row.billValue}</td>
                  <td style={{ textAlign: "right" }}>{row.paid}</td>
                  <td style={{ textAlign: "right" }}>{row.balance}</td>
                  <td style={{ textAlign: "right" }}>{row.day}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default AshokaGardenOutstanding;
// export default AshokaGardenOutstanding;