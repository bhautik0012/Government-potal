const API = "http://127.0.0.1:5000";

export const getSchemes = async () => {
  const res = await fetch(`${API}/schemes`);
  return res.json();
};

export const getSchemeById = async (id) => {
  const res = await fetch(`${API}/scheme/${id}`);
  return res.json();
};

export const applyScheme = async (data) => {
  const res = await fetch(`${API}/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
};