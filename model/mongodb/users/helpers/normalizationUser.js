const normalizeUser = (userData) => {
  if (!userData.image) {
    userData.image = {};
  }
  userData.image = {
    imageFile:
      userData.image.imageFile ||
      (userData.gender == "male"
        ? {
            file: {
              data: "../../../../assets/imgs/maleAvatar.jpg",
              contentType: "image/jpg",
            },
          }
        : userData.gender == "female"
        ? {
            file: {
              data: "../../../../assets/imgs/femaleAvatarpng.jpg",
              contentType: "image/jpg",
            },
          }
        : userData.gender == "other"
        ? {
            file: {
              data: "../../../../assets/imgs/otherAvatar.jpg",
              contentType: "image/jpg",
            },
          }
        : {
            file: {
              data: "../../../../assets/imgs/errorImg.png",
              contentType: "image/png",
            },
          }),
    alt: userData.image.alt || "profile picture",
  };
  return {
    ...userData,
  };
};

module.exports = normalizeUser;
