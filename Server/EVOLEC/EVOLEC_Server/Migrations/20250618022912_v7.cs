using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVOLEC_Server.Migrations
{
    /// <inheritdoc />
    public partial class v7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "tblUserRoles",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_tblUserRoles_ApplicationUserId",
                table: "tblUserRoles",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_tblUserRoles_tblUsers_ApplicationUserId",
                table: "tblUserRoles",
                column: "ApplicationUserId",
                principalTable: "tblUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblUserRoles_tblUsers_ApplicationUserId",
                table: "tblUserRoles");

            migrationBuilder.DropIndex(
                name: "IX_tblUserRoles_ApplicationUserId",
                table: "tblUserRoles");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "tblUserRoles");
        }
    }
}
