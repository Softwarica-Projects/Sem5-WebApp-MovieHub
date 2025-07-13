const mongoose = require('mongoose');

global.mockId = () => new mongoose.Types.ObjectId().toString();
