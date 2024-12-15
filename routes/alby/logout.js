const logout = async (req, res, next) => {
  res.cookie("awt", "", {
    maxAge: 0,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: process.env.NODE_ENV !== "development",
  });

  res.status(200).json({ loggedIn: false });
};

export default logout;
