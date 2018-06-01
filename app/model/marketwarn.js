module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const MarketwarnSchema = new Schema({
    market: { type: String },
    uid: { type: String },
    token: { type: String },
    flag: { type: String },
    create_time: { type: Date, default: Date.now },
    upprice: { type: Number },
    downprice: { type: Number }  
  });

  return mongoose.model('Marketwarn', MarketwarnSchema, 'marketwarn');
}
