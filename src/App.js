import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";

function App() {
  const [revenue, setRevenue] = useState(null);
  const [growthRate, setGrowthRate] = useState(null);
  const [yearCount, setYearCount] = useState(5);
  const [projectedRevenue, setProjectedRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [averageGrowth, setAverageGrowth] = useState(null);

  const calculateRevenue = () => {
    let revenueArray = [];
    let total = 0;
    let previousRevenue = revenue;
    console.log(previousRevenue, growthRate, yearCount);
    for (let i = 1; i <= yearCount; i++) {
      console.log(previousRevenue);
      let newRevenue = previousRevenue * (1 + growthRate / 100);
      revenueArray.push(newRevenue);
      total += newRevenue;
      previousRevenue = newRevenue;
    }
    setProjectedRevenue(revenueArray);
    setTotalRevenue(total);
    setAverageGrowth(((total / revenue - 1) * 100) / yearCount);
  };
  const data = {
    labels: Array.from(
      { length: projectedRevenue.length },
      (_, i) => "Year " + (i + 1)
    ),
    datasets: [
      {
        label: "Projected Revenue",
        data: projectedRevenue,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
  const downloadCSV = () => {
    const headers = ["Year", "Projected Revenue"];
    const rows = projectedRevenue.map((rev, index) => [
      "Year " + (index + 1),
      rev.toFixed(2),
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "projected_revenue.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    console.log(yearCount, growthRate, revenue);
    if (yearCount > 0 && growthRate > 0 && revenue > 0) {
      console.log("Calculating revenue");
      calculateRevenue();
    }
  }, [yearCount, growthRate]);

  return (
    <div
      className="App"
      style={{
        // margin: 100,
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(to right, #11998e, #38ef7d)",
      }}
    >
      <header
        style={{
          padding: 20,
          backgroundColor: "#333",
          color: "#fff",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, textAlign: "center" }}>Revenue Calculator</div>
        <button
          style={{
            // padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            backgroundColor: "#eee",
            // width: 200,
            margin: 10,
          }}
          onClick={downloadCSV}
        >
          Download CSV
        </button>
      </header>
      <div
        className="form-container"
        style={{
          margin: 20,
        }}
      >
        <p
          style={{
            maxWidth: "700px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          This website helps you calculate projected revenue over a specified
          number of years based on an initial revenue and a growth rate. Enter
          your initial revenue, growth rate, and the number of years to see the
          projected revenue.
        </p>
        <br />
        <input
          style={{
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            width: 200,
            margin: 10,
          }}
          type="number"
          placeholder="Current Revenue"
          value={revenue}
          onChange={(e) => setRevenue(Number(e.target.value))}
        />

        <input
          style={{
            margin: 10,
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
            width: 200,
          }}
          type="number"
          placeholder="Annual Growth Rate (%)"
          value={growthRate}
          onChange={(e) => setGrowthRate(Number(e.target.value))}
        />
        <br />
        {growthRate !== null && (
          <div style={{ margin: 10 }}>
            <label>Annual Growth Rate: {growthRate}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={growthRate}
              onChange={(e) => setGrowthRate(Number(e.target.value))}
            />
          </div>
        )}
        <div>
          <button
            style={{
              padding: 10,
              borderRadius: 5,
              border: "1px solid #ccc",
              width: 200,
              margin: 10,
            }}
            onClick={calculateRevenue}
          >
            Calculate
          </button>
        </div>
      </div>
      {projectedRevenue.length > 0 && (
        <div>
          <h2>Revenue Upside Summary</h2>
          <p>Total Revenue: ${totalRevenue?.toFixed(2)}</p>
          <p>Average Annual Growth: {averageGrowth?.toFixed(2)}%</p>
        </div>
      )}

      {projectedRevenue.length > 0 && (
        <div
          className="output-container"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            margin: 20,
          }}
        >
          <h2>Projected Revenue</h2>
          <div style={{ margin: 10 }}>
            <label>Count of years: {yearCount} </label>
            <input
              type="range"
              min="1"
              max="100"
              value={yearCount}
              onChange={(e) => setYearCount(Number(e.target.value))}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              flexWrap: "wrap",
              padding: 10,
              margin: 10,
              height: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
                padding: 10,
                height: "250px",
                overflowX: "auto",
              }}
            >
              <div style={{ minWidth: "600px" }}>
                <Bar
                  data={{
                    labels: data.labels,
                    datasets: [
                      {
                        label: "Revenue",
                        data: data.datasets[0].data,
                        backgroundColor: "blue", 
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        ticks: {
                          color: "#000",
                        },
                      },
                      y: {
                        ticks: {
                          color: "#000", 
                          beginAtZero: true,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div
              style={{
                maxHeight: "350px",
                backgroundColor: "#fff",
                borderRadius: 5,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  padding: 10,
                  background: "#aaa",
                  width: "300px",
                  borderRadius: 5,
                  border: "1px solid #ccc",
                }}
              >
                Yearly growth report
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "left",
                  flexWrap: "wrap",
                  width: "300px",
                  padding: 10,
                  marginTop: "40px",
                  maxHeight: "300px",
                  overflowY: "scroll", 
                }}
              >
                {projectedRevenue.map((rev, index) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: 10,
                      borderRadius: 5,
                      border: "1px solid #ccc",
                      width: "500px",
                      margin: 10,
                      overflowY: "scroll",
                    }}
                  >
                    Year {index + 1}: ${rev.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
