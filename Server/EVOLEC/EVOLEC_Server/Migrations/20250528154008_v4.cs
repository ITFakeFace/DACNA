using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVOLEC_Server.Migrations
{
    /// <inheritdoc />
    public partial class v4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "tblLessonDates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RoomId",
                table: "tblClassRooms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "tblRooms",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Address = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblRooms", x => x.ID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_tblLessonDates_RoomId",
                table: "tblLessonDates",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_tblClassRooms_RoomId",
                table: "tblClassRooms",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_tblRooms_Name",
                table: "tblRooms",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_tblClassRooms_tblRooms_RoomId",
                table: "tblClassRooms",
                column: "RoomId",
                principalTable: "tblRooms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tblLessonDates_tblRooms_RoomId",
                table: "tblLessonDates",
                column: "RoomId",
                principalTable: "tblRooms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tblClassRooms_tblRooms_RoomId",
                table: "tblClassRooms");

            migrationBuilder.DropForeignKey(
                name: "FK_tblLessonDates_tblRooms_RoomId",
                table: "tblLessonDates");

            migrationBuilder.DropTable(
                name: "tblRooms");

            migrationBuilder.DropIndex(
                name: "IX_tblLessonDates_RoomId",
                table: "tblLessonDates");

            migrationBuilder.DropIndex(
                name: "IX_tblClassRooms_RoomId",
                table: "tblClassRooms");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "tblLessonDates");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "tblClassRooms");
        }
    }
}
