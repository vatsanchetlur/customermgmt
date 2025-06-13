import React from 'react';

const CustomerDetail = ({ customer }) => {
    if (!customer) {
        return <div>Select a customer to see the details.</div>;
    }

    return (
        <div>
            <h2>Customer Details</h2>
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Password:</strong> {customer.password}</p>
        </div>
    );
};

export default CustomerDetail;