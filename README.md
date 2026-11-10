# Implementación de una interfaz de seguimiento de órdenes en tiempo real

En el contexto de una plataforma de comercio electrónico, necesitas implementar una funcionalidad que permita a los usuarios ver el estado de sus órdenes en tiempo real. Los eventos relacionados con las órdenes se publican en un topic de Kafka y deben ser consumidos y mostrados en la interfaz de usuario. Los eventos incluyen información como el ID de la orden, el estado actual y la fecha de actualización. El sistema debe manejar correctamente los casos en los que no haya eventos nuevos y debe ser capaz de recuperarse de posibles fallos en la conexión con Kafka.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Consumo de eventos en tiempo real con Kafka |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial del consumidor de Kafka

**Objetivo:** Establecer una conexión con Kafka y configurar un consumidor para leer eventos del topic de órdenes.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configura un consumidor de Kafka que se conecte al topic de órdenes.
- Implementa la lógica para leer y procesar eventos del topic.
- Asegúrate de que el consumidor maneje correctamente los casos de error y reconexión.

**Entregable:** Consumidor de Kafka funcional que lee eventos del topic de órdenes.

<details>
<summary>Pistas de conocimiento</summary>

- Considera cómo manejar la desconexión y reconexión con Kafka.
- Piensa en cómo validar la integridad de los eventos recibidos.

</details>

### Fase 2: Integración del consumidor con la interfaz de usuario

**Objetivo:** Mostrar los eventos recibidos de Kafka en la interfaz de usuario en tiempo real.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Integra el consumidor de Kafka con la interfaz de usuario para mostrar los eventos en tiempo real.
- Implementa la lógica para actualizar la interfaz con los nuevos eventos recibidos.
- Asegúrate de que la interfaz maneje correctamente los casos en los que no haya nuevos eventos.

**Entregable:** Interfaz de usuario que muestra los eventos de órdenes en tiempo real.

<details>
<summary>Pistas de conocimiento</summary>

- Considera cómo optimizar la actualización de la interfaz para minimizar la latencia.
- Piensa en cómo manejar los estados de carga y error en la interfaz.

</details>

### Fase 3: Implementación de la lógica de negocio

**Objetivo:** Implementar la lógica de negocio para manejar los eventos de órdenes y mostrar el estado actual de las órdenes en la interfaz.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Implementa la lógica de negocio para procesar los eventos de órdenes y actualizar el estado de las órdenes en la interfaz.
- Asegúrate de que la interfaz muestre el estado correcto de las órdenes en todo momento.
- Considera cómo manejar los casos en los que los eventos recibidos no sean válidos.

**Entregable:** Lógica de negocio que procesa los eventos de órdenes y actualiza el estado de las órdenes en la interfaz.

<details>
<summary>Pistas de conocimiento</summary>

- Considera cómo validar los eventos recibidos antes de procesarlos.
- Piensa en cómo manejar los casos en los que los eventos recibidos no sean válidos.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es un consumidor de Kafka y cómo se integra con una aplicación Angular?
- **paraQueSirve**: ¿Para qué sirve mostrar los eventos de órdenes en tiempo real en la interfaz de usuario?
- **comoSeUsa**: ¿Cómo se usa la lógica de negocio para procesar los eventos de órdenes y actualizar el estado de las órdenes en la interfaz?
- **erroresComunes**: ¿Cuáles son los errores comunes al consumir eventos de Kafka y cómo se manejan?
- **queDecisionesImplica**: ¿Qué decisiones implica la implementación de la lógica de negocio para procesar los eventos de órdenes?

## Criterios de Evaluacion

- Configuración correcta del consumidor de Kafka.
- Integración exitosa del consumidor con la interfaz de usuario.
- Implementación correcta de la lógica de negocio para procesar los eventos de órdenes.
- Manejo correcto de los errores y casos de no haber nuevos eventos.
- Optimización de la actualización de la interfaz para minimizar la latencia.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

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

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
