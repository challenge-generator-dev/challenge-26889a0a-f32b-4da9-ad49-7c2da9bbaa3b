import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">
            <span class="title-icon">📦</span>
            Seguimiento de Órdenes en Tiempo Real
          </h1>
          <p class="app-subtitle">Monitorea el estado de tus órdenes instantáneamente</p>
        </div>
      </header>
      
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app-footer">
        <p>Sistema de tracking en tiempo real &copy; 2024</p>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
    }
    
    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
    
    .app-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .title-icon {
      font-size: 2.5rem;
    }
    
    .app-subtitle {
      font-size: 1rem;
      opacity: 0.9;
      margin: 0;
    }
    
    .app-main {
      flex: 1;
      padding: 2rem 1rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
    
    .app-footer {
      background: #2d3748;
      color: #a0aec0;
      text-align: center;
      padding: 1rem;
      font-size: 0.875rem;
    }
    
    .app-footer p {
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .app-title {
        font-size: 1.5rem;
        flex-direction: column;
        gap: 0.25rem;
      }
      
      .title-icon {
        font-size: 2rem;
      }
      
      .app-subtitle {
        font-size: 0.875rem;
      }
      
      .app-main {
        padding: 1rem 0.5rem;
      }
    }
  `]
})
export class AppComponent {
  readonly title = 'order-tracking-client';
}