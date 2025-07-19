
// import React, { useEffect, useState } from "react";
// import { Table } from "react-bootstrap";
// import { useParams } from "react-router-dom";
// import axios from "../../Config/axios";
// import Loader from "../Loader";
// import { toWords } from "number-to-words";

// const GenerateInvoice = () => {
//   const { id } = useParams();
//   const [invoice, setInvoice] = useState(null);
//   const [error, setError] = useState(null);
//   const [fullCustomer, setFullCustomer] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [productDetails, setProductDetails] = useState({});

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`/pro-billing/${id}`);
//         setInvoice(response.data);

//         if (response.data.customerId?._id) {
//           const customerResponse = await axios.get(
//             `/customer/${response.data.customerId._id}`
//           );

//           setFullCustomer(customerResponse.data);
//         }

//         if (response.data.billing?.length > 0) {
//           const uniqueProductIds = [
//             ...new Set(
//               response.data.billing
//                 .map((item) => item.productId?._id)
//                 .filter((id) => id)
//             ),
//           ];

//           const productResponses = await Promise.all(
//             uniqueProductIds.map((id) => axios.get(`/product/${id}`))
//           );

//           const productMap = {};
//           uniqueProductIds.forEach((id, index) => {
//             productMap[id] = productResponses[index].data;
//           });

//           setProductDetails(productMap);
//         }
//       } catch (error) {
//         console.error("Error fetching invoice:", error);
//         setError("Failed to load invoice. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvoice();
//   }, [id]);

//   if (error) return <p className='text-danger'>{error}</p>;
//   if (loading || !invoice) return <Loader />;

//   const calculateTotals = () => {
//     if (!invoice.billing) return {};
//     return invoice.billing.reduce((acc, item) => {
//       acc.basicAmount =
//         (acc.basicAmount || 0) + (parseFloat(item.taxableAmount) || 0);
//       acc.sgst = (acc.sgst || 0) + (parseFloat(item.sgst) || 0);
//       acc.cgst = (acc.cgst || 0) + (parseFloat(item.cgst) || 0);
//       acc.total = (acc.total || 0) + (parseFloat(item.total) || 0);
//       acc.totalQty = (acc.totalQty || 0) + (parseFloat(item.qty) || 0);
//       return acc;
//     }, {});
//   };

//   const totals = calculateTotals();
//   const { customer = {}, billing = [], salesmanId = {} } = invoice;

//   const chunkArray = (arr, size) => {
//     const result = [];
//     for (let i = 0; i < arr.length; i += size) {
//       result.push(arr.slice(i, i + size));
//     }
//     return result;
//   };

//   const itemsPerPage = 14;
//   const billingChunks = chunkArray(billing, itemsPerPage);

//   // Utility to group by GST %
//   const gstSummary = billing.reduce((acc, item) => {
//     const product = productDetails[item.productId?._id] || {};
//     const gst = product?.gstPercent || 0;
//     const amount = parseFloat(item.total) || 0;
//     const taxableAmt = (amount * 100) / (100 + gst); // to remove GST from total

//     if (!acc[gst]) {
//       acc[gst] = {
//         taxable: 0,
//         sgst: 0,
//         cgst: 0,
//       };
//     }

//     acc[gst].taxable += taxableAmt;
//     acc[gst].sgst += (taxableAmt * gst) / 2 / 100;
//     acc[gst].cgst += (taxableAmt * gst) / 2 / 100;

//     return acc;
//   }, {});





//   if (loading) return <Loader />;

//   return (
//     <div>
//       <div className='container  d-print-none'>
//         <button
//           onClick={() => window.print()}
//           className='btn btn-primary my-3 d-print-none'
//         >
//           Print Invoice
//         </button>
//       </div>

//       <style>
//         {`
//           @media print {
//             body * {
//               visibility: hidden;
//             }

//             #print-area, #print-area * {
//               visibility: visible;
//               font-family: "Courier New", monospace;
//             }

//             #print-area {
//               position: absolute;
//               left: 0;
//               top: 0;
//               width: 100%;
//             }

//             p{
//             margin:0 ;
//             }

//             .d-print-none {
//               display: none !important;
//             }

//             .invoice-page:not(:last-child) {
//               page-break-after: always;
//             }

//             @page {
//               size: A4;
//               margin:3mm;
//             }

//             .invoice-page:not(:last-child) .invoice-footer {
//               display: none;

//             }

//             .invoice-page:not(:last-child) .to-be-continued {
//               display: block;
//             }
//           }

//           .to-be-continued {
//             display: none;
//             text-align: center;
//             margin-top: 20px;
//             font-weight: bold;
//           }
//         `}
//       </style>

//       <div id='print-area' style={{ lineHeight: "1" }}>
//         {billingChunks.map((chunk, pageIndex) => (
//           <div
//             key={pageIndex}
//             className='invoice-page'
//             style={{
//               // width: "210mm",
//               margin: "auto",
//               // padding: "1mmmm",
//               fontFamily: "Courier New monospace",

