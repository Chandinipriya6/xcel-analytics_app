import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Bar, Pie, Scatter } from "react-chartjs-2";
import Plot from "react-plotly.js";
import "./AnalyzeFile.css";
import Plotly from "plotly.js-dist-min";

export default function AnalyzeFile() {
  const location = useLocation();
  const navigate = useNavigate();
  const uploadedFile = location.state?.file;
  const savedAnalysis = location.state?.savedAnalysis || null;

  const [fields, setFields] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [dimension, setDimension] = useState("2D");
  const [selectedChartType, setSelectedChartType] = useState("");

  //  Default fileName & tableName
  const defaultFileName = uploadedFile?.name || "Untitled";
  const defaultTableName = location.state?.tableName || defaultFileName;

  const chartRef = useRef(null);
  const plotlyRef = useRef(null);

  //  Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // if you store user info
    navigate("/login"); // redirect to login page
  };

  useEffect(() => {
    if (savedAnalysis) {
      if (savedAnalysis.fields) setFields(savedAnalysis.fields);
      if (savedAnalysis.dataRows) setDataRows(savedAnalysis.dataRows);
      if (savedAnalysis.xAxis) setXAxis(savedAnalysis.xAxis);
      if (savedAnalysis.yAxis) setYAxis(savedAnalysis.yAxis);
      if (savedAnalysis.chartType) setSelectedChartType(savedAnalysis.chartType);
      if (savedAnalysis.dimension) setDimension(savedAnalysis.dimension || "2D");
      return;
    }

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        if (sheetData.length > 0) {
          setFields(sheetData[0]);
          setDataRows(sheetData.slice(1));
        }
      };
      reader.readAsArrayBuffer(uploadedFile);
    }
  }, [uploadedFile, savedAnalysis]);

  const handleDragStart = (e, field) => e.dataTransfer.setData("field", field);
  const handleDropX = (e) => {
    e.preventDefault();
    setXAxis(e.dataTransfer.getData("field"));
  };
  const handleDropY = (e) => {
    e.preventDefault();
    setYAxis(e.dataTransfer.getData("field"));
  };
  const allowDrop = (e) => e.preventDefault();

  const getChartData = () => {
    if (!xAxis || !yAxis) return null;
    const xIndex = fields.indexOf(xAxis);
    const yIndex = fields.indexOf(yAxis);
    if (xIndex === -1 || yIndex === -1) return null;
    const xValues = dataRows.map((row) => row[xIndex]);
    const yValues = dataRows.map((row) => row[yIndex]);
    return { xValues, yValues };
  };

  const chartData = getChartData();

  // ✅ Updated to always have proper names
  const handleSaveAnalysis = async () => {
    if (!chartData) {
      alert("Please select X and Y axis first.");
      return;
    }
    try {
      const payload = {
        tableName: defaultTableName,
        fileName: defaultFileName,
        description: location.state?.description || "",
        fields,
        dataRows,
        xAxis,
        yAxis,
        chartType: selectedChartType,
        dimension,
      };

      const res = await fetch("/api/analysis/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Analysis saved successfully");
      } else {
        alert("Save failed: " + (data.message || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert("Network error while saving");
    }
  };

  const handleDownload = () => {
    if (selectedChartType === "Heatmap" && dimension === "2D") {
      Plotly.toImage(plotlyRef.current, {
        format: "png",
        height: 500,
        width: 700,
      }).then((dataUrl) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${selectedChartType}.png`;
        a.click();
      });
      return;
    }
    if (dimension === "3D" || selectedChartType === "Heatmap") {
      Plotly.toImage(plotlyRef.current, {
        format: "png",
        height: 500,
        width: 700,
      }).then((dataUrl) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${selectedChartType}.png`;
        a.click();
      });
      return;
    }
    const chartInstance = chartRef.current;
    if (chartInstance && chartInstance.toBase64Image) {
      const url = chartInstance.toBase64Image();
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedChartType}.png`;
      a.click();
    }
  };

  return (
    <div className="analyze-wrapper">
      <aside className="sidebar">
        <h3>File Fields</h3>
        <div className="fields-list">
          {fields.map((field, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => handleDragStart(e, field)}
              className="draggable-field"
            >
              {field}
            </div>
          ))}
        </div>
        
        <div style={{ 
          background:"#aca1ba",
          color:"rgb(17, 16, 16)",
          marginTop:"2%",
          border:"none",
          padding:"3px 16px",
          borderRadius:"6px",
          cursor:"pointer",
          fontSize:"14px",
          // border:"1px solid #ddd",
          transition: "0.3s",
          display: "flex", 
          justifyContent: "center",  // ✅ horizontally center
          alignItems: "center", 

          }}>
          <button onClick={() => navigate("/analysis-history")}
            className="history-btn"
            style={{
              background: "transparent", 
              border: "none", 
              fontSize: "14px", 
              cursor: "pointer"
            }}
            >
            My Analysis History
          </button>
          
        </div>
        <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          // marginTop: "15px",
          width: "100%",
          fontSize: "14px",
          marginTop:"2%",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#c0392b")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#e74c3c")}
        >
        Logout
      </button>
      </aside>

      <main className="main-content">
        <div className="chart-types">
          {["Bar", "Pie", "Scatter", "Histogram", "Heatmap"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedChartType(type)}
              className={`chart-btn ${
                selectedChartType === type ? "active" : ""
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="axis-selectors">
          <div
            className="drop-zone"
            onDrop={handleDropX}
            onDragOver={allowDrop}
          >
            {xAxis || "Select X-Axis"}
          </div>
          <div
            className="drop-zone"
            onDrop={handleDropY}
            onDragOver={allowDrop}
          >
            {yAxis || "Select Y-Axis"}
          </div>
          <select
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
            className="dimension-select"
          >
            <option value="2D">2D</option>
            <option value="3D">3D</option>
          </select>

          {chartData && (
            <>
              <button className="download-btn" onClick={handleDownload}>
                Download
              </button>
              <button className="save-btn" onClick={handleSaveAnalysis}>
                Save Analysis
              </button>
            </>
          )}
        </div>

        <div className="chart-display">
          {!chartData ? (
            <p className="placeholder-text">
              Select X and Y axes to view chart.
            </p>
          ) : dimension === "2D" ? (
            selectedChartType === "Bar" ? (
              <Bar
                ref={chartRef}
                data={{
                  labels: chartData.xValues,
                  datasets: [
                    {
                      label: yAxis,
                      data: chartData.yValues,
                      backgroundColor: "rgba(75, 29, 120, 0.6)",
                    },
                  ],
                }}
                
              />
            ) : selectedChartType === "Pie" ? (
              <Pie
                ref={chartRef}
                data={{
                  labels: chartData.xValues,
                  datasets: [
                    {
                      data: chartData.yValues,
                      backgroundColor: [
                        "#ab9a90ff",
                        "#c0a94fff",
                        "#54ad91ff",
                        "#895095ff",
                        "#4BC0C0",
                        "#884c77ff",
                        "#834055ff",
                        "#793a3aff",
                      ],
                    },
                  ],
                }}
              />
            ) : selectedChartType === "Scatter" ? (
              <Scatter
                ref={chartRef}
                data={{
                  datasets: [
                    {
                      label: `${xAxis} vs ${yAxis}`,
                      data: chartData.xValues.map((x, i) => ({
                        x,
                        y: chartData.yValues[i],
                      })),
                      backgroundColor: "rgba(153,102,255,0.6)",
                    },
                  ],
                }}
              />
            ) : selectedChartType === "Histogram" ? (
              <Bar
                ref={chartRef}
                data={{
                  labels: chartData.xValues,
                  datasets: [
                    {
                      label: `${xAxis} Histogram`,
                      data: chartData.xValues,
                      backgroundColor: "rgba(255,99,132,0.6)",
                    },
                  ],
                }}
                options={{
                  scales: {
                    x: { title: { display: true, text: xAxis } },
                    y: { title: { display: true, text: "Count" } },
                  },
                }}
              />
            ) : selectedChartType === "Heatmap" ? (
              <Plot
                ref={plotlyRef}
                data={[
                  {
                    z: [chartData.yValues],
                    x: chartData.xValues,
                    type: "heatmap",
                    colorscale: "Viridis",
                  },
                ]}
                layout={{ autosize: true, height: 500 }}
              />
            ) : null
          ) : (
            <Plot
              ref={plotlyRef}
              data={[
                selectedChartType === "Histogram"
                  ? { x: chartData.xValues, y: chartData.yValues, type: "histogram" }
                  : selectedChartType === "Heatmap"
                  ? { z: [chartData.yValues], type: "surface", colorscale: "Viridis" }
                  : {
                      x: chartData.xValues,
                      y: chartData.yValues,
                      z: chartData.yValues.map(() => Math.random() * 10),
                      type:
                        selectedChartType === "Scatter" ? "scatter3d" : "mesh3d",
                      mode: "markers",
                      marker: { size: 5, color: chartData.yValues },
                    },
              ]}
              layout={{ autosize: true, height: 500 }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
