import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lib-modal-two',
  imports: [TranslatePipe],
  template: `
    <div class="panel">
      <div class="sidebar">
        <div class="logo">
          <span>&#9670;</span>
        </div>
        <nav class="nav">
          <div class="nav-item active">Dashboard</div>
          <div class="nav-item">Projects</div>
          <div class="nav-item">Users</div>
          <div class="nav-item">Settings</div>
        </nav>
      </div>
      <div class="content">
        <div class="topbar">
          <h2>Modal Two : {{ 'title' | translate }}</h2>
        </div>
        <div class="main">
          <div class="stat-card">
            <span class="stat-label">Active</span>
            <span class="stat-value">1,247</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Pending</span>
            <span class="stat-value">83</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Completed</span>
            <span class="stat-value">9,512</span>
          </div>
        </div>
        <div class="message">
          <span class="dot"></span>
          This panel demonstrates the <strong>secondary</strong> and surface theme colors.
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .panel {
      display: flex;
      min-height: 280px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    }

    .sidebar {
      background: var(--secondary);
      color: var(--onSecondary);
      width: 180px;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      transition: background 0.3s ease;
    }

    .logo {
      font-size: 1.5rem;
      text-align: center;
      opacity: 0.85;
    }

    .nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s ease;
      opacity: 0.75;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.12);
      opacity: 1;
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.18);
      opacity: 1;
      font-weight: 600;
    }

    .content {
      flex: 1;
      background: var(--surface);
      display: flex;
      flex-direction: column;
      transition: background 0.3s ease;
    }

    .topbar {
      padding: 20px 24px 0;
      color: var(--textPrimary);
      transition: color 0.3s ease;
    }

    .topbar h2 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .main {
      display: flex;
      gap: 14px;
      padding: 20px 24px;
    }

    .stat-card {
      flex: 1;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      transition: background 0.3s ease, border-color 0.3s ease;
    }

    .stat-label {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--textSecondary);
      margin-bottom: 6px;
      transition: color 0.3s ease;
    }

    .stat-value {
      display: block;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--textPrimary);
      transition: color 0.3s ease;
    }

    .message {
      margin: 0 24px 20px;
      padding: 12px 16px;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.875rem;
      color: var(--textPrimary);
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      flex-shrink: 0;
      transition: background 0.3s ease;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalTwoComponent {}
