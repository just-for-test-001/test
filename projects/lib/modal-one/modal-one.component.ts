import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lib-modal-one',
  imports: [TranslatePipe],
  template: `
    <div class="overlay">
      <div class="card">
        <div class="header">
          <h2>Modal One : {{ 'title' | translate }}</h2>
        </div>
        <div class="body">
          <p>This modal uses the <strong>primary</strong> theme colors.</p>
          <div class="color-swatch primary">Primary</div>
          <div class="color-swatch surface">Surface</div>
          <div class="color-swatch accent">Accent</div>
        </div>
        <div class="footer">
          <button class="btn-secondary">Cancel</button>
          <button class="btn-primary">Confirm</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .overlay {
      background: var(--background);
      min-height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      border-radius: 8px;
      transition: background 0.3s ease;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      width: 360px;
      max-width: 100%;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
      transition: background 0.3s ease, border-color 0.3s ease;
    }

    .header {
      background: var(--primary);
      color: var(--onPrimary);
      padding: 20px 24px;
      transition: background 0.3s ease;
    }

    .header h2 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .body {
      padding: 20px 24px;
      color: var(--textPrimary);
      transition: color 0.3s ease;
    }

    .body p {
      margin: 0 0 16px;
      line-height: 1.5;
      font-size: 0.9375rem;
    }

    .color-swatch {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 6px;
      margin: 0 8px 8px 0;
      font-size: 0.8125rem;
      font-weight: 500;
      border: 1px solid var(--border);
      transition: background 0.3s ease, border-color 0.3s ease;
    }

    .color-swatch.primary {
      background: var(--primary);
      color: var(--onPrimary);
    }

    .color-swatch.surface {
      background: var(--surface);
      color: var(--textPrimary);
    }

    .color-swatch.accent {
      background: var(--accent);
      color: var(--onPrimary);
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 24px;
      background: var(--background);
      border-top: 1px solid var(--border);
      transition: background 0.3s ease, border-color 0.3s ease;
    }

    button {
      padding: 8px 20px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s ease, background 0.3s ease;
    }

    button:hover {
      opacity: 0.88;
    }

    .btn-primary {
      background: var(--primary);
      color: var(--onPrimary);
    }

    .btn-secondary {
      background: transparent;
      color: var(--textSecondary);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background: var(--border);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalOneComponent {}
