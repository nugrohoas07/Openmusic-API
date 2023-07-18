exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    year: {
      type: 'INT',
      notNull: true
    },
    genre: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    performer: {
      type: 'VARCHAR(100)',
      notNull: true
    },
    duration: {
      type: 'INT',
      notNull: false
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('songs')
}
