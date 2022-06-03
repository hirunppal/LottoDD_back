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
      finalPrice: {
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
  return OrderDetail;
};
