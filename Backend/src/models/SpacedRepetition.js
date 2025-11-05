const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const SpacedRepetition = sequelize.define(
    "SpacedRepetition",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.UUID, // hoặc BIGINT nếu user là số
            allowNull: false,
        },

        word: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },

        // Easiness Factor (SM-2)
        ef: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 2.5,
        },

        // khoảng cách lặp hiện tại (ngày)
        interval: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        // lần tiếp theo cần ôn tập
        dueDate: {
            type: DataTypes.DATE(3),
            allowNull: false,
            defaultValue: sequelize.fn("SYSUTCDATETIME"),
        },

        successes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        failures: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        createdAt: {
            type: DataTypes.DATE(3),
            allowNull: false,
            defaultValue: sequelize.fn("SYSUTCDATETIME"),
        },
        updatedAt: {
            type: DataTypes.DATE(3),
            allowNull: false,
            defaultValue: sequelize.fn("SYSUTCDATETIME"),
        },
    },
    {
        tableName: "SpacedRepetition",
        schema: "dbo",
        freezeTableName: true,
        timestamps: false,
        indexes: [
            { fields: ["userId"] },
            { fields: ["word"] },
            { fields: ["dueDate"] },
        ],
    }
);

module.exports = SpacedRepetition;
