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
        type: DataTypes.ENUM([
          "REGISTERING",
          "APPROVED",
          "REJECTED",
          "APPEAL",
          "PENDING",
          "EXPIRED",
        ]),
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
      prizeDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { underscored: true }
  );
  Product.associate = (db) => {
    Product.belongsTo(db.Seller, {
      foreignKey: {
        allowNull: false,
        name: "sellerId",
      },
      onDelete: "restrict",
      onUpdate: "restrict",
    });
    Product.hasMany(db.OrderDetail, {
      foreignKey: {
        allowNull: false,
        name: "productId",
      },
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return Product;
};
