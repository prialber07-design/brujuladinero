---
titulo: 'Qué es Bitcoin, explicado sin tecnicismos'
descripcion: 'Qué es Bitcoin y cómo funciona realmente, contado con una analogía sencilla, sin jerga y sin promesas: qué resuelve, qué no resuelve y qué riesgos tiene.'
categoria: 'cripto-desde-cero'
fecha: 2026-08-06
actualizado: 2026-08-07
autor: 'Alberto Pérez Lafuente'
orden: 10
borrador: false
faltaAporteReal: true
palabraClave: 'qué es bitcoin'
ilustracion: 'red'
ilustracionAlt: 'Red de nodos conectados entre sí sin centro único'
resumen: >-
  Bitcoin es un libro de cuentas público del que miles de ordenadores guardan
  una copia idéntica, sin que ninguna entidad central lo controle. Sirve para
  transferir valor sin intermediarios, su emisión está limitada a 21 millones
  de unidades y su precio es muy volátil.
puntosClave:
  - 'Es un registro de transacciones copiado en miles de ordenadores a la vez.'
  - 'No hay banco central ni empresa que lo controle.'
  - 'La emisión está limitada por código a 21 millones de unidades.'
  - 'Las transacciones son públicas, pero las identidades no aparecen.'
  - 'El precio es muy volátil: puede perder gran parte de su valor.'
temas:
  - qué es bitcoin
  - blockchain
  - criptomonedas
  - cadena de bloques
faq:
  - pregunta: '¿Qué es Bitcoin en palabras sencillas?'
    respuesta: >-
      Un libro de cuentas público del que miles de ordenadores repartidos por
      el mundo guardan una copia idéntica. Cuando alguien envía bitcoins, la
      operación se anuncia a la red y todas las copias se actualizan a la vez,
      así que no hace falta un banco que valide la operación.
  - pregunta: '¿Quién controla Bitcoin?'
    respuesta: >-
      Nadie en concreto. Las reglas están escritas en un programa que ejecutan
      voluntariamente miles de ordenadores. Cambiarlas requiere que una mayoría
      abrumadora de la red adopte la modificación, cosa que en la práctica
      ocurre muy pocas veces.
  - pregunta: '¿Por qué solo habrá 21 millones de bitcoins?'
    respuesta: >-
      Porque el límite está escrito en el propio código desde su creación y la
      emisión se va reduciendo con el tiempo. Es una decisión de diseño para
      que ninguna autoridad pueda emitir más unidades a voluntad, al contrario
      de lo que ocurre con el dinero tradicional.
  - pregunta: '¿Es Bitcoin anónimo?'
    respuesta: >-
      No del todo. Todas las transacciones son públicas y cualquiera puede
      consultarlas, pero se identifican por direcciones y no por nombres. Se
      considera seudónimo: si una dirección se vincula a una persona, todo su
      historial queda a la vista.
fuentes:
  - texto: 'CNMV — Nueva regulación de criptoactivos: reglamento MiCA'
    url: 'https://www.cnmv.es/portal/mica/regulacion-criptoactivos'
    organismo: 'CNMV'
    consultado: 2026-08-07
  - texto: 'Agencia Tributaria — Sede electrónica'
    url: 'https://sede.agenciatributaria.gob.es'
    organismo: 'Agencia Tributaria'
    consultado: 2026-08-07
tieneAfiliados: false
---

Si has intentado entender qué es Bitcoin y has salido más confundido, no es
culpa tuya. La mayoría de las explicaciones empiezan por «criptografía
asimétrica» y «hash SHA-256», que son la respuesta a *cómo* funciona por dentro,
no a *qué* es.

Olvida eso un momento.

## La libreta de la partida de cartas

Imagina que juegas a las cartas con cuatro amigos todas las semanas. En vez de
mover dinero, anotáis en una libreta quién debe a quién, y a final de mes
ajustáis cuentas.

Esa libreta es un **libro de contabilidad**. Funciona mientras nadie la
manipule.

El problema evidente: si la libreta la guarda uno solo, podría borrar un número
cuando nadie mire. Así que decidís algo distinto: **cada uno tiene su propia
copia**. Cuando alguien hace una anotación, la dice en voz alta y todos la
apuntan a la vez. Si uno altera su copia, las otras cuatro no cuadran y se
descubre al instante.

Eso es Bitcoin. Solo que en vez de cinco amigos son **miles de ordenadores**
repartidos por el mundo, y en vez de una libreta es un archivo que se llama
cadena de bloques.

## Qué problema resuelve

Uno muy concreto: **transferir valor por internet sin necesitar a alguien en
medio que dé fe**.

Cuando haces una transferencia bancaria, el banco confirma que tienes el dinero
y actualiza dos saldos. Todo el sistema descansa en confiar en esa entidad.
Funciona bien la mayor parte del tiempo, y a cambio esa entidad puede bloquear
tu cuenta, cobrar comisiones y decidir horarios.

