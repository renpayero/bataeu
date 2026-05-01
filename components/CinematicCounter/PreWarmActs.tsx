'use client'

import Act1Opening from './Acts/Act1Opening'
import Act2Origin from './Acts/Act2Origin'
import Act3Mosaic from './Acts/Act3Mosaic'
import Act4Crescendo from './Acts/Act4Crescendo'
import Act5Anchor from './Acts/Act5Anchor'
import Act6Sweep from './Acts/Act6Sweep'
import Act7Finale from './Acts/Act7Finale'

/**
 * Renderiza los 7 actos invisibles fuera de la viewport durante el loading.
 *
 * Por qué: el primer frame de cada acto requiere que la GPU:
 *   1. Suba las imágenes como textures (decode → GPU memory)
 *   2. Compile los shaders de blur/filter
 *   3. Setup de los layers de compositing
 *
 * Hacer esto al instante en que cada acto se vuelve visible causa stutter.
 * Si forzamos el work durante el loader, todo queda "warm" y los actos
 * arrancan suaves cuando el user clica "Comenzar".
 *
 * Está fuera de pantalla (top: -9999px) y aria-hidden para que ningún
 * usuario/screen reader lo vea.
 */
export default function PreWarmActs() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '100vw',
        height: '100vh',
        opacity: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        contain: 'strict',
      }}
    >
      <Act1Opening />
      <Act2Origin />
      <Act3Mosaic />
      <Act4Crescendo />
      <Act5Anchor />
      <Act6Sweep />
      <Act7Finale />
    </div>
  )
}
