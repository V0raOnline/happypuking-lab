<img src="assets/readme-banner.png" alt="LEARN with hAppYpUkIng — ¿Exploramos? Una caja de laboratorio rotulada hAppYpUkIng-lab con Glitch, la mascota, asomando por la tapa." width="760">

### hAppYpUkIng — Lab

> **Ix(A+H) = Expanded heart and brain!**  
> Recursos educativos interactivos, abiertos y gratuitos para mentes que aprenden diferente.

---

## ¿Qué es esto?

hAppYpUkIng nació de una necesidad real: crear materiales que funcionaran de verdad para estudiantes que piensan distinto o simplemente con dificultad para conectar con los formatos convencionales.

Empezó en casa, para mis hijos. Lo que funcionó, lo comparto con todos.

Aquí no hay PDFs estáticos ni libros de texto digitalizados.  
Aquí hay recursos interactivos que el alumno puede explorar a su ritmo, desde distintos puntos de entrada, con retroalimentación visual inmediata.

Todo el contenido está alineado con el currículo oficial de la ESO (España).

---

## 📁 Estructura del repo

Las carpetas usan un prefijo de tres letras por materia, y cada archivo
repite ese prefijo. Así se sabe de dónde viene un fichero solo con verlo.

```
happypuking-lab/
├── index.html                          # Portada — catálogo de todas las herramientas
├── about.html                          # De dónde viene esto y por qué
├── bio/                                # Biología
│   ├── bio-5reinos.html                # Los 5 Reinos — explorador de conexiones
│   ├── bio-invertebrados-mapa.html     # Invertebrados — mapa de los 6 grupos
│   ├── bio-invertebrados-tarjetas.html # Invertebrados — tarjetas
│   └── bio-reino-plantas.html          # Reino de las Plantas — explorador e historia
├── ing/                                # Inglés
│   ├── ing-verbos-irregulares.html     # Familias fonológicas de verbos irregulares
│   ├── ing-verbos-quiz.html            # Quiz de verbos — con banco de frases en YAML
│   ├── ing-grammar-builder.html        # Construir oraciones pieza a pieza
│   ├── ing-timeline.html               # Mapa de metro de los tiempos verbales
│   └── ing-sing-and-learn.html         # Patrones de verbos cantando
├── len/                                # Lengua
│   └── len-morfosintaxis.html          # Morfosintaxis — explorador y analizador
├── mat/                                # Matemáticas
│   └── mat-tabla-pitagorica.html       # Tabla pitagórica — patrones y simetría
├── qui/                                # Química
│   ├── qui-tabla-periodica.html        # Tabla periódica — 3 modos de lectura
│   └── qui-elementos-tarjetas.html     # Tarjetas de elementos — práctica
├── nd/                                 # Neurodivergencia
│   ├── nd-carga-sensorial.html         # Modelo de Carga Sensorial (ES)
│   └── nd-carga-sensorial-en.html      # Sensory Load Model (EN)
└── trn/                                # Transversal
    └── trn-reloj.html                  # El Reloj · The Clock — bilingüe
```

Los archivos terminados en `-bck` o `-v2` son versiones de trabajo, no la
versión viva. La referencia siempre es lo que enlaza `index.html`.

---

## 🧪 Recursos disponibles

### ✅ Publicados

| Recurso                   | Materia              | Nivel             | Archivo                               |
| ------------------------- | -------------------- | ----------------- | ------------------------------------- |
| Los 5 Reinos              | Ciencias Naturales   | 1º ESO            | `bio/bio-5reinos.html`                |
| Invertebrados             | Ciencias Naturales   | 1º ESO            | `bio/bio-invertebrados-mapa.html`     |
| Reino de las Plantas      | Ciencias Naturales   | 1º ESO            | `bio/bio-reino-plantas.html`          |
| Verbos Irregulares        | Inglés               | ESO               | `ing/ing-verbos-irregulares.html`     |
| Quiz de Verbos            | Inglés               | ESO               | `ing/ing-verbos-quiz.html`            |
| Grammar Builder           | Inglés               | ESO               | `ing/ing-grammar-builder.html`        |
| Timeline de Tiempos       | Inglés               | ESO               | `ing/ing-timeline.html`               |
| Sing & Learn              | Inglés               | ESO               | `ing/ing-sing-and-learn.html`         |
| Morfosintaxis             | Lengua Castellana    | ESO               | `len/len-morfosintaxis.html`          |
| Tabla Pitagórica          | Matemáticas          | Primaria / ESO    | `mat/mat-tabla-pitagorica.html`       |
| Tabla Periódica           | Química              | ESO               | `qui/qui-tabla-periodica.html`        |
| Tarjetas de Elementos     | Química              | ESO               | `qui/qui-elementos-tarjetas.html`     |
| El Reloj · The Clock      | Matemáticas · Tiempo | Primaria / ESO    | `trn/trn-reloj.html`                  |
| Modelo de Carga Sensorial | Neurodivergencia     | Divulgativo       | `nd/nd-carga-sensorial.html`          |

