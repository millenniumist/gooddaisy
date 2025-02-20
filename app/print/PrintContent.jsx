import { format } from 'date-fns';

const PrintContent = ({ orders }) => {
  const formatOrderId = (order) => {
    const createdDate = new Date(order.createdDate);
    const monthYear = format(createdDate, 'M-yy');
    const ordersInSameMonth = orders.filter(o => 
      format(new Date(o.createdDate), 'M-yy') === monthYear
    );
    const orderIndex = ordersInSameMonth.findIndex(o => o.id === order.id) + 1;
    return `${orderIndex}-${monthYear}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      {orders.map((order) => (
        <div key={order.id} style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Order #{formatOrderId(order)}</h1>
          <p>Customer: {order.user.displayName}</p>
          <p>Address: {order.user.address}</p>
          <p>Payment: {order.paymentStatus}</p>
          
          <h2 style={{ fontSize: '20px', marginTop: '20px' }}>Order Items</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}>Product</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}>Option</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}>Price</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}>Status</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}>Color</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}>Message</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}>Add-On</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.product.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.variant ? item.variant.toUpperCase() : 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>${item.price.toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.status}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.colorRefinement ? 'Yes' : 'No'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.message || 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.addOnItem ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Note and Design: {item.note || 'N/A'}</p>
          <h3 style={{ marginTop: '20px' }}>Total Price: ${order.totalPrice.toFixed(2)}</h3>
          <div style={{ pageBreakAfter: 'always' }}></div>
        </div>
      ))}
    </div>
  );
};

export default PrintContent;

