module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      lottoNum: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lottoSet: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      registerStat: {
        type: DataTypes.ENUM(["REGISTERING", "APPROVED", "REJECTED", "APPEAL"]),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      basePrice: {
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
  return Product;
};
