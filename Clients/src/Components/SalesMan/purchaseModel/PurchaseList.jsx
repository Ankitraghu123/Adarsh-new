import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table,
  Modal,
} from "react-bootstrap";

// import Loader from "../Loader";
import toast from "react-hot-toast";
import { BsPlusCircle, BsTrash } from "react-icons/bs";

import { MdModeEdit, MdOutlineKeyboardHide } from "react-icons/md";

import { confirmAlert } from "react-confirm-alert";
import dayjs from "dayjs";

import CustomDataTable from "../../CustomDataTable";
import axiosInstance from "../../../Config/axios";

const PurchaseList = ({ onEdit }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this purchase?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              setLoading(true);
              await axiosInstance.delete(`/purchase/${id}`);
              toast.success("Purchase deleted successfully.");
              fetchInitialData();
            } catch (err) {
              console.error("Error deleting purchase:", err);
              toast.error("Failed to delete purchase.");
            } finally {
              setLoading(false);
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            // do nothing
          },
        },
      ],
    });
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const purRes = await axiosInstance.get("/purchase");

      setPurchases(purRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch initial data.");
    } finally {
      setLoading(false);
    }
  };

  // const handleEditPurchase = (purchase) => {
  //   // Set the main purchase form fields for editing
  //   setPurchaseData({
  //     entryNumber: purchase.entryNumber,
  //     partyNo: purchase.partyNo,
  //     vendorId: purchase.vendorId?._id || "",
  //     date: dayjs(purchase.date).format("YYYY-MM-DD"),
  //     item: {
  //       // Reset item fields when loading a new purchase for editing
  //       productId: "",
  //       quantity: "",
  //       purchaseRate: "",
  //       availableQty: "",
  //       totalAmount: "",
  //       discountPercent: "0",
  //       schemePercent: "0",
  //     },
  //   });

  //   // Prefill the items list with the purchase's existing items
  //   setItemsList(
  //     purchase.items.map((item) => ({
  //       ...item,
  //       productId: item.productId._id, // Ensure it's just the ID
  //       companyId: item.companyId._id, // Ensure it's just the ID
  //     }))
  //   );
  //   setEditingId(purchase._id); // ✅ THIS IS CRUCIAL: Set the ID of the purchase being edited
  //   setEditItemIndex(null); // Ensure no individual item is in edit mode when starting a purchase edit
  // };

  const handleEditPurchase = (purchase) => {
    onEdit(purchase._id); // ✅ pass ID to parent
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const getPurchaseColumns = (handleEditPurchase, handleDelete) => [
    {
      name: "SR",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "70px",
    },
    {
      name: "Entry No.",
      selector: (row) => row.entryNumber,
      sortable: true,
    },
    {
      name: "Party No.",
      selector: (row) => row.partyNo,
      sortable: true,
    },
    {
      name: "Vendor",
      selector: (row) => row.vendorId?.name || "-",
      sortable: true,
    },
    {
      name: "Items Count",
      selector: (row) => row.items?.length || 0,
      sortable: false,
    },
    {
      name: "Item Quantity",
      selector: (row) =>
        row.items?.map((i, idx) => (
          <div key={idx}>
            {i.productId?.productName}: {i.quantity}
          </div>
        )),
      wrap: true,
    },
    {
      name: "Item Rate",
      selector: (row) =>
        row.items?.map((i, idx) => <div key={idx}>₹{i.purchaseRate}</div>),
      wrap: true,
    },
    {
      name: "Total Amount",
      selector: (row) =>
        row.items?.map((i, idx) => <div key={idx}>₹{i.totalAmount}</div>),
      wrap: true,
    },
    {
      name: "Purchase Date",
      selector: (row) => dayjs(row.date).format("DD MMM YYYY"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className='d-flex gap-2'>
          <Button
            variant='warning'
            size='sm'
            onClick={() => handleEditPurchase(row)}
          >
            <MdModeEdit />
          </Button>
          <Button
            variant='danger'
            size='sm'
            onClick={() => handleDelete(row._id)}
          >
            <BsTrash />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div>
      {/* Purchase List */}
      <Card className='p-3 mt-4'>
        <h5>Purchase List</h5>
        {purchases.length === 0 ? (
          <p>No purchases found.</p>
        ) : (
          <CustomDataTable
            title=''
            columns={getPurchaseColumns(handleEditPurchase, handleDelete)}
            data={purchases}
            pagination={true}
            loading={false}
          />
        )}
      </Card>
    </div>
  );
};

export default PurchaseList;
