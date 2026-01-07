const express = require('express');
require('./config/db.config');

const app = express();
const PORT = 9080;

app.set('view engine', 'ejs');

app.use(express.urlencoded({}));
app.use(express.static('public'));

app.use('/uploads', express.static('uploads'));

app.use('/', require('./routes'));



app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