//               fontSize: "12px",
//             }}
//           >
//             <div>
//               <div
//                 style={{
//                   borderBottom: "1px dashed black",
//                   paddingBottom: "1px",
//                   marginBottom: "1px",
//                   marginTop: "0px",
//                 }}
//               >
//                 <div className='d-flex   mt-2'>
//                   <p style={{ marginBottom: "0px", fontSize: "14px" }}>
//                     <strong>GSTIN: 23BJUPR9537F1ZK</strong>
//                   </p>

//                   <h2
//                     style={{
//                       width: "45%",
//                       //fontWeight: "bold",
//                       fontSize: "22px",
//                       textAlign: "right",
//                       margin: "-3px",
//                         fontWeight: "900"

//                     }}
//                   >
//                     SAMRIDDHI ENTERPRISES
//                   </h2>
//                 </div>

//                 <p
//                   style={{
//                     margin: "1px",
//                     textAlign: "center",
//                     fontSize: "13px",
//                   }}
//                 >
//                   H.NO.02, NAGAR NIGAM COLONY, TIMBER MARKET, CHHOLA, BHOPAL
//                 </p>
//                 <p
//                   style={{
//                     margin: "1px",
//                     textAlign: "center",
//                     fontSize: "13px",
//                   }}
//                 >
//                   MOB: 9926793332, 9893315590
//                 </p>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   margin: 0,
//                   padding: 0,
//                   fontSize: "12px",
//                   // fontFamily: "monospace",
//                   lineHeight: "1.2",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "75%",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "2px",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   <strong>
//                     {" "}
//                     <span>{fullCustomer?.ledger || "N/A"}</span>
//                   </strong>
//                   <span>{fullCustomer?.address1 || "N/A"}</span>
//                   <span>{fullCustomer?.mobile || "N/A"}</span>
//                   <strong style={{ textAlign: "center", marginTop: "-13px" }}>
//                     GSTIN: {fullCustomer?.gstNumber || "N/A"}
//                   </strong>
//                 </div>

//                 <div
//                   style={{
//                     textAlign: "left",
//                     width: "35%",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "2px",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   <span>
//                     <strong>
//                       Bill No:
//                       <span style={{ fontSize: "17px", fontWeight: "300" }}>
//                         {invoice._id?.slice(-6)}
//                       </span>
//                     </strong>
//                   </span>
//                   <span>
//                     <strong>Date:</strong>
//                     {new Date(customer?.Billdate).toLocaleDateString("en-GB")}
//                     &nbsp; {invoice?.billingType}
//                   </span>

//                   <span className="d-flex align-items-center gap-2">
//                     <strong>Salesman:</strong>
//                  <span> {salesmanId?.name || "N/A"} </span>  <strong> M.No. </strong>
//                     {salesmanId?.mobile || "-"}
//                   </span>
//                 </div>
//               </div>

//               <Table
//                 bordered
//                 className='mt-1 table-sm'
//                 style={{ fontSize: "12px", borderBottom: "none" }}
//               >
//                 <thead>
//                   <tr>
//                     {[
//                       "SR",
//                       "Item Name",
//                       "HSN Code",
//                       "MRP",
//                       "Qty",
//                       "Free",
//                       "Rate",
//                       "Sch%",
//                       "Sch Amt",
//                       "CD%",
//                       "Amt",
//                       "SGST",
//                       "CGST",
//                       "Total",
//                     ].map((header, i) => (
//                       <th
//                         key={i}
//                         style={{
//                           border: "1px solid black",
//                           padding: "2px",
//                           textAlign: "center",
//                           paddingLeft: i === 1 ? "5px" : "2px",
//                           paddingRight: i === 1 ? "5px" : "2px",
//                           fontWeight: "400",
//                         }}
//                       >
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody style={{ borderBottom: "none !important" }}>
//                   {chunk.map((item, index) => {
//                     const product = productDetails[item.productId?._id] || {};
//                     const gst = product?.gstPercent || 0;
//                     return (
//                       <tr
//                         id='border-table'
//                         style={{ border: "none", background: "red" }}
//                         key={index}
//                       >
//                         <td
//                           style={{
//                             borderLeft: "1px solid black",
//                             borderRight: "1px solid black",
//                             textAlign: "center",
//                             padding: "2px",
//                           }}
//                         >
//                           {pageIndex * itemsPerPage + index + 1}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "left",
//                             paddingLeft: "5px",
//                             paddingRight: "5px",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {item.itemName || "N/A"}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                           }}
//                         >
//                           {product.hsnCode || "N/A"}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {product.mrp || 0}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {item.qty || 0}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                           }}
//                         >
//                           {item.Free || 0}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                           }}
//                         >
//                           {item.rate || 0}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                           }}
//                         >
//                           {item.sch || 0}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                           }}
//                         >
//                           {item.schAmt || 0}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                           }}
//                         >
//                           {item.cd || 0}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                           }}
//                         >
//                           {item.total || 0}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                           }}
//                         >
//                           {gst / 2}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                           }}
//                         >
//                           {gst / 2}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             textAlign: "right",
//                             padding: "2px",
//                           }}
//                         >
//                           {item.amount || 0}
//                         </td>
//                       </tr>
//                     );
//                   })}

