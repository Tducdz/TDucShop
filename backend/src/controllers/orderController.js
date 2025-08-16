const db = require("../config/db");

const createOrder = (req, res) => {
  const { user_id, payment_method, shipping_address } = req.body;

  const getCartSQL = `
    SELECT c.product_id, c.quantity, p.price, p.stock, p.name
    FROM Cart c
    JOIN Products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(getCartSQL, [user_id], (err, cartItems) => {
    if (err) return res.status(500).json({ message: "Lỗi lấy giỏ hàng." });
    if (cartItems.length === 0)
      return res.status(400).json({ message: "Giỏ hàng trống." });

    // Check stock
    const outOfStock = cartItems.find((item) => item.quantity > item.stock);
    if (outOfStock) {
      return res.status(400).json({
        message: `Sản phẩm "${outOfStock.name}" chỉ còn ${outOfStock.stock} cái trong kho.`,
      });
    }

    // Total price
    const total_price = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    // Create order
    const orderSQL = `
  INSERT INTO Orders (user_id, order_date, total_price, payment_method, shipping_address, payment_status, order_status)
  VALUES (?, NOW(), ?, ?, ?, 'pending', 'pending')
`;
    db.query(
      orderSQL,
      [user_id, total_price, payment_method, shipping_address],
      (err, orderResult) => {
        if (err) return res.status(500).json({ message: "Lỗi tạo đơn hàng." });

        const order_id = orderResult.insertId;

        // Order detail
        const orderDetailsValues = cartItems.map((item) => [
          order_id,
          item.product_id,
          item.quantity,
          item.price,
        ]);

        // Tạo chuỗi placeholder cho từng sản phẩm
        const placeholders = orderDetailsValues
          .map(() => "(?, ?, ?, ?)")
          .join(", ");

        const orderDetailSQL = `
  INSERT INTO OrderDetails (order_id, product_id, quantity, price)
  VALUES ${placeholders}
`;

        // Flatten mảng 2D thành 1D để truyền vào query
        db.query(orderDetailSQL, orderDetailsValues.flat(), (err) => {
          if (err) {
            console.log("SQL Error:", err.sqlMessage); // 👈 để debug chi tiết
            return res
              .status(500)
              .json({ message: "Lỗi khi thêm chi tiết đơn hàng." });
          }

          // Update stock
          const updateStockQueries = cartItems.map((item) => {
            return new Promise((resolve, reject) => {
              const updateStockSQL = `
              UPDATE Products
              SET stock = stock - ?
              WHERE id = ?
            `;
              db.query(
                updateStockSQL,
                [item.quantity, item.product_id],
                (err) => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            });
          });

          Promise.all(updateStockQueries)
            .then(() => {
              db.query(
                `DELETE FROM Cart WHERE user_id = ?`,
                [user_id],
                (err) => {
                  if (err)
                    return res
                      .status(500)
                      .json({ message: "Lỗi xóa giỏ hàng." });
                  res
                    .status(201)
                    .json({ message: "Đặt hàng thành công!", order_id });
                }
              );
            })
            .catch(() =>
              res.status(500).json({ message: "Lỗi khi cập nhật tồn kho." })
            );
        });
      }
    );
  });
};

//   const { user_id, payment_method, shipping_address } = req.body;

//   const getCartSQL = `
//     SELECT c.product_id, c.quantity, p.price, p.stock, p.name
//     FROM Cart c
//     JOIN Products p ON c.product_id = p.id
//     WHERE c.user_id = ?
//   `;

//   db.query(getCartSQL, [user_id], (err, cartItems) => {
//     if (err) {
//       console.log("Error fetching cart:", err.sqlMessage);
//       return res.status(500).json({ message: "Lỗi lấy giỏ hàng." });
//     }

//     console.log("Cart Items:", cartItems);

//     if (!cartItems.length) {
//       return res.status(400).json({ message: "Giỏ hàng trống." });
//     }

//     const outOfStock = cartItems.find((item) => item.quantity > item.stock);
//     if (outOfStock) {
//       return res.status(400).json({
//         message: `Sản phẩm "${outOfStock.name}" chỉ còn ${outOfStock.stock} cái trong kho.`,
//       });
//     }

//     const total_price = cartItems.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//     console.log("Total Price:", total_price);

//     const orderSQL = `
//       INSERT INTO Orders (user_id, total_price, payment_method, shipping_address)
//       VALUES (?, ?, ?, ?)
//     `;

//     db.query(
//       orderSQL,
//       [user_id, total_price, payment_method, shipping_address],
//       (err, orderResult) => {
//         if (err) {
//           console.log("Order insert error:", err.sqlMessage);
//           return res.status(500).json({ message: "Lỗi tạo đơn hàng." });
//         }

//         console.log("Order created, ID:", orderResult.insertId);

//         const orderDetailsValues = cartItems.map((item) => [
//           orderResult.insertId,
//           item.product_id,
//           item.quantity,
//           item.price,
//         ]);

//         const orderDetailSQL = `
//         INSERT INTO OrderDetails (order_id, product_id, quantity, price)
//         VALUES ?
//       `;

//         db.query(orderDetailSQL, [orderDetailsValues], (err) => {
//           if (err) {
//             console.log("OrderDetails insert error:", err.sqlMessage);
//             return res
//               .status(500)
//               .json({ message: "Lỗi thêm chi tiết đơn hàng." });
//           }

//           console.log("OrderDetails inserted successfully");
//           return res.json({
//             message: "Đặt hàng thành công",
//             order_id: orderResult.insertId,
//           });
//         });
//       }
//     );
//   });
// };

const getOrdersByUser = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT o.id AS order_id, o.order_date, o.total_price, o.order_status,
           p.name AS product_name, od.quantity
    FROM Orders o
    JOIN OrderDetails od ON o.id = od.order_id
    JOIN Products p ON od.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn CSDL" });

    // Gom nhóm theo order_id vì 1 đơn hàng có thể có nhiều sản phẩm
    const groupedOrders = {};

    results.forEach((row) => {
      if (!groupedOrders[row.order_id]) {
        groupedOrders[row.order_id] = {
          order_id: row.order_id,
          order_date: row.order_date,
          total_price: row.total_price,
          order_status: row.order_status,
          products: [],
        };
      }

      groupedOrders[row.order_id].products.push({
        name: row.product_name,
        quantity: row.quantity,
      });
    });

    res.json(Object.values(groupedOrders));
  });
};

module.exports = {
  createOrder,
  getOrdersByUser,
};
