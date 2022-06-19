module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: DataTypes.ENUM(["PENDING", "PAYMENTREQ", "PAID", "EXPIRED"]),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      paymentSlip: DataTypes.STRING,
    },
    { underscored: true }
  );
  Order.associate = (db) => {
    Order.belongsTo(db.Customer, {
      foreignKey: {
        allowNull: false,
        name: "customerId",
      },
      onDelete: "restrict",
      onUpdate: "restrict",
    });
    // Order.belongsTo(db.Seller, {
    //   foreignKey: {
    //     allowNull: false,
    //     name: "sellerId",
    //   },
    //   onDelete: "restrict",
    //   onUpdate: "restrict",
    // });
    Order.hasMany(db.OrderDetail, {
      foreignKey: {
        allowNull: false,
        name: "orderId",
      },
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return Order;
};
