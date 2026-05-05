const db = require('../services/db');

// A wrapper for our async route handlers
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Factory function to create a generic CRUD controller
function createCrudController(tableName, primaryKey, allowedCreateFields = []) {
  let singularName = tableName.slice(0, -1);
  if (tableName.endsWith('ies')) {
    singularName = tableName.slice(0, -3) + 'y';
  }
  const capitalizedSingularName = singularName.charAt(0).toUpperCase() + singularName.slice(1);

  return {
    // GET all items
    getAll: catchAsync(async (req, res) => {
      const items = await db.query(`SELECT * FROM ${tableName}`);
      res.json(items);
    }),

    // GET a single item by ID
    getById: catchAsync(async (req, res) => {
      const { id } = req.params;
      const item = await db.query(`SELECT * FROM ${tableName} WHERE ${primaryKey} = ?`, [id]);
      if (item.length === 0) {
        return res.status(404).json({ message: `${capitalizedSingularName} not found` });
      }
      res.json(item[0]);
    }),

    // POST a new item
    create: catchAsync(async (req, res) => {
      const fields = Object.keys(req.body);
      const values = Object.values(req.body);
      const filteredFields = [];
      const filteredValues = [];

      fields.forEach((field, index) => {
        if (allowedCreateFields.includes(field)) {
          filteredFields.push(field);
          filteredValues.push(values[index]);
        }
      });

      if (filteredFields.length === 0) {
        return res.status(400).json({ message: 'No valid fields provided for creation' });
      }

      const query = `INSERT INTO ${tableName} (${filteredFields.join(', ')}) VALUES (${filteredValues.map(() => '?').join(', ')})`;
      const result = await db.query(query, filteredValues);

      res.status(201).json({
        message: `${capitalizedSingularName} created successfully!`,
        [`${singularName}Id`]: result.insertId,
      });
    }),

    // PUT to update an item
    update: catchAsync(async (req, res) => {
      const { id } = req.params;
      const result = await db.query(`UPDATE ${tableName} SET ? WHERE ${primaryKey} = ?`, [req.body, id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: `${capitalizedSingularName} not found` });
      }
      res.json({ message: `${capitalizedSingularName} updated successfully!` });
    }),

    // DELETE an item
    delete: catchAsync(async (req, res) => {
      const { id } = req.params;
      const result = await db.query(`DELETE FROM ${tableName} WHERE ${primaryKey} = ?`, [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: `${capitalizedSingularName} not found` });
      }
      res.json({ message: `${capitalizedSingularName} deleted successfully!` });
    }),
  };
}

module.exports = {
  createCrudController,
  catchAsync,
};