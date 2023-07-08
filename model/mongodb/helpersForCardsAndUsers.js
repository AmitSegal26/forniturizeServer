const mongoose = require("mongoose");
const { UploadSchema } = require("./Upload");

const URL = {
  type: String,
  match: RegExp(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
  ),
  trim: true,
};

const DEFAULT_STRING_SCHEMA = {
  type: String,
  maxLength: 256,
  trim: true,
};

const DEFAULT_STRING_SCHEMA_REQUIRED = {
  ...DEFAULT_STRING_SCHEMA,
  minLength: 2,
  required: true,
};
const Email = {
  type: String,
  require: true,
  match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
  lowercase: true,
  trim: true,
  unique: true,
};
const Phone = {
  type: String,
  required: true,
  match: RegExp(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/),
};
const Created_At = {
  type: Date,
  default: Date.now,
};

const Name = new mongoose.Schema({
  first: DEFAULT_STRING_SCHEMA_REQUIRED,
  last: DEFAULT_STRING_SCHEMA_REQUIRED,
});

const Image = new mongoose.Schema({
  imageFile: UploadSchema,
  alt: DEFAULT_STRING_SCHEMA_REQUIRED,
});

module.exports = {
  Email,
  Phone,
  Created_At,
  URL,
  Image,
  Name,
  DEFAULT_STRING_SCHEMA_REQUIRED,
};
