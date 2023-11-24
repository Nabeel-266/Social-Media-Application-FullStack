export const LoginProcess = (userCredentials) => ({
  type: "LOGIN_PROCESS",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const Follow = (userId) => ({
  type: "FOLLOW",
  payload: userId,
});

export const Unfollow = (userId) => ({
  type: "UNFOLLOW",
  payload: userId,
});

export const UpdateProfile = (updtUser) => ({
  type: "UPDATE_PROFILE",
  payload: updtUser,
});
