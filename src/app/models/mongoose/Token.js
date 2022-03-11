const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    token:{
        type: String
    },
    expires: {type: Date,},
    revoked: { type: Date },
    replacedByToken: { type: String },

})

schema.set('timestamps', true);

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove props on object serialization
        delete ret._id;
        delete ret.id;
        delete ret.user;
    }
});

const userModel = mongoose.model('Tokens', schema, 'Tokens');

module.exports = userModel
    
    
