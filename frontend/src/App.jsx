
import { useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Bell,
  Search,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Menu,
  Settings,
  FileSearch,
  Network,
  ArrowUpRight,
} from "lucide-react";
import { analyzeSecurityEvent } from "./api";
import "./App.css";

const initialAlerts = [
  {
    id: 1,
    severity: "CRITICAL",
    title: "Brute force followed by successful login",
    ip: "192.0.2.50",
    time: "Just now",
    status: "Investigating",
  },
  {
    id: 2,
    severity: "HIGH",
    title: "Unusual login activity detected",
    ip: "198.51.100.24",
    time: "8 min ago",
    status: "Open",
  },
  {
    id: 3,
    severity: "MEDIUM",
    title: "Multiple failed authentication attempts",
    ip: "203.0.113.17",
    time: "21 min ago",
    status: "Open",
  },
  {
    id: 4,
    severity: "LOW",
    title: "New source IP observed",
    ip: "192.0.2.81",
    time: "42 min ago",
    status: "Resolved",
  },
];

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [alerts, setAlerts] = useState(initialAlerts);

  const [investigationResult, setInvestigationResult] = useState(null);
  const [investigationError, setInvestigationError] = useState("");
  const [investigating, setInvestigating] = useState(false);

  const filtered = alerts.filter((alert) =>
    `${alert.title} ${alert.ip} ${alert.severity}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Alerts", icon: Bell },
    { name: "Investigations", icon: FileSearch },
    { name: "Network", icon: Network },
    { name: "Settings", icon: Settings },
  ];

  async function handleInvestigation(e) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const event = {
      username: form.get("username") || "unknown",
      source_ip: form.get("source_ip") || "unknown",
      failed_logins: Number(form.get("failed_logins") || 0),
      successful_login: form.get("successful_login") === "true",
      unique_ips: Number(form.get("unique_ips") || 1),
      unusual_hour: Number(form.get("unusual_hour") || 0),
      admin_action: Number(form.get("admin_action") || 0),
    };

    setInvestigating(true);
    setInvestigationError("");
    setInvestigationResult(null);

    try {
      const result = await analyzeSecurityEvent(event);
      setInvestigationResult(result);
      setActive("Investigations");
    } catch (error) {
      setInvestigationError(
        error.response?.data?.detail ||
          error.message ||
          "Investigation failed. Check your backend connection."
      );
    } finally {
      setInvestigating(false);
    }
  }

  function markResolved(id) {
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === id ? { ...alert, status: "Resolved" } : alert
      )
    );
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Shield size={23} />
          </div>
          <div>
            <h2>CyberSentinel</h2>
            <span>AI SECURITY PLATFORM</span>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav>
          {navItems.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${active === name ? "active" : ""}`}
              onClick={() => setActive(name)}
            >
              <Icon size={18} />
              <span>{name}</span>
              {name === "Alerts" && (
                <span className="nav-count">{alerts.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot" />
            All systems operational
          </div>

          <div className="profile">
            <div className="avatar">SA</div>
            <div>
              <strong>Security Analyst</strong>
              <span>SOC Administrator</span>
            </div>
            <Settings size={16} className="profile-settings" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            <Menu size={20} />
            CyberSentinel AI
          </div>

          <div className="breadcrumb">
            Security Operations <span>/</span> <strong>{active}</strong>
          </div>

          <div className="top-actions">
            <span className="live-indicator">
              <i /> LIVE MONITORING
            </span>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
              <b />
            </button>
            <div className="top-avatar">SA</div>
          </div>
        </header>

        <section className="page">
          {/* Page Heading */}
          <div className="page-heading">
            <div>
              <div className="eyebrow">SECURITY OPERATIONS CENTER</div>
              <h1>
                {active === "Dashboard" ? "Security Overview" : active}
              </h1>
              <p>
                Monitor threats, investigate incidents, and protect your
                environment.
              </p>
            </div>

            <div className="heading-right">
              <span className="date-chip">
                <Activity size={15} /> Detection engine active
              </span>
            </div>
          </div>

          {/* Metrics */}
          <div className="metric-grid">
            <Metric
              icon={Activity}
              label="Total Events"
              value="1,284"
              change="+12.8%"
              tone="blue"
              note="vs. previous period"
            />

            <Metric
              icon={AlertTriangle}
              label="Suspicious Events"
              value="38"
              change="+4.3%"
              tone="orange"
              note="vs. previous period"
            />

            <Metric
              icon={Shield}
              label="Critical Alerts"
              value={alerts
                .filter(
                  (alert) =>
                    alert.severity === "CRITICAL" &&
                    alert.status !== "Resolved"
                )
                .length.toString()
                .padStart(2, "0")}
              change="Requires review"
              tone="red"
              note="active critical alerts"
            />

            <Metric
              icon={CheckCircle}
              label="Resolved Incidents"
              value="96"
              change="+8.2%"
              tone="green"
              note="vs. previous period"
            />
          </div>

          {/* Alerts and Threat Activity */}
          <div className="content-grid">
            <section className="panel alert-panel">
              <div className="panel-heading">
                <div>
                  <h3>Recent Security Alerts</h3>
                  <p>Review and manage detected threats</p>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActive("Alerts")}
                >
                  View all <ArrowUpRight size={15} />
                </button>
              </div>

              <div className="search-box">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search alerts, IPs, severity..."
                />
              </div>

              <div className="alert-list">
                {filtered.map((alert) => (
                  <div className="alert-row" key={alert.id}>
                    <div
                      className={`severity-mark ${alert.severity.toLowerCase()}`}
                    />

                    <div className="alert-main">
                      <strong>{alert.title}</strong>
                      <span>
                        {alert.ip} <i>·</i> {alert.time}
                      </span>
                    </div>

                    <span
                      className={`severity-tag ${alert.severity.toLowerCase()}`}
                    >
                      {alert.severity}
                    </span>

                    <button
                      className="resolve-button"
                      title="Mark resolved"
                      onClick={() => markResolved(alert.id)}
                    >
                      {alert.status === "Resolved" ? (
                        <CheckCircle size={17} />
                      ) : (
                        <ArrowUpRight size={17} />
                      )}
                    </button>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <p className="empty-state">No matching alerts found.</p>
                )}
              </div>

              <div className="panel-footer">
                <span>
                  <span className="status-dot" /> {filtered.length} alerts
                  displayed
                </span>
                <span>Demo data</span>
              </div>
            </section>

            <section className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <h3>Threat Activity</h3>
                  <p>Events detected over time</p>
                </div>
                <span className="period-chip">Last 24 hours</span>
              </div>

              <div className="chart-summary">
                <strong>38</strong>
                <span>Suspicious events</span>
                <span className="trend-up">↑ 4.3%</span>
              </div>

              <div className="chart">
                {[
                  28, 42, 34, 54, 38, 68, 47, 39, 61, 45, 78, 51,
                  64, 43, 88, 58, 72, 49, 62, 39, 55, 75, 46, 67,
                ].map((height, i) => (
                  <div className="bar-column" key={i}>
                    <div
                      className={`bar ${i === 14 ? "bar-highlight" : ""}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="chart-labels">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>Now</span>
              </div>

              <div className="chart-legend">
                <span>
                  <i className="legend-blue" /> Total activity
                </span>
                <span>
                  <i className="legend-red" /> Threat spike
                </span>
              </div>
            </section>
          </div>

          {/* AI Pipeline */}
          <section className="panel pipeline-panel">
            <div className="panel-heading">
              <div>
                <h3>AI Investigation Pipeline</h3>
                <p>How CyberSentinel analyzes security events</p>
              </div>

              <span className="pipeline-badge">
                <span className="status-dot" /> Pipeline ready
              </span>
            </div>

            <div className="pipeline">
              <PipelineStep
                number="01"
                title="Security Event"
                detail="Log input"
              />
              <div className="pipeline-line" />

              <PipelineStep
                number="02"
                title="Rule Engine"
                detail="Rule-based checks"
              />
              <div className="pipeline-line" />

              <PipelineStep
                number="03"
                title="ML Detection"
                detail="Random Forest"
              />
              <div className="pipeline-line" />

              <PipelineStep
                number="04"
                title="RAG Retrieval"
                detail="ChromaDB knowledge"
              />
              <div className="pipeline-line" />

              <PipelineStep
                number="05"
                title="AI Investigation"
                detail="Gemini analysis"
              />
            </div>
          </section>

          {/* Quick Investigation and System Health */}
          <div className="bottom-grid">
            <section className="panel quick-panel">
              <div className="panel-heading">
                <div>
                  <h3>Quick Investigation</h3>
                  <p>Analyze a suspicious login event</p>
                </div>
                <FileSearch size={19} />
              </div>

              <form onSubmit={handleInvestigation}>
                <div className="form-grid">
                  <label>
                    Username
                    <input
                      name="username"
                      defaultValue="analyst01"
                      required
                    />
                  </label>

                  <label>
                    Source IP
                    <input
                      name="source_ip"
                      defaultValue="192.0.2.50"
                      required
                    />
                  </label>

                  <label>
                    Failed logins
                    <input
                      name="failed_logins"
                      type="number"
                      min="0"
                      defaultValue="12"
                      required
                    />
                  </label>

                  <label>
                    Unique IPs
                    <input
                      name="unique_ips"
                      type="number"
                      min="1"
                      defaultValue="2"
                      required
                    />
                  </label>

                  <label>
                    Successful login?
                    <select
                      name="successful_login"
                      defaultValue="true"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </label>

                  <label>
                    Unusual hour
                    <select name="unusual_hour" defaultValue="1">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </label>

                  <label>
                    Admin action
                    <select name="admin_action" defaultValue="0">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </label>
                </div>

                <button
                  className="primary-button"
                  type="submit"
                  disabled={investigating}
                >
                  <Activity size={16} />
                  {investigating
                    ? "Analyzing event..."
                    : "Run AI investigation"}
                </button>
              </form>
            </section>

            <section className="panel health-panel">
              <div className="panel-heading">
                <div>
                  <h3>System Health</h3>
                  <p>Connected services</p>
                </div>
                <CheckCircle size={19} />
              </div>

              {[
                "FastAPI backend · :8001",
                "ML detection engine",
                "ChromaDB knowledge base",
                "Gemini investigation service",
              ].map((service) => (
                <div className="health-row" key={service}>
                  <span>
                    <i className="status-dot" />
                    {service}
                  </span>
                  <strong>Ready</strong>
                </div>
              ))}

              <p className="health-note">
                <Clock size={13} /> Status indicators are illustrative until
                API health checks are connected.
              </p>
            </section>
          </div>

          {/* Investigation Error */}
          {investigationError && (
            <section className="panel result-panel">
              <div className="panel-heading">
                <div>
                  <h3>Investigation Error</h3>
                  <p>The security event could not be analyzed.</p>
                </div>
                <AlertTriangle size={19} />
              </div>

              <p className="error-message">
                {String(investigationError)}
              </p>
            </section>
          )}

          {/* Investigation Results */}
          {investigationResult && (
            <section className="panel result-panel">
              <div className="panel-heading">
                <div>
                  <h3>Investigation Results</h3>
                  <p>Response from the CyberSentinel AI backend</p>
                </div>

                <span className="pipeline-badge">
                  <span className="status-dot" /> Analysis complete
                </span>
              </div>

              <pre className="result-json">
                {JSON.stringify(investigationResult, null, 2)}
              </pre>
            </section>
          )}

          <footer>
            CyberSentinel AI <span>•</span> SOC Intelligence Platform
            <span className="footer-right">
              Built for security operations
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}

function Metric({ icon: Icon, label, value, change, tone, note }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <div className={`metric-icon ${tone}`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="metric-value">{value}</div>

      <div className="metric-bottom">
        <span
          className={tone === "red" ? "metric-alert" : "metric-change"}
        >
          {change}
        </span>
        <span>{note}</span>
      </div>
    </div>
  );
}

function PipelineStep({ number, title, detail }) {
  return (
    <div className="pipeline-step">
      <div className="step-number">{number}</div>
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  );
}
