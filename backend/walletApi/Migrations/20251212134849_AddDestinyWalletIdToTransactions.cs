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
            // Add nullable column first to avoid foreign key violations when migrating existing data
            migrationBuilder.AddColumn<int>(
                name: "DestinyWalletId",
                table: "Transactions",
                type: "INTEGER",
                nullable: true);

            // Initialize the new column using existing WalletId where appropriate
            migrationBuilder.Sql("UPDATE Transactions SET DestinyWalletId = WalletId WHERE DestinyWalletId IS NULL;");

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
