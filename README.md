# 4x1000 Colombia

Interactive GMF calculator for Colombia.

**Entiende cuánto pagas.** Una herramienta clara para calcular el Gravamen a los Movimientos
Financieros (GMF, el "4x1000") de una operación, entender cómo funciona y simular un mes de
movimientos. 100 % estática: sin backend, sin base de datos, sin APIs.

---

## Overview

|                  |                                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| **Qué resuelve** | Cuánto cuesta mover plata, por qué, y cuánto suma en un mes.                                         |
| **Cómo**         | Una calculadora en la primera pantalla, un desglose visual y secciones cortas que explican la norma. |
| **Dónde corre**  | GitHub Pages. Cualquier hosting estático sirve.                                                      |

## Features

- **Calculadora en tiempo real** con formato COP automático, presets, slider logarítmico e input
  sincronizados. El cursor no salta al reagrupar miles, y borrar un separador borra el dígito de al lado.
- **Resultado animado**: interpolación numérica breve (≈220 ms) y una microanimación del número.
- **Desglose visual**: barra proporcional (vertical en móvil) y una cuadrícula de 1.000 celdas con
  4 resaltadas.
- **Ejemplos interactivos** que llevan el monto a la calculadora.
- **Simulador mensual** con varias operaciones y simulación opcional de cuenta exenta.
- **Transparencia**: tasa, moneda, fecha, fuente y versión de reglas, todo leído de la configuración.
- Accesible (WCAG AA): labels reales, foco visible, teclado completo, `prefers-reduced-motion`, skip link.
- SEO: title, description, canonical, Open Graph, Twitter card, JSON-LD, manifest.

## Tech Stack