//                   {chunk.length > 0 && (
//                     <tr style={{}}>
//                       <td
//                         colSpan={14}
//                         style={{ height: "1px", padding: 0 }}
//                       ></td>
//                     </tr>
//                   )}

//                   {chunk.length < itemsPerPage &&
//                     Array.from({ length: itemsPerPage - chunk.length }).map(
//                       (_, i) => (
//                         <tr key={`empty-${i}`}>
//                           {Array.from({ length: 14 }).map((_, j) => (
//                             <td
//                               key={j}
//                               style={{
//                                 borderRight: "1px solid black",
//                                 borderLeft:
//                                   j === 0 ? "1px solid black" : undefined,
//                                 textAlign: "center",
//                                 padding: "2px",
//                                 height: "22px", // Consistent height
//                               }}
//                             ></td>
//                           ))}
//                         </tr>
//                       )
//                     )}

//                   {pageIndex === billingChunks.length - 1 && (
//                     <tr style={{ fontWeight: "bold" }}>
//                       <td className='border border-black p-1'></td>
//                       <td className='border border-black p-1' colSpan={1}>
//                         Basic Amount: {totals.total?.toFixed(2) || "0.00"}
//                       </td>
//                       <td
//                         className='p-1'
//                         style={{
//                           borderBottom: "1px solid black",
//                           borderTop: "1px solid black",
//                         }}
//                       >
//                         QTY:{" "}
//                       </td>
//                       <td
//                         className='p-1 '
//                         style={{
//                           whiteSpace: "nowrap",
//                           borderBottom: " 1px solid black",
//                           borderTop: "1px solid black",
//                         }}
//                       >
//                         C/S 0
//                       </td>
//                       <td
//                         className='p-1'
//                         style={{
//                           borderBottom: "1px solid black",
//                           borderRight: "1px solid black",
//                           borderTop: "1px solid black",
//                           textAlign: "center",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         PCS:{totals.totalQty || 0}
//                       </td>
//                       <td
//                         style={{ textAlign: "right" }}
//                         className='border border-black p-1'
//                       >
//                         0
//                       </td>
//                       <td
//                         style={{ textAlign: "right" }}
//                         className='border border-black p-1'
//                       ></td>
//                       <td
//                         style={{ textAlign: "right" }}
//                         className='border border-black p-1'
//                       ></td>
//                       <td
//                         style={{ textAlign: "right" }}
//                         className='border border-black p-1'
//                       >
//                         {billing
//                           .reduce(
//                             (sum, item) => sum + (parseFloat(item.schAmt) || 0),
//                             0
//                           )
//                           .toFixed(2)}
//                       </td>
//                       <td
//                         style={{ textAlign: "right" }}
//                         className='border border-black p-1 '
//                       ></td>
//                       <td
//                         style={{ textAlign: "right" }}
//                         className='border border-black p-1'
//                       >
//                         {totals.total?.toFixed(2) || "0.00"}
//                       </td>
//                       <td
//                         style={{ textAlign: "right" }}
//                         className='border border-black p-1'
//                       >
//                         {((totals.total || 0) * 0.06).toFixed(2)}
//                       </td>
//                       <td
//                         style={{ textAlign: "right" }}
//                         className='border border-black p-1'
//                       >
//                         {totals.cgst?.toFixed(2) || "0.00"}
//                       </td>
//                       <td
//                         style={{ textAlign: "right" }}
//                         className='border border-black p-1 '
//                       >
//                         {invoice.finalAmount?.toFixed(2) || "0.00"}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>




//               {pageIndex < billingChunks.length - 1 && (
//                 <div
//                   className='invoice-footer ' id="invoice"
//                   style={{
//                     display: "flex",
//                     padding: "2px",
//                     paddingBottom: "0",
//                     marginTop: "-16px",
//                     fontSize: "11px",
//                     gap: "6px",
//                     border: "1px solid black",
//                     borderTop: "0",
//                     width: "100%",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   <div>
//                     <p style={{ marginBottom: "0", whiteSpace: "nowrap" }}>
//                       Goods once sold will not be taken back
//                     </p>
//                     <p style={{ marginBottom: "0" }}>
//                       Cheque bounce charges Rs. 500/-
//                     </p>
//                     <p style={{ marginBottom: "0" }}>Credit 7 Days Only/-</p>
//                     <p style={{ marginBottom: "0" }}>
//                       Subject to Bhopal jurisdiction/-
//                     </p>
//                     <p style={{ marginBottom: "0" }}>E.&.O.E</p>
//                   </div>

