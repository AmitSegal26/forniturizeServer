const handleEmailExistsErrorFromMongoose = (err) => {
  return {
    msg:
      err.name && err.name.includes("Mongo") && err.code === 11000
        ? `Email ${err.keyValue.email} already exists !`
        : err,
  };
};
/*
let stringArr => "MongoServer" => [`M`,`o`,`n`,`g`,`o`,`S`,`e`,`r`,`v`,`e`,`r`] 
stringArr.includes("Mongo")
err.title.includes("Mongo") && err.price==11000
  err{
    title:"MongoServerError",
    price:11000
    .
    .
    .
    .
  }
*/
module.exports = handleEmailExistsErrorFromMongoose;
