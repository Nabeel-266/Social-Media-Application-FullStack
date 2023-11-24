const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_PROCESS":
      return {
        user: null,
        isFetching: true,
        error: false,
      };

    case "LOGIN_SUCCESS":
      localStorage.setItem("loggedInUser", JSON.stringify({ ...action.payload }));
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };

    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };

    case "FOLLOW":
      return {
        ...state,
        user: {
          ...JSON.parse(localStorage.getItem("loggedInUser")),
          followings: [
            ...JSON.parse(localStorage.getItem("loggedInUser")).followings,
            action.payload,
          ],
        },
      };

    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...JSON.parse(localStorage.getItem("loggedInUser")),
          followings: JSON.parse(localStorage.getItem("loggedInUser")).followings.filter(
            (following) => following !== action.payload
          ),
        },
      };

    case "UPDATE_PROFILE":
      localStorage.setItem("loggedInUser", JSON.stringify({ ...action.payload }));
      return {
        ...state,
        user: {
          ...JSON.parse(localStorage.getItem("loggedInUser")),
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export default AuthReducer;

// case "FOLLOW":
//   return {
//     ...state,
//     user: {
//       ...state.user,
//       followings: [...state.user.data.followings, action.payload],
//     },
//   };
// case "UNFOLLOW":
//   return {
//     ...state,
//     user: {
//       ...state.user,
//       followings: state.user.data.followings.filter(
//         (following) => following !== action.payload
//       ),
//     },
//   };