### ⚗️ Química — el viaje hacia la formulación

Las dos herramientas de Química están pensadas como una secuencia, no como
piezas sueltas. La idea es que formular deje de ser memorizar.

La **Tabla Periódica** se lee en tres capas, con el mismo tablero:

1. **Familias** — reconocer el territorio: quién es quién y de qué familia.
2. **Valencia** — cuántos electrones tiene cada átomo en la última capa, que
   es lo único que cuenta al unirse. Se ve que cada columna comparte valencia.
3. **Electronegatividad** — con cuánta fuerza los agarra. La diagonal que
   explica la forma de la tabla.

Las **Tarjetas de Elementos** cierran el ciclo: practicar símbolos, nombres,
familias y electrones de valencia, con filtro por familia y lista de fallos
para repasar.

### 🔧 En desarrollo

| Recurso                    | Materia           | Nivel  |
| -------------------------- | ----------------- | ------ |
| Formulador de compuestos   | Química           | ESO    |
| Verbos irregulares español | Lengua Castellana | ESO    |
| Chuletarios interactivos   | Todas             | VARIOS |

---

## 🧠 Sección ND — Neurodivergencia

Recursos explicativos sobre neurodivergencia — no clínicos, no diagnósticos.  
Pensados para entender, comunicar y reducir la brecha entre quien lo vive y quien no.

**Modelo de Carga Sensorial** — herramienta interactiva sobre prefiltrado sensorial y sobrecarga en perfiles DPS / TEA.  
Explica el desajuste entre el input disponible y la capacidad de atenuación automática.  
Incluye amortiguadores naturales y conductuales, factores de coste adicional (masking, sobrecarga ejecutiva, falta de previsibilidad) y comparativa NT / DPS en tiempo real.  
No es un test. No es un diagnóstico. Es para entender y explicar.

---

## 🎮 ¿Cómo funcionan los recursos?

Los recursos son archivos HTML autocontenidos — sin instalación, sin login, sin servidor.  
Se abren directamente en el navegador. También funcionan **sin conexión** — descarga el archivo y úsalo donde quieras.

Cada recurso incluye múltiples modos de navegación cuando el contenido lo justifica:

- **Modo explorador** — navegación libre por secciones
- **Modo historia** — recorrido guiado paso a paso con narración

---

## 🗂 Contenido extensible con YAML

Algunas herramientas separan el contenido del código mediante archivos YAML. Esto permite:

- Añadir o modificar contenido sin tocar el HTML
- Generar nuevas oraciones o ejercicios con un chatbot usando la plantilla incluida
- Adaptar los recursos a cualquier nivel o contexto sin conocimientos técnicos avanzados

Plantilla y prompt de ejemplo incluidos en cada herramienta que lo soporte.

---

## 🎨 Identidad visual

Fondo oscuro · Verde bioluminiscente · Tipografía Unbounded  
Diseño pensado para reducir fatiga visual y maximizar contraste.  
Weird, pero funcional. Así somos.

---

## <img title="" src="assets/ax0-icono.png" alt="AX0, el ajolote de ARKINESIS" width="77" data-align="inline"> Otros recursos

#### [ARKINESIS](https://v0raonline.github.io/arkinesis/)

Simulador de física interactivo para Bachillerato.

---

## 📺 Canal de YouTube

[@h4ppypuk1ng](https://www.youtube.com/@h4ppypuk1ng) — vídeos y contando.

---

## 📬 Contacto

¿Preguntas, colaboraciones o simplemente quieres decir algo?  
✉️ [h4ppypuk1ng@gmail.com](mailto:h4ppypuk1ng@gmail.com)

---

## 📄 Licencia

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)  
Puedes usar, adaptar y compartir — siempre que sea sin fines comerciales y mantengas esta misma licencia.  
Cita la fuente. Es lo mínimo.

---

## 🤝 Contribuciones

¿Tienes una idea o encontraste un error?  
Abre un issue o un PR. Esto es un taller abierto, no un producto terminado.

[Issues · V0raOnline/happypuking-lab](https://github.com/V0raOnline/happypuking-lab/issues)

---

## 🦄 Sobre el proyecto

Lee el [about.html](./about.html) para entender de dónde viene esto, por qué se llama así y quién hay detrás.

Spoiler: una persona, un cerebro lokito y una IA bien entrenada.

---

*Built with AI, with intention, and with lived experience.*  
*For those who've heard "you're just not trying hard enough" one too many times.*
