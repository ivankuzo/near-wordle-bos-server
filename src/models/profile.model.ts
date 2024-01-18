import mongoose, { InferSchemaType } from 'mongoose'

const profileSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
    },
    lost: {
        type: Number,
        required: true,
        default: 0,
    },

    currentStreak: {
        type: Number,
        required: true,
        default: 0,
    },

    maxStreak: {
        type: Number,
        required: true,
        default: 0,
    },

    guessDistribution: {
        type: [Number],
        required: true,
        default: [0, 0, 0, 0, 0, 0],
    },
})

export type ProfileModelType = InferSchemaType<typeof profileSchema>
const ProfileModel = mongoose.model<ProfileModelType>('profile', profileSchema)

export default ProfileModel
