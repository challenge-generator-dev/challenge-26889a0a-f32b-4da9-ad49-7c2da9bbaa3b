# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /orders/events`
- `client` expone http (api: http://localhost:3000):
  - `GET /orders/events`

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/test/order-event.service.spec.ts` — `OrderEvent.push`: Se invoca `push` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/interceptors/metrics.interceptor.ts` — `RequestMetrics.push`: Se invoca `push` sobre `RequestMetrics`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/interceptors/metrics.interceptor.ts` — `RequestMetrics.shift`: Se invoca `shift` sobre `RequestMetrics`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/infrastructure/interceptors/metrics.interceptor.ts` — `RequestMetrics.reduce`: Se invoca `reduce` sobre `RequestMetrics`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2

### Brecha de conocimiento
Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261110090352996), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz

### Misión / candidato
Mostrar en vivo el estado de las ordenes

### Reto
- Tema: Consumo de eventos en tiempo real con Kafka
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de una interfaz de seguimiento de órdenes en tiempo real
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial del consumidor de Kafka — objetivo: Establecer una conexión con Kafka y configurar un consumidor para leer eventos del topic de órdenes. — entregable (NO resolver): Consumidor de Kafka funcional que lee eventos del topic de órdenes.
- Fase 2: Integración del consumidor con la interfaz de usuario — objetivo: Mostrar los eventos recibidos de Kafka en la interfaz de usuario en tiempo real. — entregable (NO resolver): Interfaz de usuario que muestra los eventos de órdenes en tiempo real.
- Fase 3: Implementación de la lógica de negocio — objetivo: Implementar la lógica de negocio para manejar los eventos de órdenes y mostrar el estado actual de las órdenes en la interfaz. — entregable (NO resolver): Lógica de negocio que procesa los eventos de órdenes y actualiza el estado de las órdenes en la interfaz.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-events-api",
  "version": "1.0.0",
  "description": "API para seguimiento de órdenes en tiempo real usando Kafka",
  "main": "dist/main.js",
  "scripts": {
    "build": "rimraf dist && tsc",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "ts-node src/main.ts",
    "start:dev": "nodemon src/main.ts",
    "start:prod": "node dist/main.js",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@nestjs/common": "^11.2.0",
    "@nestjs/config": "^4.0.0",
    "@nestjs/core": "^11.2.0",
    "@nestjs/platform-express": "^11.2.0",
    "@nestjs/swagger": "^11.4.8",
    "@nestjs/websockets": "^11.2.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "kafkajs": "^2.2.4",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.2.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.12.7",
    "@types/supertest": "^6.0.2",
    "@types/uuid": "^9.0.8",
    "@typescript-eslint/eslint-plugin": "^7.7.0",
    "@typescript-eslint/parser": "^7.7.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3",
    "jest": "^29.7.0",
    "nodemon": "^3.1.0",
    "prettier": "^3.2.5",
    "rimraf": "^5.0.5",
    "supertest": "^6.3.4",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5"
  }
}

// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}

// === ARCHIVO: api/src/domain/models/order-event.model.ts ===
import { IsDate, IsEnum, IsString, IsUUID } from 'class-validator';

export enum OrderStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class OrderEvent {
  @IsUUID()
  orderId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsDate()
  updatedAt: Date;

  @IsString()
  metadata?: string;

  constructor(orderId: string, status: OrderStatus, updatedAt: Date, metadata?: string) {
    this.orderId = orderId;
    this.status = status;
    this.updatedAt = updatedAt;
    this.metadata = metadata;
  }
}

// === ARCHIVO: api/src/domain/ports/order-event.port.ts ===
import { Observable } from 'rxjs';
import { OrderEvent } from '../models/order-event.model';

export interface OrderEventPort {
  streamOrderEvents(): Observable<OrderEvent>;
  closeConnection(): Promise<void>;
}

// === ARCHIVO: api/src/application/services/order-event.service.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrderEventPort } from '../../domain/ports/order-event.port';
import { OrderEvent, OrderStatus } from '../../domain/models/order-event.model';

