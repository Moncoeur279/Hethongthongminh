// // Backend/authModels/RefreshToken.js
// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/dbConfig");

// const RefreshToken = sequelize.define(
//   "RefreshToken",
//   {
//     id: {
//       type: DataTypes.UUID,
//       defaultValue: DataTypes.UUIDV4,
//       primaryKey: true,
//     },
//     userId: { type: DataTypes.UUID, allowNull: false },
//     tokenHash: { type: DataTypes.STRING(64), allowNull: false }, // SHA-256
//     expiresAt: { type: DataTypes.DATE(3), allowNull: false },
//     revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
//     ua: { type: DataTypes.STRING(255), allowNull: true },
//     ip: { type: DataTypes.STRING(64), allowNull: true },
//     createdAt: {
//       type: DataTypes.DATE(3),
//       allowNull: false,
//       defaultValue: sequelize.fn("SYSUTCDATETIME"),
//     },
//   },
//   {
//     tableName: "RefreshTokens",
//     schema: "dbo",
//     freezeTableName: true,
//     timestamps: false,
//     indexes: [
//       { name: "IX_Refresh_User_Expires", fields: ["userId", "expiresAt"] },
//     ],
//   }
// );

// module.exports = RefreshToken;
