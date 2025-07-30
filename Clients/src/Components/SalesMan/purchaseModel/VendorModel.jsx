import React from "react";

const VendorModal = ({
  showModal,
  setShowModal,
  filterText,
  setFilterText,
  focusedIndex,
  setFocusedIndex,
  modalRef,
  inputRef,
  rowRefs,
  filteredItems,
  setPurchaseData,
}) => {
  if (!showModal) return null;

  return (
    <div
      className='modal-overlay'
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
      onClick={() => setShowModal(false)}
    >
      <div
        className='modal-body'
        ref={modalRef}
        style={{
          width: "80%",
          margin: "5% auto",
          backgroundColor: "white",
          padding: "1rem",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex((prev) =>
              prev < filteredItems.length - 1 ? prev + 1 : 0
            );
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredItems.length - 1
            );
          }
          if (e.key === "Enter" && focusedIndex >= 0) {
            e.preventDefault();
            const selected = filteredItems[focusedIndex];
            setPurchaseData((prev) => ({
              ...prev,
              vendorId: selected._id,
            }));
            setShowModal(false);
            // Focus the date input
            setTimeout(() => {
              document.querySelector('input[name="date"]')?.focus();
            }, 100);
          }
          if (e.key === "Escape") {
            e.preventDefault();
            setShowModal(false);
            // Refocus the vendor input
            setTimeout(() => {
              document
                .querySelector('div[data-nav][class*="form-select"]')
                ?.focus();
            }, 100);
          }
        }}
      >
        <input
          ref={inputRef}
          className='form-control mb-3'
          placeholder='Search vendor...'
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            setFocusedIndex(0);
          }}
        />

        <table className='table table-hover table-bordered'>
          <thead className='table-light'>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((vendor, idx) => (
              <tr
                key={vendor._id}
                ref={(el) => (rowRefs.current[idx] = el)}
                className={idx === focusedIndex ? "table-active" : ""}
                onClick={() => {
                  setPurchaseData((prev) => ({
                    ...prev,
                    vendorId: vendor._id,
                  }));
                  setShowModal(false);
                }}
              >
                <td>{vendor.name}</td>
                <td>{vendor.mobile}</td>
                <td>{vendor.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorModal;
