---
titulo: 'Cómo proteger tus cuentas: contraseñas, 2FA y el SMS'
descripcion: 'Cómo proteger de verdad tus cuentas bancarias y de inversión: gestor de contraseñas, verificación en dos pasos y por qué el SMS es el método más débil.'
categoria: 'fiscalidad-y-seguridad'
fecha: 2026-08-07
autor: 'Alberto'
borrador: false
faltaAporteReal: true
palabraClave: 'verificación en dos pasos'
ilustracion: 'candado'
ilustracionAlt: 'Candado cerrado'
resumen: >-
  Proteger tus cuentas de dinero se reduce a tres cosas: una contraseña única
  por servicio guardada en un gestor, verificación en dos pasos con app de
  autenticación en lugar de SMS, y un correo electrónico bien protegido, porque
  desde él se recuperan todas las demás cuentas.
puntosClave:
  - 'Una contraseña distinta por servicio, guardada en un gestor.'
  - 'Verificación en dos pasos con app, no por SMS.'
  - 'El SMS es vulnerable al duplicado fraudulento de tarjeta SIM.'
  - 'Protege el correo primero: desde él se recupera todo lo demás.'
  - 'Guarda los códigos de recuperación en papel, fuera del móvil.'
temas:
  - verificación en dos pasos
  - 2FA
  - gestor de contraseñas
  - SIM swapping
  - seguridad bancaria
faq:
  - pregunta: '¿Qué es la verificación en dos pasos?'
    respuesta: >-
      Un segundo requisito además de la contraseña para entrar en una cuenta,
      normalmente un código temporal. Su utilidad es que aunque alguien
      consiga tu contraseña, no puede acceder sin ese segundo factor.
  - pregunta: '¿Por qué es mejor una app de autenticación que un SMS?'
    respuesta: >-
      Porque el código de la app se genera en tu dispositivo y no viaja por
      ninguna red. Un SMS puede interceptarse mediante el duplicado fraudulento
      de la tarjeta SIM, una técnica en la que el atacante convence a la
      operadora de trasladar tu número a otra tarjeta y recibe él tus códigos.
  - pregunta: '¿Es seguro guardar todas las contraseñas en un gestor?'
    respuesta: >-
      Sí, y es bastante más seguro que la alternativa real, que suele ser
      repetir la misma contraseña en todas partes. El gestor cifra la
      información con una contraseña maestra que solo tú conoces, y permite
      tener claves largas y distintas sin memorizar ninguna.
  - pregunta: '¿Qué hago si pierdo el móvil con la app de autenticación?'
    respuesta: >-
      Por eso hay que guardar los códigos de recuperación que cada servicio
      entrega al activar el segundo factor. Consérvalos impresos o escritos a
      mano en un lugar seguro, nunca en el propio móvil ni en la nube, porque
      ahí desaparecerían junto con el dispositivo.
fuentes:
  - texto: 'INCIBE — Oficina de Seguridad del Internauta'
    url: 'https://www.incibe.es'
    organismo: 'INCIBE'
    consultado: 2026-08-07
  - texto: 'Banco de España — Portal del Cliente Bancario'
    url: 'https://clientebancario.bde.es'
    organismo: 'Banco de España'
    consultado: 2026-08-07
tieneAfiliados: false
---

De poco sirve tener el dinero bien organizado si alguien puede entrar en tus
cuentas. Y la seguridad tiene una ventaja poco habitual: **con tres medidas
cubres casi todo el riesgo real**, y se hacen una vez.

## 1. Una contraseña distinta en cada sitio

El problema no es que tu contraseña sea débil. Es que **la repites**.

Funciona así: una web cualquiera —un foro, una tienda pequeña— sufre una
filtración y sus contraseñas acaban publicadas. Alguien coge esa lista y prueba
las mismas combinaciones de correo y contraseña en bancos, correos y exchanges,
de forma automática. Si repetiste, entran.

No hace falta que nadie te ataque a ti personalmente. Basta con estar en una
lista.

**La solución es un gestor de contraseñas.** Genera y guarda una clave distinta
y larga para cada servicio; tú solo recuerdas una, la maestra.

La objeción típica es «¿y si hackean el gestor?». Es razonable, pero compara con
la alternativa real: **repetir la misma contraseña en veinte sitios**, que no es
un riesgo hipotético sino una filtración esperando a ocurrir. El gestor cifra los
datos de forma que ni la propia empresa puede leerlos.

