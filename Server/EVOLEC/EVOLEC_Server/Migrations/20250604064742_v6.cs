using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVOLEC_Server.Migrations
{
    /// <inheritdoc />
    public partial class v6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TeacherId",
                table: "tblOffDates",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_tblOffDates_TeacherId",
                table: "tblOffDates",
                column: "TeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_tblOffDates_tblUsers_TeacherId",
                table: "tblOffDates",
                column: "TeacherId",
                principalTable: "tblUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblOffDates_tblUsers_TeacherId",
                table: "tblOffDates");

            migrationBuilder.DropIndex(
                name: "IX_tblOffDates_TeacherId",
                table: "tblOffDates");

            migrationBuilder.DropColumn(
                name: "TeacherId",
                table: "tblOffDates");
        }
    }
}
