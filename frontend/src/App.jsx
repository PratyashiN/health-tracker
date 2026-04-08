import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");

  // 🎯 Dynamic goals
  const [goals, setGoals] = useState({});
  const [goalInputName, setGoalInputName] = useState("");
  const [goalInputValue, setGoalInputValue] = useState("");

  // 📊 Fetch
  const fetchData = async () => {
    const res = await axios.get("http://127.0.0.1:5000/get_water");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ Add water
  const addWater = async () => {
    if (!name || !amount) return alert("Enter all fields");

    await axios.post("http://127.0.0.1:5000/add_water", {
      name: name.toLowerCase(),
      amount: parseInt(amount),
      date: new Date().toISOString().split("T")[0],
    });

    setName("");
    setAmount("");
    fetchData();
  };

  // ❌ Delete
  const deleteEntry = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/delete/${id}`);
    fetchData();
  };

  // ✏️ Update
  const updateEntry = async (id) => {
    await axios.put(`http://127.0.0.1:5000/update/${id}`, {
      name: editName.toLowerCase(),
      amount: parseInt(editAmount),
    });

    setEditId(null);
    fetchData();
  };

  // 🎯 Set goal
  const setGoal = () => {
    if (!goalInputName || !goalInputValue) return;

    setGoals({
      ...goals,
      [goalInputName.toLowerCase()]: parseInt(goalInputValue),
    });

    setGoalInputName("");
    setGoalInputValue("");
  };

  // 👨‍👩‍👧 Group data
  const grouped = {};
  data.forEach((item) => {
    if (!grouped[item.name]) grouped[item.name] = 0;
    grouped[item.name] += item.amount;
  });

  return (
    <div style={{ textAlign: "center", padding: "20px", color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1>💧 Family Water Intake</h1>

      {/* ADD WATER */}
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Water (ml)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={addWater}>Add Water</button>

      <hr />

      {/* 🎯 SET GOAL */}
      <h3>🎯 Set Goal</h3>

      <input
        placeholder="Name"
        value={goalInputName}
        onChange={(e) => setGoalInputName(e.target.value)}
      />

      <input
        placeholder="Goal (ml)"
        value={goalInputValue}
        onChange={(e) => setGoalInputValue(e.target.value)}
      />

      <button onClick={setGoal}>Set Goal</button>

      <hr />

      {/* 👨‍👩‍👧 PROGRESS */}
      <h2>👨‍👩‍👧 Family Progress</h2>

      {Object.keys(grouped).length === 0 ? (
        <p>No data yet</p>
      ) : (
        Object.keys(grouped).map((person) => {
          const total = grouped[person];
          const goal = goals[person] || 2000;
          const percent = Math.min((total / goal) * 100, 100);

          return (
            <div key={person} style={{ marginBottom: "20px" }}>
              <strong>{person}</strong>: {total} / {goal} ml

              <div style={{ width: "300px", margin: "auto", border: "1px solid white" }}>
                <div
                  style={{
                    width: `${percent}%`,
                    background: "lightgreen",
                    color: "black",
                  }}
                >
                  {percent.toFixed(0)}%
                </div>
              </div>
            </div>
          );
        })
      )}

      <hr />

      {/* ENTRIES */}
      <h3>📊 Today's Entries</h3>

      {data.map((item) => (
        <div key={item.id}>
          {editId === item.id ? (
            <>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} />
              <input value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
              <button onClick={() => updateEntry(item.id)}>Save</button>
            </>
          ) : (
            <>
              {item.name} - {item.amount} ml

              <button onClick={() => {
                setEditId(item.id);
                setEditName(item.name);
                setEditAmount(item.amount);
              }}>
                Edit
              </button>

              <button onClick={() => deleteEntry(item.id)} style={{ color: "red" }}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;