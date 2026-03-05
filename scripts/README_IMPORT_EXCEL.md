# Importar Excel y actualizar la app (sin Python en tu PC)

Si no puedes instalar Python en tu ordenador corporativo, usa la pantalla web:

- `admin-datos.html`

## Opción A (recomendada): pantalla web de administración

1. Abre `admin-datos.html` en el navegador.
2. Sube el Excel de **GRANDES** y pulsa **Procesar GRANDES**.
3. Pulsa **Aplicar a la app (localStorage)**.
4. Sube el Excel de **MEDIANOS** y pulsa **Procesar MEDIANOS**.
5. Pulsa **Aplicar a la app (localStorage)**.
6. Abre `grandes.html` y `medianos.html`: ya leerán esos datos en ese navegador.

Notas:
- No instala nada en tu equipo.
- Los datos se guardan en el navegador (localStorage) con claves:
  - `qr_data_grandes`
  - `qr_data_medianos`
- También puedes descargar los JSON con los botones de la pantalla.

## Opción B: script Python (si dispones de entorno)

Script: `scripts/import_excel.py`

Requisitos:
- Python 3
- Para `.xlsx`: `pip install openpyxl`

### GRANDES

```bash
python scripts/import_excel.py grandes \
  --input /ruta/a/grandes.xlsx \
  --update-html grandes.html
```

### MEDIANOS

```bash
python scripts/import_excel.py medianos \
  --input /ruta/a/medianos.xlsx \
  --station ES05 \
  --update-html medianos.html
```

## Columnas soportadas (aliases)

El importador intenta reconocer variantes de nombres para:
- Modelo/coche (`COCHE`, `MODELO`)
- Código QR/componente
- Operación
- Ubicación
- Bloque/bol o maleta
- `Día Sec.` (`DiaSec`, `DiaSecuencia`, `Día Sec.`, etc.)
