const handleEmailExistsErrorFromMongoose = (err) => {
  console.log("hererer", err);
  return {
    msg:
      err.name && err.name.includes("Mongo") && err.code === 11000
        ? `Email ${err.keyValue.email} already exists !`
        : err,
  };
};

module.exports = handleEmailExistsErrorFromMongoose;