Para la contraseña maestra: larga mejor que complicada. Cuatro o cinco palabras
sin relación entre sí son más seguras y más fáciles de recordar que ocho
caracteres con símbolos raros.

## 2. Verificación en dos pasos, pero no por SMS

El segundo factor añade un código temporal además de la contraseña. Con él, que
alguien tenga tu contraseña ya no basta.

Pero **no todos los métodos valen lo mismo**:

| Método | Seguridad | Comentario |
|---|---|---|
| **Llave física** | Muy alta | Un dispositivo USB. Lo más seguro |
| **App de autenticación** | Alta | Códigos generados en tu móvil |
| **Notificación push** | Media-alta | Cómoda; cuidado con aceptar por inercia |
| **SMS** | **Baja** | Vulnerable al duplicado de SIM |
| **Solo contraseña** | Ninguna | — |

### Por qué el SMS es el eslabón débil

Existe una técnica llamada **duplicado fraudulento de SIM**. El atacante reúne
datos tuyos, contacta con tu operadora haciéndose pasar por ti y consigue que
trasladen tu número a una tarjeta que él controla.

A partir de ese momento **recibe tus SMS**. Incluidos los códigos del banco.

La señal de que está pasando es que **tu móvil se queda sin cobertura de golpe**
sin motivo. Si eso ocurre y no vuelve en unos minutos, no lo dejes para mañana:
llama a tu operadora desde otro teléfono.

Con una app de autenticación esto no funciona, porque el código se genera dentro
de tu dispositivo y no viaja por ninguna red.

## 3. Protege el correo antes que nada

Este es el punto que casi nadie prioriza y que más daño hace.

**Tu correo es la llave maestra.** Desde él se recuperan las contraseñas de todo
lo demás. Quien controla tu correo controla, tarde o temprano, todas tus cuentas.

Así que el correo merece el mejor tratamiento: contraseña única y larga, segundo
factor con app o llave física, y revisar de vez en cuando que no haya reglas de
reenvío automático que tú no hayas creado —es lo primero que configura un
atacante para leer tu correspondencia sin que lo notes.

## Los códigos de recuperación

Al activar el segundo factor, cada servicio te da una lista de códigos de un solo
uso para entrar si pierdes el móvil.

**Guárdalos en papel**, fuera del teléfono y fuera de la nube. Si los guardas en
el móvil, desaparecen exactamente cuando los necesitas.

Es el mismo razonamiento que con
[la frase semilla de una wallet](/wallet-vs-exchange/): lo que protege el acceso
no puede depender del dispositivo que puedes perder.

## Qué hacer esta semana

En una hora, por orden de importancia:

1. **Instala un gestor de contraseñas** y empieza por el correo.
2. **Activa el segundo factor con app** en: correo, banco, y cualquier
   plataforma donde tengas dinero.
3. **Cambia el SMS por app** donde el servicio lo permita.
4. **Imprime los códigos de recuperación** y guárdalos con la documentación
   importante.
5. **Comprueba si tu correo aparece en filtraciones conocidas** y cambia las
   contraseñas de los servicios afectados.

## Lo que ninguna medida técnica arregla

La mayoría de los robos no vencen a la tecnología: **te convencen a ti**. Una
llamada del «departamento de fraude de tu banco», un SMS con un enlace urgente,
un correo que imita a tu exchange.

Dos reglas que cubren casi todo:

- **Nadie legítimo te pedirá jamás una contraseña, un código o una frase
  semilla.** Ni tu banco, ni el soporte, ni la policía.
- **Si te meten prisa, es una estafa.** La urgencia existe para que no lo
  consultes con nadie.

Lo desarrollo en detalle en [el artículo sobre estafas](/estafas-cripto/): los
patrones son los mismos aunque cambie el envoltorio.

## Resumen

- **Contraseña única por servicio**, con gestor. El problema es repetirlas.
- **Segundo factor con app**, no por SMS: existe el duplicado de SIM.
- **El correo primero**: desde él se recupera todo lo demás.
- **Códigos de recuperación en papel**, fuera del móvil.
- Ninguna medida técnica protege de que te convenzan. Nadie legítimo pide
  contraseñas ni códigos.

<!--
════════════════════════════════════════════════════════════════════
AQUÍ VA TU PARTE

  · Qué gestor usas y por qué elegiste ese
  · Cuántas contraseñas repetidas tenías al empezar
  · Algún intento de phishing que hayas recibido, con captura

Después pon borrador y faltaAporteReal en false.
════════════════════════════════════════════════════════════════════
-->
