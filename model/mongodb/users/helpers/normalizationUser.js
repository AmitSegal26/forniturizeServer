const normalizeUser = (userData) => {
  if (!userData.image) {
    userData.image = {};
  }
  userData.image = {
    imageFile:
      userData.image.imageFile ||
      (userData.gender == "male"
        ? {
            data: "../../../../assets/imgs/maleAvatar.jpg",
            contentType: "image/jpg",
          }
        : userData.gender == "female"
        ? {
            data: "../../../../assets/imgs/femaleAvatarpng.jpg",
            contentType: "image/jpg",
          }
        : userData.gender == "other"
        ? {
            data: "../../../../assets/imgs/otherAvatar.jpg",
            contentType: "image/jpg",
          }
        : {
            data: "../../../../assets/imgs/errorImg.png",
            contentType: "image/png",
          }),
    alt: userData.image.alt || "profile picture",
  };
  return {
    ...userData,
  };
};

module.exports = normalizeUser;