//                   <div
//                     className=''
//                     style={{
//                       borderLeft: "1px solid black",
//                       paddingLeft: "10px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <p
//                       style={{
//                         textAlign: "center",
//                       }}
//                     >
//                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be
//                       continued...
//                       <span style={{ display: "block", textAlign: "right" }}>
//                         Page {pageIndex + 1} of {billingChunks.length}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {pageIndex === billingChunks.length - 1 && (
//                 <div
//                   className='invoice-footer '
//                   style={{
//                     display: "flex",
//                     // padding: "25px",
//                     paddingBottom: "0",
//                     marginTop: "-16px",
//                     fontSize: "11px",
//                     gap: "6px",
//                     // padding:"10px",
//                     border: "1px solid black",
//                     // borderTop: "0",
//                     width: "100%",
//                   }}
//                 >
//                   <div style={{ paddingTop:"25px",
//                        paddingBottom:"25px",  paddingLeft: "10px", }}>
//                     <p style={{ marginBottom: "0", whiteSpace: "nowrap" }}>
//                       Goods once sold will not be taken back
//                     </p>
//                     <p style={{ marginBottom: "0" }}>
//                       Cheque bounce charges Rs. 500/-
//                     </p>
//                     <p style={{ marginBottom: "0" }}>Credit 7 Days Only/-</p>
//                     <p style={{ marginBottom: "0" }}>
//                       Subject to Bhopal jurisdiction/-
//                     </p>
//                     <p className='mb-0'>E.&.O.ES</p>
//                   </div>
//                   {/* //!SGST */}
//                   <div

//                     style={{
//                        paddingTop:"25px",
//                        paddingBottom:"25px",

//                       borderLeft: "1px solid black",
//                       paddingLeft: "15px",
//                       // paddingRight: "15px",

//                       margin: "0",
//                     }}
//                   >
//                     {Object.entries(gstSummary).map(([rate, value]) => (
//                       <p
//                         style={{
//                           margin: "0",
//                           padding: "2px",
//                           whiteSpace: "nowrap",
//                         }}
//                         key={rate}
//                       >
//                         {rate}%: SGST {value.sgst.toFixed(2)}, CGST{" "}
//                         {value.cgst.toFixed(2)} ={" "}
//                         {(value.sgst + value.cgst).toFixed(2)} /{" "}
//                         {value.taxable.toFixed(2)}
//                       </p>
//                     ))}
//                     <p
//                       style={{
//                         borderTop: "1px solid black",
//                         paddingLeft: "5px",
//                         // paddingRight: "5px",
//                         paddingTop: "8px",
//                         marginBottom: "0",
//                         borderTopStyle: "dashed",
//                       }}
//                     >
//                       SGST AMT{" "}
//                       {Object.values(gstSummary)
//                         .reduce((sum, val) => sum + val.sgst, 0)
//                         .toFixed(2)}
//                       , CGST AMT :{" "}
//                       {Object.values(gstSummary)
//                         .reduce((sum, val) => sum + val.cgst, 0)
//                         .toFixed(2)}
//                     </p>
//                   </div>
//                   <div
//                     style={{
//                       width: "100%",
//                       textAlign: "",
//                        paddingRight: "5px",
//                       borderLeft: "1px solid black",
//                       paddingLeft: "6px",
//                       fontSize: "13px",
//                       position: "relative",
//                     }}
//                   >
//                     <h5
//                       style={{
//                         width: "100%",
//                         fontSize: "12px",
//                         fontWeight: "bold",
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: "15px",
//                       }}
//                     >
//                       <span>Bill Amount (R):</span>
//                       <span
//                         style={{
//                           textAlign: "right",
//                         fontSize: "15px",
//                         }}
//                       >
//                         {invoice.finalAmount?.toFixed(2)}
//                       </span>
//                     </h5>
//                     <span
//                       style={{
//                         textAlign: "right",
//                         position: "absolute",
//                         bottom: "5px",
//                         right: "0",
//                       }}
//                     >
//                       Page {pageIndex + 1} of {billingChunks.length}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GenerateInvoice;










import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "../../Config/axios";
import Loader from "../Loader";

// Constants for better readability
const ITEMS_PER_PAGE = 14;

// Helper function to format currency values
const formatCurrency = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

// Helper function to format GST rates to one decimal place
const formatGstRate = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? "0.0" : num.toFixed(1);
};

