import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'user',
            columns: [
                { name: 'user_id', type: 'string', isIndexed: true },
                { name: 'email_addr', type: 'string'},
                { name: 'phone', type: 'number'},
                { name: 'weight', type: 'number' },
                { name: 'power', type: 'number' },
                ],
        }),

        tableSchema({
            name: 'workouts',
            columns: [
                { name: 'username', type: 'string' },
                { name: 'workout_id', type: 'string', isIndexed: true },
                { name: 'time', type: 'number' },
                { name: 'workout', type: 'number' },
                ],
        }),
    ],
})