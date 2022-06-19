module.exports = (sequelize, DataTypes) => {
  const Seller = sequelize.define(
    "Seller",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNum: { type: DataTypes.STRING, unique: true },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: { type: DataTypes.STRING },
    },
    { underscored: true }
  );
  Seller.associate = (db) => {
    Seller.hasMany(db.Product, {
      foreignKey: {
        allowNull: false,
        name: "sellerId",
      },
      onDelete: "restrict",
      onUpdate: "restrict",
    });
    Seller.hasMany(db.OrderDetail, {
      foreignKey: {
        allowNull: false,
        name: "sellerId",
      },
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return Seller;
};
