'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format, subMonths } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMainStorage } from '@/store/mainStorage';

const OrdersPage = () => {
  const router = useRouter();
  const isAdmin = useMainStorage((state) => state.isAdmin);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const printAllFilteredOrders = async () => {
    const orderIds = filteredOrders.map(order => order.id).join(',');
    const response = await fetch(`/api/print-orders?orderId=${orderIds}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  };

  useEffect(() => {
    if (!isAdmin) {
      router.push('/login/admin');
      return;
    }
    fetchOrders();
  }, [isAdmin, router]);

  useEffect(() => {
    filterOrders();
  }, [allOrders, searchTerm, statusFilter, paymentFilter]);

  const fetchOrders = async () => {
    const response = await fetch(`/api/print-orders?orderId=all`);
    const data = await response.json();
    setAllOrders(data.orders);
  };

  const filterOrders = () => {
    const MonthsAgo = subMonths(new Date(), 6);
    const filtered = allOrders.filter(order => {
      const orderDate = new Date(order.createdDate);
      const customOrderId = formatOrderId(order);
      return (
        orderDate >= MonthsAgo &&
        (searchTerm === '' || 
         order.id.toString().includes(searchTerm) || 
         customOrderId.includes(searchTerm) ||
         order.user.displayName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'ALL' || order.orderStatus === statusFilter) &&
        (paymentFilter === 'ALL' || order.paymentStatus === paymentFilter)
      );
    });
    setFilteredOrders(filtered);
    setTotalPages(Math.ceil(filtered.length / 20));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePaymentFilter = (status) => {
    setPaymentFilter(status);
    setCurrentPage(1);
  };

  const printOrder = async (orderId) => {
    const response = await fetch(`/api/print-orders?orderId=${orderId}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatOrderId = (order) => {
    const createdDate = new Date(order.createdDate);
    const monthYear = format(createdDate, 'M-yy');
    const ordersInSameMonth = allOrders?.filter(o => 
      format(new Date(o.createdDate), 'M-yy') === monthYear
    );
    const orderIndex = ordersInSameMonth.findIndex(o => o.id === order.id) + 1;
    return `${orderIndex}-${monthYear}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders </h1>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Select value={statusFilter} onValueChange={(value) => handleStatusFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {['PENDING', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'].map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={(value) => handlePaymentFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Payment Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Payment Statuses</SelectItem>
            {['PENDING', 'PAID', 'FAILED', 'REFUNDED'].map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={printAllFilteredOrders} className="mb-4">
        Print All Filtered Orders
      </Button>
      <Table className='overflow-scroll'>
        <TableHeader>
          <TableRow>
            <TableHead className='text-nowrap'>Order ID</TableHead>
            <TableHead className='text-nowrap'>Status</TableHead>
            <TableHead className='text-nowrap'>Payment</TableHead>
            <TableHead className='text-nowrap'>Total Price</TableHead>
            <TableHead className='text-nowrap'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.slice((currentPage - 1) * 20, currentPage * 20).map(order => (
            <TableRow key={order.id}>
              <TableCell className='text-nowrap'>{formatOrderId(order)}</TableCell>
              <TableCell className='text-nowrap'>{order.orderStatus}</TableCell>
              <TableCell className='text-nowrap'>{order.paymentStatus}</TableCell>
              <TableCell className='text-nowrap'>${Number(order.totalPrice).toFixed(2)}</TableCell>
              <TableCell className='text-nowrap'>
                <Button onClick={() => printOrder(order.id)} variant="outline">
                  Print
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrdersPage;
