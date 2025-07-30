// import React, { useEffect, useState, useRef } from "react";
// import { Tabs, Tab } from "react-bootstrap";
// import ProductForm from "./ProductForm";
// import ProductList from "./ProductList";

// const ProductTabs = () => {
//   const [key, setKey] = useState("form");
//   const [productToEdit, setProductToEdit] = useState(null);
//   const [refreshListFlag, setRefreshListFlag] = useState(0); // Trigger
//   const formTabRef = useRef(null);

//   useEffect(() => {
//     if (key === "form" && formTabRef.current) {
//       // try to focus the first input or button inside the form tab
//       const firstInput = formTabRef.current.querySelector(
//         "input, select, textarea, button, [tabindex]:not([tabindex='-1'])"
//       );
//       if (firstInput) firstInput.focus();
//     }
//   }, [key]);

//   const handleEdit = (product) => {
//     setProductToEdit(product);
//     setKey("form"); // Switch to form tab
//   };

//   const handleSuccess = () => {
//     setProductToEdit(null); // Reset edit mode
//     setRefreshListFlag((prev) => prev + 1); // Change flag to trigger refresh
//     setKey("list"); // Go back to list after success
//   };

//   return (
//     <div className='container mt-3'>
//       <Tabs
//         activeKey={key}
//         onSelect={(k) => setKey(k)}
//         className='mb-3'
//         justify
//       >
//         <Tab
//           eventKey='form'
//           title={productToEdit ? "Edit Product" : "Add Product"}
//         >
//           <div ref={formTabRef}>
//             <ProductForm
//               onSuccess={handleSuccess}
//               productToEdit={productToEdit}
//             />
//           </div>
//         </Tab>
//         <Tab eventKey='list' title='Product List'>
//           <ProductList onEdit={handleEdit} refreshFlag={refreshListFlag} />
//         </Tab>
//       </Tabs>
//     </div>
//   );
// };

// export default ProductTabs;

import React, { useEffect, useState, useRef } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";

const ProductTabs = () => {
  const [key, setKey] = useState("form");
  const [productToEdit, setProductToEdit] = useState(null);
  const [refreshListFlag, setRefreshListFlag] = useState(0);
  const formTabRef = useRef(null);

  // ✅ Jab page load ho tab auto-focus
  useEffect(() => {
    if (key === "form" && formTabRef.current) {
      const firstInput = formTabRef.current.querySelector(
        "input, select, textarea, button, [tabindex]:not([tabindex='-1'])"
      );
      if (firstInput) firstInput.focus();
    }
  }, [key]);

  // ✅ Arrow keys for tab switch
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        if (key === "form") setKey("list");
      } else if (e.key === "ArrowLeft") {
        if (key === "list") setKey("form");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key]);

  const handleEdit = (product) => {
    setProductToEdit(product);
    setKey("form");
  };

  const handleSuccess = () => {
    setProductToEdit(null);
    setRefreshListFlag((prev) => prev + 1);
    setKey("list");
  };

  return (
    <div className='container mt-3'>
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className='mb-3'
        justify
      >
        <Tab
          eventKey='form'
          title={productToEdit ? "Edit Product" : "Add Product"}
        >
          <div ref={formTabRef}>
            <ProductForm
              onSuccess={handleSuccess}
              productToEdit={productToEdit}
            />
          </div>
        </Tab>

        <Tab eventKey='list' title='Product List'>
          <ProductList onEdit={handleEdit} refreshFlag={refreshListFlag} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProductTabs;
