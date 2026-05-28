import Knex from "knex";

async function up(knex: Knex.Knex): Promise<void> {
	// Add media_type column to data table
	await knex.schema.alterTable("data", (table) => {
		table.string("media_type", 20).nullable().defaultTo(null);
	});
}

async function down(knex: Knex.Knex): Promise<void> {
	// Remove media_type column from data table
	await knex.schema.alterTable("data", (table) => {
		table.dropColumn("media_type");
	});
}

export default { name: "18-data-directory-media-type", up, down };
