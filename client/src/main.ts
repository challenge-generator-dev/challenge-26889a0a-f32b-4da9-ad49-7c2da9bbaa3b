import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { enableProdMode, isDevMode } from '@angular/core';

const isProduction = !isDevMode();

if (isProduction) {
  enableProdMode();
}

function bootstrap(): void {
  bootstrapApplication(AppComponent, appConfig)
    .then((appRef) => {
      console.log('Order Tracking Client initialized successfully');
      
      if (!isProduction) {
        console.debug('Application running in development mode');
      }
      
      window.addEventListener('beforeunload', () => {
        appRef.destroy();
      });
    })
    .catch((error) => {
      console.error('Failed to bootstrap application:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown bootstrap error';
      
      if (typeof document !== 'undefined') {
        const rootElement = document.getElementById('app');
        if (rootElement) {
          rootElement.innerHTML = `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #f5f5f5;
            ">
              <div style="
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                text-align: center;
              ">
                <h2 style="color: #d32f2f; margin-bottom: 1rem;">Error de Inicialización</h2>
                <p style="color: #666; margin-bottom: 1rem;">${errorMessage}</p>
                <button onclick="window.location.reload()" style="
                  background: #1976d2;
                  color: white;
                  border: none;
                  padding: 0.75rem 1.5rem;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 1rem;
                ">Reintentar</button>
              </div>
            </div>
          `;
        }
      }
    });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bootstrap();
    });
  } else {
    bootstrap();
  }
}

(window as unknown as { appBootstrap: () => void }).appBootstrap = bootstrap;