const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Conversation = sequelize.define(
    "Conversation",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(120),
            allowNull: true,
        },
        lastMessageAt: {
            type: DataTypes.DATE(3),
            allowNull: true,
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
        tableName: "Conversations",
        schema: "dbo",
        freezeTableName: true,
        timestamps: false,
        indexes: [
            { name: "IX_Conversations_User_Last", fields: ["userId", "lastMessageAt"] },
        ],
    }
);

module.exports = Conversation;
