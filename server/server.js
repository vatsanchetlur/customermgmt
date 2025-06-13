const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data store
let customers = [
    { id: 1, name: 'Mike Johnson', email: 'mikej@abc.com', password: 'mikej' },
    { id: 2, name: 'Cindy Smith', email: 'cinds@abc.com', password: 'cinds' },
    { id: 3, name: 'Julio Martin', email: 'julim@abc.com', password: 'julim' }
];
let nextId = 4; // To generate unique IDs for new customers

// API Endpoints

// GET all customers
app.get('/api/customers', (req, res) => {
    res.json(customers);
});

// GET a single customer by ID (optional, not strictly required by frontend but good practice)
app.get('/api/customers/:id', (req, res) => {
    const customerId = parseInt(req.params.id);
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
        res.json(customer);
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
});

// POST a new customer
app.post('/api/customers', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Check for duplicate email
    const existingCustomer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (existingCustomer) {
        return res.status(409).json({ message: 'This email address is already in use by another customer.' });
    }
    
    const newCustomer = {
        id: nextId++,
        name,
        email,
        password
    };
    customers.push(newCustomer);
    res.status(201).json(newCustomer);
});

// PUT (update) an existing customer
app.put('/api/customers/:id', (req, res) => {
    const customerId = parseInt(req.params.id);
    const { name, email, password } = req.body;
    const customerIndex = customers.findIndex(c => c.id === customerId);

    if (customerIndex !== -1) {
        // Check for duplicate email (excluding the current customer)
        const existingCustomer = customers.find(c => 
            c.email.toLowerCase() === email.toLowerCase() && c.id !== customerId
        );
        if (existingCustomer) {
            return res.status(409).json({ message: 'This email address is already in use by another customer.' });
        }
        
        const updatedCustomer = { ...customers[customerIndex], name, email, password };
        customers[customerIndex] = updatedCustomer;
        res.json(updatedCustomer);
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
});

// DELETE a customer
app.delete('/api/customers/:id', (req, res) => {
    const customerId = parseInt(req.params.id);
    const initialLength = customers.length;
    customers = customers.filter(c => c.id !== customerId);

    if (customers.length < initialLength) {
        res.status(200).json({ message: 'Customer deleted successfully' });
    } else {
        res.status(404).json({ message: 'Customer not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
