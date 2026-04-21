using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rentora.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddExtendedFacilities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Dishwasher",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Garden",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "KeypadEntry",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Microwave",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Oven",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ParkingFree",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Refrigerator",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Safe",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SecurityCamera",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SmokingAllowed",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Stove",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Terrace",
                table: "Facilities",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Dishwasher",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Garden",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "KeypadEntry",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Microwave",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Oven",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "ParkingFree",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Refrigerator",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Safe",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "SecurityCamera",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "SmokingAllowed",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Stove",
                table: "Facilities");

            migrationBuilder.DropColumn(
                name: "Terrace",
                table: "Facilities");
        }
    }
}
