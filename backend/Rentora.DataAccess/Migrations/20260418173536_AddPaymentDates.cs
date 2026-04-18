using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rentora.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Payments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Payments",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Payments");
        }
    }
}
