/*
  hAppYpUkIng — Lab  ·  https://v0raonline.github.io/happypuking-lab/
  Copyright (c) 2024-2026 V0ra (v0raonline)
  Licencia CC BY-NC-SA 4.0 — sin fines comerciales.

  ── EL CHASIS COMPARTIDO ─────────────────────────────────────────────────
  Los controles que se repiten en todas las paginas viven aqui y solo aqui.
  Ahora mismo: el conmutador de tema. Mas adelante: el de idioma.

  POR QUE ESTA FUERA, si las herramientas son HTML autocontenidos:
  porque un boton que hay que mantener en 16 sitios se queda desincronizado
  en 16 sitios. El trato es de degradacion honesta, no de promesa absoluta:
  si te descargas un HTML suelto y este fichero no viaja con el, la pagina
  se ve entera y funciona entera — solo pierde el boton de cambiar de tema.
  El tema que tuvieras guardado se respeta igual, porque de eso se encarga
  un fragmento inline en el <head> de cada pagina, no este fichero.

  NO metas aqui nada de lo que dependa que la pagina se entienda.
*/
(function () {
  'use strict';

  var CLAVE = 'hpk-theme';

  // El texto dice a donde vas, no donde estas. Es lo que espera quien lee
  // un boton: la etiqueta es la accion, no el estado.
  var TEXTOS = {
    es: { claro: 'Modo claro', oscuro: 'Modo oscuro',
          aClaro: 'Cambiar a modo claro', aOscuro: 'Cambiar a modo oscuro' },
    en: { claro: 'Light mode', oscuro: 'Dark mode',
          aClaro: 'Switch to light mode', aOscuro: 'Switch to dark mode' }
  };

  function idioma() {
    var l = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2);
    return TEXTOS[l] ? l : 'es';
  }

  function temaActual() {
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? 'light' : 'dark';
  }

  /* El <style> lo inyecta el propio fichero en vez de vivir en un CSS aparte:
     asi el chasis es UN archivo que enlazar, no dos. Los colores salen de los
     tokens de la pagina, de modo que el boton se tine solo en cada seccion. */
  function estilos() {
    if (document.getElementById('lab-chasis-css')) return;
    var s = document.createElement('style');
    s.id = 'lab-chasis-css';
    s.textContent = [
            // Abajo y no arriba: arriba chocaba con el contador "N herramientas"
      // de cada seccion de la portada al desplazar. Abajo no hay nada
      // anclado, y sigue estando siempre a mano.
      '.lab-chasis{position:fixed;bottom:1rem;right:1rem;z-index:60;',
        'display:flex;gap:.4rem}',
      '.lab-btn{display:inline-flex;align-items:center;gap:.45rem;',
        'font-family:"DM Mono","SF Mono",monospace;font-size:.7rem;',
        'letter-spacing:.06em;text-transform:uppercase;',
        'padding:.5rem .8rem;border-radius:999px;cursor:pointer;',
        'color:var(--muted,#8880a0);background:var(--surface,#0e0c14);',
        'border:1px solid var(--border,rgba(255,255,255,.07));',
        'transition:color .18s ease,border-color .18s ease,transform .18s ease}',
      '.lab-btn:hover{color:var(--text,#f8f6ff);',
        'border-color:var(--magenta,#e0007a);transform:translateY(-1px)}',
      '.lab-btn:focus-visible{outline:2px solid var(--focus,#22D3EE);',
        'outline-offset:3px}',
      '.lab-punto{width:.5rem;height:.5rem;border-radius:50%;',
        'background:var(--magenta,#e0007a);flex:none}',
      // Debajo de 560px el rotulo se come la esquina: se queda el punto.
      '@media(max-width:560px){.lab-btn span:last-child{display:none}',
        '.lab-btn{padding:.5rem}}',
      // Quien haya pedido no ver animaciones, no las ve.
      '@media(prefers-reduced-motion:reduce){.lab-btn{transition:none}',
        '.lab-btn:hover{transform:none}}',
      // Al imprimir, el boton sobra.
      '@media print{.lab-chasis{display:none}}'
    ].join('');
    document.head.appendChild(s);
  }

  function pinta(btn) {
    var t = TEXTOS[idioma()];
    var claro = temaActual() === 'light';
    btn.querySelector('.lab-rotulo').textContent = claro ? t.oscuro : t.claro;
    btn.setAttribute('title', claro ? t.aOscuro : t.aClaro);
    btn.setAttribute('aria-pressed', claro ? 'true' : 'false');
  }

  function aplica(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    try { localStorage.setItem(CLAVE, tema); } catch (e) {}
  }

  function monta() {
    estilos();

    // Si la pagina declara donde lo quiere, va ahi. Si no, esquina flotante.
    var casa = document.querySelector('[data-lab-chasis]');
    if (!casa) {
      casa = document.createElement('div');
      casa.className = 'lab-chasis';
      document.body.appendChild(casa);
    }

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lab-btn';
    btn.id = 'lab-tema';
    btn.innerHTML = '<span class="lab-punto" aria-hidden="true"></span>'
                  + '<span class="lab-rotulo"></span>';
    btn.addEventListener('click', function () {
      aplica(temaActual() === 'light' ? 'dark' : 'light');
      pinta(btn);
    });
    casa.appendChild(btn);
    pinta(btn);

    // Si nadie ha elegido a mano, seguimos al sistema cuando cambie.
    try {
      var mq = window.matchMedia('(prefers-color-scheme: light)');
      var alCambiar = function (e) {
        if (localStorage.getItem(CLAVE)) return;
        document.documentElement.setAttribute('data-theme',
          e.matches ? 'light' : 'dark');
        pinta(btn);
      };
      if (mq.addEventListener) mq.addEventListener('change', alCambiar);
      else if (mq.addListener) mq.addListener(alCambiar);
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', monta);
  } else {
    monta();
  }
})();
