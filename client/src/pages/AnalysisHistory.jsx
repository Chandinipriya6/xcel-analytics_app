import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function buildGraphData(analysis) {
  const { fields, dataRows, xAxis, yAxis } = analysis;

  const xIndex = fields.indexOf(xAxis);
  const yIndex = fields.indexOf(yAxis);

  if (xIndex === -1 || yIndex === -1) return [];

  return dataRows.map((row) => ({
    x: row[xIndex],
    y: row[yIndex],
  }));
}

export default function AnalysisHistory() {
  const [history, setHistory] = useState([]);
  const [insightsMap, setInsightsMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch insights for a specific analysis item
  async function fetchInsights(item) {
    if (!item) return;

    setLoadingMap((prev) => ({ ...prev, [item._id]: true }));

    try {
      const res = await fetch(
        "http://localhost:5000/api/summaries/graph-insights",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ summary: item.summary || item }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend returned error:", text);
        setInsightsMap((prev) => ({
          ...prev,
          [item._id]: "Failed to load insights.",
        }));
        setLoadingMap((prev) => ({ ...prev, [item._id]: false }));
        return;
      }

      const data = await res.json();
      setInsightsMap((prev) => ({ ...prev, [item._id]: data.insights }));
    } catch (error) {
      console.error("Fetch error:", error);
      setInsightsMap((prev) => ({
        ...prev,
        [item._id]: "Error fetching insights.",
      }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [item._id]: false }));
    }
  }

  // ✅ Fetch summary for a specific item
  async function fetchSummary(item) {
    try {
      const token = localStorage.getItem("token");
      const graphData = buildGraphData(item);

      const response = await fetch("/api/analysis/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ analysisId: item._id, data: graphData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error("Failed to fetch summary");
      }

      const result = await response.json();
      return result.summary || "No summary available.";
    } catch (error) {
      console.error("Summary fetch error:", error);
      return "Error fetching summary.";
    }
  }

  // ✅ Load history and fetch summaries
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    async function loadHistoryWithSummaries() {
      try {
        const res = await fetch("/api/analysis/history", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          navigate("/");
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          const dataWithSummaries = await Promise.all(
            data.map(async (item) => {
              const summary = await fetchSummary(item);
              return { ...item, summary };
            })
          );
          setHistory(dataWithSummaries);
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error("Error loading history:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }

    loadHistoryWithSummaries();
  }, [navigate]);

  const handleView = (item) => {
    navigate("/analyze-file", { state: { savedAnalysis: item } });
  };

  // const handleDelete = (id) => {
  //   setHistory((prev) => prev.filter((item) => item._id !== id));
  // };

  const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/analysis/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errMsg = await res.text();
      console.error("Delete failed:", errMsg);
      return;
    }

    // Remove from UI only if backend confirmed deletion
    setHistory((prev) => prev.filter((item) => item._id !== id));
  } catch (error) {
    console.error("Delete error:", error);
  }
};


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <p>Loading history...</p>;

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "24px",
      fontFamily: "Inter, Arial, sans-serif",
      background: `url("https://www.shutterstock.com/image-photo/analyst-manages-system-database-analysis-600nw-2437018947.jpg")`,
      backgroundSize: "cover",
      borderRadius: "0",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      textAlign: "center",
      color: "#b3bccbff",
      marginBottom: "30px",
      letterSpacing: "-0.5px",
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },
    item: {
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "18px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    },
    fileName: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    detail: {
      fontSize: "14px",
      color: "#374151",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    summary: {
      marginTop: "4px",
      fontStyle: "italic",
      fontSize: "14px",
      color: "#6b7280",
      padding: "8px 12px",
      background: "#f3f4f6",
      borderRadius: "6px",
    },
    insights: {
    marginTop: "12px",
    padding: "12px 16px",
    backgroundColor: "#f9fafb",
    borderLeft: "4px solid #3b82f6", // accent border
    borderRadius: "8px",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#111827",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  insightsTitle: {
    margin: "0 0 8px 0",
    fontSize: "16px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
    deleteBtn: {
      alignSelf: "flex-end",
      background: "#ef4444",
      color: "white",
      border: "none",
      padding: "8px 14px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "background 0.2s",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📜 My Analysis History</h2>

      {history.length === 0 ? (
        <p>No saved analyses yet.</p>
      ) : (
        <ul style={styles.list}>
          {history.map((h) => (
            <li key={h._id} style={styles.item} onClick={() => handleView(h)}>
              <div style={styles.fileName}>📂 {h.fileName || "Untitled File"}</div>
              <div style={styles.detail}>📝 Table: {h.tableName || "N/A"}</div>
              <div style={styles.detail}>
                📊 Chart: {h.chartType || "N/A"}{" "}
                {h.dimension ? `(${h.dimension})` : ""}
              </div>
              <div style={styles.detail}>
                📅 Saved: {h.createdAt ? formatDate(h.createdAt) : "Date not available"}
              </div>
              <div style={styles.summary}>{h.summary || "Loading summary..."}</div>

              <div className="chart-card">
                
                {/* <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchInsights(h);
                  }}
                > */}
                  {/* {loadingMap[h._id] ? "⏳ Loading..." : "Show Insights"} */}
                {/* </button> */}
                {/* {insightsMap[h._id] && (
                  <div className="insights">
                    <h4>Insights:</h4>
                    <ReactMarkdown>{insightsMap[h._id]}</ReactMarkdown>
                  </div>
                )} */}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(h._id);
                }}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
