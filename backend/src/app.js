const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const genreRoutes = require('./routes/genreRoutes');
const generalRoutes = require('./routes/generalRoutes');
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./config/swaggerConfig');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/movies', movieRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/utility', utilityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/genres', genreRoutes); 
app.use('/api/general', generalRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});