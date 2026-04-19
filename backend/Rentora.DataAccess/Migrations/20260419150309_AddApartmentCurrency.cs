using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rentora.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddApartmentCurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Currency",
                table: "Apartments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "Apartments");
        }
    }
}
