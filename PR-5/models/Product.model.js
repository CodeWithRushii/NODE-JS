const mongoose = require('mongoose');

const PerfumeSchema = mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_Price: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    usage: {
        type: String,
        required: true
    },
    fragrance_type:
    {
        type: String,
        required: true
    },
    category:
    {
        type: String,
        required: true
    },
    size:
    {
        type: Array,
        required: true
    },
    description:
    {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Perfume", PerfumeSchema, "perfumes");