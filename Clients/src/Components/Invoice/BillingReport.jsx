import React, { useEffect, useState, useRef } from "react";
import axios from "../../Config/axios";
import ProductBillingReport from "./ProductBillingReport";
import CustomerBilling from "./CustomerBilling";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader";
import { useNavigate, useParams } from "react-router-dom";
import {
  createInvoice,
  updateInvoice,
  fetchInvoiceById,
} from "../../redux/features/product-bill/invoiceThunks";
import { useDispatch } from "react-redux";

function BillingReport() {
  const [billingData, setBillingData] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const navigate = useNavigate();
  const [finalAmount, setFinalAmount] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const [originalInvoice, setOriginalInvoice] = useState(null);

  console.log(originalInvoice, "Original data");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchInvoiceById(id))
        .unwrap()
        .then((invoice) => {
          setOriginalInvoice(invoice);
          setCustomerData(invoice.customer);
          setBillingData(invoice.billing);
          setFinalAmount(invoice.finalAmount || 0);
        })
        .catch((err) => {
          console.error("Failed to load invoice: " + err);
        });
    }
  }, [id, dispatch]);

  const handleBillingDataChange = (data, totalAmount) => {
    setBillingData(data);
    setFinalAmount(parseFloat(totalAmount));
  };

  const handleCustomerDataChange = (data) => {
    setCustomerData(data);
  };
  const resetForm = () => {
    setBillingData([]);
    setCustomerData({});
    setFinalAmount(0);
    setResetKey((prev) => prev + 1);
  };

  // const handleSubmit = async (shouldNavigate = true) => {
  //   setLoading(true);

  //   try {
  //     const finalData = {
  //       companyId: customerData.companyId,
  //       salesmanId: customerData.salesmanId,
  //       customerId: customerData.customerId,
  //       customer: customerData,
  //       customerName: customerData.name,
  //       billing: billingData,
  //       finalAmount,
  //     };

  //     const response = await axios.post("/pro-billing", finalData);
  //     toast.success("Invoice saved successfully!");

  //     const invoiceId = response.data.invoice._id;

  //     if (shouldNavigate) {
  //       navigate(`/generate-invoice/${invoiceId}`);
  //     } else {
  //       // Just reset form and reload same page
  //       resetForm();
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.details || "Failed to save invoice");
  //     console.error("Error saving invoice:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (shouldNavigate = true) => {
    setLoading(true);

    const finalData = {
      companyId: customerData.companyId,
      salesmanId: customerData.salesmanId,
      customerId: customerData.customerId,
      customer: customerData,
      customerName: customerData.name,
      billing: billingData,
      finalAmount,
    };

    try {
      let invoice;

      if (id) {
        invoice = await dispatch(
          updateInvoice({ id, invoiceData: finalData })
        ).unwrap();
        toast.success("Invoice updated successfully!");
      } else {
        invoice = await dispatch(createInvoice(finalData)).unwrap();
        toast.success("Invoice created successfully!");
      }

      if (shouldNavigate) {
        navigate(`/generate-invoice/${invoice._id}`);
      } else {
        resetForm();
      }
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const productRef = useRef();

  // ... your state and handlers

  const focusNextComponent = () => {
    // console.log("Calling productRef.focusItemName()");
    productRef.current?.focusItemName();
  };

  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (e.key === "F10") {
  //       e.preventDefault();
  //       handleSubmit();
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [handleSubmit]);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.key === "F10") {
        e.preventDefault();
        await handleSubmit(true); // pass `true` → means navigate
      }

      if (e.altKey && (e.key === "w" || e.key === "W")) {
        e.preventDefault();
        await handleSubmit(false); // pass `false` → means do NOT navigate
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <CustomerBilling
        value={customerData}
        onDataChange={handleCustomerDataChange}
        resetTrigger={resetKey}
        onNextFocus={focusNextComponent}
      />
      <ProductBillingReport
        finalAmount={finalAmount}
        value={billingData}
        ref={productRef}
        onBillingDataChange={handleBillingDataChange}
        key={resetKey}
      />

      <div
        style={{
          fontSize: "12px",
          margin: "4px",
          color: "#555",
          textAlign: "center",
        }}
      >
        Press <kbd>F10</kbd> to submit
      </div>
      <div className='text-center mt-4'>
        <button
          className='btn btn-primary px-4 py-2'
          onClick={() => handleSubmit(true)}
          style={{ fontWeight: "bold", fontSize: "16px", borderRadius: "8px" }}
          title='Shortcut: Ctrl + Enter'
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default BillingReport;
