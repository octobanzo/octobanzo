function up(Knex, Promise) {
    return Promise.all([
        Knex.schema.createTable('guilds', (table) => {
            table.increments('id').primary()
            table.string('discord_id')
            table.string('prefix')
            table.string('mod_role')
            table.string('admin_role')
        })
    ])
}

function down(Knex, Promise) {
    return Promise.all([
        Knex.schema.dropTable('guilds')
    ])
}

export {
    up,
    down
}
