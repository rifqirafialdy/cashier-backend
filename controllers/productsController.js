const { db, query } = require('../database')

module.exports = {
    addProduct: async (req, res) => {
let { name, description, price, category, isActive } = req.body;
const productQuery = await query(`SELECT * FROM products WHERE name = ${db.escape(name)}`);
if (productQuery.length > 0) {
  return res.status(200).send({ message: 'Name is already taken' });
}
const categoryQuery = await query(`SELECT * FROM categories WHERE category_name = ${db.escape(category)}`);
const categoryId = categoryQuery[0].categories_ID;


let filename = null;
if (req.file) {
  filename = '/' + req.file.filename;
}


if (!isActive) {
  isActive = true;
}


const addProduct = await query(`INSERT INTO products VALUES (null, ${db.escape(name)}, ${db.escape(description)}, ${db.escape(filename)}, ${db.escape(price)}, ${db.escape(isActive)}, null, ${db.escape(categoryId)})`);
return res.status(200).send({ message: 'Product added successfully' });

    },
    addCategory: async (req, res) => {
    const { name } = req.body;

try {
  const categoryQuery = await query(`SELECT * FROM categories WHERE category_name = ${db.escape(name)}`);
  
  if (categoryQuery.length > 0) {
    return res.status(200).send({ message: "Category already exists" });
  }
  
  const addCategory = await query(`INSERT INTO categories VALUES (null, ${db.escape(name)})`);
  
  return res.status(200).send({ message: "Category added" });
} catch (err) {
  console.error(err);
  return res.status(500).send({ message: "Internal server error" });
}

    
    },
    editProduct : async (req, res) => {
        const  idProduct  = parseInt(req.params.id)
        const { name, description, price,isActive  } = req.body
        let updateQuery = `UPDATE products SET`

        if (name) {
            updateQuery += ` name = ${db.escape(name)},`
        }
        if (description) {
            updateQuery += ` description = ${db.escape(description)},`
        }
        if (price) {
            updateQuery += ` price = ${db.escape(price)},`
        }
        if (isActive) {
            updateQuery += ` isActive = ${db.escape(isActive)} `
            
        }
        updateQuery = updateQuery.slice(0,-1)
        console.log(updateQuery);
        updateQuery = await query(updateQuery + ` WHERE product_ID = ${db.escape(idProduct)}`)
        return res.status(200).send({message:'Update succes'})
    },
    editCategories: async (req, res) => {
        const idCat = parseInt(req.params.id);
        const { name } = req.body;
      
        try {
          const categoryQuery = await query(`SELECT * FROM categories WHERE categories_ID = ${db.escape(idCat)}`);
      
          if (categoryQuery.length === 0) {
            return res.status(404).send({ message: "Category not found" });
          }
      
          await query(`UPDATE categories SET category_name = ${db.escape(name)} WHERE categories_ID = ${db.escape(idCat)}`);
      
          return res.status(200).send({ message: "Update successful" });
        } catch (err) {
          console.error(err);
          return res.status(500).send({ message: "Internal server error" });
        }
    },
    filterProducts: async (req, res) => {
 const categoryName = req.body.category;
try {
  const filteredProducts = await query(`SELECT * FROM products INNER JOIN categories ON products.categories_ID = categories.categories_ID WHERE categories.category_name = ${db.escape(categoryName)}`);
  
  return res.status(200).send({ filteredProducts });
} catch (err) {
  console.error(err);
  return res.status(500).send({ message: "Internal server error" });
}

    },
    fetchProducts: async (req, res) => {
        const { page, sort, order } = req.body;
        console.log(sort,order);
      
        try {
          let productList;
          if (sort && order) {
            let orderBy = 'name';
            let sortOrder = 'ASC';
            if (sort === 'price') {
              orderBy = 'price';
            }
            if (order === 'DESC') {
              sortOrder = 'DESC';
            }
      
            productList = await query(`SELECT * FROM products ORDER BY ${orderBy} ${sortOrder} LIMIT 9 OFFSET ${page}`);

          } else {
            productList = await query(`SELECT * FROM products LIMIT 9 OFFSET ${db.escape(page)}`);
            }
            
      
          return res.status(200).send(productList);
        } catch (error) {
          console.error(error);
          return res.status(500).send({ message: 'Internal server error' });
        }
    },
    deleteProduct: async (req, res) => {
        const idProduct = parseInt(req.params.id);
          console.log(idProduct);
        try {
          const result = await query(`DELETE FROM products WHERE product_ID = ${db.escape(idProduct)}`);
          
          if (result.affectedRows === 1) {
            res.status(200).send({ message: `Product with ID ${idProduct} has been deleted` })
          } else {
            res.status(404).send({ error: `Product with ID ${idProduct} not found` })
          }
            
        } catch (error) {
          res.status(500).send({ error: error.message })
        }
    },
    fetchAllData: async (req, res) => {
        try {
          const products = await query('SELECT * FROM products');
          return res.status(200).send(products);
        } catch (error) {
          console.error(error);
          return res.status(500).send({ message: 'Internal server error' });
        }
    },
    fetchCategories: async (req, res) => {
        try {
          const categories = await query('SELECT * FROM categories');
          return res.status(200).send(categories);
        } catch (error) {
          console.error(error);
          return res.status(500).send({ message: 'Internal server error' });
        }
      }
      
      
    
    
      
    
      
    
}