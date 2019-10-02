
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('licenses', function(table){
      table.increments('id').primary();
      table.string('licensee_name');
      table.string('doing_business_as');
      table.string('license_type');
      table.string('issue_date');
      table.string('license_number');
      table.string('street_address');
      table.string('city');
      table.string('state');
      table.string('zip');

      table.timestamps(true, true)
    }),

    knex.schema.createTable('checks', function(table) {
      table.increments('id').primary();
      table.string('date');
      table.boolean('pass');
      table.string('agency');
      table.integer('license_id').unsigned();
      table.foreign('license_id').references('licenses.id')

      table.timestamps(true, true)
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('checks'),
    knex.schema.dropTable('licenses')
  ]);
};
