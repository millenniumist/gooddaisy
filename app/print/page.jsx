"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useMainStorage } from "@/store/mainStorage";

const OrdersPage = () => {
  const router = useRouter();
  const isAdmin = useMainStorage((state) => state.isAdmin);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isAdmin) {
        router.push("/login/admin");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAdmin, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`/api/orders`);
      const data = await response.json();
      const sortedOrders = data.orders.sort((a, b) => b.customId - a.customId);
      setAllOrders(sortedOrders);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const filterOrders = () => {
      const filtered = allOrders.filter((order) => {
        const searchString = searchTerm.toLowerCase();
        return (
          order.user.displayName.toLowerCase().includes(searchString) ||
          (order.customId && order.customId.toLowerCase().includes(searchString))
        );
      });
      setFilteredOrders(filtered);
      setTotalPages(Math.ceil(filtered.length / 20));
    };
    filterOrders();
  }, [allOrders, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <Input
        type="text"
        placeholder="Search by Order ID or Customer Name"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Product Customization</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders
            .slice((currentPage - 1) * 20, currentPage * 20)
            .map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.user.displayName}</TableCell>
                <TableCell>{order.customId || "No ID"}</TableCell>
                <TableCell>
                  {order.orderItems.map((item, index) => (
                    <div key={item.id} className="mb-2">
                      <strong>{item.name}</strong>
                      <ul className="text-sm text-gray-600">
                        {item.colorRefinement && <li>Color Refinement</li>}
                        {item.message && <li>Message: {item.message}</li>}
                        {item.addOnItem && <li>Add-on Item</li>}
                        {item.variant && <li>Variant: {item.variant}</li>}
                        {item.note && <li>Design: {item.note}</li>}
                      </ul>
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
