# DolceMel Pâtisserie

Sitio de DolceMel con la composición de la referencia, el logo original y azul marino `#061e40` en los elementos de marca. Incluye catálogo por categorías, detalles de productos, menú móvil y consultas por WhatsApp al **+598 98 966 775**.

## Archivos

- `index.html`: portada, historia, tortas personalizadas, colección, entregas y contacto.
- `styles.css`: diseño adaptable a celular y escritorio.
- `catalog.json`: nombres, descripciones, categorías y rutas de las fotos.
- `app.js`: filtros, detalles, menú y preparación de consultas por WhatsApp.
- Las imágenes originales se conservan en la raíz con los nombres subidos por el propietario.
- `assets/`: favicon e imágenes ilustrativas generadas con autorización del propietario.

## Imágenes ilustrativas

Las fotos de casamiento, cumpleaños de 15, Rogel, cheesecake de maracuyá, cheesecake de frutos rojos y la selección adicional de brigadeiros son generadas. Se indican como **Imagen ilustrativa** en las tarjetas y en los detalles. Para reemplazarlas por fotos propias, cambiar `image` e `illustrative` en `catalog.json`.

El retrato de la pastelera de la referencia todavía no está entre los archivos subidos. La sección de historia usa una foto propia de producto mientras tanto.

## Ver localmente

No requiere instalar dependencias ni compilar. Desde esta carpeta:

```sh
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. El catálogo se carga desde JSON y requiere servir la carpeta por HTTP.

## Publicar en GitHub Pages

En **Settings → Pages**, seleccionar **Deploy from a branch**, rama **main**, carpeta **/(root)**. El archivo `.nojekyll` permite servir el sitio estático directamente.

El formulario abre WhatsApp con una consulta para que el visitante la revise y la envíe. No guarda datos ni envía mensajes automáticamente. Fechas, precios, tamaños, entrega y disponibilidad se coordinan personalmente; no se inventaron precios ni zonas de entrega.
