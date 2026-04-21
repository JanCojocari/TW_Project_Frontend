using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rentora.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddBedroomsBedsHouseRulesRegionPostalCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AdditionlaInfo_Bedrooms",
                table: "Apartments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AdditionlaInfo_Beds",
                table: "Apartments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "AdditionlaInfo_HouseRules",
                table: "Apartments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Location_PostalCode",
                table: "Apartments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Location_Region",
                table: "Apartments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionlaInfo_Bedrooms",
                table: "Apartments");

            migrationBuilder.DropColumn(
                name: "AdditionlaInfo_Beds",
                table: "Apartments");

            migrationBuilder.DropColumn(
                name: "AdditionlaInfo_HouseRules",
                table: "Apartments");

            migrationBuilder.DropColumn(
                name: "Location_PostalCode",
                table: "Apartments");

            migrationBuilder.DropColumn(
                name: "Location_Region",
                table: "Apartments");
        }
    }
}