// Helper function to chunk an array
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const GenerateInvoice = () => {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [fullCustomer, setFullCustomer] = useState(null);
  const [productDetailsMap, setProductDetailsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchInvoiceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const invoiceResponse = await axios.get(`/pro-billing/${id}`, { signal });
        const invoice = invoiceResponse.data;
        setInvoiceData(invoice);

        const customerId = invoice.customerId?._id;
        const billingItems = invoice.billing || [];

        const promises = [];

        // Fetch customer details
        if (customerId) {
          promises.push(axios.get(`/customer/${customerId}`, { signal }));
        } else {
          promises.push(Promise.resolve({ data: null })); // Placeholder for customer
        }

        // Fetch unique product details
        const uniqueProductIds = [
          ...new Set(
            billingItems
              .map((item) => item.productId?._id)
              .filter(Boolean) // Filter out null/undefined IDs
          ),
        ];

        if (uniqueProductIds.length > 0) {
          promises.push(
            Promise.all(
              uniqueProductIds.map((productId) =>
                axios.get(`/product/${productId}`, { signal })
              )
            )
          );
        } else {
          promises.push(Promise.resolve([])); // Placeholder for products
        }

        const [customerRes, productResponses] = await Promise.all(promises);

        setFullCustomer(customerRes.data);

        const productMap = {};
        if (Array.isArray(productResponses)) {
          productResponses.forEach((res) => {
            if (res.data) {
              productMap[res.data._id] = res.data;
            }
          });
        }
        setProductDetailsMap(productMap);
      } catch (err) {
        if (err.name === 'CanceledError') {
          console.log('Fetch aborted');
        } else {
          console.error("Error fetching invoice:", err);
          setError("Failed to load invoice. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();

    return () => {
      controller.abort(); // Abort ongoing requests on unmount
    };
  }, [id]);

  // Memoized calculations for totals
  const totals = useMemo(() => {
    if (!invoiceData?.billing) return {};
    return invoiceData.billing.reduce(
      (acc, item) => {
        acc.basicAmount += parseFloat(item.taxableAmount) || 0;
        acc.sgst += parseFloat(item.sgst) || 0;
        acc.cgst += parseFloat(item.cgst) || 0;
        acc.total += parseFloat(item.total) || 0;
        acc.totalQty += parseFloat(item.qty) || 0;
        acc.totalSchAmt += parseFloat(item.schAmt) || 0;
        return acc;
      },
      { basicAmount: 0, sgst: 0, cgst: 0, total: 0, totalQty: 0, totalSchAmt: 0 }
    );
  }, [invoiceData]);

  // Memoized GST summary
  const gstSummary = useMemo(() => {
    if (!invoiceData?.billing) return {};
    return invoiceData.billing.reduce((acc, item) => {
      const product = productDetailsMap[item.productId?._id] || {};
      const gst = parseFloat(product?.gstPercent) || 0;
      const amount = parseFloat(item.total) || 0;

      // Calculate taxable amount by removing GST from total
      // This assumes item.total already includes GST
      const taxableAmt = gst > 0 ? (amount * 100) / (100 + gst) : amount;

      if (!acc[gst]) {
        acc[gst] = { taxable: 0, sgst: 0, cgst: 0 };
      }

      acc[gst].taxable += taxableAmt;
      acc[gst].sgst += (taxableAmt * gst) / 2 / 100;
      acc[gst].cgst += (taxableAmt * gst) / 2 / 100;

      return acc;
    }, {});
  }, [invoiceData, productDetailsMap]);

  const { customer = {}, billing = [], salesmanId = {} } = invoiceData || {};
  const billingChunks = useMemo(() => chunkArray(billing, ITEMS_PER_PAGE), [billing]);

  if (error) return <p className='text-danger'>{error}</p>;
  if (loading || !invoiceData) return <Loader />;

  return (
    <div>
      <div className='container d-print-none'>
        <button
          onClick={() => window.print()}
          className='btn btn-primary my-3 d-print-none'
        >
          Print Invoice
        </button>






      </div>





      <style>
        {`
  @media print {
    /* Hide everything initially */
    body * {
      visibility: hidden;
    }

    /* Make only the print area visible */
    #print-area, #print-area * {
      visibility: visible;
      font-family: "Courier New", monospace;
    }

    #print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      max-width: 100%;
    }

    /* Clean paragraph spacing */
    p {
      margin: 0;
    }

    /* Hide print buttons, etc. */
    .d-print-none {
      display: none !important;
    }

    /* Page break control */
    .invoice-page:not(:last-child) {
      page-break-after: always;
    }

    /* Hide footers from all but the last page */
    .invoice-page:not(:last-child) .invoice-footer {
      display: none;
    }

    /* Show continuation note on non-final pages */
    .invoice-page:not(:last-child) .to-be-continued {
      display: block;
    }

    /*  Set your exact physical margins */
    @page {
      size: A4;
      margin-top: 0.35in;     /* ~8.89mm */
      margin-right: 0.13in;   /* ~3.3mm */
      margin-bottom: 0.21in;  /* ~5.3mm (assumed reasonable) */
      margin-left: 0.31in;    /* ~7.87mm */
    }
  }

  .to-be-continued {
    display: none;
    text-align: center;
    margin-top: 20px;
    font-weight: bold;
    font-family: "Courier New", monospace;
  }
`}
      </style>



      <div id='print-area' style={{ lineHeight: "1" }}>
        {billingChunks.map((chunk, pageIndex) => (
          <div
            key={pageIndex}
            className='invoice-page'
            style={{
              margin: "auto",
              fontFamily: "Courier New monospace",
              fontSize: "12px",
            }}
          >
            <div>


              <div
                style={{
                  borderBottom: "1px dashed black",
                  paddingBottom: "1px",
                  marginBottom: "1px",
                  marginTop: "0px",
                }}
              >

<div className="line-main">
<div className="liness"></div></div>


                <div className='d-flex mt-2'>
                  

                  <p style={{ marginBottom: "0px", fontSize: "14px" }}>
                    <strong>GSTIN: 23BJUPR9537F1ZK</strong>
                  </p>


                  <h2
                    style={{
                      width: "45%",
                      fontSize: "22px",
                      textAlign: "right",
                      margin: "-3px",
                      fontWeight: "900",
                    }}
                  >
                    SAMRIDDHI ENTERPRISES
                  </h2>
                </div>

                <p
                  style={{
                    margin: "1px",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  H.NO.02, NAGAR NIGAM COLONY, TIMBER MARKET, CHHOLA, BHOPAL
                </p>
                <p
                  style={{
                    margin: "1px",
                    textAlign: "center",
                    fontSize: "13px",
                  }}
                >
                  MOB: 9926793332, 9893315590
                </p>
              </div>




              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: 0,
                  padding: 0,
                  fontSize: "12px",
                  lineHeight: "1.2",
                }}
              >
                <div
                  style={{
                    width: "75%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  <strong style={{ fontSize: "0.8rem" }}>
                    <span>{fullCustomer?.ledger || "N/A"}</span>
                  </strong>
                  <span>{fullCustomer?.address1 || "N/A"}</span>
                  <span>{fullCustomer?.mobile || "N/A"}</span>
                  <strong style={{ textAlign: "center", marginTop: "-13px" }}>
                    GSTIN: {fullCustomer?.gstNumber || "N/A"}
                  </strong>
                </div>

                <div
                  style={{
                    textAlign: "left",
                    width: "35%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  <span>
                    <strong style={{ fontSize: "13px" }}>
                      Bill No:
                      <span style={{ fontWeight: "bold", }}>
                        {invoiceData._id?.slice(-6) || "N/A"}
                      </span>
                    </strong>
                  </span>


                  <div className="div flex flex-col">


                    <span>

                      <strong style={{ "lineHeight": "1" }}  >Date:</strong>
                      {new Date(customer?.Billdate).toLocaleDateString("en-GB")}{" "}
                      &nbsp; {invoiceData?.billingType || "N/A"}

                    </span>



                    <span className="d-flex align-items-center gap-1 ">

                      <strong>Salesman:</strong>
                      <span> {salesmanId?.name || "N/A"} </span>{" "}
                      <strong> M.No. </strong>
                      {salesmanId?.mobile || "-"}

                    </span>
                  </div>

                </div>


              </div>

              <Table
                bordered
                className='mt-1 table-sm'
                style={{ fontSize: "12px", borderBottom: "none" }}
              >

                <thead>
                  <tr>
                    {[
                      "SR",
                      "Item Name",
                      "HSN Code",
                      "MRP",
                      "Qty",
                      "Free",
                      "Rate",
                      "Sch%",
                      "Sch Amt",
                      "CD%",
                      "Amt",
                      "SGST",
                      "CGST",
                      "Total",
                    ].map((header) => (
                      <th
                        key={header}
                        style={{
                          border: "1px solid black",
                          padding: "2px",
                          textAlign: "center",
                          paddingLeft: header === "Item Name" ? "5px" : "2px",
                          paddingRight: header === "Item Name" ? "5px" : "2px",
                          fontWeight: "400",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>



                <tbody style={{ borderBottom: "1px solid black" }}>
                  {chunk.slice(0, 14).map((item, index) => {
                    const product = productDetailsMap[item.productId?._id] || {};
                    const gst = parseFloat(product?.gstPercent) || 0;

                    const commonBodyCellStyle = {
                      borderRight: "1px solid black",
                      padding: "2px",
                      textAlign: "right",
                    };

                    return (
                      <tr style={{ border: "none" }} key={item._id || index}>
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            ...commonBodyCellStyle,
                          }}
                        >
                          {pageIndex * 8 + index + 1}
                        </td>
                        <td
                          style={{
                            ...commonBodyCellStyle,
                            paddingLeft: "5px",
                            paddingRight: "5px",
                            whiteSpace: "nowrap",
                            textAlign: "left",
                          }}
                        >
                          {item.itemName || "N/A"}
                        </td>
                        <td style={commonBodyCellStyle}>
                          {product.hsnCode || "N/A"}
                        </td>
                        <td
                          style={{
                            ...commonBodyCellStyle,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatCurrency(product.mrp)}
                        </td>
                        <td
                          style={{
                            ...commonBodyCellStyle,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.qty || 0}
                        </td>
                        <td style={commonBodyCellStyle}>
                          {item.Free || 0}
                        </td>
                        <td style={commonBodyCellStyle}>
                          {formatCurrency(item.rate)}
                        </td>
                        <td style={commonBodyCellStyle}>
                          {item.sch || 0}
                        </td>
                        <td style={commonBodyCellStyle}>
                          {formatCurrency(item.schAmt)}
                        </td>
                        <td style={commonBodyCellStyle}>
                          {item.cd || 0}
                        </td>
                        <td style={commonBodyCellStyle}>
                          {formatCurrency(item.total)}
                        </td>
                        <td style={commonBodyCellStyle}>
                          {formatGstRate(gst / 2)}
                        </td>
                        <td style={commonBodyCellStyle}>
                          {formatGstRate(gst / 2)}
                        </td>
                        <td style={commonBodyCellStyle}>
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Optional horizontal line */}
                  {chunk.length > 0 && (
                    <tr>
                      <td colSpan={14} style={{ height: "1px", padding: 0 }}></td>
                    </tr>
                  )}

                  {/* Empty filler rows */}
                  {chunk.length < 8 &&
                    Array.from({ length: 8 - chunk.length }).map((_, i) => (
                      <tr key={`empty-${i}`}>
                        {Array.from({ length: 14 }).map((_, j) => (
                          <td
                            key={j}
                            style={{
                              borderRight: "1px solid black",
                              borderLeft: j === 0 ? "1px solid black" : undefined,
                              textAlign: "center",
                              padding: "2px",
                              height: "22px",
                            }}
                          ></td>
                        ))}
                      </tr>
                    ))}

                  {/* Final row on last page */}
                  {pageIndex === billingChunks.length - 1 && (
                    <tr style={{ fontWeight: "bold" }}>
                      <td className="border border-black p-1" style={{ textAlign: "center" }}></td>
                      <td className="border border-black p-1" style={{ textAlign: "center" }}>
                        Basic Amount: {formatCurrency(totals.total)}
                      </td>
                      <td
                        className="p-1"
                        style={{
                          borderBottom: "1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        QTY:{" "}
                      </td>
                      <td
                        className="p-1 "
                        style={{
                          whiteSpace: "nowrap",
                          borderBottom: " 1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        C/S 0
                      </td>
                      <td
                        className="p-1"
                        style={{
                          borderBottom: "1px solid black",
                          borderRight: "1px solid black",
                          borderTop: "1px solid black",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        PCS:{totals.totalQty || 0}
                      </td>
                      <td className="border border-black p-1" style={{ textAlign: "center" }}>
                        0
                      </td>
                      <td className="border border-black p-1" style={{ textAlign: "center" }}></td>
                      <td className="border border-black p-1" style={{ textAlign: "center" }}></td>
                      <td className="border border-black p-1" style={{ textAlign: "center" }}>
                        {formatCurrency(totals.totalSchAmt)}
                      </td>
                      <td className="border border-black p-1 " style={{ textAlign: "center" }}></td>
                      <td className="border border-black p-1" style={{ textAlign: "center" }}>
                        {formatCurrency(totals.total)}
                      </td>
                      <td className="border border-black p-1" style={{ textAlign: "center" }}>
                        {formatCurrency(totals.sgst)}
                      </td>
                      <td className="border border-black p-1" style={{ textAlign: "center" }}>
                        {formatCurrency(totals.cgst)}
                      </td>
                      <td className="border border-black p-1 " style={{ textAlign: "center" }}>
                        {formatCurrency(invoiceData.finalAmount)}
                      </td>
                    </tr>
                  )}
                </tbody>




              </Table>



              {/* // first page footer  */}
              {pageIndex < billingChunks.length - 1 && (
                <div
                  className='invoice-footer'
                  style={{
                    display: "flex",
                    marginTop: "-16px",
                    fontSize: "11px",
                    gap: "6px",
                    border: "1px solid black",
                    borderTop: "0",
                    width: "100%",
                    whiteSpace: "nowrap",

                  }}
                >

                  {/* left section  */}
                  {/* <div  style={{borderRight:"1px solid  black"}}>
                    <p style={{ marginBottom: "0", whiteSpace: "nowrap" }}>
                      Goods once sold will not be taken back
                    </p>
                    <p style={{ marginBottom: "0" }}>
                      Cheque bounce charges Rs. 500/-
                    </p>
                    <p style={{ marginBottom: "0" }}>Credit 7 Days Only/-</p>
                    <p style={{ marginBottom: "0" }}>
                      Subject to Bhopal jurisdiction/-
                    </p>
                    <p style={{ marginBottom: "0" }}>E.&.O.E</p>
                  </div> */}

                  <div style={{ display: "flex", alignItems: "stretch" }}>
                    {/* LEFT SECTION WITH BORDER */}
                    <div
                      style={{
                        borderRight: "1px solid black",
                        paddingTop: "0",
                        paddingBottom: "35px",
                        paddingLeft: "5px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <p style={{ marginBottom: "0", whiteSpace: "nowrap" }}>
                        Goods once sold will not be taken back
                      </p>
                      <p style={{ marginBottom: "0" }}>Cheque bounce charges Rs. 500/-</p>
                      <p style={{ marginBottom: "0" }}>Credit 7 Days Only/-</p>
                      <p style={{ marginBottom: "0" }}>Subject to Bhopal jurisdiction/-</p>
                      <p style={{ marginBottom: "0" }}>E.&.O.E</p>
                    </div>

                  </div>

                  {/* // right section */}
                  <div
                    className=''
                    style={{
                      // borderLeft: "1px solid black",
                      paddingLeft: "10px",
                      paddingTop: "0",
                      paddingBottom: "35px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        textAlign: "center",
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To be
                      continued...
                      <span style={{ display: "block", textAlign: "right" }}>
                        Page {pageIndex + 1} of {billingChunks.length}
                      </span>
                    </p>
                  </div>



                </div>
              )}




              {/* // second page footer  */}
              {pageIndex === billingChunks.length - 1 && (
                <div
                  className='invoice-footer'
                  style={{
                    display: "flex",
                    paddingBottom: "0",
                    marginTop: "-16px",
                    fontSize: "11px",
                    gap: "6px",
                    border: "1px solid black",
                    width: "100%",
                  }}
                >


                  {/* // Left section  */}
                  <div
                    style={{
                      paddingTop: "0",
                      paddingBottom: "35px",
                      paddingLeft: "5px",

                    }}
                  >
                    <p style={{ marginBottom: "0", whiteSpace: "nowrap" }}>
                      Goods once sold will not be taken back
                    </p>
                    <p style={{ marginBottom: "0" }}>
                      Cheque bounce charges Rs. 500/-
                    </p>
                    <p style={{ marginBottom: "0" }}>Credit 7 Days Only/-</p>
                    <p style={{ marginBottom: "0" }}>
                      Subject to Bhopal jurisdiction/-
                    </p>
                    <p className='mb-0'>E.&.O.ES</p>
                  </div>


                  <div
                    style={{
                      // paddingTop: "25px",
                      // paddingBottom: "25px",
                      paddingTop: "0",
                      paddingBottom: "35px",
                      borderLeft: "1px solid black",
                      paddingLeft: "15px",
                      margin: "0",
                    }}
                  >
                    {Object.entries(gstSummary).map(([rate, value]) => (
                      <p
                        style={{
                          margin: "0",
                          padding: "2px",
                          whiteSpace: "nowrap",
                        }}
                        key={rate}
                      >
                        {rate}%: SGST {formatCurrency(value.sgst)}, CGST{" "}
                        {formatCurrency(value.cgst)} ={" "}
                        {formatCurrency(value.sgst + value.cgst)} /{" "}
                        {formatCurrency(value.taxable)}
                      </p>
                    ))}
                    <p
                      style={{
                        borderTop: "1px solid black",
                        paddingLeft: "5px",
                        paddingTop: "8px",
                        marginBottom: "0",
                        borderTopStyle: "dashed",
                      }}
                    >
                      SGST AMT{" "}
                      {formatCurrency(
                        Object.values(gstSummary).reduce((sum, val) => sum + val.sgst, 0)
                      )}
                      , CGST AMT :{" "}
                      {formatCurrency(
                        Object.values(gstSummary).reduce((sum, val) => sum + val.cgst, 0)
                      )}
                    </p>
                  </div>


                  <div
                    style={{
                      width: "100%",
                      paddingRight: "5px",
                      borderLeft: "1px solid black",
                      paddingLeft: "6px",
                      fontSize: "13px",
                      position: "relative",
                    }}
                  >
                    <h5
                      style={{
                        width: "100%",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "15px",
                      }}
                    >
                      <span>Bill Amount (R):</span>
                      <span
                        style={{
                          textAlign: "right",
                          fontSize: "15px",
                        }}
                      >
                        {formatCurrency(invoiceData.finalAmount)}
                      </span>
                    </h5>
                    <span
                      style={{
                        textAlign: "right",
                        position: "absolute",
                        bottom: "5px",
                        right: "0",
                      }}
                    >
                      Page {pageIndex + 1} of {billingChunks.length}
                    </span>
                  </div>



                </div>
              )}


            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default GenerateInvoice;