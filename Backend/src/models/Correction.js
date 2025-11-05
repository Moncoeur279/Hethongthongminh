const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Correction = sequelize.define(
    "Correction",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        messageId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true, // 1 message ↔ 1 correction (mới nhất)
        },
        original: {
            type: DataTypes.TEXT, // NVARCHAR(MAX)
            allowNull: false,
        },
        corrected: {
            type: DataTypes.TEXT, // NVARCHAR(MAX)
            allowNull: false,
        },
        issues: {
            type: DataTypes.TEXT, // JSON string
            allowNull: true,
            get() {
                const raw = this.getDataValue("issues");
                try {
                    return raw ? JSON.parse(raw) : null;
                } catch {
                    return raw;
                }
            },
            set(val) {
                this.setDataValue("issues", val == null ? null : JSON.stringify(val));
            },
        },
        score: {
            type: DataTypes.TINYINT, // 0..100
            allowNull: true,
            validate: { min: 0, max: 100 },
        },
        createdAt: {
            type: DataTypes.DATE(3),
            allowNull: false,
            defaultValue: sequelize.fn("SYSUTCDATETIME"),
        },
    },
    {
        tableName: "Corrections",
        schema: "dbo",
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = Correction;
