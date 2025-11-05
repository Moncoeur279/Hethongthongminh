const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Message = sequelize.define(
    "Message",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        conversationId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: { isIn: [["user", "assistant"]] },
        },
        content: {
            // NVARCHAR(MAX)
            type: DataTypes.TEXT,
            allowNull: false,
        },
        tokens: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE(3),
            allowNull: false,
            defaultValue: sequelize.fn("SYSUTCDATETIME"),
        },
    },
    {
        tableName: "Messages",
        schema: "dbo",
        freezeTableName: true,
        timestamps: false,
        indexes: [{ name: "IX_Messages_Conv_Created", fields: ["conversationId", "createdAt"] }],
    }
);

module.exports = Message;
