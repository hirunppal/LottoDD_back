module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
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
  Customer.associate = (db) => {
    Customer.hasMany(db.Order, {
      foreignKey: {
        allowNull: false,
        name: "customerId",
      },
      onDelete: "restrict",
      onUpdate: "restrict",
    });
  };
  return Customer;
};
