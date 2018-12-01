import { Model } from '@nozbe/watermelondb'
import { field, nochange, relation, children } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
    static table = 'user'

    // every user has many workouts
    static associations = {
        workouts: { type: 'has_many', foreignKey: 'workout_id' },
    }

    // define model's properties (fields)
    @nochange @field('user_id') user_id
    @nochange @field('email_addr') email_addr
    @nochange @field('phone') phone
    @field('weight') weight
    @field('power') power

    // relation: all workouts that belong to user
    @children('workouts') workouts


    // define model actions

    // add workout to a associated user
    async addWorkout(power) {
        return this.collections.get('workouts').create ( workout =>{
            workouts.user.set(this);
        })
    }

}