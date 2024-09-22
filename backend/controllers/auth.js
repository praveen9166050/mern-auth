export const signup = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Signup successful"
    });
  } catch (error) {
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Login successful"
    });
  } catch (error) {
    next(error);
  }
}

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    next(error);
  }
}