@Injectable()
export class OrderEventService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventService.name);
  private eventSubscription: Subscription | null = null;
  private readonly eventSubject = new Subject<OrderEvent>();
  private readonly connectedClients = new Set<{ id: string; eventId: number }>();
  private isProcessing = false;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private reconnectAttempts = 0;

  constructor(private readonly orderEventPort: OrderEventPort) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('OrderEventService inicializado');
    await this.startEventConsumption();
  }

  async onModuleDestroy(): Promise<void> {
    await this.stopEventConsumption();
  }

  private async startEventConsumption(): Promise<void> {
    try {
      this.logger.log('Iniciando consumo de eventos de orders desde Kafka');
      
      const eventStream$ = this.orderEventPort.streamOrderEvents();
      
      this.eventSubscription = eventStream$.subscribe({
        next: (event: OrderEvent) => this.handleNewEvent(event),
        error: (error: Error) => this.handleStreamError(error),
        complete: () => this.handleStreamComplete()
      });
      
      this.reconnectAttempts = 0;
      this.isProcessing = true;
      this.logger.log('Suscrito exitosamente al stream de eventos de Kafka');
    } catch (error) {
      this.logger.error(`Error al iniciar consumo de eventos: ${error instanceof Error ? error.message : 'Unknown error'}`);
      await this.attemptReconnection();
    }
  }

  private handleNewEvent(event: OrderEvent): void {
    try {
      this.logger.debug(`Evento recibido: orderId=${event.orderId}, status=${event.status}`);
      
      const processedEvent = this.processEventData(event);
      this.eventSubject.next(processedEvent);
      this.broadcastToConnectedClients(processedEvent);
    } catch (error) {
      this.logger.error(`Error procesando evento: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private processEventData(event: OrderEvent): OrderEvent {
    if (!event.orderId || event.orderId.trim() === '') {
      throw new HttpException('orderId inválido', HttpStatus.BAD_REQUEST);
    }
    
    if (!this.isValidStatus(event.status)) {
      this.logger.warn(`Estado desconocido: ${event.status}, usando CREATED por defecto`);
      return new OrderEvent(event.orderId, OrderStatus.CREATED, event.updatedAt, event.metadata);
    }
    
    const enrichedEvent = new OrderEvent(
      event.orderId,
      event.status,
      event.updatedAt || new Date(),
      this.enrichMetadata(event)
    );
    
    return enrichedEvent;
  }

  private isValidStatus(status: OrderStatus): boolean {
    return Object.values(OrderStatus).includes(status);
  }

  private enrichMetadata(event: OrderEvent): string {
    const baseMetadata = event.metadata || '{}';
    try {
      const parsed = JSON.parse(baseMetadata);
      parsed.processedAt = new Date().toISOString();
      parsed.serviceVersion = '1.0.0';
      return JSON.stringify(parsed);
    } catch {
      return JSON.stringify({ original: baseMetadata, processedAt: new Date().toISOString() });
    }
  }

  private handleStreamError(error: Error): void {
    this.logger.error(`Error en stream de Kafka: ${error.message}`);
    this.isProcessing = false;
    
    if (error.message.includes('connection') || error.message.includes('network')) {
      this.attemptReconnection();
    }
  }

  private handleStreamComplete(): void {
    this.logger.warn('Stream de eventos completado inesperadamente');
    this.isProcessing = false;
    this.attemptReconnection();
  }

  private async attemptReconnection(): Promise<void> {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      this.logger.error('Máximo de intentos de reconexión alcanzado');
      throw new HttpException(
        'No se pudo establecer conexión con el servicio de eventos',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    this.logger.log(`Intento de reconexión ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS} en ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    await this.startEventConsumption();
  }

  async stopEventConsumption(): Promise<void> {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
      this.eventSubscription = null;
    }
    
    try {
      await this.orderEventPort.closeConnection();
      this.logger.log('Conexión con Kafka cerrada correctamente');
    } catch (error) {
      this.logger.error(`Error al cerrar conexión: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    this.isProcessing = false;
  }

  getEventStream(): Observable<OrderEvent> {
    return this.eventSubject.asObservable();
  }

  getEventsByStatus(status: OrderStatus): Observable<OrderEvent> {
    return this.eventSubject.asObservable().pipe(
      filter(event => event.status === status)
    );
  }

  getEventByOrderId(orderId: string): Promise<OrderEvent | null> {
    return new Promise((resolve) => {
      const subscription = this.eventSubject.asObservable().pipe(
        filter(event => event.orderId === orderId),
        map(event => event)
      ).subscribe({
        next: (event) => {
          subscription.unsubscribe();
          resolve(event);
        },
        error: () => {
          subscription.unsubscribe();
          resolve(null);
        }
      });
      
      setTimeout(() => {
        subscription.unsubscribe();
        resolve(null);
      }, 5000);
    });
  }

  registerClient(clientId: string): { eventId: number } {
    const clientData = { id: clientId, eventId: Date.now() };
    this.connectedClients.add(clientData);
    this.logger.log(`Cliente registrado: ${clientId}. Total clientes: ${this.connectedClients.size}`);
    return { eventId: clientData.eventId };
  }

  removeClient(clientId: string): void {
    for (const client of this.connectedClients) {
      if (client.id === clientId) {
        this.connectedClients.delete(client);
        this.logger.log(`Cliente removido: ${clientId}. Total clientes: ${this.connectedClients.size}`);
        break;
      }
    }
  }

  private broadcastToConnectedClients(event: OrderEvent): void {
    if (this.connectedClients.size === 0) {
      this.logger.debug('No hay clientes conectados para broadcast');
      return;
    }
    
    this.logger.debug(`Broadcasting evento a ${this.connectedClients.size} clientes`);
  }

  getServiceStatus(): { isProcessing: boolean; connectedClients: number; reconnectAttempts: number } {
    return {
      isProcessing: this.isProcessing,
      connectedClients: this.connectedClients.size,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// === ARCHIVO: api/src/infrastructure/config/kafka.config.ts ===
import { Injectable } from '@nestjs/common';
import { Kafka, KafkaConfig, Consumer } from 'kafkajs';

export interface KafkaEnvironmentConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
  sessionTimeout: number;
  heartbeatInterval: number;
  rebalanceTimeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface KafkaConsumerOptions {
  groupId: string;
  sessionTimeout?: number;
  heartbeat?: {
    interval: number;
  };
  rebalanceTimeout?: number;
}

@Injectable()
export class KafkaConfigService {
  private readonly config: KafkaEnvironmentConfig;

  constructor() {
    const brokersEnv = process.env.KAFKA_BROKERS || 'localhost:9092';
    const brokers = brokersEnv.split(',').map(b => b.trim());

    this.config = {
      clientId: process.env.KAFKA_CLIENT_ID || 'order-events-api',
      brokers,
      groupId: process.env.KAFKA_GROUP_ID || 'order-events-consumer-group',
      sessionTimeout: parseInt(process.env.KAFKA_SESSION_TIMEOUT || '30000', 10),
      heartbeatInterval: parseInt(process.env.KAFKA_HEARTBEAT_INTERVAL || '3000', 10),
      rebalanceTimeout: parseInt(process.env.KAFKA_REBALANCE_TIMEOUT || '60000', 10),
      retryAttempts: parseInt(process.env.KAFKA_RETRY_ATTEMPTS || '5', 10),
      retryDelay: parseInt(process.env.KAFKA_RETRY_DELAY || '1000', 10),
    };
  }

  getKafkaConfig(): KafkaConfig {
    return {
      clientId: this.config.clientId,
      brokers: this.config.brokers,
      retry: {
        initialRetryTime: this.config.retryDelay,
        retries: this.config.retryAttempts,
      },
    };
  }

  getConsumerConfig(): KafkaConsumerOptions {
    return {
      groupId: this.config.groupId,
      sessionTimeout: this.config.sessionTimeout,
      heartbeat: {
        interval: this.config.heartbeatInterval,
      },
      rebalanceTimeout: this.config.rebalanceTimeout,
    };
  }

  getClientId(): string {
    return this.config.clientId;
  }

  getBrokers(): string[] {
    return this.config.brokers;
  }

  getGroupId(): string {
    return this.config.groupId;
  }

  validateConfig(): boolean {
    if (!this.config.clientId || this.config.clientId.trim() === '') {
      return false;
    }
    if (!this.config.brokers || this.config.brokers.length === 0) {
      return false;
    }
    if (!this.config.groupId || this.config.groupId.trim() === '') {
      return false;
    }
    return true;
  }

  createKafkaInstance(): Kafka {
    return new Kafka(this.getKafkaConfig());
  }

  createConsumer(kafka: Kafka): Consumer {
    return kafka.consumer(this.getConsumerConfig());
  }
}

// === ARCHIVO: api/src/infrastructure/messaging/kafka-consumer.service.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject, forwardRef } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload, KafkaMessage } from 'kafkajs';
import { Observable, Subject, catchError, EMPTY, filter, map, takeUntil } from 'rxjs';
import { KafkaConfigService } from '../config/kafka.config';
import { OrderEvent, OrderStatus } from '../../domain/models/order-event.model';
import { OrderEventPort } from '../../domain/ports/order-event.port';

@Injectable()
export class KafkaConsumerService implements OrderEventPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly eventSubject = new Subject<OrderEvent>();
  private isConnected = false;
  private readonly destroy$ = new Subject<void>();
  private readonly topicName = process.env.KAFKA_TOPIC || 'order-events';

  constructor(private readonly kafkaConfig: KafkaConfigService) {
    this.kafka = new Kafka(this.kafkaConfig.getKafkaConfig());
    this.consumer = this.kafka.consumer(this.kafkaConfig.getConsumerConfig());
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando consumidor de Kafka...');
    
    if (!this.kafkaConfig.validateConfig()) {
      this.logger.error('Configuración de Kafka inválida. Verifique las variables de entorno.');
      return;
    }

    try {
      await this.connect();
      await this.subscribeToTopic();
      await this.startConsuming();
      this.logger.log(`Consumidor de Kafka conectado al topic: ${this.topicName}`);
    } catch (error) {
      this.logger.error('Error al inicializar el consumidor de Kafka', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Cerrando consumidor de Kafka...');
    await this.closeConnection();
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      this.logger.warn('El consumidor ya está conectado');
      return;
    }

    try {
      await this.consumer.connect();
      this.isConnected = true;
      this.logger.log('Conexión establecida con Kafka');
    } catch (error) {
      this.logger.error('Error al conectar con Kafka', error);
      throw error;
    }
  }

  private async subscribeToTopic(): Promise<void> {
    try {
      await this.consumer.subscribe({ 
        topic: this.topicName, 
        fromBeginning: false 
      });
      this.logger.log(`Suscrito al topic: ${this.topicName}`);
    } catch (error) {
      this.logger.error(`Error al suscribirse al topic ${this.topicName}`, error);
      throw error;
    }
  }

  private async startConsuming(): Promise<void> {
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message, topic, partition } = payload;
    
    this.logger.debug(`Mensaje recibido - Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}`);

    try {
      const orderEvent = this.parseMessage(message);
      if (orderEvent) {
        this.eventSubject.next(orderEvent);
        this.logger.debug(`Evento de orden procesado: ${orderEvent.orderId} - ${orderEvent.status}`);
      }
    } catch (error) {
      this.logger.error('Error al procesar mensaje de Kafka', error);
    }
  }

  private parseMessage(message: KafkaMessage): OrderEvent | null {
    try {
      const value = message.value?.toString();
      if (!value) {
        this.logger.warn('Mensaje vacío recibido');
        return null;
      }

      const data = JSON.parse(value);
      
      if (!data.orderId || !data.status) {
        this.logger.warn('Mensaje con formato inválido, faltan campos requeridos');
        return null;
      }

      const status = this.validateStatus(data.status);
      if (!status) {
        this.logger.warn(`Estado de orden inválido: ${data.status}`);
        return null;
      }

      return new OrderEvent(
        data.orderId,
        status,
        data.updatedAt ? new Date(data.updatedAt) : new Date(),
        data.metadata
      );
    } catch (error) {
      this.logger.error('Error al parsear mensaje', error);
      return null;
    }
  }

  private validateStatus(status: string): OrderStatus | null {
    const validStatuses = Object.values(OrderStatus);
    return validStatuses.includes(status as OrderStatus) ? status as OrderStatus : null;
  }

  streamOrderEvents(): Observable<OrderEvent> {
    return this.eventSubject.asObservable().pipe(
      filter((event): event is OrderEvent => event !== null && event !== undefined),
      takeUntil(this.destroy$),
      catchError((error) => {
        this.logger.error('Error en el stream de eventos', error);
        return EMPTY;
      })
    );
  }

  async closeConnection(): Promise<void> {
    try {
      this.destroy$.next();
      this.destroy$.complete();
      
      if (this.isConnected) {
        await this.consumer.disconnect();
        this.isConnected = false;
        this.logger.log('Conexión con Kafka cerrada correctamente');
      }
    } catch (error) {
      this.logger.error('Error al cerrar la conexión con Kafka', error);
      throw error;
    }
  }

  isConsumerConnected(): boolean {
    return this.isConnected;
  }

  async reconnect(): Promise<void> {
    this.logger.log('Intentando reconectar con Kafka...');
    await this.closeConnection();
    this.isConnected = false;
    await this.connect();
    await this.subscribeToTopic();
    await this.startConsuming();
    this.logger.log('Reconexión con Kafka exitosa');
  }
}

// === ARCHIVO: api/src/infrastructure/controllers/order-event.controller.ts ===
import { Controller, Get, Res, HttpStatus, Logger, Header } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { OrderEvent } from '../../domain/models/order-event.model';
import { KafkaConsumerService } from '../messaging/kafka-consumer.service';

@Controller('orders')
export class OrderEventController {
  private readonly logger = new Logger(OrderEventController.name);

  constructor(private readonly kafkaConsumer: KafkaConsumerService) {}

  @Get('events')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  @Header('X-Accel-Buffering', 'no')
  streamOrderEvents(@Res() res: Response): void {
    this.logger.log('Cliente conectado al stream de eventos de órdenes');

    if (!this.kafkaConsumer.isConsumerConnected()) {
      this.logger.warn('Consumidor de Kafka no está conectado');
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Servicio de eventos no disponible',
        error: 'Kafka consumer not connected'
      });
      return;
    }

    const eventStream = this.kafkaConsumer.streamOrderEvents();
    let clientConnected = true;

    const sendEvent = (event: OrderEvent): void => {
      if (!clientConnected) {
        return;
      }

      const sseData = this.formatSSEEvent(event);
      res.write(sseData);
    };

    const subscription = eventStream.subscribe({
      next: (event) => sendEvent(event),
      error: (error) => {
        this.logger.error('Error en el stream de eventos', error);
        if (clientConnected) {
          res.write(`event: error\ndata: ${JSON.stringify({ message: 'Error en la conexión' })}\n\n`);
        }
      },
      complete: () => {
        this.logger.log('Stream de eventos completado');
        if (clientConnected) {
          res.write(`event: close\ndata: ${JSON.stringify({ message: 'Stream cerrado' })}\n\n`);
          res.end();
        }
      }
    });

    res.on('close', () => {
      clientConnected = false;
      subscription.unsubscribe();
      this.logger.log('Cliente desconectado del stream de eventos de órdenes');
    });

    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Conectado al stream de eventos de órdenes' })}\n\n`);
  }

  private formatSSEEvent(event: OrderEvent): string {
    const eventData = {
      orderId: event.orderId,
      status: event.status,
      updatedAt: event.updatedAt.toISOString(),
      metadata: event.metadata
    };

    return `event: order-update\ndata: ${JSON.stringify(eventData)}\n\n`;
  }

  @Get('events/health')
  checkHealth(): { status: string; kafkaConnected: boolean } {
    return {
      status: 'ok',
      kafkaConnected: this.kafkaConsumer.isConsumerConnected()
    };
  }
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const requiredEnvVars = ['KAFKA_BROKERS', 'KAFKA_CLIENT_ID', 'KAFKA_GROUP_ID'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    logger.error(`Faltan variables de entorno requeridas: ${missingEnvVars.join(', ')}`);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);
  
  logger.log(`Aplicación escuchando en http://${host}:${port}`);
  logger.log(`Endpoint de eventos SSE: http://${host}:${port}/orders/events`);
  logger.log(`Health check: http://${host}:${port}/health`);

  const shutdown = async (signal: string) => {
    logger.log(`Recibida señal ${signal}, iniciando cierre graceful...`);
    await app.close();
    logger.log('Aplicación cerrada correctamente');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('uncaughtException', (error) => {
    logger.error(`Excepción no capturada: ${error.message}`, error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Rechazo no manejado en: ${promise}, razón: ${reason}`);
  });
}

bootstrap();

// === ARCHIVO: api/src/app.module.ts ===
import { Module, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { OrderEventController } from './infrastructure/controllers/order-event.controller';
import { OrderEventService } from './application/services/order-event.service';
import { KafkaConsumerService } from './infrastructure/messaging/kafka-consumer.service';
import { KafkaConfigService } from './infrastructure/config/kafka.config';
import { GlobalExceptionFilter } from './infrastructure/filters/global-exception.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { MetricsInterceptor } from './infrastructure/interceptors/metrics.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
  controllers: [OrderEventController],
  providers: [
    KafkaConfigService,
    KafkaConsumerService,
    OrderEventService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [OrderEventService, KafkaConsumerService, KafkaConfigService],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AppModule.name);
  private isShuttingDown = false;

  async onModuleInit() {
    this.logger.log('Inicializando módulo de aplicación');
    this.logger.debug('Configuración de Kafka cargada');
    this.logger.debug('Consumidor de Kafka registrado');
    this.logger.debug('Controlador de eventos de órdenes registrado');
  }

  async onModuleDestroy() {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;
    this.logger.log('Cerrando conexiones y limpiando recursos...');

    try {
      const kafkaConsumer = await import('./infrastructure/messaging/kafka-consumer.service');
      this.logger.log('Conexión con Kafka cerrada');
    } catch (error) {
      this.logger.error('Error al cerrar conexión con Kafka', error);
    }

    this.logger.log('Módulo de aplicación cerrado correctamente');
  }
}

// === ARCHIVO: api/test/order-event.service.spec.ts ===
import { Test, TestingModule } from '@nestjs/testing';
import { OrderEventService } from '../src/application/services/order-event.service';
import { OrderEventPort } from '../src/domain/ports/order-event.port';
import { OrderStatus, OrderEvent } from '../src/domain/models/order-event.model';
import { Observable, Subject } from 'rxjs';

describe('OrderEventService', () => {
  let service: OrderEventService;
  let mockPort: jest.Mocked<OrderEventPort>;
  let eventSubject: Subject<OrderEvent>;

  const mockOrderEvent: OrderEvent = {
    orderId: 'order-123',
    status: OrderStatus.PROCESSING,
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    metadata: '{"customerId": "cust-456"}',
  };

  beforeEach(async () => {
    eventSubject = new Subject<OrderEvent>();

    mockPort = {
      streamOrderEvents: jest.fn().mockReturnValue(eventSubject.asObservable()),
      closeConnection: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderEventService,
        {
          provide: 'OrderEventPort',
          useValue: mockPort,
        },
      ],
    }).compile();

    service = module.get<OrderEventService>(OrderEventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('debería iniciar el consumo de eventos al inicializar el módulo', async () => {
      const startConsumptionSpy = jest.spyOn(service as any, 'startEventConsumption');

      await service.onModuleInit();

      expect(startConsumptionSpy).toHaveBeenCalled();
    });

    it('debería registrar la conexión del consumidor', async () => {
      await service.onModuleInit();

      const status = service.getServiceStatus();
      expect(status.isInitialized).toBe(true);
    });
  });

  describe('onModuleDestroy', () => {
    it('debería cerrar la conexión al destruir el módulo', async () => {
      await service.onModuleInit();
      await service.onModuleDestroy();

      expect(mockPort.closeConnection).toHaveBeenCalled();
    });

    it('debería detener el consumo de eventos', async () => {
      const stopConsumptionSpy = jest.spyOn(service as any, 'stopEventConsumption');

      await service.onModuleDestroy();

      expect(stopConsumptionSpy).toHaveBeenCalled();
    });
  });

  describe('getEventStream', () => {
    it('debería retornar un observable de eventos de órdenes', () => {
      const stream = service.getEventStream();

      expect(stream).toBeInstanceOf(Observable);
    });

    it('debería emitir eventos cuando el puerto los publique', (done) => {
      const stream = service.getEventStream();

      stream.subscribe((event) => {
        expect(event.orderId).toBe(mockOrderEvent.orderId);
        done();
      });

      eventSubject.next(mockOrderEvent);
    });
  });

  describe('getEventsByStatus', () => {
    it('debería filtrar eventos por estado', (done) => {
      const stream = service.getEventsByStatus(OrderStatus.PROCESSING);

      stream.subscribe((event) => {
        expect(event.status).toBe(OrderStatus.PROCESSING);
        done();
      });

      eventSubject.next(mockOrderEvent);
    });

    it('no debería emitir eventos con estado diferente', () => {
      const emittedEvents: OrderEvent[] = [];
      const stream = service.getEventsByStatus(OrderStatus.DELIVERED);

      stream.subscribe((event) => {
        emittedEvents.push(event);
      });

      eventSubject.next(mockOrderEvent);

      expect(emittedEvents.length).toBe(0);
    });
  });

  describe('getEventByOrderId', () => {
    it('debería retornar el evento cuando existe', async () => {
      eventSubject.next(mockOrderEvent);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await service.getEventByOrderId('order-123');

      expect(result).not.toBeNull();
      expect(result?.orderId).toBe('order-123');
    });

    it('debería retornar null cuando el evento no existe', async () => {
      const result = await service.getEventByOrderId('non-existent-order');

      expect(result).toBeNull();
    });
  });

  describe('registerClient', () => {
    it('debería registrar un cliente conectado', () => {
      const clientId = 'client-1';

      service.registerClient(clientId);

      const status = service.getServiceStatus();
      expect(status.connectedClients).toContain(clientId);
    });

    it('debería permitir múltiples clientes', () => {
      service.registerClient('client-1');
      service.registerClient('client-2');
      service.registerClient('client-3');

      const status = service.getServiceStatus();
      expect(status.connectedClients.length).toBe(3);
    });
  });

  describe('removeClient', () => {
    it('debería eliminar un cliente registrado', () => {
      const clientId = 'client-1';
      service.registerClient(clientId);

      service.removeClient(clientId);

      const status = service.getServiceStatus();
      expect(status.connectedClients).not.toContain(clientId);
    });
  });

  describe('handleStreamError', () => {
    it('debería manejar errores del stream y planificar reconexión', async () => {
      const error = new Error('Connection failed');
      const attemptReconnectionSpy = jest.spyOn(service as any, 'attemptReconnection');

      await (service as any).handleStreamError(error);

      expect(attemptReconnectionSpy).toHaveBeenCalled();
    });

    it('debería registrar el error en el logger', async () => {
      const error = new Error('Test error');
      const loggerSpy = jest.spyOn((service as any).logger, 'error');

      await (service as any).handleStreamError(error);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error en el stream de eventos'),
        expect.any(String)
      );
    });
  });

  describe('attemptReconnection', () => {
    it('debería incrementar los intentos de reconexión', async () => {
      const initialAttempts = (service as any).reconnectAttempts;

      await (service as any).attemptReconnection();

      expect((service as any).reconnectAttempts).toBe(initialAttempts + 1);
    });

    it('debería alcanzar el límite máximo de intentos', async () => {
      const maxAttempts = (service as any).MAX_RECONNECT_ATTEMPTS;

      for (let i = 0; i < maxAttempts; i++) {
        await (service as any).attemptReconnection();
      }

      expect((service as any).reconnectAttempts).toBe(maxAttempts);
    });
  });

  describe('processEventData', () => {
    it('debería procesar y enriquecer los datos del evento', () => {
      const processedEvent = (service as any).processEventData(mockOrderEvent);

      expect(processedEvent).toBeDefined();
      expect(processedEvent.orderId).toBe(mockOrderEvent.orderId);
    });

    it('debería enriquecer con metadatos cuando no existen', () => {
      const eventWithoutMetadata = {
        orderId: 'order-456',
        status: OrderStatus.CREATED,
        updatedAt: new Date(),
      };

      const processedEvent = (service as any).processEventData(eventWithoutMetadata);

      expect(processedEvent.metadata).toBeDefined();
    });
  });

  describe('isValidStatus', () => {
    it('debería retornar true para estados válidos', () => {
      const isValid = (service as any).isValidStatus(OrderStatus.PROCESSING);

      expect(isValid).toBe(true);
    });

    it('debería retornar false para estados inválidos', () => {
      const isValid = (service as any).isValidStatus('INVALID_STATUS' as OrderStatus);

      expect(isValid).toBe(false);
    });
  });

  describe('getServiceStatus', () => {
    it('debería retornar el estado actual del servicio', () => {
      const status = service.getServiceStatus();

      expect(status).toHaveProperty('isInitialized');
      expect(status).toHaveProperty('isProcessing');
      expect(status).toHaveProperty('connectedClients');
      expect(status).toHaveProperty('reconnectAttempts');
    });

    it('debería reflejar el estado de procesamiento', () => {
      const status = service.getServiceStatus();

      expect(typeof status.isProcessing).toBe('boolean');
    });
  });

  describe('stopEventConsumption', () => {
    it('debería detener el consumo de eventos', async () => {
      await service.onModuleInit();
      await service.stopEventConsumption();

      const status = service.getServiceStatus();
      expect(status.isProcessing).toBe(false);
    });

    it('debería limpiar la suscripción', async () => {
      await service.onModuleInit();
      await service.stopEventConsumption();

      expect((service as any).eventSubscription).toBeNull();
    });
  });
});

// === ARCHIVO: api/test/jest-e2e.json ===
{
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}


// === ARCHIVO: api/src/infrastructure/filters/global-exception.filter.ts ===
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  details?: Record<string, unknown>;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let errorDetails: Record<string, unknown> | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || exception.message;
        if (typeof responseObj === 'object' && responseObj !== null) {
          errorDetails = responseObj;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Excepción no manejada: ${exception.message}`, exception.stack);
    }

    const errorResponse: ErrorResponseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    if (errorDetails !== null && typeof errorDetails === 'object') {
      errorResponse.details = errorDetails;
    }

    this.logger.error(
      `${request.method} ${request.url} - Estado: ${status} - Mensaje: ${message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(status).json(errorResponse);
  }
}

// === ARCHIVO: api/src/infrastructure/interceptors/logging.interceptor.ts ===
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url, body, headers } = request;
    const startTime = Date.now();

    this.logger.log(`→ ${method} ${url}`);

    if (Object.keys(body).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `← ${method} ${url} - Estado: ${response.statusCode} - Duración: ${duration}ms`
        );
      }),
      tap((data) => {
        if (data) {
          this.logger.debug(`Response Data: ${JSON.stringify(data)}`);
        }
      })
    );
  }
}

// === ARCHIVO: api/src/infrastructure/interceptors/metrics.interceptor.ts ===
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

interface RequestMetrics {
  method: string;
  path: string;
  statusCode: number;
  duration: number;
  timestamp: string;
}

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);
  private readonly metrics: RequestMetrics[] = [];
  private readonly MAX_METRICS_STORED = 1000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const metric: RequestMetrics = {
          method: request.method,
          path: request.url,
          statusCode: response.statusCode,
          duration,
          timestamp: new Date().toISOString(),
        };

        this.recordMetric(metric);

        if (duration > 1000) {
          this.logger.warn(
            `Solicitud lenta detectada: ${request.method} ${request.url} - ${duration}ms`
          );
        }
      }),
      tap(undefined, (error) => {
        this.logger.error(
          `Error en solicitud: ${request.method} ${request.url} - ${error.message}`
        );
      })
    );
  }

  private recordMetric(metric: RequestMetrics): void {
    this.metrics.push(metric);

    if (this.metrics.length > this.MAX_METRICS_STORED) {
      this.metrics.shift();
    }
  }

  getMetrics(): RequestMetrics[] {
    return [...this.metrics];
  }

  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / this.metrics.length;
  }

  getRequestCountByStatus(): Record<number, number> {
    return this.metrics.reduce((acc, metric) => {
      acc[metric.statusCode] = (acc[metric.statusCode] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }

  getRequestCountByMethod(): Record<string, number> {
    return this.metrics.reduce((acc, metric) => {
      acc[metric.method] = (acc[metric.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  clearMetrics(): void {
    this.metrics.length = 0;
  }
}

// === ARCHIVO: client/package.json ===
{
  "name": "order-tracking-client",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --port 3000",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "20.2.0",
    "@angular/common": "20.2.0",
    "@angular/compiler": "20.2.0",
    "@angular/core": "20.2.0",
    "@angular/forms": "20.2.0",
    "@angular/material": "20.2.0",
    "@angular/platform-browser": "20.2.0",
    "@angular/platform-browser-dynamic": "20.2.0",
    "@angular/router": "20.2.0",
    "rxjs": "~7.8.1",
    "tslib": "^2.6.2",
    "zone.js": "~0.15.1"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "20.2.0",
    "@angular/cli": "20.2.0",
    "@angular/compiler-cli": "20.2.0",
    "@types/jasmine": "~5.1.0",
    "jasmine-core": "~5.1.2",
    "karma": "~6.4.3",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.1",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.8.0"
  },
  "browserslist": {
    "production": [
      "last 2 Chrome versions",
      "last 2 Firefox versions",
      "last 2 Safari versions",
      "last 2 Edge versions"
    ],
    "development": [
      "last 1 Chrome version",
      "last 1 Firefox version",
      "last 1 Safari version",
      "last 1 Edge version"
    ]
  }
}

// === ARCHIVO: client/angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "order-tracking-client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "standalone": true,
          "style": "scss"
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/order-tracking-client",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "node_modules/@angular/material/prebuilt-themes/indigo-pink.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "order-tracking-client:build:production"
            },
            "development": {
              "browserTarget": "order-tracking-client:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "order-tracking-client:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "src/test.ts",
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [],
            "scripts": []
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": [
              "tsconfig.app.json",
              "tsconfig.spec.json"
            ],
            "exclude": [
              "**/node_modules/**"
            ]
          }
        }
      }
    }
  },
  "cli": {
    "analytics": false,
    "schematicCollections": [
      "@schematics/angular"
    ]
  },
  "schematics": {
    "@schematics/angular:component": {
      "standalone": true,
      "style": "scss"
    }
  }
}

// === ARCHIVO: client/tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom",
      "dom.iterable"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}

// === ARCHIVO: client/src/app/core/models/order-event.model.ts ===
import { InjectionToken } from '@angular/core';

/**
 * Modelo que representa un evento de orden.
 * Contiene la información clave sobre el estado actual de una orden.
 */
export interface OrderEvent {
  /**
   * Identificador único de la orden.
   */
  orderId: string;

  /**
   * Estado actual de la orden.
   * Ejemplos: 'CREATED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
   */
  status: string;

  /**
   * Fecha y hora en que se generó el evento (ISO 8601).
   */
  timestamp: string;

  /**
   * Detalles adicionales sobre el evento.
   * Puede incluir información como ubicación, método de pago, etc.
   */
  details?: {
    [key: string]: unknown;
  };
}

/**
 * Token de inyección para la URL base de la API de órdenes.
 * Permite configurar dinámicamente la URL del endpoint SSE.
 */
export const ORDER_EVENT_API_URL = new InjectionToken<string>('ORDER_EVENT_API_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000/orders/events'
});

// === ARCHIVO: client/src/app/core/services/order-event.service.ts ===
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ORDER_EVENT_API_URL } from '../models/order-event.model';
import { OrderEvent } from '../models/order-event.model';
import { Observable, Subscription, catchError, EMPTY, finalize, share } from 'rxjs';

/**
 * Servicio encargado de consumir eventos de órdenes en tiempo real mediante SSE.
 * Proporciona una señal reactiva para que los componentes puedan reaccionar
 * a los cambios en el estado de las órdenes.
 */
@Injectable({
  providedIn: 'root'
})
export class OrderEventService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ORDER_EVENT_API_URL);

  /**
   * Señal reactiva que contiene el último evento de orden recibido.
   * Los componentes pueden suscribirse a esta señal para actualizar la UI.
   */
  readonly lastOrderEvent = signal<OrderEvent | null>(null);

  /**
   * Señal reactiva que indica si el servicio está actualmente conectado
   * al stream de eventos.
   */
  readonly isConnected = signal<boolean>(false);

  /**
   * Señal reactiva que indica si hubo un error al conectarse al stream.
   */
  readonly connectionError = signal<boolean>(false);

  /**
   * Señal reactiva que contiene el mensaje de error más reciente.
   */
  readonly errorMessage = signal<string>('');

  private eventSource!: EventSource;
  private eventSubscription!: Subscription;

  /**
   * Inicia la conexión con el stream de eventos SSE.
   * @returns Observable que emite cada evento de orden recibido.
   */
  connect(): Observable<OrderEvent> {
    if (this.isConnected()) {
      console.warn('OrderEventService: Ya hay una conexión activa.');
      return EMPTY;
    }

    this.isConnected.set(true);
    this.connectionError.set(false);
    this.errorMessage.set('');

    return new Observable<OrderEvent>((subscriber) => {
      try {
        // Configuración del EventSource con opciones para manejar CORS y reconexión
        this.eventSource = new EventSource(this.apiUrl, {
          withCredentials: false
        });

        // Manejo de errores en la conexión SSE
        this.eventSource.onerror = (error) => {
          this.handleConnectionError(error);
          subscriber.error(error);
        };

        // Procesamiento de mensajes recibidos
        this.eventSource.onmessage = (event) => {
          try {
            const orderEvent: OrderEvent = JSON.parse(event.data);
            this.lastOrderEvent.set(orderEvent);
            subscriber.next(orderEvent);
          } catch (parseError) {
            console.error('OrderEventService: Error al parsear evento:', parseError);
            this.errorMessage.set('Error al procesar el evento recibido');
            subscriber.error(parseError);
          }
        };

        // Manejo de eventos con tipo específico
        this.eventSource.addEventListener('order-event', (event) => {
          try {
            const orderEvent: OrderEvent = JSON.parse(event.data);
            this.lastOrderEvent.set(orderEvent);
            subscriber.next(orderEvent);
          } catch (parseError) {
            console.error('OrderEventService: Error al parsear evento con tipo:', parseError);
            this.errorMessage.set('Error al procesar el evento con tipo');
            subscriber.error(parseError);
          }
        });

      } catch (error) {
        this.handleConnectionError(error);
        subscriber.error(error);
      }

      // Retorno de la función de limpieza
      return () => {
        this.disconnect();
      };
    }).pipe(
      // Compartir la suscripción para evitar múltiples conexiones
      share(),
      // Manejo de errores global
      catchError((error) => {
        this.handleConnectionError(error);
        return EMPTY;
      }),
      // Finalizar la conexión cuando se complete el observable
      finalize(() => {
        this.isConnected.set(false);
      })
    );
  }

  /**
   * Cierra la conexión con el stream de eventos SSE.
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
    this.isConnected.set(false);
  }

  /**
   * Maneja errores en la conexión con el stream de eventos.
   * @param error Error recibido
   */
  private handleConnectionError(error: unknown): void {
    this.disconnect();
    this.connectionError.set(true);
    this.isConnected.set(false);

    if (error instanceof Error) {
      this.errorMessage.set(error.message);
      console.error('OrderEventService: Error de conexión:', error.message);
    } else {
      this.errorMessage.set('Error desconocido en la conexión');
      console.error('OrderEventService: Error desconocido:', error);
    }
  }

  /**
   * Observa los eventos de órdenes y actualiza la señal reactiva.
   * Útil para componentes que necesitan suscribirse directamente a los eventos.
   */
  observeOrderEvents(): Observable<OrderEvent> {
    return new Observable<OrderEvent>(subscriber => {
      const subscription = this.connect().subscribe({
        next: (event) => subscriber.next(event),
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });

      return () => {
        subscription.unsubscribe();
        this.disconnect();
      };
    });
  }
}

// === ARCHIVO: client/src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Order Tracking - Seguimiento de Órdenes en Tiempo Real</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Sistema de seguimiento de órdenes en tiempo real con actualizaciones en vivo">
  <meta name="theme-color" content="#1976d2">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body class="mat-typography">
  <app-root></app-root>
  <noscript>
    <div style="padding: 40px; text-align: center; font-family: sans-serif;">
      <h1>JavaScript Requerido</h1>
      <p>Esta aplicación requiere JavaScript para funcionar. Por favor, habilite JavaScript en su navegador.</p>
    </div>
  </noscript>
</body>
</html>

// === ARCHIVO: client/src/app/features/orders/order-tracking.component.ts ===
import { Component, OnInit, OnDestroy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { OrderEventService } from '../../core/services/order-event.service';
import { OrderEvent } from '../../core/models/order-event.model';

interface OrderState {
  orderId: string;
  status: string;
  timestamp: string;
  details?: Record<string, unknown>;
  lastUpdate: Date;
}

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private readonly orderEventService = inject(OrderEventService);
  private eventSubscription: Subscription | null = null;

  readonly isConnected = this.orderEventService.isConnected;
  readonly connectionError = this.orderEventService.connectionError;
  readonly errorMessage = this.orderEventService.errorMessage;

  readonly orders = signal<Map<string, OrderState>>(new Map());
  readonly orderList = computed(() => {
    const orderMap = this.orders();
    return Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });

  readonly pendingCount = computed(() => 
    Array.from(this.orders().values()).filter(o => o.status === 'PENDING').length
  );

  readonly processingCount = computed(() => 
    Array.from(this.orders().values()).filter(o => o.status === 'PROCESSING').length
  );

  readonly completedCount = computed(() => 
    Array.from(this.orders().values()).filter(o => o.status === 'COMPLETED').length
  );

  readonly isLoading = signal<boolean>(false);

  constructor() {
    effect(() => {
      const connected = this.isConnected();
      if (connected) {
        console.log('[OrderTracking] Conexión con servidor de eventos establecida');
      }
    });
  }

  ngOnInit(): void {
    this.connectToEventStream();
  }

  ngOnDestroy(): void {
    this.disconnectFromEventStream();
  }

  connectToEventStream(): void {
    this.isLoading.set(true);
    this.orderEventService.connect();
    
    this.eventSubscription = this.orderEventService.observeOrderEvents().subscribe({
      next: (event: OrderEvent) => {
        this.handleOrderEvent(event);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        console.error('[OrderTracking] Error al recibir eventos:', err.message);
        this.isLoading.set(false);
      }
    });
  }

  disconnectFromEventStream(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
      this.eventSubscription = null;
    }
    this.orderEventService.disconnect();
  }

  reconnect(): void {
    this.disconnectFromEventStream();
    this.orders.set(new Map());
    setTimeout(() => this.connectToEventStream(), 500);
  }

  private handleOrderEvent(event: OrderEvent): void {
    const currentOrders = new Map(this.orders());
    const existingOrder = currentOrders.get(event.orderId);
    
    const newOrderState: OrderState = {
      orderId: event.orderId,
      status: event.status,
      timestamp: event.timestamp,
      details: event.details,
      lastUpdate: new Date()
    };
    
    currentOrders.set(event.orderId, newOrderState);
    this.orders.set(currentOrders);
    
    if (existingOrder && existingOrder.status !== event.status) {
      console.log(`[OrderTracking] Orden ${event.orderId} actualizada: ${existingOrder.status} -> ${event.status}`);
    } else if (!existingOrder) {
      console.log(`[OrderTracking] Nueva orden recibida: ${event.orderId}`);
    }
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'status--pending',
      'PROCESSING': 'status--processing',
      'COMPLETED': 'status--completed',
      'CANCELLED': 'status--cancelled',
      'FAILED': 'status--failed'
    };
    return statusMap[status] || 'status--unknown';
  }

  getStatusIcon(status: string): string {
    const iconMap: Record<string, string> = {
      'PENDING': 'schedule',
      'PROCESSING': 'autorenew',
      'COMPLETED': 'check_circle',
      'CANCELLED': 'cancel',
      'FAILED': 'error'
    };
    return iconMap[status] || 'help_outline';
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getOrderDetails(order: OrderState): string[] {
    if (!order.details) return [];
    return Object.entries(order.details).map(([key, value]) => `${key}: ${value}`);
  }
}

// === ARCHIVO: client/src/app/features/orders/order-tracking.component.html ===
<div class="order-tracking">
  <header class="order-tracking__header">
    <h1 class="order-tracking__title">Seguimiento de Órdenes</h1>
    <div class="order-tracking__actions">
      <button 
        mat-raised-button 
        color="primary"
        (click)="reconnect()"
        [disabled]="isLoading()"
        class="order-tracking__action-btn">
        <mat-icon>refresh</mat-icon>
        Reconectar
      </button>
    </div>
  </header>

  <div class="order-tracking__status-bar">
    <mat-card class="status-card status-card--pending">
      <mat-card-content>
        <mat-icon class="status-card__icon">schedule</mat-icon>
        <span class="status-card__count">{{ pendingCount() }}</span>
        <span class="status-card__label">Pendientes</span>
      </mat-card-content>
    </mat-card>

    <mat-card class="status-card status-card--processing">
      <mat-card-content>
        <mat-icon class="status-card__icon">autorenew</mat-icon>
        <span class="status-card__count">{{ processingCount() }}</span>
        <span class="status-card__label">Procesando</span>
      </mat-card-content>
    </mat-card>

    <mat-card class="status-card status-card--completed">
      <mat-card-content>
        <mat-icon class="status-card__icon">check_circle</mat-icon>
        <span class="status-card__count">{{ completedCount() }}</span>
        <span class="status-card__label">Completadas</span>
      </mat-card-content>
    </mat-card>
  </div>

  <section class="order-tracking__connection-status">
    <div *ngIf="isLoading()" class="connection-status connection-status--loading">
      <mat-spinner diameter="24"></mat-spinner>
      <span>Conectando al servidor de eventos...</span>
    </div>

    <div *ngIf="connectionError()" class="connection-status connection-status--error">
      <mat-icon>error_outline</mat-icon>
      <span>{{ errorMessage() }}</span>
    </div>

    <div *ngIf="isConnected() && !isLoading()" class="connection-status connection-status--connected">
      <mat-icon>wifi</mat-icon>
      <span>Conectado - Recepciones en tiempo real activas</span>
    </div>
  </section>

  <mat-divider></mat-divider>

  <main class="order-tracking__content">
    <div *ngIf="orderList().length === 0 && !isLoading()" class="order-tracking__empty">
      <mat-icon class="order-tracking__empty-icon">inbox</mat-icon>
      <p>No hay órdenes disponibles</p>
      <p class="order-tracking__empty-hint">Los eventos de órdenes aparecerán aquí en tiempo real</p>
    </div>

    <mat-list *ngIf="orderList().length > 0" class="order-list">
      <mat-list-item 
        *ngFor="let order of orderList()" 
        class="order-item"
        [ngClass]="getStatusClass(order.status)">
        <mat-icon matListItemIcon class="order-item__icon">
          {{ getStatusIcon(order.status) }}
        </mat-icon>
        <div matListItemTitle class="order-item__title">
          <span class="order-item__id">Orden #{{ order.orderId }}</span>
          <mat-chip class="order-item__status-chip" [ngClass]="getStatusClass(order.status)">
            {{ order.status }}
          </mat-chip>
        </div>
        <div matListItemLine class="order-item__meta">
          <span class="order-item__timestamp">
            <mat-icon class="order-item__meta-icon">schedule</mat-icon>
            {{ formatTimestamp(order.timestamp) }}
          </span>
        </div>
        <div *ngIf="order.details" matListItemLine class="order-item__details">
          <span *ngFor="let detail of getOrderDetails(order)" class="order-item__detail-tag">
            {{ detail }}
          </span>
        </div>
      </mat-list-item>
    </mat-list>
  </main>

  <footer class="order-tracking__footer">
    <span class="order-tracking__footer-text">
      Total de órdenes: {{ orderList().length }}
    </span>
  </footer>
</div>

// === ARCHIVO: client/src/app/features/orders/order-tracking.component.scss ===
.order-tracking {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  background-color: #f5f5f5;
  box-sizing: border-box;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  &__title {
    margin: 0;
    font-size: 28px;
    font-weight: 500;
    color: #333;
  }

  &__actions {
    display: flex;
    gap: 12px;
  }

  &__action-btn {
    mat-icon {
      margin-right: 8px;
    }
  }

  &__status-bar {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  &__connection-status {
    margin-bottom: 16px;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    background: white;
    border-radius: 8px;
    padding: 16px;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    color: #757575;
  }

  &__empty-icon {
    font-size: 64px;
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    color: #bdbdbd;
  }

  &__empty-hint {
    font-size: 14px;
    color: #9e9e9e;
    margin-top: 8px;
  }

  &__footer {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;
  }

  &__footer-text {
    font-size: 14px;
    color: #757575;
  }
}

.status-card {
  flex: 1;
  min-width: 120px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  mat-card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
  }

  &__icon {
    font-size: 32px;
    width: 32px;
    height: 32px;
    margin-bottom: 8px;
  }

  &__count {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__label {
    font-size: 14px;
    color: #757575;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &--pending {
    .status-card__icon,
    .status-card__count {
      color: #ff9800;
    }
  }

  &--processing {
    .status-card__icon,
    .status-card__count {
      color: #2196f3;
    }
  }

  &--completed {
    .status-card__icon,
    .status-card__count {
      color: #4caf50;
    }
  }
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 16px;

  &--loading {
    background-color: #e3f2fd;
    color: #1976d2;
  }

  &--error {
    background-color: #ffebee;
    color: #c62828;

    mat-icon {
      color: #c62828;
    }
  }

  &--connected {
    background-color: #e8f5e9;
    color: #2e7d32;

    mat-icon {
      color: #2e7d32;
    }
  }
}

.order-list {
  padding: 0;
}

.order-item {
  border-left: 4px solid transparent;
  margin-bottom: 8px;
  border-radius: 4px;
  background-color: #fafafa;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &__icon {
    font-size: 24px;
    width: 24px;
    height: 24px;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  &__id {
    font-weight: 500;
    color: #333;
  }

  &__status-chip {
    font-size: 12px;
    min-height: 24px;
    padding: 0 8px;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #757575;
    font-size: 13px;
  }

  &__timestamp {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__meta-icon {
    font-size: 16px;
    width: 16px;
    height: 16px;
    color: #9e9e9e;
  }

  &__details {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  &__detail-tag {
    font-size: 12px;
    color: #616161;
    background-color: #eeeeee;
    padding: 2px 8px;
    border-radius: 12px;
  }

  &--pending {
    border-left-color: #ff9800;
    .order-item__icon {
      color: #ff9800;
    }
  }

  &--processing {
    border-left-color: #2196f3;
    .order-item__icon {
      color: #2196f3;
    }
  }

  &--completed {
    border-left-color: #4caf50;
    .order-item__icon {
      color: #4caf50;
    }
  }

  &--cancelled {
    border-left-color: #9e9e9e;
    .order-item__icon {
      color: #9e9e9e;
    }
  }

  &--failed {
    border-left-color: #f44336;
    .order-item__icon {
      color: #f44336;
    }
  }
}

.status {
  &--pending {
    background-color: #fff3e0;
  }

  &--processing {
    background-color: #e3f2fd;
  }

  &--completed {
    background-color: #e8f5e9;
  }

  &--cancelled {
    background-color: #fafafa;
  }

  &--failed {
    background-color: #ffebee;
  }

  &--unknown {
    background-color: #f5f5f5;
  }
}

@media (max-width: 600px) {
  .order-tracking {
    padding: 16px;

    &__header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    &__title {
      font-size: 22px;
    }

    &__status-bar {
      flex-direction: column;
    }
  }

  .status-card {
    min-width: 100%;
  }
}

// === ARCHIVO: client/src/app/shared/components/order-status.component.ts ===
import { Component, Input, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderEvent } from '../../core/models/order-event.model';

type OrderStatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'unknown';

interface StatusConfig {
  label: string;
  icon: string;
  colorClass: string;
  bgClass: string;
}

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent {
  @Input({ required: true }) set orderEvent(value: OrderEvent) {
    this._orderEvent.set(value);
  }

  readonly _orderEvent = signal<OrderEvent | null>(null);

  readonly statusConfig = computed<StatusConfig>(() => {
    const event = this._orderEvent();
    if (!event) return this.getDefaultConfig();
    return this.getConfigForStatus(event.status);
  });

  readonly formattedTimestamp = computed(() => {
    const event = this._orderEvent();
    if (!event?.timestamp) return '';
    try {
      const date = new Date(event.timestamp);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return event.timestamp;
    }
  });

  readonly isRecent = computed(() => {
    const event = this._orderEvent();
    if (!event?.timestamp) return false;
    const eventTime = new Date(event.timestamp).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return (now - eventTime) < fiveMinutes;
  });

  private getConfigForStatus(status: string): StatusConfig {
    const normalizedStatus = this.normalizeStatus(status);
    const configs: Record<OrderStatusType, StatusConfig> = {
      pending: {
        label: 'Pendiente',
        icon: '⏳',
        colorClass: 'status--pending',
        bgClass: 'status-bg--pending'
      },
      processing: {
        label: 'Procesando',
        icon: '⚙️',
        colorClass: 'status--processing',
        bgClass: 'status-bg--processing'
      },
      shipped: {
        label: 'Enviado',
        icon: '📦',
        colorClass: 'status--shipped',
        bgClass: 'status-bg--shipped'
      },
      delivered: {
        label: 'Entregado',
        icon: '✅',
        colorClass: 'status--delivered',
        bgClass: 'status-bg--delivered'
      },
      cancelled: {
        label: 'Cancelado',
        icon: '❌',
        colorClass: 'status--cancelled',
        bgClass: 'status-bg--cancelled'
      },
      unknown: {
        label: 'Desconocido',
        icon: '❓',
        colorClass: 'status--unknown',
        bgClass: 'status-bg--unknown'
      }
    };
    return configs[normalizedStatus] || configs.unknown;
  }

  private normalizeStatus(status: string): OrderStatusType {
    if (!status) return 'unknown';
    const lower = status.toLowerCase().trim();
    if (lower.includes('pending') || lower.includes('pendiente')) return 'pending';
    if (lower.includes('processing') || lower.includes('procesando')) return 'processing';
    if (lower.includes('shipped') || lower.includes('enviado')) return 'shipped';
    if (lower.includes('delivered') || lower.includes('entregado')) return 'delivered';
    if (lower.includes('cancelled') || lower.includes('cancelado')) return 'cancelled';
    return 'unknown';
  }

  private getDefaultConfig(): StatusConfig {
    return {
      label: 'Sin estado',
      icon: '❓',
      colorClass: 'status--unknown',
      bgClass: 'status-bg--unknown'
    };
  }

  get orderId(): string {
    return this._orderEvent()?.orderId || '';
  }

  get hasDetails(): boolean {
    const event = this._orderEvent();
    return !!(event?.details && Object.keys(event.details).length > 0);
  }

  getStatusDetails(): Record<string, unknown> | undefined {
    return this._orderEvent()?.details;
  }
}

// === ARCHIVO: client/src/app/shared/components/order-status.component.html ===
<div *ngIf="_orderEvent() as event" 
     class="order-status"
     [class.order-status--recent]="isRecent()"
     [attr.aria-label]="'Estado de orden ' + event.orderId"
     role="status"
     aria-live="polite">
  
  <div class="order-status__header">
    <span class="order-status__icon" aria-hidden="true">
      {{ statusConfig().icon }}
    </span>
    <div class="order-status__info">
      <span class="order-status__label">Orden</span>
      <span class="order-status__order-id">{{ event.orderId }}</span>
    </div>
  </div>

  <div class="order-status__body">
    <div class="order-status__badge" 
         [ngClass]="[statusConfig().colorClass, statusConfig().bgClass]">
      <span class="order-status__badge-icon" aria-hidden="true">
        {{ statusConfig().icon }}
      </span>
      <span class="order-status__badge-label">
        {{ statusConfig().label }}
      </span>
    </div>

    <div class="order-status__timestamp" aria-label="Fecha y hora">
      <svg class="order-status__timestamp-icon" 
           viewBox="0 0 24 24" 
           width="16" 
           height="16"
           aria-hidden="true">
        <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
      </svg>
      <time [attr.datetime]="event.timestamp">{{ formattedTimestamp() }}</time>
    </div>
  </div>

  <div *ngIf="hasDetails" class="order-status__details">
    <details class="order-status__details-panel">
      <summary class="order-status__details-toggle">
        Ver detalles adicionales
        <svg class="order-status__details-chevron" 
             viewBox="0 0 24 24" 
             width="16" 
             height="16"
             aria-hidden="true">
          <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
        </svg>
      </summary>
      <dl class="order-status__details-list">
        <ng-container *ngFor="let item of getStatusDetails() | keyvalue">
          <dt class="order-status__details-key">{{ item.key }}</dt>
          <dd class="order-status__details-value">{{ item.value }}</dd>
        </ng-container>
      </dl>
    </details>
  </div>

</div>

// === ARCHIVO: client/src/app/shared/components/order-status.component.scss ===
$status-pending: #f59e0b;
$status-processing: #3b82f6;
$status-shipped: #8b5cf6;
$status-delivered: #10b981;
$status-cancelled: #ef4444;
$status-unknown: #6b7280;

$bg-pending: rgba(245, 158, 11, 0.1);
$bg-processing: rgba(59, 130, 246, 0.1);
$bg-shipped: rgba(139, 92, 246, 0.1);
$bg-delivered: rgba(16, 185, 129, 0.1);
$bg-cancelled: rgba(239, 68, 68, 0.1);
$bg-unknown: rgba(107, 114, 128, 0.1);

$border-radius: 8px;
$transition-duration: 200ms;
$font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

.order-status {
  font-family: $font-family;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: $border-radius;
  padding: 16px;
  transition: box-shadow $transition-duration ease, transform $transition-duration ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: $status-unknown;
    transition: background $transition-duration ease;
  }

  &--recent {
    animation: pulse-border 2s ease-in-out infinite;
    
    &::before {
      background: $status-processing;
    }
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__icon {
    font-size: 24px;
    line-height: 1;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border-radius: 50%;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__label {
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
  }

  &__order-id {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    font-family: 'Monaco', 'Menlo', monospace;
  }

  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    transition: all $transition-duration ease;

    &-icon {
      font-size: 14px;
    }

    &-label {
      white-space: nowrap;
    }
  }

  &__timestamp {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6b7280;

    &-icon {
      color: #9ca3af;
    }
  }

  &__details {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;

    &-panel {
      background: #f9fafb;
      border-radius: 6px;
      overflow: hidden;
    }

    &-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: #4b5563;
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
      transition: background $transition-duration ease;

      &:hover {
        background: #f3f4f6;
      }

      &::-webkit-details-marker {
        display: none;
      }
    }

    &-chevron {
      transition: transform $transition-duration ease;
      color: #9ca3af;
    }

    &-panel[open] &-toggle &-chevron {
      transform: rotate(180deg);
    }

    &-list {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px 12px;
      padding: 8px 12px 12px;
      margin: 0;
      font-size: 13px;
    }

    &-key {
      font-weight: 500;
      color: #6b7280;
    }

    &-value {
      color: #111827;
      margin: 0;
      word-break: break-word;
    }
  }
}

.status {
  &--pending {
    color: $status-pending;
  }
  &--processing {
    color: $status-processing;
  }
  &--shipped {
    color: $status-shipped;
  }
  &--delivered {
    color: $status-delivered;
  }
  &--cancelled {
    color: $status-cancelled;
  }
  &--unknown {
    color: $status-unknown;
  }
}

.status-bg {
  &--pending {
    background: $bg-pending;
  }
  &--processing {
    background: $bg-processing;
  }
  &--shipped {
    background: $bg-shipped;
  }
  &--delivered {
    background: $bg-delivered;
  }
  &--cancelled {
    background: $bg-cancelled;
  }
  &--unknown {
    background: $bg-unknown;
  }
}

@keyframes pulse-border {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0);
  }
}

// === ARCHIVO: client/src/main.ts ===
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

// === ARCHIVO: client/src/app/app.config.ts ===
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    )
  ]
};

// === ARCHIVO: client/src/app/app.component.ts ===
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

// === ARCHIVO: client/src/app/app.routes.ts ===
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadComponent: () => 
      import('./features/orders/order-tracking.component').then(
        m => m.OrderTrackingComponent
      ),
    title: 'Seguimiento de Órdenes'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];

// === ARCHIVO: client/tsconfig.app.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts",
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts",
    "src/**/*.test.ts"
  ]
}

// === ARCHIVO: client/src/test.ts ===
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    <T>(id: string): T;
    keys(): string[];
  };
};

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: true }
  }
);

const context = require.context('../src/app', true, /\.spec\.ts$/);
context.keys().forEach((key) => {
  try {
    context(key);
  } catch (error) {
    console.error(`Error loading test file: ${key}`, error);
  }
});

// === ARCHIVO: client/tsconfig.spec.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jasmine",
      "node"
    ],
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowJs": true,
    "baseUrl": "./",
    "paths": {
      "@app/*": ["src/app/*"],
      "@core/*": ["src/app/core/*"],
      "@features/*": ["src/app/features/*"],
      "@shared/*": ["src/app/shared/*"],
      "@env/*": ["src/environments/*"]
    }
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts",
    "src/**/*.test.ts"
  ],
  "exclude": [
    "src/**/*.avoid.spec.ts",
    "src/assets/**/*",
    "src/environments/**/*"
  ]
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  kafka:
    image: "apache/kafka:3.8.0"
    ports:
      - "127.0.0.1:9092:9092"
    environment:
      KAFKA_NODE_ID: "1"
      KAFKA_PROCESS_ROLES: "broker,controller"
      KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092"
      KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0"
    healthcheck:
      test: ["CMD-SHELL","/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| Apache Kafka (KRaft, un nodo) | `apache/kafka:3.8.0` | 9092 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/kafka/create-topics.sh ===
#!/usr/bin/env bash
# Crea los topics en Kafka local (idempotente). Ejecutar con el compose levantado y healthy.
set -euo pipefail

docker compose exec -T kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic app-events --partitions 1 --replication-factor 1

```
