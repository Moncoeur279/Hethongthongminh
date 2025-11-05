// Backend/authModels/VerificationCode.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const VerificationCode = sequelize.define(
  "VerificationCode",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: { type: DataTypes.STRING(120), allowNull: false },
    codeHash: { type: DataTypes.STRING(64), allowNull: false }, // SHA-256 hex
    payload: {
      type: DataTypes.TEXT, // JSON { name, passwordHash }
      allowNull: false,
      get() {
        const raw = this.getDataValue("payload");
        try {
          return raw ? JSON.parse(raw) : null;
        } catch {
          return raw;
        }
      },
      set(val) {
        this.setDataValue("payload", JSON.stringify(val));
      },
    },
    expiresAt: { type: DataTypes.DATE(3), allowNull: false },
    consumed: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: {
      type: DataTypes.DATE(3),
      allowNull: false,
      defaultValue: sequelize.fn("SYSUTCDATETIME"),
    },
  },
  {
    tableName: "VerificationCodes",
    schema: "dbo",
    freezeTableName: true,
    timestamps: false,
    indexes: [
      { name: "IX_Verify_Email_Expires", fields: ["email", "expiresAt"] },
    ],
  }
);

module.exports = VerificationCode;
