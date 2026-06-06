import mongoose from 'mongoose'

const homeSlider = mongoose.Schema({
    images:[
        {
            type: String,
            required: true,
        }
    ],
    dateCreated:{
        type: Date,
        default: Date.now,
    },
},{
    timestamps: true
})

const homeSliderModel = mongoose.model('slider', homeSlider)

export default homeSliderModel