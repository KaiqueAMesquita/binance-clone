using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace walletApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWalletModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
