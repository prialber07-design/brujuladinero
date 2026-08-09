---
titulo: 'Qué es Ethereum y por qué no es solo otra moneda'
descripcion: 'Qué es Ethereum, en qué se diferencia de Bitcoin, qué son los contratos inteligentes y el gas, y qué riesgos tiene todo lo que se construye encima.'
categoria: 'cripto-desde-cero'
fecha: 2026-08-08
autor: 'Alberto Pérez Lafuente'
borrador: false
faltaAporteReal: true
palabraClave: 'qué es ethereum'
ilustracion: 'bloques'
ilustracionAlt: 'Tres bloques encadenados entre sí'
resumen: >-
  Ethereum es una red que además de registrar transferencias permite ejecutar
  programas llamados contratos inteligentes. Bitcoin es una calculadora que
  apunta quién tiene qué; Ethereum es un ordenador compartido. Esa flexibilidad
  es su utilidad y también su principal fuente de riesgos.
puntosClave:
  - 'Bitcoin registra transferencias; Ethereum ejecuta programas.'
  - 'Los contratos inteligentes se ejecutan solos: nadie puede pararlos.'
  - 'Cada operación cuesta comisión, llamada gas, y varía con la congestión.'
  - 'Un contrato con un fallo es dinero perdido, y ha pasado muchas veces.'
  - 'ETH no tiene límite fijo de emisión, a diferencia de Bitcoin.'
temas:
  - ethereum
  - contratos inteligentes
  - gas
  - ether
  - blockchain programable
faq:
  - pregunta: '¿Qué diferencia hay entre Bitcoin y Ethereum?'
    respuesta: >-
      Bitcoin está diseñado para registrar transferencias de valor y hace eso muy
      bien. Ethereum añade la capacidad de ejecutar programas sobre la red, los
      contratos inteligentes, lo que permite construir aplicaciones encima. Uno
      es un libro de cuentas; el otro, un ordenador compartido.
  - pregunta: '¿Qué es un contrato inteligente?'
    respuesta: >-
      Un programa almacenado en la red que se ejecuta automáticamente cuando se
      cumplen las condiciones escritas en su código. No requiere que nadie lo
      autorice ni lo supervise, y por lo general no puede modificarse una vez
      desplegado.
  - pregunta: '¿Qué es el gas en Ethereum?'
    respuesta: >-
      La comisión que se paga por ejecutar una operación en la red. No es fija:
      depende de lo compleja que sea la operación y de cuánta demanda haya en ese
      momento. En periodos de congestión puede encarecerse mucho.
  - pregunta: '¿Ethereum tiene un límite de emisión como Bitcoin?'
    respuesta: >-
      No de la misma forma. Bitcoin tiene un tope fijo de 21 millones escrito en
      su código. La emisión de ether funciona con reglas distintas y sin un
      límite máximo equivalente, algo que conviene tener en cuenta si te
      interesaba precisamente la escasez programada.
fuentes:
  - texto: 'CNMV — Nueva regulación de criptoactivos: reglamento MiCA'
    url: 'https://www.cnmv.es/portal/mica/regulacion-criptoactivos'
    organismo: 'CNMV'
    consultado: 2026-08-07
tieneAfiliados: false
---

Si ya entiendes [qué es Bitcoin](/que-es-bitcoin/), Ethereum se explica en una
frase: **es lo mismo, pero además puede ejecutar programas**.

Esa diferencia parece pequeña y lo cambia casi todo.

## La analogía

Bitcoin es una **libreta compartida** en la que miles de personas anotan quién
transfiere qué a quién. Hace eso, lo hace bien, y no hace nada más.

Ethereum es un **ordenador compartido**. Puedes anotar transferencias, sí, pero
también puedes subir un programa que se ejecute solo cuando alguien cumple unas
condiciones. Ese programa lo ejecutan miles de máquinas a la vez y todas obtienen
el mismo resultado.

De ahí sale todo lo demás: préstamos automáticos, intercambios sin intermediario,
tokens, NFT. No son cosas distintas: son programas corriendo sobre la misma red.

## Los contratos inteligentes

El nombre confunde: no son contratos ni son inteligentes. Son **programas**.

Un ejemplo sencillo: «si la dirección A envía 100, envía automáticamente el token
X a la dirección A». Nadie lo aprueba ni lo supervisa. Se ejecuta porque está
escrito.

Tres consecuencias que conviene tener claras:

