async function login(username, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Error logging in");
  }
}

async function logout() {
  const response = await fetch("/api/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error logging out");
  }
}

async function register(username, email, password) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Error registering");
  }
}

async function fetchProfile() {
  const response = await fetch("/api/profile");
  const data = await response.json();
  return data;
}

async function submitProfile(name, description) {
  const profile = { name, description };

  const response = await fetch("/api/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Error submitting profile");
  }
}

async function deleteProfile(id) {
  const response = await fetch(`/api/profile/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error deleting profile");
  }
}

async function updateProfile(id, name, description) {
  const profile = { name, description };

  const response = await fetch(`/api/profile/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error("Error updating profile");
  }
}

export {
  login,
  logout,
  register,
  fetchProfile,
  submitProfile,
  deleteProfile,
  updateProfile,
};
