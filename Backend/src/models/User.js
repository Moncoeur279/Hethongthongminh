const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(80),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE(3),
            allowNull: false,
            defaultValue: sequelize.fn("SYSUTCDATETIME"),
        },
    },
    {
        tableName: "Users",
        schema: "dbo",
        freezeTableName: true,
        timestamps: false,
        indexes: [{ name: "IX_Users_Email", fields: ["email"] }],
    }
);

module.exports = User;
