# Importar Excel/CSV a DATA (grandes y medianos)

Este script convierte tus tablas en el JSON que usan `grandes.html` y `medianos.html`.

## Requisitos

- Python 3
- Para `.xlsx`: `pip install openpyxl`

## Script

- `scripts/import_excel.py`

## Uso rápido

### 1) GRANDES

```bash
python scripts/import_excel.py grandes \
  --input /ruta/a/grandes.xlsx \
  --output /tmp/data_grandes.json \
  --pretty
```

Actualizar directamente `grandes.html`:

```bash
python scripts/import_excel.py grandes \
  --input /ruta/a/grandes.xlsx \
  --update-html grandes.html
```

### 2) MEDIANOS

```bash
python scripts/import_excel.py medianos \
  --input /ruta/a/medianos.xlsx \
  --station ES05 \
  --output /tmp/data_medianos.json \
  --pretty
```

Actualizar directamente `medianos.html`:

```bash
python scripts/import_excel.py medianos \
  --input /ruta/a/medianos.xlsx \
  --station ES05 \
  --update-html medianos.html
```

## Cómo subir al GitHub

1. Copia tus Excel al repo (por ejemplo en `data/`, opcional).
2. Ejecuta el script para actualizar el HTML o generar JSON.
3. Revisa cambios:

```bash
git status
git diff -- grandes.html medianos.html
```

4. Guarda y sube:

```bash
git add grandes.html medianos.html scripts/import_excel.py scripts/README_IMPORT_EXCEL.md
git commit -m "Importador Excel para DATA y Día Sec"
git push
```

## Columnas soportadas (aliases)

El script intenta reconocer variantes de nombres para:
- Modelo/coche (`COCHE`, `MODELO`)
- Código QR/componente
- Operación
- Ubicación
- Bloque/bol o maleta
- `Día Sec.` (`DiaSec`, `DiaSecuencia`, `Día Sec.`, etc.)

Si alguna cabecera no te la detecta, pásamela y te la añado en 1 minuto.
