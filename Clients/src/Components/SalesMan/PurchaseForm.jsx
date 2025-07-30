import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Form, Button, Card, Table, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { BsPlusCircle, BsTrash } from "react-icons/bs";
import { MdModeEdit, MdOutlineKeyboardHide } from "react-icons/md";

import Loader from "../Loader";
import axios from "../../Config/axios";
import axiosInstance from "../../Config/axios";

import Product from "../Productss/CreateProduct/Product";
import useSearchableModal from "../../Components/SearchableModal";

import ProductModel from "./purchaseModel/ProductModel";
import BrandModels from "./purchaseModel/BrandModels";
import VendorModal from "./purchaseModel/VendorModel";

const PurchaseForm = ({ idToEdit }) => {
  const [vendors, setVendors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showProductModal, setShowProductModal] = useState(false);

  const brandRef = useRef(null);
  const productRef = useRef(null);
  const quantityRef = useRef(null); // for next field

  const [isEditingProductName, setIsEditingProductName] = useState(false);
  const [editedProductName, setEditedProductName] = useState("");

  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);

  const [editItemIndex, setEditItemIndex] = useState(null);

  // ! edit options
  const handleOpenProductModal = () => {
    setSelectedProductToEdit(null); // ✅ Ensure it opens in ADD mode
    setShowProductModal(true);
  };
  const handleCloseProductModal = () => setShowProductModal(false);

  const [purchaseData, setPurchaseData] = useState({
    vendorId: "",
    date: new Date().toISOString().split("T")[0],
    entryNumber: "",
    partyNo: "", // Moved partyNo here as it's a main purchase field
    item: {
      productId: "",
      companyId: "",
      purchaseRate: "",
      quantity: "",
      availableQty: "",
      totalAmount: "",
      discountPercent: "0",
      schemePercent: "0",
    },
  });

  const handleProductSelect = (product) => {
    console.log("Selected product", product);
    setPurchaseData((prev) => {
      const alreadySelectedBrand = prev.item.companyId;

      return {
        ...prev,
        item: {
          ...prev.item,
          productId: product._id,
          // ✅ brand/companyId only set if not already selected
          companyId: alreadySelectedBrand || product.companyId || "",
          purchaseRate: product.purchaseRate ?? "",
          availableQty: product.availableQty ?? "",
        },
      };
    });

    productModal.setShowModal(false);

    setTimeout(() => {
      document.querySelector('input[name="quantity"]')?.focus();
    }, 100);
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [itemsList, setItemsList] = useState([]);

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

      setPurchaseData((prev) => ({
        ...prev,
        // No need to set purchaseData here with initial values, it's done in useState
      }));
    } catch (err) {
      console.error("Error fetching data:", err);
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
    } catch (err) {
      console.error("Failed to fetch entry number:", err);
      toast.error("Failed to fetch entry number.");
    }
  };

  useEffect(() => {
    fetchInitialData();
    fetchEntryNumber();
  }, []);

  const handleItemChange = (e) => {
    const { name, value } = e.target;

    setPurchaseData((prev) => {
      const updatedItem = { ...prev.item, [name]: value };

      if (name === "productId") {
        const selectedProduct = products.find((p) => p._id === value);
        if (selectedProduct) {
          updatedItem.availableQty = selectedProduct.availableQty;
          updatedItem.purchaseRate = selectedProduct.purchaseRate;
          updatedItem.quantity = "";
          updatedItem.totalAmount = "";
          updatedItem.discountPercent = "0"; // Reset to default "0"
          updatedItem.schemePercent = "0"; // Reset to default "0"
        }
      }

      const rate =
        parseFloat(
          name === "purchaseRate" ? value : updatedItem.purchaseRate
        ) || 0;

      const qty =
        parseFloat(name === "quantity" ? value : updatedItem.quantity) || 0;

      const dis =
        parseFloat(
          name === "discountPercent" ? value : updatedItem.discountPercent
        ) || 0;

      const scm =
        parseFloat(
          name === "schemePercent" ? value : updatedItem.schemePercent
        ) || 0;

      if (rate && qty) {
        // ✅ Successive discount application
        const finalRate = rate * (1 - dis / 100) * (1 - scm / 100);
        const totalAmount = finalRate * qty;

        updatedItem.totalAmount = totalAmount.toFixed(2);
      }

      return { ...prev, item: updatedItem };
    });
  };

  const addItemToList = () => {
    const item = purchaseData.item;

    if (
      !item.productId ||
      !item.companyId ||
      !item.quantity ||
      !item.purchaseRate
    ) {
      toast.error(
        "Please fill all required item fields (Product, Brand, Qty, Rate)."
      );
      return;
    }

    if (editItemIndex !== null) {
      // 🛠️ Update existing item
      const updatedItems = [...itemsList];
      updatedItems[editItemIndex] = { ...item };
      setItemsList(updatedItems);
      setEditItemIndex(null);
    } else {
      // ➕ Add new item
      setItemsList((prev) => [...prev, item]);
    }

    // Reset item form
    setPurchaseData((prev) => ({
      ...prev,
      item: {
        productId: "",
        // companyId: "",
        companyId: prev.companyId, // ✅ SAME brand dubara
        quantity: "",
        availableQty: "",
        purchaseRate: "",
        discountPercent: "0", // Reset to default "0"
        schemePercent: "0", // Reset to default "0"
        totalAmount: "",
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!purchaseData.vendorId || itemsList.length === 0) {
      toast.error("Please select a vendor and add at least one item.");
      return;
    }
    if (!purchaseData.partyNo) {
      // Added validation for partyNo
      toast.error("Party No. is required.");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        vendorId: purchaseData.vendorId,
        date: purchaseData.date,
        partyNo: purchaseData.partyNo,
        entryNumber: purchaseData.entryNumber,
        availableQty: purchaseData.availableQty,
        items: itemsList,
      };

      if (editingId) {
        // This `editingId` will now be correctly set from handleEditPurchase
        await axios.put(`/purchase/${editingId}`, dataToSend);
        toast.success("Purchase updated successfully.");
      } else {
        await axios.post("/purchase", dataToSend);
        fetchEntryNumber(); // 🔄 Get next entry number for next purchase
        toast.success("Purchase saved successfully.");
      }

      // Reset form after submission (for both add and edit)
      setPurchaseData({
        vendorId: "",
        date: getCurrentDate(),
        entryNumber: "", // Will be refetched by fetchEntryNumber
        partyNo: "",
        item: {
          productId: "",
          companyId: "",
          purchaseRate: "",
          quantity: "",
          availableQty: "",
          totalAmount: "",
          discountPercent: "0",
          schemePercent: "0",
        },
      });
      setItemsList([]);
      setEditingId(null); // Clear editing ID
      fetchInitialData(); // Refresh the list of purchases
    } catch (err) {
      console.error("Error saving/updating purchase:", err);
      toast.error(
        err?.response?.data?.error || "Failed to save/update purchase."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (index) => {
    setItemsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    const form = e.target.form || document.querySelector("form");
    const focusable = Array.from(
      form.querySelectorAll(
        'input:not([type="hidden"]), select, textarea, div[data-nav]'
      )
    ).filter((el) => !el.disabled && el.offsetParent !== null);

    const currentIndex = focusable.indexOf(e.target);
    const isInsideRow = e.target.closest(".flex-nowrap");
    const rowFocusable = focusable.filter(
      (el) => el.closest(".flex-nowrap") === isInsideRow
    );

    if (e.key === "Enter") {
      e.preventDefault();
      if (rowFocusable.indexOf(e.target) === rowFocusable.length - 1) {
        addItemToList();
        setTimeout(() => {
          // brandRef.current?.focus(); // Focus back to brand input
          productRef.current?.focus(); // ✅ Ab Product pe dobara focus
        }, 100);
      } else {
        const nextIndex = focusable.indexOf(e.target) + 1;
        focusable[nextIndex]?.focus();
      }
    }

    if (["ArrowRight", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      const nextIndex =
        currentIndex < focusable.length - 1 ? currentIndex + 1 : 0;
      focusable[nextIndex]?.focus();
    }

    if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      const prevIndex =
        currentIndex > 0 ? currentIndex - 1 : focusable.length - 1;
      focusable[prevIndex]?.focus();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      const prevIndex =
        currentIndex > 0 ? currentIndex - 1 : focusable.length - 1;
      focusable[prevIndex]?.focus();
    }
  };

  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      if (e.key === "F3") {
        e.preventDefault();
        const selectedProduct = products.find(
          (p) => p._id === purchaseData.item.productId
        );
        if (selectedProduct) {
          setSelectedProductToEdit(selectedProduct);
          setShowProductModal(true);
        } else {
          // If no product is selected in the dropdown, open the modal for adding a new product
          setSelectedProductToEdit(null);
          setShowProductModal(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDownGlobal);
    return () => window.removeEventListener("keydown", handleKeyDownGlobal);
  }, [purchaseData.item.productId, products]);

  const handleSaveEditedName = async () => {
    const productId = purchaseData.item.productId;
    if (!productId || !editedProductName) {
      toast.error("Please select a product and enter a name.");
      setIsEditingProductName(false);
      return;
    }
    try {
      await axiosInstance.put(`/product/${productId}`, {
        productName: editedProductName,
      });

      const updatedProducts = products.map((p) =>
        p._id === productId ? { ...p, productName: editedProductName } : p
      );
      setProducts(updatedProducts);
      toast.success("Product name updated successfully!");
      setIsEditingProductName(false);
    } catch (err) {
      console.error("Error updating product name:", err);
      toast.error("Failed to update product name.");
      setIsEditingProductName(false);
    }
  };

  const handleEditItem = (index) => {
    const itemToEdit = itemsList[index];
    setPurchaseData((prev) => ({
      ...prev,
      item: { ...itemToEdit },
    }));
    setEditItemIndex(index); // mark the index being edited
  };

  // !model
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
  } = useSearchableModal(vendors, "name"); // vendors array & key 'name'

  const brandModal = useSearchableModal(companies, "name");
  const productModal = useSearchableModal(products, "productName");

  const handleFormNav = (e) => {
    const form = e.target.form || document.querySelector("form");
    const focusable = Array.from(
      form.querySelectorAll(
        'input:not([type="hidden"]), select, textarea, div[data-nav]'
      )
    ).filter((el) => !el.disabled && el.offsetParent !== null);

    const currentIndex = focusable.indexOf(e.target);

    if (["ArrowRight", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      const nextIndex =
        currentIndex < focusable.length - 1 ? currentIndex + 1 : 0;
      focusable[nextIndex]?.focus();
    }

    if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      const prevIndex =
        currentIndex > 0 ? currentIndex - 1 : focusable.length - 1;
      focusable[prevIndex]?.focus();
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target.name === "partyNo") {
        // brandRef.current?.focus();
        productRef.current?.focus();
        return;
      }
      const nextIndex =
        currentIndex < focusable.length - 1 ? currentIndex + 1 : 0;
      focusable[nextIndex]?.focus();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      const prevIndex =
        currentIndex > 0 ? currentIndex - 1 : focusable.length - 1;
      focusable[prevIndex]?.focus();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        // Close any open modals first
        if (showVendorModal) {
          setShowVendorModal(false);
          setTimeout(() => {
            document
              .querySelector('div[data-nav][class*="form-select"]')
              ?.focus();
          }, 100);
          return;
        }
        if (brandModal.showModal) {
          brandModal.setShowModal(false);
          setTimeout(() => {
            brandRef.current?.focus();
          }, 100);
          return;
        }
        if (productModal.showModal) {
          productModal.setShowModal(false);
          setTimeout(() => {
            productRef.current?.focus();
          }, 100);
          return;
        }
        // Handle item edit mode
        if (editItemIndex !== null) {
          setEditItemIndex(null);
          setPurchaseData((prev) => ({
            ...prev,
            item: {
              productId: "",
              companyId: "",
              quantity: "",
              availableQty: "",
              purchaseRate: "",
              discountPercent: "0",
              schemePercent: "0",
              totalAmount: "",
            },
          }));
          setTimeout(() => {
            brandRef.current?.focus();
          }, 100);
          return;
        }
        // Handle purchase edit mode
        if (editingId) {
          setEditingId(null);
          setPurchaseData({
            vendorId: "",
            date: getCurrentDate(),
            entryNumber: "",
            partyNo: "",
            item: {
              productId: "",
              companyId: "",
              quantity: "",
              availableQty: "",
              purchaseRate: "",
              discountPercent: "0",
              schemePercent: "0",
              totalAmount: "",
            },
          });
          setItemsList([]);
          fetchEntryNumber();
          setTimeout(() => {
            document
              .querySelector('div[data-nav][class*="form-select"]')
              ?.focus();
          }, 100);
        }
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [
    showVendorModal,
    brandModal.showModal,
    productModal.showModal,
    editItemIndex,
    editingId,
  ]);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        // 1. Pehle check karein kya vendor modal open hai
        if (showVendorModal) {
          setShowVendorModal(false);
          return;
        }

        // 2. Fir check karein kya item edit mode mein hai
        if (editItemIndex !== null) {
          setEditItemIndex(null);
          setPurchaseData((prev) => ({
            ...prev,
            item: {
              productId: "",
              companyId: "",
              quantity: "",
              availableQty: "",
              purchaseRate: "",
              discountPercent: "0",
              schemePercent: "0",
              totalAmount: "",
            },
          }));
          return;
        }

        // 3. Last mein check karein kya purchase edit mode mein hai
        if (editingId) {
          setEditingId(null);
          setPurchaseData({
            vendorId: "",
            date: getCurrentDate(),
            entryNumber: "",
            partyNo: "",
            item: {
              productId: "",
              companyId: "",
              quantity: "",
              availableQty: "",
              purchaseRate: "",
              discountPercent: "0",
              schemePercent: "0",
              totalAmount: "",
            },
          });
          setItemsList([]);
          fetchEntryNumber();
        }
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [showVendorModal, editItemIndex, editingId]);

  useEffect(() => {
    const handleCtrlQ = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "q") {
        e.preventDefault();
        handleSubmit({ preventDefault: () => {} }); // ✅ Fix
      }
    };

    window.addEventListener("keydown", handleCtrlQ);

    return () => {
      window.removeEventListener("keydown", handleCtrlQ);
    };
  }, [handleSubmit]);

  useEffect(() => {
    const fetchPurchaseById = async () => {
      if (idToEdit) {
        const { data } = await axiosInstance.get(`/purchase/${idToEdit}`);
        setPurchaseData({
          vendorId: data.vendorId?._id,
          entryNumber: data.entryNumber,
          partyNo: data.partyNo,
          date: dayjs(data.date).format("YYYY-MM-DD"),
          item: {
            productId: "",
            companyId: "",
            purchaseRate: "",
            quantity: "",
            availableQty: "",
            totalAmount: "",
            discountPercent: "0",
            schemePercent: "0",
          },
        });
        setItemsList(
          data.items.map((item) => ({
            ...item,
            productId: item.productId._id,
            companyId: item.companyId._id,
          }))
        );
        setEditingId(data._id);
      }
    };
    fetchPurchaseById();
  }, [idToEdit]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='mx-5'>
      <Card className='p-4 mb-4'>
        <h4 className='mb-3'>{idToEdit ? "Edit Purchase" : "Add Purchase"}</h4>
        <Form onSubmit={handleSubmit}>
          {/* Vendor and Date */}
          <Row className='mb-3 d-flex justify-content-between align-items-end'>
            <Col xs={12} sm={6} md={3}>
              <Form.Group>
                <Form.Label>Vendor</Form.Label>

                <input
                  type='text'
                  name='vendorDummy'
                  style={{ display: "none" }}
                  onKeyDown={handleFormNav}
                />

                <div
                  tabIndex={0}
                  className='form-select'
                  style={{
                    cursor: "pointer",
                    backgroundColor: "white",
                    padding: "0.375rem 0.75rem",
                  }}
                  onClick={() => setShowVendorModal(true)} // ✅ Mouse click se open
                  onFocus={() => setShowVendorModal(true)} // ✅ keyboard focus
                  onKeyDown={handleFormNav} // Changed to use handleFormNav
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
                  type='date'
                  name='date'
                  value={purchaseData.date}
                  onKeyDown={handleFormNav} // ✅ Add this
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Entry No. and Party No. */}
          <Row className='mb-3 d-flex justify-content-between align-items-end'>
            <Col xs='auto'>
              <Form.Group>
                <Form.Label>Entry No.</Form.Label>
                <Form.Control
                  onKeyDown={handleFormNav}
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
                  type='text'
                  name='brand'
                  value={
                    companies.find((c) => c._id === purchaseData.item.companyId)
                      ?.name || ""
                  }
                  onFocus={() => brandModal.setShowModal(true)}
                  onKeyDown={handleFormNav} // ✅ Yeh line add karo
                  // ref={brandRef} // 👈 add this
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
                  type='text'
                  name='partyNo'
                  onKeyDown={handleFormNav}
                  ref={brandRef} // ✅ Yahin lagao
                  value={purchaseData.partyNo}
                  required
                  onChange={(e) =>
                    setPurchaseData((prev) => ({
                      ...prev,
                      partyNo: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Buttons */}
          <Row className='mt-3 d-flex align-items-center justify-content-between flex-wrap'>
            <Col xs={12} md='auto' className='mb-2'>
              <div style={{ fontSize: "12px", color: "gray" }}>
                <span className='me-3'>
                  Press <kbd>Enter</kbd> to add items
                </span>
                <span className='me-3'>
                  Press <kbd>F3</kbd> to edit product
                </span>
                <span>
                  Press <kbd>Esc</kbd> to cancel edit
                </span>
              </div>
            </Col>

            <Col
              xs={12}
              md='auto'
              className='d-flex justify-content-end gap-2 mb-2'
            >
              <Button variant='primary' onClick={handleOpenProductModal}>
                <BsPlusCircle size={16} style={{ marginRight: "4px" }} />{" "}
                Product
              </Button>
              <Button variant='primary' onClick={addItemToList}>
                <MdOutlineKeyboardHide
                  size={16}
                  style={{ marginRight: "4px" }}
                />{" "}
                {editItemIndex !== null ? "Update Item" : "Add Item"}{" "}
                {/* Changed button text */}
              </Button>
            </Col>
          </Row>
          {/* Item Form */}
          <div style={{ overflowX: "auto" }}>
            <Row className='mb-3 flex-nowrap'>
              <Col md='auto'>
                <Form.Group>
                  <Form.Label>Product</Form.Label>
                  {isEditingProductName ? (
                    <input
                      type='text'
                      value={editedProductName}
                      onChange={(e) => setEditedProductName(e.target.value)}
                      onBlur={handleSaveEditedName}
                      autoFocus
                      className='form-select'
                    />
                  ) : (
                    <Form.Control
                      type='text'
                      name='productId'
                      value={
                        products.find(
                          (p) => p._id === purchaseData.item.productId
                        )?.productName || ""
                      }
                      onFocus={() => productModal.setShowModal(true)}
                      readOnly
                      ref={productRef} // 👈 add this
                      onKeyDown={handleFormNav}
                      data-nav // ✅ added
                      placeholder='Select Product'
                      className='form-select'
                    />
                  )}
                </Form.Group>
              </Col>
              {[
                { label: "Qty", name: "quantity" },
                {
                  label: "Available Qty",
                  name: "availableQty",
                  readOnly: true,
                },
                { label: "Rate", name: "purchaseRate" },
                { label: "DIS%", name: "discountPercent" },
                { label: "SCM%", name: "schemePercent" },
                { label: "Total", name: "totalAmount", readOnly: true },
              ].map(({ label, name, readOnly = false }) => (
                <Col key={name} md='auto'>
                  <Form.Group>
                    <Form.Label>{label}</Form.Label>

                    <Form.Control
                      type='number'
                      name={name}
                      value={purchaseData.item[name]}
                      onChange={handleItemChange}
                      onKeyDown={handleKeyDown}
                      placeholder={`Enter ${label}`}
                      readOnly={readOnly}
                      ref={quantityRef} // 👈 add this
                      className='auto-width-input'
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </div>
          {/* Items Table */}
          {itemsList.length > 0 && (
            <Table striped bordered className='mt-3'>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>DIS%</th>
                  <th>SCM%</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {itemsList.map((item, index) => {
                  const product = products.find(
                    (p) => p._id === item.productId
                  );
                  const company = companies.find(
                    (c) => c._id === item.companyId
                  );

                  return (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          editItemIndex === index ? "#e6f7ff" : "transparent",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{product?.productName || ""}</td>
                      <td>{company?.name || ""}</td>
                      <td>{item.quantity || ""}</td>
                      <td>{item.purchaseRate || ""}</td>
                      <td>{item.discountPercent || ""}</td>
                      <td>{item.schemePercent || ""}</td>
                      <td>{item.totalAmount || ""}</td>
                      <td>
                        <Button
                          variant='outline-danger'
                          size='sm'
                          onClick={() => removeItem(index)}
                          className='me-2'
                        >
                          <BsTrash />
                        </Button>
                        <Button
                          variant='outline-primary'
                          size='sm'
                          onClick={() => handleEditItem(index)}
                        >
                          <MdModeEdit />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          {/* Submit Button */}
          <Button
            variant='primary'
            type='submit' // Changed to type='submit'
            className='mt-3'
            disabled={!purchaseData.vendorId || itemsList.length === 0}
          >
            {editingId ? "Update Purchase" : "Save Purchase"}{" "}
            {/* Changed button text */}
          </Button>
        </Form>
      </Card>

      {/* Product Modal */}
      <Modal
        show={showProductModal}
        onHide={() => {
          setSelectedProductToEdit(null);
          handleCloseProductModal();
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
              handleCloseProductModal();
              setSelectedProductToEdit(null);
              fetchInitialData();
            }}
            onCancel={() => {
              handleCloseProductModal();
              setSelectedProductToEdit(null);
            }}
            productToEdit={selectedProductToEdit}
          />
        </Modal.Body>
      </Modal>

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
        handleProductSelect={handleProductSelect}
        productRef={productRef}
      />
    </div>
  );
};
export default PurchaseForm;
