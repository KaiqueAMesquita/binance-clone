using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace walletApi.Migrations
{
    /// <inheritdoc />
    public partial class DestinyWalletId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Intentionally left blank because the database already contains the Wallets/Transactions schema.
            // This migration previously attempted to create those tables and caused conflicts.
            // We keep a placeholder so EF migration history remains consistent with model snapshot.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // No-op
        }
    }
}
