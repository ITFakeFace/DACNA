using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVOLEC_Server.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LessonDateOffDates");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "ToDate",
                table: "tblOffDates",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.CreateTable(
                name: "tblLessonOffDates",
                columns: table => new
                {
                    OffDateId = table.Column<int>(type: "int", nullable: false),
                    LessonDateId = table.Column<int>(type: "int", nullable: false),
                    InitDate = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tblLessonOffDates", x => new { x.LessonDateId, x.OffDateId });
                    table.ForeignKey(
                        name: "FK_tblLessonOffDates_tblLessonDates_LessonDateId",
                        column: x => x.LessonDateId,
                        principalTable: "tblLessonDates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tblLessonOffDates_tblOffDates_OffDateId",
                        column: x => x.OffDateId,
                        principalTable: "tblOffDates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_tblLessonOffDates_OffDateId",
                table: "tblLessonOffDates",
                column: "OffDateId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tblLessonOffDates");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ToDate",
                table: "tblOffDates",
                type: "datetime(6)",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.CreateTable(
                name: "LessonDateOffDates",
                columns: table => new
                {
                    LessonDatesId = table.Column<int>(type: "int", nullable: false),
                    OffDatesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonDateOffDates", x => new { x.LessonDatesId, x.OffDatesId });
                    table.ForeignKey(
                        name: "FK_LessonDateOffDates_tblLessonDates_LessonDatesId",
                        column: x => x.LessonDatesId,
                        principalTable: "tblLessonDates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LessonDateOffDates_tblOffDates_OffDatesId",
                        column: x => x.OffDatesId,
                        principalTable: "tblOffDates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_LessonDateOffDates_OffDatesId",
                table: "LessonDateOffDates",
                column: "OffDatesId");
        }
    }
}