Bitcoin sustituye la confianza en una entidad por la comprobación de una red.
Nadie tiene que fiarse de nadie porque todos pueden verificar la contabilidad
completa.

Eso es genuinamente novedoso. También es lo único que hace.

## Las tres piezas que conviene entender

**Los bloques.** Las transacciones se agrupan en paquetes. Cada paquete lleva
una huella del anterior, así que van encadenados: cambiar algo antiguo obligaría
a rehacer todo lo posterior en todas las copias a la vez.

**La minería.** Añadir un bloque nuevo exige resolver un problema de cálculo
costoso. Quien lo consigue recibe bitcoins recién creados. Ese trabajo es lo que
hace caro atacar la red, y de paso es la única forma en que se emiten monedas
nuevas.

**Las claves.** No hay cuentas con nombre. Hay una dirección pública, que sirve
para recibir, y una clave privada, que autoriza a enviar. Quien tiene la clave
privada tiene los fondos: no hay servicio de atención al cliente que te la
recupere.

Esa última pieza es la que más disgustos causa, y por eso conviene entender bien
[la diferencia entre una wallet y un exchange](/wallet-vs-exchange/) antes de
mover nada.

## Bitcoin frente al euro

| | Euro | Bitcoin |
|---|---|---|
| **Quién emite** | Banco Central Europeo | Un programa, con emisión decreciente |
| **Cantidad total** | Sin límite fijado | 21 millones |
| **Quién controla** | Bancos centrales y gobiernos | La red de participantes |
| **Registro** | Privado, en cada banco | Público, consultable por cualquiera |
| **Estabilidad** | Alta | Muy volátil |
| **Aceptación** | Universal | Limitada |

Las dos últimas filas son las que se suelen omitir en los artículos entusiastas,
y son las que más te afectan si te lo estás planteando.

## Lo que Bitcoin no es

Conviene decirlo con claridad, porque en este terreno abunda el humo.

**No es una inversión garantizada.** Su precio ha caído más de un 50% en varias
ocasiones. Puede volver a pasar.

**No es anónimo.** Todas las transacciones son públicas. Son seudónimas: se ven
direcciones, no nombres. Si una dirección se vincula contigo, todo su historial
queda expuesto.

**No es rápido ni gratis.** Las transacciones tardan minutos y llevan comisión,
que sube cuando la red está congestionada.

**No está exento de impuestos.** Vender criptomonedas, o cambiar unas por otras,
genera ganancia o pérdida patrimonial en el IRPF aunque no llegues a tocar un
euro. Y si están custodiadas fuera de España por encima de cierto umbral, hay
una declaración informativa aparte. Comprobarlo antes de operar es más barato
que comprobarlo en abril.

**No está sin regular.** Desde el **1 de julio de 2026** el reglamento europeo
MiCA está en aplicación plena: cualquier plataforma que preste servicios de
criptoactivos en España necesita autorización de la CNMV o de otra autoridad
competente de la UE. Comprobar que la tiene es el primer filtro, y el más
barato, contra [las estafas del sector](/estafas-cripto/). Lo explico entero en
[qué es MiCA](/que-es-mica/).

**No lo respalda nadie.** No hay fondo de garantía de depósitos ni entidad que
responda. Si lo pierdes, lo perdiste.

## Si te estás planteando comprar

Tres cosas antes que ninguna otra:

1. **Solo dinero que puedas perder entero.** No es una frase hecha; es el
   escenario que debes poder asumir sin que te cambie la vida.
2. **Primero el colchón.** Si no tienes
   [fondo de emergencia](/fondo-de-emergencia/), lo urgente es ese, no esto.
3. **Entiende la custodia antes de comprar**, no después.

Y desconfía por sistema de cualquiera que te prometa rentabilidad garantizada:
es el patrón de casi todas
[las estafas del sector](/estafas-cripto/).

## Resumen

- Bitcoin es un **libro de cuentas público** copiado en miles de ordenadores.
- Resuelve transferir valor **sin intermediario**. Eso es todo lo que hace.
- Emisión limitada a **21 millones**; nadie puede emitir más a voluntad.
- Es **seudónimo**, no anónimo, y muy **volátil**.
- Quien tiene la clave privada tiene los fondos. No hay recuperación.

<!--
════════════════════════════════════════════════════════════════════
AQUÍ VA TU PARTE — y en cripto es más importante que en nada

Este artículo es un explicador: no afirma experiencia que no tienes,
y por eso es publicable. Pero mejora mucho con algo real:

  · Qué te costó entender a ti y qué analogía te hizo clic
  · Si abriste cuenta en un exchange, qué te sorprendió del proceso
  · Qué término te sonaba a chino y qué significaba de verdad

NO escribas "yo compré" ni "mi experiencia" si no ha pasado.

VERIFICA antes de publicar los datos técnicos (límite de emisión,
comportamiento de las comisiones) con fuentes oficiales.

Después pon borrador y faltaAporteReal en false.
════════════════════════════════════════════════════════════════════
-->
