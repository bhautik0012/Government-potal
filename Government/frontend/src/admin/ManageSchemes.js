import React, { useState, useEffect } from "react";
import axios from "axios";

function ManageSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isEditing, setIsEditing] = useState(false);
  const [currentSchemeId, setCurrentSchemeId] = useState(null);
  const [loading, setLoading] = useState(false); // New: Prevent double submission

  const [formData, setFormData] = useState({
    name: "", ministry: "", category: "General", 
    description: "", eligibility: "", documents: "", 
    deadline: "", how_to_apply: ""
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/schemes");
      setSchemes(res.data);
    } catch (err) {
      console.error("Error fetching schemes");
    }
  };

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditClick = (scheme) => {
    setIsEditing(true);
    setCurrentSchemeId(scheme.id);
    setFormData({
      name: scheme.name,
      ministry: scheme.ministry,
      category: scheme.category,
      description: scheme.description,
      eligibility: scheme.eligibility,
      documents: scheme.documents || "",
      deadline: scheme.deadline || "",
      how_to_apply: scheme.how_to_apply || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        // UPDATE EXISTING
        await axios.put(`http://127.0.0.1:5000/api/admin/update-scheme/${currentSchemeId}`, formData);
        alert("✅ Scheme Updated Successfully!");
      } else {
        // ADD NEW
        const res = await axios.post("http://127.0.0.1:5000/api/admin/add-scheme", formData);
        if (res.status === 201) {
            alert("🚀 New Scheme Published Successfully!");
        }
      }
      
      setIsEditing(false);
      setCurrentSchemeId(null);
      setFormData({ name: "", ministry: "", category: "General", description: "", eligibility: "", documents: "", deadline: "", how_to_apply: "" });
      fetchSchemes(); 
    } catch (err) {
      console.error(err);
      alert(isEditing ? "❌ Failed to update scheme" : "❌ Failed to add scheme. Check if the database has all columns.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("🗑️ Are you sure you want to delete this scheme? This action cannot be undone.")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/admin/delete-scheme/${id}`);
        fetchSchemes();
      } catch (err) {
        alert("Error deleting scheme");
      }
    }
  };

  // --- ANNOUNCEMENT LOGIC ---
  const postNewAd = async () => {
    const adContent = prompt("Enter the new announcement/advertisement text:");
    if (adContent) {
      try {
        await axios.post("http://127.0.0.1:5000/api/admin/add-announcement", { content: adContent });
        alert("📢 Ticker Updated!");
        window.location.reload(); 
      } catch (err) { alert("Error updating ticker"); }
    }
  };

  const handleClearAd = async () => {
    if (window.confirm("Remove current announcement?")) {
      try {
        await axios.delete("http://127.0.0.1:5000/api/admin/clear-announcements");
        window.location.reload(); 
      } catch (err) { alert("Error clearing ticker"); }
    }
  };

  const styles = {
    container: { padding: "40px", color: "white", fontFamily: "'Poppins', sans-serif", background: "#0f172a", minHeight: "100vh" },
    formCard: { 
      background: isEditing ? "#1e1b4b" : "#1e293b", 
      padding: "30px", borderRadius: "15px", marginBottom: "40px", 
      border: isEditing ? "2px solid #fbbf24" : "1px solid #334155",
      transition: "0.3s"
    },
    input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white", outline: "none", boxSizing: "border-box" },
    btn: { background: "#38bdf8", color: "#0f172a", padding: "12px 25px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", opacity: loading ? 0.6 : 1 },
    listCard: { background: "#1e293b", padding: "30px", borderRadius: "15px", border: "1px solid #334155" },
    schemeRow: { display: "flex", justifyContent: "space-between", padding: "15px", borderBottom: "1px solid #334155", alignItems: "center" }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ color: "#38bdf8", marginBottom: "30px" }}>Scheme Management</h1>

      <div style={{ ...styles.formCard, background: "#1e1b4b", border: "1px solid #334155" }}>
        <h3 style={{ color: "#fbbf24", margin: "0 0 15px 0" }}>📢 Global Announcement Ticker</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={postNewAd} style={{ ...styles.btn, background: "#fbbf24" }}>Update Text</button>
          <button onClick={handleClearAd} style={{ ...styles.btn, background: "#ef4444", color: "white" }}>Clear</button>
        </div>
      </div>

      <div style={styles.formCard}>
        <h3 style={{ color: isEditing ? "#fbbf24" : "white", marginTop: 0 }}>
          {isEditing ? "✏️ Edit Mode" : "➕ Create New Detailed Scheme"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <input style={styles.input} placeholder="Scheme Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <input style={styles.input} placeholder="Ministry" value={formData.ministry} onChange={(e) => setFormData({ ...formData, ministry: e.target.value })} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <select style={styles.input} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              <option value="General">General</option>
              <option value="Farmers">Farmers</option>
              <option value="Students">Students</option>
              <option value="Women">Women</option>
              <option value="Healthcare">Healthcare</option>
            </select>
            <input type="date" style={styles.input} value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
          </div>

          <input style={styles.input} placeholder="Required Docs (comma separated)" value={formData.documents} onChange={(e) => setFormData({ ...formData, documents: e.target.value })} />
          <textarea style={{ ...styles.input, height: "80px" }} placeholder="Brief Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <textarea style={{ ...styles.input, height: "60px" }} placeholder="Eligibility Rules" value={formData.eligibility} onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })} required />
          <textarea style={{ ...styles.input, height: "60px" }} placeholder="Instructions on How to Apply" value={formData.how_to_apply} onChange={(e) => setFormData({ ...formData, how_to_apply: e.target.value })} />

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" disabled={loading} style={{ ...styles.btn, background: isEditing ? "#fbbf24" : "#38bdf8" }}>
              {loading ? "Processing..." : isEditing ? "Save Changes" : "Publish Scheme"}
            </button>
            {isEditing && (
              <button type="button" style={{ ...styles.btn, background: "#64748b", color: "white" }} 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: "", ministry: "", category: "General", description: "", eligibility: "", documents: "", deadline: "", how_to_apply: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.listCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0 }}>Active Schemes</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <input style={{ ...styles.input, margin: 0, width: "200px" }} placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {filteredSchemes.map((s) => (
          <div key={s.id} style={styles.schemeRow}>
            <div>
              <strong style={{ color: "#38bdf8" }}>{s.name}</strong>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>{s.category} | Deadline: {s.deadline}</div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleEditClick(s)} style={{ background: "#fbbf24", color: "#1e3a8a", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Edit</button>
              <button onClick={() => handleDelete(s.id)} style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSchemes;