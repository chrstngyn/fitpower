import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class Workouts extends Model {
    static table = 'workouts'

    // every workout belongs to a users
    static associations = {
        user: { type: 'belongs_to', key: 'user_id' },
    }

    // define model's properties (fields)
    @field('username') username
    @field('time') time
    @field('workout') workout

    // relation: workout belongs to user
    @relation('user', 'user_id') user

}