using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EVOLEC_Server.Migrations
{
    /// <inheritdoc />
    public partial class v3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "tblUsers",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "Dob",
                table: "tblUsers",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "Fullname",
                table: "tblUsers",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Gender",
                table: "tblUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PID",
                table: "tblUsers",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "tblUsers");

            migrationBuilder.DropColumn(
                name: "Dob",
                table: "tblUsers");

            migrationBuilder.DropColumn(
                name: "Fullname",
                table: "tblUsers");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "tblUsers");

            migrationBuilder.DropColumn(
                name: "PID",
                table: "tblUsers");
        }
    }
}