| Herramienta                                                                              | Por qué                                                     |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| React 19 + TypeScript (strict, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`) | UI y tipos estrictos                                        |
| Vite                                                                                     | Build estático rápido                                       |
| Tailwind CSS v4                                                                          | Tokens del design system en `@theme`                        |
| Motion (`LazyMotion` + `m`)                                                              | Reveal, tooltips. Las features se cargan en un chunk aparte |
| Lucide React                                                                             | Iconos, tree-shaken                                         |
| Geist / Geist Mono (Fontsource)                                                          | Tipografía auto-hospedada, sin peticiones a terceros        |
| Vitest                                                                                   | Tests del dominio y utilidades, sin DOM                     |
| ESLint (typescript-eslint strict type-checked, jsx-a11y, react-hooks) + Prettier         | Calidad                                                     |

No se usan Redux, router ni librería de gráficas: la app es de una página y las dos
visualizaciones se hacen con flexbox y un SVG con `<pattern>`.

## Architecture

```text
src/
├── app/                 Shell: App, providers (motion, calculadora), anclas de sección
├── components/
│   ├── ui/              Design system: Button, Card, Input, CurrencyInput, Slider, Switch,
│   │                    Tooltip, AnimatedNumber, Stat, Badge, Section, Container, Reveal…
│   ├── layout/          Navbar, Footer, Logo, SkipLink
│   ├── calculator/      Piezas presentacionales de la calculadora
│   ├── charts/          DistributionBar, PerMilleGrid
│   └── sections/        Secciones de la página
├── features/gmf/
│   ├── components/      Widgets con estado: GmfCalculator, MonthlySimulator
│   ├── hooks/           useGmfCalculator, useMonthlySimulator, contexto
│   ├── services/        rules.service: único puente config → UI
│   └── utils/           Mensajes, etiquetas derivadas, texto para copiar
├── domain/gmf/          Lógica pura: calculator, rules, types, constants (sin React)
├── config/              gmf.config (reglas), calculator.config, site.config
├── hooks/               Hooks genéricos (tween, scroll, clipboard)
├── lib/                 formatters, amount-input, scale, motion, utils
└── styles/globals.css   Tokens y utilidades
```

Flujo de datos:

```text
config/gmf.config.ts ──resolveGmfRules(fecha)──▶ features/gmf/services ──▶ hooks ──▶ componentes
                                                          │
                                        domain/gmf/calculateGmf (puro, testeado)
```

La UI nunca contiene reglas tributarias: recibe `GmfRules` resueltas y llama a
`calculateGmf({ amount, transactionType, exemptionStatus }, rules)`. Hasta el texto
"4 × cada $1.000" se deriva de la tasa configurada (`features/gmf/utils/labels.ts`).

## Development

Requiere Node 22 (ver `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script            | Qué hace                                   |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo                     |
| `npm run build`   | Typecheck + build de producción en `dist/` |
| `npm run preview` | Sirve `dist/` localmente                   |
| `npm run lint`    | ESLint                                     |
| `npm test`        | Vitest                                     |
| `npm run format`  | Prettier                                   |

## Testing

```bash
npm test
```

El dominio se prueba sin React: montos de referencia ($1.000 → $4, $1.000.000 → $4.000…), cero,
negativos, `NaN`/`Infinity`, límite superior, montos grandes, los tres modos de redondeo (incluido el
ruido de coma flotante: `1000 * 0.004 === 4.000000000000001`), sobrescritura por tipo de operación,
exención parcial y consumo del tope a lo largo del mes, resolución de versiones por fecha, solapes y
fallback cuando todas las versiones expiraron. También se valida que `GMF_CONFIG` no tenga huecos
entre años, y que el slider logarítmico sea estrictamente creciente y reversible en cada paso.

## Build

```bash
npm run build
npm run preview
```

`BASE_PATH` controla la ruta base de Vite (por defecto `/`). En CI se inyecta automáticamente.
Para probar localmente la ruta de GitHub Pages:

```bash
BASE_PATH=/4x1000/ npm run build
```

> En Git Bash (Windows) antepón `MSYS_NO_PATHCONV=1`, o MSYS convierte `/4x1000/` en una ruta
> de Windows.

## Deployment

Dos workflows con responsabilidades separadas:

| Workflow                       | Cuándo                                | Qué hace                                       |
| ------------------------------ | ------------------------------------- | ---------------------------------------------- |
| `.github/workflows/ci.yml`     | Pull requests hacia `main`            | Formato → lint → tests → typecheck + build     |
| `.github/workflows/deploy.yml` | Push a `main` (o manual desde `main`) | Build con la ruta de Pages → deploy de `dist/` |

El deploy no repite las validaciones: lo que llega a `main` ya pasó CI en el PR. Para que eso sea
una garantía, protege la rama: _Settings → Branches → Add rule → `main`_ → **Require status checks
to pass** → marca **Lint, test and build**.

**Setup inicial (una sola vez):** en el repositorio, _Settings → Pages → Build and deployment →
Source_: **GitHub Actions**. Después, cada push a `main` despliega solo.

La ruta base y la URL canónica salen de `actions/configure-pages`, así que un fork o un dominio
propio funcionan sin cambiar código. Para desarrollo local, la URL canónica vive en `.env`
(`VITE_SITE_URL`).

## Configuration

| Archivo                           | Contenido                                                                 |
| --------------------------------- | ------------------------------------------------------------------------- |
| `src/config/gmf.config.ts`        | **Reglas del GMF** (tasa, redondeo, exención, fuentes, fechas)            |
| `src/config/calculator.config.ts` | Monto inicial, presets, ejemplos, rango del slider, límites del simulador |
| `src/config/site.config.ts`       | Nombre, tagline, URL del repositorio, año del copyright                   |
| `.env`                            | `VITE_SITE_URL` para canonical y Open Graph                               |

## Tax rules

Todas las reglas viven en **`src/config/gmf.config.ts`** como versiones con vigencia:

```ts
versions: [
  {
    id: 'gmf-2026',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
    rate: 0.004,
    rounding: 'nearest',
    exemptAccount: { monthlyLimitUvt: 350, uvtValue: 52_374, legalReference: '…' },
    transactionTypes: [{ id: 'general', label: 'Movimiento financiero' }],
  },
]
```

**Para actualizar la legislación o el año:**

1. Agrega una versión nueva; no edites las anteriores. Si dos se solapan, gana la que empezó más tarde.
2. Actualiza `uvtValue` con el valor que fije la DIAN para ese año.
3. Actualiza `lastUpdated` y, si aplica, `sources`.
4. Corre `npm test`: el test de configuración falla si quedan huecos entre versiones.

Si llega una fecha que ninguna versión cubre (por ejemplo, enero sin actualizar la config), la app
usa la última versión y la sección de Transparencia muestra "Reglas por revisar". No se rompe.

La estructura ya admite: cambios de tarifa, tarifas por tipo de operación (`rateOverride`), topes de
exención en UVT, modos de redondeo y fechas de vigencia. Nuevas exenciones o límites mensuales se
agregan en `domain/gmf` (tipos + calculadora + tests) sin tocar componentes.

> ⚠️ Antes de publicar, verifica `uvtValue` de cada año contra la resolución oficial de la DIAN y
> las referencias del Estatuto Tributario (arts. 871 a 881; exención de cuenta marcada: art. 879,
> num. 1).

## Disclaimer

Esta herramienta es informativa y no reemplaza la liquidación oficial realizada por una entidad
financiera ni la interpretación profesional de la normativa vigente. El valor mostrado es el cálculo
matemático de la tasa sobre el monto. La aplicación real del GMF depende de si la operación está
gravada, de las exenciones que apliquen y de cómo liquida cada entidad.

## License

[MIT](LICENSE)
