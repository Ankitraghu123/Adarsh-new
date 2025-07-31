import React, { useEffect, useState, useRef, useCallback } from "react";
import { Row, Col, Form, Button, Card, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { BsPlusCircle } from "react-icons/bs";
import { MdOutlineKeyboardHide } from "react-icons/md";

import Loader from "../Loader";
import axios from "../../Config/axios";
import axiosInstance from "../../Config/axios";
import Product from "../Productss/CreateProduct/Product";
import useSearchableModal from "../../Components/SearchableModal";
import ProductModel from "./purchaseModel/ProductModel";
import BrandModels from "./purchaseModel/BrandModels";
import VendorModal from "./purchaseModel/VendorModel";
import dayjs from "dayjs";

// const defaultItem = {
//   productId: "",
//   companyId: "",
//   purchaseRate: "",
//   quantity: "",
//   availableQty: "",
//   totalAmount: "",
//   discountPercent: "0",
//   schemePercent: "0",
// };

// const PurchaseForm = ({ idToEdit }) => {
//   const [vendors, setVendors] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [focusedRowIndex, setFocusedRowIndex] = useState(null);

//   const [showProductModal, setShowProductModal] = useState(false);
//   const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
//   const [editItemIndex, setEditItemIndex] = useState(null);

//   const [itemsList, setItemsList] = useState([{ ...defaultItem }]);

//   const vendorRef = useRef(null);
//   const brandRef = useRef(null);
//   const productRef = useRef(null);
//   const dateRef = useRef(null);

//   const partyNoRef = useRef(null);

//   const [purchaseData, setPurchaseData] = useState({
//     vendorId: "",
//     date: new Date().toISOString().split("T")[0],
//     entryNumber: "",
//     partyNo: "",
//     item: { ...defaultItem },
//   });

//   // Fetch initial data and entry number
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setLoading(true);
//       try {
//         const [vRes, cRes, pRes] = await Promise.all([
//           axios.get("/vendor"),
//           axios.get("/company"),
//           axios.get("/product"),
//         ]);
//         setVendors(vRes.data);
//         setCompanies(cRes.data);
//         setProducts(pRes.data || []);
//       } catch {
//         toast.error("Failed to fetch initial data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchEntryNumber = async () => {
//       try {
//         const res = await axios.get("/purchase/next-entry-number");
//         setPurchaseData((prev) => ({
//           ...prev,
//           entryNumber: res.data.nextEntryNumber,
//         }));
//       } catch {
//         toast.error("Failed to fetch entry number.");
//       }
//     };

//     fetchInitialData();
//     fetchEntryNumber();
//   }, []);

//   // Fetch purchase for editing if idToEdit is provided
//   useEffect(() => {
//     const fetchPurchaseById = async () => {
//       if (idToEdit) {
//         setLoading(true);
//         try {
//           const { data } = await axiosInstance.get(`/purchase/${idToEdit}`);

//           setPurchaseData({
//             vendorId: data.vendorId?._id,
//             entryNumber: data.entryNumber,
//             companyId: data.items?.[0]?.companyId || "",
//             partyNo: data.partyNo,
//             date: dayjs(data.date).format("YYYY-MM-DD"),
//             item: { ...defaultItem },
//           });
//           setItemsList(
//             data.items.map((item) => ({
//               ...item,
//               productId: item.productId._id,
//               companyId: item.companyId._id,
//             }))
//           );
//           setEditingId(data._id);
//         } catch {
//           toast.error("Failed to fetch purchase details.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchPurchaseById();
//   }, [idToEdit]);

//   // Searchable modals for vendor, brand, product
//   const {
//     showModal: showVendorModal,
//     setShowModal: setShowVendorModal,
//     filterText,
//     setFilterText,
//     focusedIndex,
//     setFocusedIndex,
//     modalRef,
//     inputRef,
//     rowRefs,
//     filteredItems: filteredVendors,
//   } = useSearchableModal(vendors, "name");

//   const brandModal = useSearchableModal(companies, "name");
//   const productModal = useSearchableModal(products, "productName");

//   // Handle changes in items table inputs
//   const handleItemChange = (e, rowIndex) => {
//     const { name, value } = e.target;
//     // setItemsList((prev) => {
//     //   const updated = [...prev];
//     //   updated[rowIndex][name] = value;

//     //   if (name === "productId") {
//     //     const selectedProduct = products.find((p) => p._id === value);
//     //     if (selectedProduct) {
//     //       updated[rowIndex] = {
//     //         ...updated[rowIndex],
//     //         availableQty: selectedProduct.availableQty,
//     //         purchaseRate: selectedProduct.purchaseRate,
//     //         quantity: "",
//     //         totalAmount: "",
//     //         discountPercent: "0",
//     //         schemePercent: "0",
//     //       };
//     //     }
//     //   }

//     //   // Calculate total amount
//     //   const rate = parseFloat(updated[rowIndex].purchaseRate) || 0;
//     //   const qty = parseFloat(updated[rowIndex].quantity) || 0;
//     //   const dis = parseFloat(updated[rowIndex].discountPercent) || 0;
//     //   const scm = parseFloat(updated[rowIndex].schemePercent) || 0;

//     //   if (rate && qty) {
//     //     const finalRate = rate * (1 - dis / 100) * (1 - scm / 100);
//     //     updated[rowIndex].totalAmount = (finalRate * qty).toFixed(2);
//     //   }

//     //   return updated;
//     // });

//     setItemsList((prev) => {
//       const updated = [...prev];
//       updated[rowIndex][name] = value;

//       if (!updated[rowIndex].productId) {
//         return updated; // ✅ Product blank hai toh calculate mat karo
//       }

//       if (name === "productId") {
//         const selectedProduct = products.find((p) => p._id === value);
//         if (selectedProduct) {
//           updated[rowIndex] = {
//             ...updated[rowIndex],
//             availableQty: selectedProduct.availableQty,
//             purchaseRate: selectedProduct.purchaseRate,
//             quantity: "",
//             totalAmount: "",
//             discountPercent: "0",
//             schemePercent: "0",
//           };
//         }
//       }

//       const rate = parseFloat(updated[rowIndex].purchaseRate) || 0;
//       const qty = parseFloat(updated[rowIndex].quantity) || 0;
//       const dis = parseFloat(updated[rowIndex].discountPercent) || 0;
//       const scm = parseFloat(updated[rowIndex].schemePercent) || 0;

//       if (rate && qty) {
//         const finalRate = rate * (1 - dis / 100) * (1 - scm / 100);
//         updated[rowIndex].totalAmount = (finalRate * qty).toFixed(2);
//       }

//       return updated;
//     });
//   };

//   // Handle Enter key navigation in the items table inputs and add new row on last input
//   const handleRowKeyDown = (e, rowIndex, fieldName) => {
//     if (e.key === "Enter") {
//       e.preventDefault();

//       const form = e.target.form;
//       const focusable = Array.from(
//         form.querySelectorAll(
//           'input:not([type="hidden"]), select, textarea, div[data-nav]'
//         )
//       ).filter((el) => !el.disabled && el.offsetParent !== null);

//       const currentRow = e.target.closest("tr");
//       const rowFocusable = focusable.filter(
//         (el) => el.closest("tr") === currentRow
//       );
//       const currentIndex = rowFocusable.indexOf(e.target);

//       if (currentIndex === rowFocusable.length - 1) {
//         // If it's the last input in this row
//         setItemsList((prev) => {
//           const updated = prev.length > 0 ? [...prev] : [{ ...defaultItem }];
//           if (rowIndex === updated.length - 1) {
//             updated.push({
//               ...defaultItem,
//               companyId: purchaseData.companyId || "",
//             });
//           }
//           return updated;
//         });

//         setTimeout(() => {
//           const allRows = form.querySelectorAll("tbody tr");
//           const newRow = allRows[allRows.length - 1];
//           const firstInput = newRow.querySelector('select[name="productId"]');
//           firstInput?.focus();
//         }, 50);
//       } else {
//         // Focus next input in the same row
//         rowFocusable[currentIndex + 1]?.focus();
//       }
//     }

//     // ✅ DELETE KEY -> Delete this row
//     if (e.key === "Delete") {
//       e.preventDefault();
//       setItemsList((prev) => {
//         if (prev.length <= 1) return prev; // Don't remove the last row
//         const updated = [...prev];
//         updated.splice(rowIndex, 1);
//         return updated;
//       });
//     }

//     // ✅ F2 KEY -> Add new row
//     if (e.key === "F2") {
//       e.preventDefault();
//       setItemsList((prev) => [...prev, { ...defaultItem }]);
//       setTimeout(() => {
//         const form = e.target.form;
//         const allRows = form.querySelectorAll("tbody tr");
//         const newRow = allRows[allRows.length - 1];
//         const firstInput = newRow.querySelector('select[name="productId"]');
//         firstInput?.focus();
//       }, 50);
//     }

//     // ✅ F4 KEY -> Focus Product select & open product modal
//     if (e.key === "F4") {
//       e.preventDefault();
//       const form = e.target.form;
//       const allRows = form.querySelectorAll("tbody tr");
//       const currentRow = allRows[rowIndex];
//       const productSelect = currentRow.querySelector(
//         'select[name="productId"]'
//       );
//       productSelect?.focus();
//       // Open Product modal too
//       productModal.setShowModal(true);
//     }
//   };

//   // Add or update item from item form
//   const addItemToList = useCallback(() => {
//     const item = purchaseData.item;
//     if (
//       !item.productId ||
//       !item.companyId ||
//       !item.quantity ||
//       !item.purchaseRate
//     ) {
//       toast.error(
//         "Please fill all required item fields (Product, Brand, Qty, Rate)."
//       );
//       return;
//     }

//     if (editItemIndex !== null) {
//       const updatedItems = [...itemsList];
//       updatedItems[editItemIndex] = { ...item };
//       setItemsList(updatedItems);
//       setEditItemIndex(null);
//     } else {
//       setItemsList((prev) => [...prev, item]);
//     }
//     setPurchaseData((prev) => ({
//       ...prev,
//       item: { ...defaultItem, companyId: prev.companyId },
//     }));
//   }, [purchaseData.item, editItemIndex, itemsList]);

//   // Submit purchase form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!purchaseData.vendorId) {
//       toast.error("Please select a vendor.");
//       return;
//     }

//     if (!purchaseData.partyNo) {
//       toast.error("Party No. is required.");
//       return;
//     }

//     if (itemsList.length === 0) {
//       toast.error("Add at least one item.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const validItems = itemsList.filter((item) => item.productId);

//       if (validItems.length === 0) {
//         toast.error("No valid items found. Please select products.");
//         setLoading(false);
//         return;
//       }

//       const dataToSend = {
//         vendorId: purchaseData.vendorId,
//         date: purchaseData.date,
//         partyNo: purchaseData.partyNo,
//         entryNumber: purchaseData.entryNumber,
//         items: validItems, // ✅ Sirf valid rows jayengi
//       };

//       if (idToEdit) {
//         await axios.put(`/purchase/${editingId}`, dataToSend);
//         toast.success("Purchase updated successfully.");
//       } else {
//         await axios.post("/purchase", dataToSend);
//         toast.success("Purchase saved successfully.");
//       }

//       setPurchaseData({
//         vendorId: "",
//         date: new Date().toISOString().split("T")[0],
//         entryNumber: "",
//         partyNo: "",
//         item: { ...defaultItem },
//       });
//       setItemsList([]);
//       setEditingId(null);
//     } catch (err) {
//       toast.error(err?.response?.data?.error || "Save/update failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Keyboard shortcuts and Escape handling for modals and edit modes
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "F3") {
//         e.preventDefault();
//         const selectedProduct = products.find(
//           (p) => p._id === purchaseData.item.productId
//         );
//         setSelectedProductToEdit(selectedProduct || null);
//         setShowProductModal(true);
//       }

//       if (e.altKey && e.key.toLowerCase() === "w") {
//         e.preventDefault();
//         if (!loading) handleSubmit({ preventDefault: () => {} });
//       }

//       if (e.key === "Escape") {
//         if (showVendorModal) {
//           setShowVendorModal(false);
//           return;
//         }
//         if (brandModal.showModal) {
//           brandModal.setShowModal(false);
//           return;
//         }
//         if (productModal.showModal) {
//           productModal.setShowModal(false);
//           return;
//         }
//         if (editItemIndex !== null) {
//           setEditItemIndex(null);
//           setPurchaseData((prev) => ({ ...prev, item: { ...defaultItem } }));
//         } else if (editingId) {
//           setEditingId(null);
//           setPurchaseData({
//             vendorId: "",
//             date: new Date().toISOString().split("T")[0],
//             entryNumber: "",
//             partyNo: "",
//             item: { ...defaultItem },
//           });
//           setItemsList([]);
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [
//     purchaseData.item.productId,
//     showVendorModal,
//     brandModal.showModal,
//     productModal.showModal,
//     editItemIndex,
//     editingId,
//     loading,
//     products,
//     handleSubmit,
//   ]);

//   // Focus vendor select after data load
//   useEffect(() => {
//     if (!loading && vendors.length > 0) {
//       setTimeout(() => {
//         vendorRef.current?.focus();
//       }, 100);
//     }
//   }, [loading, vendors]);

//   const displayedItems =
//     itemsList.length > 0 ? itemsList : [{ ...defaultItem }];

//   const handleProductSelect = (product, rowIndex) => {
//     setItemsList((prev) => {
//       const updated = [...prev];
//       updated[rowIndex] = {
//         ...updated[rowIndex],
//         productId: product._id,
//         // companyId: product.companyId || "",
//         companyId: purchaseData.companyId || "", // ✅ brand id daal do
//         purchaseRate: product.purchaseRate ?? "",
//         availableQty: product.availableQty ?? "",
//       };
//       return updated;
//     });

//     productModal.setShowModal(false);

//     // Focus quantity input of same row
//     setTimeout(() => {
//       const form = document.querySelector("form");
//       const allRows = form.querySelectorAll("tbody tr");
//       const currentRow = allRows[rowIndex];
//       const qtyInput = currentRow.querySelector('input[name="quantity"]');
//       qtyInput?.focus();
//     }, 50);
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className='mx-5'>
//       <Card className='p-4 mb-4'>
//         <h4 className='mb-3'>{idToEdit ? "Edit Purchase" : "Add Purchase"}</h4>
//         <Form onSubmit={handleSubmit}>
//           {/* Vendor & Date */}
//           <Row className='mb-3 d-flex justify-content-between align-items-end'>
//             <Col xs={12} sm={6} md={3}>
//               <Form.Group>
//                 <Form.Label>Vendor</Form.Label>
//                 <div
//                   ref={vendorRef}
//                   tabIndex={0}
//                   className='form-select'
//                   style={{
//                     cursor: "pointer",
//                     backgroundColor: "white",
//                     padding: "0.375rem 0.75rem",
//                   }}
//                   onClick={() => setShowVendorModal(true)}
//                   onFocus={() => setShowVendorModal(true)}
//                   data-nav
//                 >
//                   {vendors.find((v) => v._id === purchaseData.vendorId)?.name ||
//                     "Select Vendor"}
//                 </div>
//               </Form.Group>
//             </Col>
//             <Col xs={12} sm={6} md={2} className='text-end'>
//               <Form.Group>
//                 <Form.Label>Purchase Date</Form.Label>
//                 <Form.Control
//                   type='date'
//                   name='date'
//                   ref={dateRef}
//                   value={purchaseData.date}
//                   onChange={(e) =>
//                     setPurchaseData((prev) => ({
//                       ...prev,
//                       date: e.target.value,
//                     }))
//                   }
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       brandRef.current?.focus();
//                     }
//                   }}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Entry No., Brand, Party No. */}
//           <Row className='mb-3 d-flex justify-content-between align-items-end'>
//             <Col xs='auto'>
//               <Form.Group>
//                 <Form.Label>Entry No.</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='entryNumber'
//                   value={purchaseData.entryNumber}
//                   readOnly
//                   style={{ minWidth: "100px" }}
//                 />
//               </Form.Group>
//             </Col>
//             <Col md='auto'>
//               <Form.Group>
//                 <Form.Label>Brand</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='brand'
//                   ref={brandRef}
//                   value={
//                     companies.find((c) => c._id === purchaseData.companyId)
//                       ?.name || ""
//                   }
//                   onFocus={() => brandModal.setShowModal(true)}
//                   readOnly
//                   data-nav
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       partyNoRef.current?.focus();
//                     }
//                   }}
//                   placeholder='Select Brand'
//                   className='form-select'
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Party No.</Form.Label>
//                 <Form.Control
//                   type='text'
//                   name='partyNo'
//                   value={purchaseData.partyNo}
//                   ref={partyNoRef}
//                   required
//                   onChange={(e) =>
//                     setPurchaseData((prev) => ({
//                       ...prev,
//                       partyNo: e.target.value,
//                     }))
//                   }
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       // Focus first product in table
//                       document
//                         .querySelector('select[name="productId"]')
//                         ?.focus();
//                     }
//                   }}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Buttons */}
//           <Row className='mt-3 d-flex align-items-center justify-content-between flex-wrap'>
//             <Col xs={12} md='auto' className='mb-2'>
//               <div style={{ fontSize: "12px", color: "gray" }}>
//                 <span className='me-3'>
//                   Press <kbd>Enter</kbd> to add items
//                 </span>
//                 <span className='me-3'>
//                   Press <kbd>F3</kbd> to edit product
//                 </span>
//                 <span>
//                   Press <kbd>Esc</kbd> to cancel edit
//                 </span>
//               </div>
//             </Col>
//             <Col
//               xs={12}
//               md='auto'
//               className='d-flex justify-content-end gap-2 mb-2'
//             >
//               <Button
//                 variant='primary'
//                 onClick={() => setShowProductModal(true)}
//               >
//                 <BsPlusCircle size={16} style={{ marginRight: "4px" }} />{" "}
//                 Product
//               </Button>
//               <Button variant='primary' onClick={addItemToList}>
//                 <MdOutlineKeyboardHide
//                   size={16}
//                   style={{ marginRight: "4px" }}
//                 />{" "}
//                 {editItemIndex !== null ? "Update Item" : "Add Item"}
//               </Button>
//             </Col>
//           </Row>

//           {/* Items Table */}
//           <div style={{ overflowX: "auto" }}>
//             <table className='table'>
//               <thead className='table-secondary'>
//                 <tr>
//                   <th>Product</th>
//                   <th>Qty</th>
//                   <th>Available Qty</th>
//                   <th>Rate</th>
//                   <th>DIS%</th>
//                   <th>SCM%</th>
//                   <th>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayedItems.map((row, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {/* Product select */}
//                     <td style={{ minWidth: "200px" }}>
//                       <Form.Control
//                         type='text'
//                         name='productId'
//                         value={
//                           products.find((p) => p._id === row.productId)
//                             ?.productName || ""
//                         }
//                         placeholder='Select Product'
//                         readOnly
//                         // onFocus={() => productModal.setShowModal(true)}
//                         onKeyDown={(e) =>
//                           handleRowKeyDown(e, rowIndex, "productId")
//                         }
//                         onFocus={() => {
//                           setFocusedRowIndex(rowIndex);
//                           productModal.setShowModal(true);
//                         }}
//                         data-nav
//                         style={{ cursor: "pointer" }}
//                       />
//                     </td>

//                     {/* Other inputs */}
//                     {[
//                       { name: "quantity" },
//                       { name: "availableQty", readOnly: true },
//                       { name: "purchaseRate" },
//                       { name: "discountPercent" },
//                       { name: "schemePercent" },
//                       { name: "totalAmount", readOnly: true },
//                     ].map(({ name, readOnly = false }, colIndex) => (
//                       <td key={colIndex} style={{ minWidth: "150px" }}>
//                         <input
//                           type='number'
//                           name={name}
//                           value={row[name]}
//                           onChange={(e) => handleItemChange(e, rowIndex)}
//                           readOnly={readOnly}
//                           placeholder={`Enter ${name}`}
//                           className='form-control'
//                           onKeyDown={(e) => handleRowKeyDown(e, rowIndex, name)}
//                           style={{ minWidth: "100px", height: "30px" }}
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Submit */}
//           <Button
//             variant='primary'
//             type='submit'
//             className='mt-3'
//             disabled={!purchaseData.vendorId || itemsList.length === 0}
//           >
//             {editingId ? "Update Purchase" : "Save Purchase"}
//           </Button>
//         </Form>
//       </Card>

//       {/* Product Modal */}
//       <Modal
//         show={showProductModal}
//         onHide={() => {
//           setSelectedProductToEdit(null);
//           setShowProductModal(false);
//         }}
//         size='lg'
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {selectedProductToEdit ? "Edit Product" : "Add New Product"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Product
//             onSuccess={() => {
//               setShowProductModal(false);
//               setSelectedProductToEdit(null);
//             }}
//             onCancel={() => {
//               setShowProductModal(false);
//               setSelectedProductToEdit(null);
//             }}
//             productToEdit={selectedProductToEdit}
//           />
//         </Modal.Body>
//       </Modal>

//       {/* Vendor Modal */}
//       <VendorModal
//         showModal={showVendorModal}
//         setShowModal={setShowVendorModal}
//         filterText={filterText}
//         setFilterText={setFilterText}
//         focusedIndex={focusedIndex}
//         setFocusedIndex={setFocusedIndex}
//         modalRef={modalRef}
//         inputRef={inputRef}
//         rowRefs={rowRefs}
//         filteredItems={filteredVendors}
//         setPurchaseData={setPurchaseData}
//       />

//       {/* Brand Modal */}
//       <BrandModels
//         showModal={brandModal.showModal}
//         setShowModal={brandModal.setShowModal}
//         filterText={brandModal.filterText}
//         setFilterText={brandModal.setFilterText}
//         focusedIndex={brandModal.focusedIndex}
//         setFocusedIndex={brandModal.setFocusedIndex}
//         modalRef={brandModal.modalRef}
//         inputRef={brandModal.inputRef}
//         rowRefs={brandModal.rowRefs}
//         filteredItems={brandModal.filteredItems}
//         setPurchaseData={setPurchaseData}
//         brandRef={brandRef}
//         partyNoRef={partyNoRef}
//       />

//       {/* Product Modal */}
//       <ProductModel
//         showModal={productModal.showModal}
//         setShowModal={productModal.setShowModal}
//         filterText={productModal.filterText}
//         setFilterText={productModal.setFilterText}
//         focusedIndex={productModal.focusedIndex}
//         setFocusedIndex={productModal.setFocusedIndex}
//         modalRef={productModal.modalRef}
//         inputRef={productModal.inputRef}
//         rowRefs={productModal.rowRefs}
//         filteredItems={productModal.filteredItems}
//         handleProductSelect={(product) =>
//           handleProductSelect(product, focusedRowIndex)
//         }
//       />
//     </div>
//   );
// };

// export default PurchaseForm;

const defaultItem = {
  productId: "",
  companyId: "",
  purchaseRate: "",
  quantity: "",
  availableQty: "",
  totalAmount: "",
  discountPercent: "0",
  schemePercent: "0",
};

const PurchaseForm = ({ idToEdit }) => {
  const [vendors, setVendors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedRowIndex, setFocusedRowIndex] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [itemsList, setItemsList] = useState([{ ...defaultItem }]);

  const dateRef = useRef(null);
  const vendorRef = useRef(null);
  const brandRef = useRef(null);
  const partyNoRef = useRef(null);

  const [purchaseData, setPurchaseData] = useState({
    vendorId: "",
    date: new Date().toISOString().split("T")[0],
    entryNumber: "",
    partyNo: "",
    item: { ...defaultItem },
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [vRes, cRes, pRes] = await Promise.all([
          axios.get("/vendor"),
          axios.get("/company"),
          axios.get("/product"),
        ]);
        setVendors(vRes.data);
        setCompanies(cRes.data);
        setProducts(pRes.data || []);
      } catch {
        toast.error("Failed to fetch initial data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchEntryNumber = async () => {
      try {
        const res = await axios.get("/purchase/next-entry-number");
        setPurchaseData((prev) => ({
          ...prev,
          entryNumber: res.data.nextEntryNumber,
        }));
      } catch {
        toast.error("Failed to fetch entry number.");
      }
    };

    fetchInitialData();
    fetchEntryNumber();
  }, []);

  // Fetch purchase for editing
  useEffect(() => {
    const fetchPurchaseById = async () => {
      if (idToEdit) {
        setLoading(true);
        try {
          const { data } = await axios.get(`/purchase/${idToEdit}`);

          setPurchaseData({
            vendorId: data.vendorId?._id,
            entryNumber: data.entryNumber,
            companyId: data.items?.[0]?.companyId || "",
            partyNo: data.partyNo,
            date: dayjs(data.date).format("YYYY-MM-DD"),
            item: { ...defaultItem },
          });
          setItemsList(
            data.items.map((item) => ({
              ...item,
              productId: item.productId._id,
              companyId: item.companyId._id,
            }))
          );
          setEditingId(data._id);
        } catch {
          toast.error("Failed to fetch purchase details.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPurchaseById();
  }, [idToEdit]);

  // Searchable modals
  const {
    showModal: showVendorModal,
    setShowModal: setShowVendorModal,
    filterText,
    setFilterText,
    focusedIndex,
    setFocusedIndex,
    modalRef,
    inputRef,
    rowRefs,
    filteredItems: filteredVendors,
  } = useSearchableModal(vendors, "name");

  const brandModal = useSearchableModal(companies, "name");
  const productModal = useSearchableModal(products, "productName");

  // Handle item changes
  const handleItemChange = (e, rowIndex) => {
    const { name, value } = e.target;
    setItemsList((prev) => {
      const updated = [...prev];
      updated[rowIndex][name] = value;

      if (name === "productId") {
        const selectedProduct = products.find((p) => p._id === value);
        if (selectedProduct) {
          updated[rowIndex] = {
            ...updated[rowIndex],
            availableQty: selectedProduct.availableQty,
            purchaseRate: selectedProduct.purchaseRate,
            quantity: "",
            totalAmount: "",
            discountPercent: "0",
            schemePercent: "0",
          };
        }
      }

      const rate = parseFloat(updated[rowIndex].purchaseRate) || 0;
      const qty = parseFloat(updated[rowIndex].quantity) || 0;
      const dis = parseFloat(updated[rowIndex].discountPercent) || 0;
      const scm = parseFloat(updated[rowIndex].schemePercent) || 0;

      if (rate && qty) {
        const finalRate = rate * (1 - dis / 100) * (1 - scm / 100);
        updated[rowIndex].totalAmount = (finalRate * qty).toFixed(2);
      }

      return updated;
    });
  };

  // Handle row key navigation
  const handleRowKeyDown = (e, rowIndex, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const form = e.target.form;
      const focusable = Array.from(
        form.querySelectorAll("input, select, [data-nav]")
      ).filter((el) => !el.disabled);

      const currentRow = e.target.closest("tr");
      const rowFocusable = focusable.filter(
        (el) => el.closest("tr") === currentRow
      );
      const currentIndex = rowFocusable.indexOf(e.target);

      if (currentIndex === rowFocusable.length - 1) {
        setItemsList((prev) => {
          const updated = [...prev];
          if (rowIndex === updated.length - 1) {
            updated.push({ ...defaultItem });
          }
          return updated;
        });

        setTimeout(() => {
          const allRows = form.querySelectorAll("tbody tr");
          const newRow = allRows[allRows.length - 1];
          const firstInput = newRow.querySelector('select[name="productId"]');
          firstInput?.focus();
        }, 50);
      } else {
        rowFocusable[currentIndex + 1]?.focus();
      }
    }

    if (e.key === "Delete") {
      e.preventDefault();
      setItemsList((prev) => {
        if (prev.length <= 1) return prev;
        const updated = [...prev];
        updated.splice(rowIndex, 1);
        return updated;
      });
    }

    if (e.key === "F2") {
      e.preventDefault();
      setItemsList((prev) => [...prev, { ...defaultItem }]);
      setTimeout(() => {
        const form = e.target.form;
        const allRows = form.querySelectorAll("tbody tr");
        const newRow = allRows[allRows.length - 1];
        const firstInput = newRow.querySelector('select[name="productId"]');
        firstInput?.focus();
      }, 50);
    }

    if (e.key === "F4") {
      e.preventDefault();
      const form = e.target.form;
      const allRows = form.querySelectorAll("tbody tr");
      const currentRow = allRows[rowIndex];
      const productSelect = currentRow.querySelector(
        'select[name="productId"]'
      );
      productSelect?.focus();
      productModal.setShowModal(true);
    }
  };

  // Add item to list
  const addItemToList = useCallback(() => {
    const item = purchaseData.item;
    if (!item.productId || !item.quantity || !item.purchaseRate) {
      toast.error("Please fill all required item fields.");
      return;
    }

    if (editItemIndex !== null) {
      const updatedItems = [...itemsList];
      updatedItems[editItemIndex] = { ...item };
      setItemsList(updatedItems);
      setEditItemIndex(null);
    } else {
      setItemsList((prev) => [...prev, item]);
    }
    setPurchaseData((prev) => ({
      ...prev,
      item: { ...defaultItem },
    }));
  }, [purchaseData.item, editItemIndex, itemsList]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !purchaseData.vendorId ||
      !purchaseData.partyNo ||
      itemsList.length === 0
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const validItems = itemsList.filter((item) => item.productId);
      const dataToSend = {
        vendorId: purchaseData.vendorId,
        date: purchaseData.date,
        partyNo: purchaseData.partyNo,
        entryNumber: purchaseData.entryNumber,
        items: validItems,
      };

      if (idToEdit) {
        await axios.put(`/purchase/${editingId}`, dataToSend);
        toast.success("Purchase updated successfully.");
      } else {
        await axios.post("/purchase", dataToSend);
        toast.success("Purchase saved successfully.");
      }

      setPurchaseData({
        vendorId: "",
        date: new Date().toISOString().split("T")[0],
        entryNumber: "",
        partyNo: "",
        item: { ...defaultItem },
      });
      setItemsList([{ ...defaultItem }]);
      setEditingId(null);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F3") {
        e.preventDefault();
        const selectedProduct = products.find(
          (p) => p._id === purchaseData.item.productId
        );
        setSelectedProductToEdit(selectedProduct || null);
        setShowProductModal(true);
      }

      if (e.altKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        if (!loading) handleSubmit({ preventDefault: () => {} });
      }

      if (e.key === "Escape") {
        if (showVendorModal) setShowVendorModal(false);
        else if (brandModal.showModal) brandModal.setShowModal(false);
        else if (productModal.showModal) productModal.setShowModal(false);
        else if (editItemIndex !== null) {
          setEditItemIndex(null);
          setPurchaseData((prev) => ({ ...prev, item: { ...defaultItem } }));
        } else if (editingId) {
          setEditingId(null);
          setPurchaseData({
            vendorId: "",
            date: new Date().toISOString().split("T")[0],
            entryNumber: "",
            partyNo: "",
            item: { ...defaultItem },
          });
          setItemsList([{ ...defaultItem }]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    purchaseData.item.productId,
    showVendorModal,
    brandModal.showModal,
    productModal.showModal,
    editItemIndex,
    editingId,
    loading,
    products,
  ]);

  // Initial focus
  useEffect(() => {
    if (!loading && vendors.length > 0) {
      setTimeout(() => {
        dateRef.current?.focus();
      }, 100);
    }
  }, [loading, vendors]);

  // Handle product selection
  const handleProductSelect = (product, rowIndex) => {
    setItemsList((prev) => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        productId: product._id,
        companyId: purchaseData.companyId || "",
        purchaseRate: product.purchaseRate ?? "",
        availableQty: product.availableQty ?? "",
      };
      return updated;
    });

    productModal.setShowModal(false);

    setTimeout(() => {
      const form = document.querySelector("form");
      const allRows = form.querySelectorAll("tbody tr");
      const currentRow = allRows[rowIndex];
      const qtyInput = currentRow.querySelector('input[name="quantity"]');
      qtyInput?.focus();
    }, 50);
  };

  if (loading) return <Loader />;

  return (
    <div className='mx-5'>
      <Card className='p-4 mb-4'>
        <h4 className='mb-3'>{idToEdit ? "Edit Purchase" : "Add Purchase"}</h4>
        <Form onSubmit={handleSubmit}>
          {/* Vendor & Date */}
          <Row className='mb-3 d-flex justify-content-between align-items-end'>
            <Col xs={12} sm={6} md={3}>
              <Form.Group>
                <Form.Label>Vendor</Form.Label>
                <div
                  ref={vendorRef}
                  tabIndex={0}
                  className='form-select'
                  style={{
                    cursor: "pointer",
                    backgroundColor: "white",
                    padding: "0.375rem 0.75rem",
                  }}
                  onClick={() => setShowVendorModal(true)}
                  onFocus={() => setShowVendorModal(true)}
                  data-nav
                >
                  {vendors.find((v) => v._id === purchaseData.vendorId)?.name ||
                    "Select Vendor"}
                </div>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={2} className='text-end'>
              <Form.Group>
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control
                  ref={dateRef}
                  type='date'
                  name='date'
                  value={purchaseData.date}
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      brandRef.current?.focus();
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Entry No., Brand, Party No. */}
          <Row className='mb-3 d-flex justify-content-between align-items-end'>
            <Col xs='auto'>
              <Form.Group>
                <Form.Label>Entry No.</Form.Label>
                <Form.Control
                  type='text'
                  name='entryNumber'
                  value={purchaseData.entryNumber}
                  readOnly
                  style={{ minWidth: "100px" }}
                />
              </Form.Group>
            </Col>
            <Col md='auto'>
              <Form.Group>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  ref={brandRef}
                  type='text'
                  name='brand'
                  value={
                    companies.find((c) => c._id === purchaseData.companyId)
                      ?.name || ""
                  }
                  onFocus={() => brandModal.setShowModal(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      partyNoRef.current?.focus();
                    }
                  }}
                  readOnly
                  data-nav
                  placeholder='Select Brand'
                  className='form-select'
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Party No.</Form.Label>
                <Form.Control
                  ref={partyNoRef}
                  type='text'
                  name='partyNo'
                  value={purchaseData.partyNo}
                  required
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      partyNo: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const firstProductSelect = document.querySelector(
                        'tbody tr:first-child select[name="productId"]'
                      );
                      if (firstProductSelect) {
                        firstProductSelect.focus();
                        setFocusedRowIndex(0);
                        productModal.setShowModal(true);
                      }
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Buttons */}
          <Row className='mt-3 d-flex align-items-center justify-content-between flex-wrap'>
            <Col xs={12} md='auto' className='mb-2'>
              <div style={{ fontSize: "12px", color: "gray" }}>
                <span className='me-3'>
                  Press <kbd>Enter</kbd> to navigate
                </span>
                <span className='me-3'>
                  Press <kbd>F2</kbd> to add row
                </span>
                <span>
                  Press <kbd>Esc</kbd> to cancel
                </span>
              </div>
            </Col>
            <Col
              xs={12}
              md='auto'
              className='d-flex justify-content-end gap-2 mb-2'
            >
              <Button
                variant='primary'
                onClick={() => setShowProductModal(true)}
              >
                <BsPlusCircle size={16} style={{ marginRight: "4px" }} />{" "}
                Product
              </Button>
              <Button variant='primary' onClick={addItemToList}>
                <MdOutlineKeyboardHide
                  size={16}
                  style={{ marginRight: "4px" }}
                />{" "}
                {editItemIndex !== null ? "Update Item" : "Add Item"}
              </Button>
            </Col>
          </Row>

          {/* Items Table */}
          <div style={{ overflowX: "auto" }}>
            <table className='table'>
              <thead className='table-secondary'>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Available Qty</th>
                  <th>Rate</th>
                  <th>DIS%</th>
                  <th>SCM%</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {itemsList.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td style={{ minWidth: "200px" }}>
                      <Form.Control
                        as='select'
                        name='productId'
                        value={row.productId}
                        onChange={(e) => handleItemChange(e, rowIndex)}
                        onFocus={() => {
                          setFocusedRowIndex(rowIndex);
                          productModal.setShowModal(true);
                        }}
                        onKeyDown={(e) =>
                          handleRowKeyDown(e, rowIndex, "productId")
                        }
                        className='form-select'
                        style={{ cursor: "pointer" }}
                      >
                        <option value=''>Select Product</option>
                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.productName}
                          </option>
                        ))}
                      </Form.Control>
                    </td>
                    {[
                      { name: "quantity" },
                      { name: "availableQty", readOnly: true },
                      { name: "purchaseRate" },
                      { name: "discountPercent" },
                      { name: "schemePercent" },
                      { name: "totalAmount", readOnly: true },
                    ].map(({ name, readOnly = false }, colIndex) => (
                      <td key={colIndex} style={{ minWidth: "150px" }}>
                        <input
                          type='number'
                          name={name}
                          value={row[name]}
                          onChange={(e) => handleItemChange(e, rowIndex)}
                          readOnly={readOnly}
                          placeholder={`Enter ${name}`}
                          className='form-control'
                          onKeyDown={(e) => handleRowKeyDown(e, rowIndex, name)}
                          style={{ minWidth: "100px", height: "30px" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button
            variant='primary'
            type='submit'
            className='mt-3'
            disabled={!purchaseData.vendorId || itemsList.length === 0}
          >
            {editingId ? "Update Purchase" : "Save Purchase"}
          </Button>
        </Form>
      </Card>

      {/* Modals */}
      <Modal
        show={showProductModal}
        onHide={() => {
          setSelectedProductToEdit(null);
          setShowProductModal(false);
        }}
        size='lg'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProductToEdit ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Product
            onSuccess={() => {
              setShowProductModal(false);
              setSelectedProductToEdit(null);
            }}
            onCancel={() => {
              setShowProductModal(false);
              setSelectedProductToEdit(null);
            }}
            productToEdit={selectedProductToEdit}
          />
        </Modal.Body>
      </Modal>

      {/* Vendor Modal */}
      <VendorModal
        showModal={showVendorModal}
        setShowModal={setShowVendorModal}
        filterText={filterText}
        setFilterText={setFilterText}
        focusedIndex={focusedIndex}
        setFocusedIndex={setFocusedIndex}
        modalRef={modalRef}
        inputRef={inputRef}
        rowRefs={rowRefs}
        filteredItems={filteredVendors}
        setPurchaseData={setPurchaseData}
      />

      <BrandModels
        showModal={brandModal.showModal}
        setShowModal={brandModal.setShowModal}
        filterText={brandModal.filterText}
        setFilterText={brandModal.setFilterText}
        focusedIndex={brandModal.focusedIndex}
        setFocusedIndex={brandModal.setFocusedIndex}
        modalRef={brandModal.modalRef}
        inputRef={brandModal.inputRef}
        rowRefs={brandModal.rowRefs}
        filteredItems={brandModal.filteredItems}
        setPurchaseData={setPurchaseData}
        brandRef={brandRef}
        partyNoRef={partyNoRef}
      />

      <ProductModel
        showModal={productModal.showModal}
        setShowModal={productModal.setShowModal}
        filterText={productModal.filterText}
        setFilterText={productModal.setFilterText}
        focusedIndex={productModal.focusedIndex}
        setFocusedIndex={productModal.setFocusedIndex}
        modalRef={productModal.modalRef}
        inputRef={productModal.inputRef}
        rowRefs={productModal.rowRefs}
        filteredItems={productModal.filteredItems}
        handleProductSelect={(product) =>
          handleProductSelect(product, focusedRowIndex)
        }
      />
    </div>
  );
};

export default PurchaseForm;