**Nadie puede pararlo.** Ni el autor, ni una empresa, ni un juzgado con
facilidad. Esa resistencia a la censura es su gracia y su peligro.

**Normalmente no se puede corregir.** Una vez desplegado, el código suele ser
inmutable. Si tiene un fallo, el fallo se queda.

**Un error es dinero perdido.** Y ha ocurrido muchas veces, con cantidades
enormes, en proyectos que parecían serios. No es un riesgo teórico.

Cuando alguien te diga que un proyecto es seguro «porque está auditado», recuerda
que las auditorías reducen el riesgo pero no lo eliminan, y que muchos proyectos
auditados han sido igualmente vaciados.

## El gas

Ejecutar operaciones en Ethereum cuesta. Esa comisión se llama **gas**, y no es
fija: depende de lo compleja que sea la operación y de **cuánta gente esté usando
la red en ese momento**.

Es la parte que más sorprende a quien llega nuevo. En un momento tranquilo una
operación puede costar poco; en un pico de demanda, muchísimo más por hacer
exactamente lo mismo.

La consecuencia práctica: **con cantidades pequeñas, el gas puede llevarse un
porcentaje enorme**. Es el mismo problema que explico en
[cuánto cuesta comprar criptomonedas](/comisiones-cripto/), amplificado.

## Ether frente a Bitcoin

| | Bitcoin | Ethereum |
|---|---|---|
| **Para qué está diseñado** | Transferir valor | Ejecutar programas |
| **Emisión máxima** | 21 millones, fija | Sin tope equivalente |
| **Comisión** | Por transacción | Gas, variable según uso |
| **Complejidad** | Deliberadamente baja | Alta |
| **Superficie de riesgo** | Menor | Mayor: cada contrato añade riesgos |

Esa última fila es la que suele omitirse. **Más flexibilidad significa más
cosas que pueden fallar.** No es un defecto de diseño: es la contrapartida
inevitable de poder hacer más.

Y la fila de la emisión importa si lo que te atraía de las criptomonedas era la
escasez programada: **ether no funciona igual que Bitcoin en ese aspecto**.

## Lo que se construye encima

Verás nombres que en realidad son categorías de aplicaciones sobre esta red:

- **Tokens.** Monedas creadas por proyectos, incluidas muchas
  [stablecoins](/que-es-una-stablecoin/).
- **Finanzas descentralizadas.** Préstamos e intercambios automatizados. Sin
  intermediario y también **sin ninguna red de seguridad**.
- **NFT.** Registros de propiedad de elementos únicos. Quedan fuera del
  reglamento [MiCA](/que-es-mica/) cuando son genuinamente únicos.

Aquí hay que decir algo con claridad: **la mayoría de proyectos construidos sobre
Ethereum han desaparecido**, y muchos de los que prometían rentabilidades altas
resultaron ser exactamente lo que parecían. Las señales de alarma están en
[el artículo sobre estafas](/estafas-cripto/), y no cambian por estar en una red
prestigiosa.

## Si te lo estás planteando

Lo mismo de siempre, que no deja de ser cierto por repetirse: solo dinero que
puedas perder entero, [fondo de emergencia](/fondo-de-emergencia/) resuelto
antes, y plataforma autorizada por la CNMV.

Y una específica de esta red: **si vas a interactuar con aplicaciones**, entiende
que estás autorizando a un programa a mover tus fondos. Cada permiso que concedes
es una puerta. Revísalos y revoca los que no uses.

## Resumen

- Bitcoin **registra**; Ethereum **ejecuta programas**.
- Los contratos inteligentes se ejecutan solos y **no se pueden parar ni corregir**.
- El **gas** varía con la congestión y castiga las cantidades pequeñas.
- **Sin límite de emisión** equivalente al de Bitcoin.
- Más flexibilidad = **más superficie de riesgo**.

<!--
════════════════════════════════════════════════════════════════════
AQUÍ VA TU PARTE

  · Qué te costó entender del concepto de contrato inteligente
  · Si alguna vez has visto una comisión de gas, cuánto era

NO menciones proyectos concretos ni rentabilidades. NO afirmes haber
usado aplicaciones si no lo has hecho.

VERIFICA antes de publicar cómo funciona la emisión de ether: es la
afirmación más delicada del artículo y cambia con las actualizaciones
de la red.

Después pon faltaAporteReal en false.
════════════════════════════════════════════════════════════════════
-->
