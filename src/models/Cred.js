const { Schema, model } = require("mongoose");

const date = moment().add(6, "month").format("MM/DD/YYYY");

const CredSchema = new Schema({
  expire: {
    type: Date,
    default: date
  },
  vpn: {
    login: {
      default: "",
      type: String
    },
    password: {
      default: "",
      type: String
    }
  },
  sso: {
    login: {
      default: "",
      type: String
    },
    password: {
      default: "",
      type: String
    }
  },
  role: {
    default: "user",
    type: String
  },
  emailToSubscribe: {
    default: "",
    type: String
  }
});

module.exports = CredModel = model("creds", CredSchema, "creds");