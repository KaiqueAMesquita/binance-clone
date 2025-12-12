using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace walletApi.Migrations
{
    /// <inheritdoc />
    public partial class AddDestinyWalletIdToTransactions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Column `DestinyWalletId` already exists in the database (created by a prior migration).
            // Skip adding the column to avoid duplicate-column errors, but still create the
            // index and foreign key that the original migration intended.

            // Create index and foreign key (column is nullable so existing rows won't violate FK)
            migrationBuilder.CreateIndex(
                name: "IX_Transactions_DestinyWalletId",
                table: "Transactions",
                column: "DestinyWalletId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Wallets_DestinyWalletId",
                table: "Transactions",
                column: "DestinyWalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Wallets_DestinyWalletId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_DestinyWalletId",
                table: "Transactions");
        }
    }
}
