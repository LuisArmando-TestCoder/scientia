Reasoning is not just a semantic emergent phenomena, is an algebraically boolean recursive operation applied (a thinking framework).

```deno run --allow-env --allow-net main.ts si se da lo que recibe cuando se da, entonces se recibe```

Example output main.ts
```ts
Starting claim analysis...
claim:  si se da lo que recibe cuando se da, entonces se recibe
Recursion level:  0
evaluacion_global:  {
  estado: "indefinido",
  criterio: "la afirmación es un bucle condicional autoreferencial: requiere que la acción de dar esté simultáneamente vinculada a recibir, lo cual es circular sin agencia o temporalidad explícita; no puede resolverse sin especificar un agente que inicie el intercambio"
}
sub claim:  si se da lo que recibe cuando se da, entonces se recibe  (uncertain)
claim:  si se da lo que recibe cuando se da, entonces se recibe
sub claim:  siempre que se da, se recibe  (false)
sub claim:  se puede recibir sin dar  (true)
sub claim:  dar y recibir siempre ocurren juntos  (false)
Recursion level:  1
evaluacion_global:  {
  estado: "indefinido",
  criterio: "La afirmación está sujeta a interpretación: en algunos sistemas (matemáticos, eticista puro), el acto cumple, pero si hay desacople temporal, emocional o contextual, puede fallar. La autoreferencia permite bucle infinito si no se especifican límites."
}
sub claim:  si se da lo que recibe cuando se da, entonces se recibe  (uncertain)
claim:  si se da lo que recibe cuando se da, entonces se recibe
sub claim:  dar implica recibir siempre  (false)
sub claim:  reciprocidad es simétrica  (uncertain)
claim:  reciprocidad es simétrica
sub claim:  al dar, se garantiza recibir  (uncertain)
claim:  al dar, se garantiza recibir
sub claim:  es posible dar sin recibir  (true)
Recursion level:  2
evaluacion_global:  {
  estado: "falso",
  criterio: "Contraejemplos empíricos y lógicos refutan la garantía universal; sólo se verifica en algunos contextos, pero no siempre"
}
sub claim:  al dar, se garantiza recibir  (false)
sub claim:  al dar, se puede recibir  (true)
sub claim:  algunos que dan reciben  (true)
sub claim:  todos los que dan reciben  (false)
Recursion level:  2
evaluacion_global:  {
  estado: "indefinido",
  criterio: "El nodo muestra tensiones estructurales entre la definición ideal/matemática de simetría y la variabilidad empírica/social de la reciprocidad; algunos tipos de reciprocidad pueden ser asimétricos por diseño (e.g. gratitud, favores)"
}
sub claim:  reciprocidad es simétrica  (uncertain)
claim:  reciprocidad es simétrica
sub claim:  puede haber reciprocidad sin simetría perfecta  (true)
sub claim:  toda simetría es necesariamente recíproca  (false)
sub claim:  la percepción de simetría sostiene la reciprocidad  (true)
Recursion level:  2
evaluacion_global:  {
  estado: "indefinido",
  criterio: "La afirmación puede ser verdadera, falsa o vacía según el marco (dar sin receptor definido, dar sin que el objeto físico/abstracto pueda ser recibido, dar cuyo recibir está mediado por factores contextuales: intención, identidad, reversibilidad). Solo se resuelve bajo definición explícita o axioma tautológico."
}
sub claim:  Dar implica recibir  (uncertain)
claim:  Dar implica recibir
sub claim:  Dar sin receptor es posible  (false)
sub claim:  Recibir sólo si algo es dado  (true)
sub claim:  Reciprocidad es simétrica  (uncertain)
claim:  Reciprocidad es simétrica
Recursion level:  3
evaluacion_global:  {
  estado: "indefinido",
  criterio: "El carácter simétrico de la reciprocidad es frecuentemente una idealización; existen formas de reciprocidad asimétrica (por ejemplo, responder con gratitud a una acción material), por lo que la afirmación generalmente no es universal."
}
sub claim:  La reciprocidad es siempre simétrica  (uncertain)
claim:  La reciprocidad es siempre simétrica
...
```