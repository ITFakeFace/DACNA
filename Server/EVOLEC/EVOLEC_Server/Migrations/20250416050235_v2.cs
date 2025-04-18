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
            migrationBuilder.DropPrimaryKey(
                name: "PK_Courses",
                table: "Courses");

            migrationBuilder.RenameTable(
                name: "Courses",
                newName: "tblCourses");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tblCourses",
                table: "tblCourses",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_tblCourses",
                table: "tblCourses");

            migrationBuilder.RenameTable(
                name: "tblCourses",
                newName: "Courses");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Courses",
                table: "Courses",
                column: "Id");
        }
    }
}
