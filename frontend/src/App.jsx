import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://fabulous-amazement-production.up.railway.app/";

function App() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [goal, setGoal] = useState("");
  const [data, setData] = useState([]);
  const [goals, setGoals] = useState({});
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchGoals();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(`${API}/get_water`);
    setData(res.data);
  };

  const fetchGoals = async () => {
    const res = await axios.get(`${API}/get_goals`);
    const g = {};
    res.data.forEach((item) => {
      g[item.name] = item.goal;
    });
    setGoals(g);
  };

  const addWater = async () => {
    if (!name || !amount) return;

    if (editId) {
      await axios.put(`${API}/update/${editId}`, {
        name,
        amount,
      });
      setEditId(null);
    } else {
      await axios.post(`${API}/add_water`, {
        name,
        amount,
      });
    }

    setName("");
    setAmount("");
    fetchData();
  };

  const deleteEntry = async (id) => {
    await axios.delete(`${API}/delete/${id}`);
    fetchData();
  };

  const editEntry = (item) => {
    setName(item.name);
    setAmount(item.amount);
    setEditId(item.id);
  };

  const setUserGoal = async () => {
    if (!name || !goal) return;

    await axios.post(`${API}/set_goal`, {
      name,
      goal,
    });

    setGoal("");
    fetchGoals();
  };

  const grouped = {};
  data.forEach((item) => {
    if (!grouped[item.name]) grouped[item.name] = 0;
    grouped[item.name] += item.amount;
  });

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>💧 Family Water Tracker</h1>

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
      <button onClick={addWater}>
        {editId ? "Update" : "Add Water"}
      </button>

      <br /><br />

      <input
        placeholder="Set Goal (ml)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button onClick={setUserGoal}>Set Goal</button>

      <h2>👨‍👩‍👧 Family Progress</h2>

      {Object.keys(grouped).map((person) => {
        const total = grouped[person];
        const g = goals[person] || 2000;
        const percent = Math.min((total / g) * 100, 100);

        return (
          <div key={person}>
            <b>{person}</b>: {total}/{g} ml
            <div
              style={{
                width: "300px",
                margin: "auto",
                background: "#ddd",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  background: "green",
                  color: "white",
                }}
              >
                {Math.round(percent)}%
              </div>
            </div>
          </div>
        );
      })}

      <h2>📋 Entries</h2>

      {data.map((item) => (
        <div key={item.id}>
          {item.name} - {item.amount} ml
          <button onClick={() => editEntry(item)}>Edit</button>
          <button onClick={() => deleteEntry(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;