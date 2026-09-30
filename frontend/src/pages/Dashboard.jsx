import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/expenses",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch expenses");
      }

      setExpenses(data.expenses);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Total amount
  const totalAmount = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  // Total number of expenses
  const totalExpenses = expenses.length;

  // Current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthAmount = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);

      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((total, expense) => total + Number(expense.amount), 0);

  // Recent 5 expenses

  const categoryTotals = {};

expenses.forEach((e) => {
  categoryTotals[e.category] =
    (categoryTotals[e.category] || 0) + Number(e.amount);
});

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="page">
        <h1 className="page-title">Dashboard</h1>
        <p>Loading expenses...</p>
      </div>
    );
  }

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

  return (
    <div className="page">
      <div className="expense-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ color: "#777", marginTop: "5px" }}>
            Overview of your expenses
          </p>
        </div>

        <button className="btn btn-primary"onClick={() => navigate("/expenses")}
        > + Add Expense
        </button>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      {error && (
        <div className="error-message"> {error}
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Amount Spent</h3>
          <h2>₹{totalAmount.toLocaleString("en-IN")}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Total Expenses</h3>
          <h2>{totalExpenses}</h2>
        </div>

        <div className="dashboard-card">
          <h3>This Month</h3>
          <h2>₹{thisMonthAmount.toLocaleString("en-IN")}</h2>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="expense-card">
        <div className="expense-header">
          <h2>Recent Expenses</h2>

          {expenses.length > 0 && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/expenses")}
            >
              View All
            </button>
          )}
        </div>
        <div className="expense-card">
  <h2>Category Summary</h2>

  {Object.entries(categoryTotals).map(([category, amount]) => (
    <div key={category} style={{display:"flex", justifyContent:"space-between", padding:"10px 0"}}>
      <span>{category}</span>
      <b>₹{amount.toLocaleString("en-IN")}</b>
    </div>
  ))}
</div>

        {recentExpenses.length === 0 ? (
          <p style={{ marginTop: "20px", color: "#777" }}>
            No expenses added yet.
          </p>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {recentExpenses.map((expense) => (
              <div
                key={expense._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div>
                  <h3>{expense.title}</h3>

                  <p
                    style={{
                      color: "#777",
                      marginTop: "5px",
                    }}
                  >
                    {expense.category} • {expense.paymentMethod}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <strong className="expense-amount">
                    ₹{Number(expense.amount).toLocaleString("en-IN")}
                  </strong>

                  <p
                    style={{
                      color: "#999",
                      fontSize: "13px",
                      marginTop: "5px",
                    }}
                  >
                    {new Date(expense.date).toLocaleDateString("en-IN")}
                  </p>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    
  );
}

export default Dashboard;