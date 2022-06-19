module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    "OrderDetail",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Price: {
        type: DataTypes.DECIMAL.UNSIGNED,
        allowNull: true,
        defaultValue: 80,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );
  OrderDetail.associate = (db) => {
    OrderDetail.belongsTo(db.Seller, {
      foreignKey: {
        allowNull: false,
        name: "sellerId",
      },
      onDelete: "restrict",
      onUpdate: "restrict",
    });
    OrderDetail.belongsTo(db.Product, {
      foreignKey: {
        allowNull: false,
        // unique: true,
        name: "productId",
      },
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return OrderDetail;
};
