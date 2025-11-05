const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const DictionaryLookup = sequelize.define(
    "DictionaryLookup",
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

        word: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },

        phonetic: {
            type: DataTypes.STRING(64),
            allowNull: true,
        },

        language: {
            type: DataTypes.STRING(8),
            allowNull: false,
            defaultValue: "en",
        },

        source: {
            type: DataTypes.STRING(64),
            allowNull: true,
        },

        resultJson: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const raw = this.getDataValue("resultJson");
                try {
                    return raw ? JSON.parse(raw) : null;
                } catch {
                    return raw;
                }
            },
            set(val) {
                this.setDataValue(
                    "resultJson",
                    val == null ? null : JSON.stringify(val)
                );
            },
        },

        createdAt: {
            type: DataTypes.DATE(3),
            allowNull: false,
            defaultValue: sequelize.fn("SYSUTCDATETIME"),
        },
    },
    {
        tableName: "DictionaryLookups",
        schema: "dbo",
        freezeTableName: true,
        timestamps: false,
        indexes: [
            { fields: ["userId"] },
            { fields: ["word"] },
            { fields: ["language"] },
            { fields: ["createdAt"] },
        ],
    }
);

module.exports = DictionaryLookup;