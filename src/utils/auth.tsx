const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const getUser = () => {
  if (typeof window !== "undefined") {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return {};
    }
  }
  return {};
};

export { getToken, getUser };
