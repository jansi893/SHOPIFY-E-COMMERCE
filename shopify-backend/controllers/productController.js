import Product from "../models/Product.js";

//create product
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, brand, category, stock } = req.body;

    const images = req.files?.map((file) => ({
      public_id: file.filename,
      url: file.path,
    })) || [];

    const product = await Product.create({
      title,
      description,
      price,
      brand,
      category,
      stock,
      images,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({
      message: "Product creation failed",
      error: err.message,
    });
  }
};

//get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fetching products failed", error: error.message });
  }
};

//get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fetching product failed", error: error.message });
  }
};

//update product
export const updateProduct = async (req, res) => {
  try {
    const { title, price, description, brand, category, stock } = req.body;
    const images = req.files?.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));

    const updateFields = { title, price, description, brand, category, stock };
    if (images) updateFields.images = images;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Update failed", error: error.message });
  }
};


//delete product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        for (const img of product.image) {
            await cloudinary.uploader.destroy(img.public_id);
        }
        await product.deleteOne();
        res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
        
    }
}


