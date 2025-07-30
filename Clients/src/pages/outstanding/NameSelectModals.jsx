// import React, { useEffect } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import { useSelector } from "react-redux";

// const NameSelectModals = ({
//   show,
//   onHide,
//   onSubmit,
//   selectedType,
//   selectedName,
//   setSelectedName,
// }) => {
//   const mrList = useSelector((s) => s?.salesman?.salesmen || []);
//   const areaList = useSelector((s) => s?.customer?.beats || []);

//   //   console.log("MR List:", mrList);
//   //   console.log("Area List:", areaList);

//   let options = [];

//   if (selectedType === "mrwise") {
//     options = mrList.map((mr) => mr.name);
//   } else {
//     options = areaList.map((a) => a._id);
//   }

//   // ✅ Escape key handler
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") {
//         onHide();
//       }
//     };

//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [onHide]);

//   return (
//     <Modal show={show} onHide={onHide} backdrop='static' centered>
//       <Modal.Header closeButton>
//         <Modal.Title>
//           Select {selectedType === "mrwise" ? "MR Name" : "Area Name"}
//         </Modal.Title>
//       </Modal.Header>
//       <Form onSubmit={onSubmit}>
//         <Modal.Body>
//           <Form.Group className='mb-3'>
//             <Form.Label>
//               {selectedType === "mrwise" ? "MR Name" : "Area Name"}
//             </Form.Label>
//             <Form.Select
//               value={selectedName}
//               onChange={(e) => setSelectedName(e.target.value)}
//             >
//               <option value=''>Select</option>
//               {options.map((name, index) => (
//                 <option key={index} value={name}>
//                   {name}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant='secondary' onClick={onHide}>
//             Back
//           </Button>
//           <Button variant='primary' type='submit'>
//             Show Data
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default NameSelectModals;

import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

const NameSelectModals = ({
  show,
  onHide,
  onSubmit,
  selectedType,
  selectedName,
  setSelectedName,
}) => {
  const mrList = useSelector((s) => s?.salesman?.salesmen || []);
  const areaList = useSelector((s) => s?.customer?.beats || []);
  // console.log(areaList, "areaList");
  let options = [];

  if (selectedType === "mrwise") {
    options = mrList.map((mr) => ({ id: mr._id, name: mr.name }));
  } else {
    options = areaList.map((a) => ({
      id: a.areaId,
      name: a.areaName || a.name,
    }));
  }

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onHide();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onHide]);

  return (
    <Modal show={show} onHide={onHide} backdrop='static' centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Select {selectedType === "mrwise" ? "MR Name" : "Area Name"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className='mb-3'>
            <Form.Label>
              {selectedType === "mrwise" ? "MR Name" : "Area Name"}
            </Form.Label>
            <Form.Select
              value={selectedName?.id || ""}
              onChange={(e) => {
                const selected = options.find(
                  (opt) => opt.id === e.target.value
                );
                setSelectedName(selected);
              }}
            >
              <option value=''>Select</option>
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={onHide}>
            Back
          </Button>
          <Button variant='primary' type='submit'>
            Show Data
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NameSelectModals;
