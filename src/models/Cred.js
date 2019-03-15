const { Schema, model } = require("mongoose");

const CredSchema = new Schema({
  expire: Date,

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