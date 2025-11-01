import Product from '../models/Product.js'

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find() // Blocks the rest of this function's statements from running until complete, the rest of async functions in this file can run before products get resolved value of Promise
        res.json(products)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
    
}

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id) 
        if (!product) return res.status(404).json({error: 'Product Not Found'})
        res.json(product)
    } catch (err) {
        res.status(500).json({error: err.message})
    }

}

export const createProduct = async (req, res) => { // can run before await operation in getProducts is done (APPLIES TO ALL ASYNC/NOT FUNCTION HERE)
    try {
        const product = await Product.create(req.body) 
        res.status(201).json(product)
    } catch (err) {
        res.status(500).json({error: err.message})
    }

}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { // REMEMBER in app.js: app.use(express.json()); -> converts incoming json bodies to objects
            new: true
        }) 
        if (!product) return res.status(404).json({error: 'Product Not Found'})
        res.json(product)
    } catch (err) {
        res.status(500).json({error: err.message})
    }

}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIDAndDelete(req.params.id) 
        if (!product) return res.status(404).json({error: 'Product Not Found'})
        res.json({message: 'Product Deleted successfully'})
    } catch (err) {
        res.status(500).json({error: err.message})
    }

}