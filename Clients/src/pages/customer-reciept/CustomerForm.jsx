import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BillAdjustmentModal from "./BillAdjustmentModal";
import PendingBillsModal from "./PendingBillsModal";

import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../redux/features/customer/customerThunks";
import { fetchVendorBills } from "../../redux/features/vendor/VendorThunks";
import { getBalance } from "../../redux/features/purchase/purchaseThunks";
import {
  fetchBalanceByCustomer,
  fetchInvoicesByCustomer,
} from "../../redux/features/product-bill/invoiceThunks";
import axiosInstance from "../../Config/axios";

const CustomerForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [customerIndex, setCustomerIndex] = useState(0);
  const [debitAmount, setDebitAmount] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [pendingRowIndex, setPendingRowIndex] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const billAdjustmentModalRef = useRef();
  const [openBillModalRequested, setOpenBillModalRequested] = useState(false);

  const [dateValue, setDateValue] = useState("");
  const [dayValue, setDayValue] = useState("");

  const formRefs = useRef([]);

  const dispatch = useDispatch();
  const [showBillModal, setShowBillModal] = useState(false);
  const [pendingValue, setPendingValue] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const customerList = useSelector((state) => state.customer.customers);
  const vendorBills = useSelector((state) => state.vendor.vendorBills);
  const balance = useSelector((state) => state.purchase?.balance);
  const { balanceByCustomer, invoicesByCustomer } = useSelector(
    (state) => state.invoice
  );

  // !
  const [voucherNumber, setVoucherNumber] = useState("");

  // Fetch next voucher number
  const fetchNextVoucherNumber = async () => {
    try {
      const res = await axiosInstance.get("/ledger/next-voucher-number");
      setVoucherNumber(res.data.nextVoucherNumber);
    } catch (err) {
      console.error("Error fetching voucher number:", err);
    }
  };

  // On component mount, fetch voucher number
  useEffect(() => {
    fetchNextVoucherNumber();
  }, []);

  // !

  const handleOpenPendingBills = (rowIdx) => {
    setPendingRowIndex(rowIdx);
    dispatch(fetchVendorBills(selectedCustomer?._id)).then((res) => {
      if (res.payload?.length > 0) {
        setShowPendingModal(true);
      }
    });
  };

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (vendorBills.length > 0 && showBillModal && pendingRowIndex !== null) {
      setShowPendingModal(true);
    }
  }, [vendorBills, showBillModal, pendingRowIndex]);

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      if (e.target.name === "date") {
        setCustomerIndex(0);
        setShowModal(true);
        return;
      }
      if (index === 4) {
        setOpenBillModalRequested(true);
        setShowBillModal(true);
        return;
      }
      formRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      formRefs.current[index - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      formRefs.current[0]?.focus();
    }
  };

  const handleCustomerKey = (e) => {
    if (!showModal) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCustomerIndex((prev) => (prev + 1) % customerList.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCustomerIndex((prev) =>
        prev === 0 ? customerList.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectCustomer(customerList[customerIndex]);
    } else if (e.key === "Escape") {
      setShowModal(false);
    }
  };

  useEffect(() => {
    let timeout;
    if (showModal) {
      timeout = setTimeout(() => {
        window.addEventListener("keydown", handleCustomerKey);
      }, 300);
    }
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", handleCustomerKey);
    };
  }, [showModal, customerIndex]);

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB");
    const formattedDay = now.toLocaleDateString("en-GB", { weekday: "long" });

    setDateValue(formattedDate);
    setDayValue(formattedDay);
  }, []);

  const handleDateChange = (e) => {
    const input = e.target.value;
    setDateValue(input);

    const [day, month, year] = input.split("/");
    const parsedDate = new Date(`${year}-${month}-${day}`);

    if (!isNaN(parsedDate)) {
      const newDay = parsedDate.toLocaleDateString("en-GB", {
        weekday: "long",
      });
      setDayValue(newDay);
    } else {
      setDayValue("");
    }
  };

  const selectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    await dispatch(fetchBalanceByCustomer(customer._id));
    dispatch(fetchInvoicesByCustomer(customer._id));
    setShowModal(false);

    // setTimeout(() => {
    //   formRefs.current[4]?.focus();
    // }, 100);
  };

  useEffect(() => {
    if (openBillModalRequested && vendorBills.length > 0) {
      setShowBillModal(true);
      setOpenBillModalRequested(false);
    }
  }, [openBillModalRequested, vendorBills]);

  // ✅ Filter customers based on search input
  const filteredCustomers = customerList.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className='mt-4'>
      <h4 className='text-center mb-2'>SAMRIDDHI ENTERPRISES - JYOTHY</h4>
      <p className='text-center mb-1'>
        H.NO 2, NAGAR NIGAM COLONY COAL & TIMBER MARKET CHHOLA ROAD, BHOPAL
      </p>
      <p className='text-center mb-4'>Period : 01-04-2025 - 31-03-2026</p>
      <div className='line mb-3'></div>
      {/* sourabh */}
      <Form>
        <Row className='mb-4'>
          {/* Left Side */}
          <Col md={6} className='mt-4'>
            {/* Voucher Type */}
            <Form.Group as={Row} className='mb-3 align-items-center'>
              <Form.Label column sm={4} className='col-form-label'>
                Voucher Type
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type='text'
                  defaultValue='Receipt'
                  ref={(el) => (formRefs.current[0] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                />
              </Col>
            </Form.Group>

            {/* Voucher No. */}
            <Form.Group as={Row} className='mb-3 align-items-center'>
              <Form.Label column sm={4} className='col-form-label'>
                Voucher No.
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type='text'
                  value={voucherNumber}
                  readOnly
                  placeholder='Auto-generated'
                  ref={(el) => (formRefs.current[1] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                />
              </Col>
            </Form.Group>
          </Col>

          {/* Right Side */}
          <Col md={6} className='mt-4'>
            {/* Date */}
            <Form.Group as={Row} className='mb-3 align-items-center'>
              <Form.Label column sm={4} className='col-form-label'>
                Date{" "}
                <span style={{ fontSize: "12px", color: "red" }}>
                  (Press Enter to trigger a function)
                </span>
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type='text'
                  name='date'
                  placeholder='DD/MM/YYYY'
                  value={dateValue}
                  onChange={handleDateChange}
                  ref={(el) => (formRefs.current[2] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                />
              </Col>
            </Form.Group>

            {/* Day */}
            <Form.Group as={Row} className='mb-3 align-items-center'>
              <Form.Label column sm={4} className='col-form-label'>
                Day
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type='text'
                  value={dayValue}
                  readOnly
                  ref={(el) => (formRefs.current[3] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                />
              </Col>
            </Form.Group>
          </Col>
        </Row>

        {/* Optional horizontal line */}
        <hr />
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Customer</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* ✅ Search Input */}
          <input
            type='text'
            placeholder='Search customer name...'
            className='form-control mb-3'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {filteredCustomers.map((customer, index) => (
            <div
              key={customer._id}
              onClick={() => {
                selectCustomer(customer);
                setCustomerIndex(index);
              }}
              style={{
                padding: "12px 16px",
                backgroundColor:
                  customerIndex === index ? "#007bff" : "#f8f9fa",
                color: customerIndex === index ? "#fff" : "#000",
                cursor: "pointer",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            >
              <div className='d-flex justify-content-between align-items-center'>
                <p className='mb-0' style={{ flex: 1 }}>
                  {customer?.name}
                </p>
                <p className='mb-0 text-center' style={{ flex: 1 }}>
                  {customer?.city}
                </p>
              </div>
            </div>
          ))}

          {filteredCustomers[customerIndex] && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                backgroundColor: "#e9ecef",
                borderRadius: "6px",
                border: "1px solid #ced4da",
              }}
            >
              <h6 style={{ marginBottom: "8px", color: "#333" }}>
                Selected Customer Address:
              </h6>
              <p style={{ margin: 0, fontStyle: "italic", color: "#495057" }}>
                🏠{" "}
                {filteredCustomers[customerIndex]?.address ||
                  "Address not available"}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {selectedCustomer && (
        <>
          <div className='d-flex align-items-center gap-5 mt-4 w-full'>
            <p className='mb-0'>
              <strong></strong> {selectedCustomer?.name}
            </p>
            <p className='mb-0'>
              <strong></strong> {selectedCustomer?.city}
            </p>
            <p className='mb-0'>
              <strong>Total Balance:</strong> ₹
              {balanceByCustomer.toFixed(2) || "0.00"}
            </p>

            <Form.Group className=' d-flex ' controlId='formDebit'>
              <Form.Label column>Debit Amount</Form.Label>
              <Col>
                <Form.Control
                  type='number'
                  placeholder='Enter amount'
                  value={debitAmount}
                  ref={(el) => (formRefs.current[4] = el)}
                  onChange={(e) => setDebitAmount(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 4)}
                />
              </Col>
            </Form.Group>
          </div>
          <div className='line mt-5'></div>
        </>
      )}

      <BillAdjustmentModal
        ref={billAdjustmentModalRef}
        show={showBillModal}
        onHide={() => setShowBillModal(false)}
        amount={parseFloat(debitAmount || 0)}
        openPendingModal={(rowIndex) => {
          handleOpenPendingBills(rowIndex);
        }}
        selectedVendorId={selectedCustomer?._id}
        onPendingChange={(value) => {
          console.log("⏱ Pending from modal:", value);
          setPendingValue(value);
        }}
      />

      <PendingBillsModal
        show={!!showPendingModal}
        onHide={() => setShowPendingModal(false)}
        bills={invoicesByCustomer}
        onSelectItem={(result) => {
          billAdjustmentModalRef.current?.insertBill(pendingRowIndex, result);
          setShowPendingModal(false);
        }}
        amountBill={pendingValue}
      />
    </Container>
  );
};

export default CustomerForm;
