Reasoning is not just a semantic emergent phenomena, is an algebraically boolean recursive operation applied (a thinking framework).

```deno run --allow-env --allow-net main.ts si se da lo que recibe cuando se da, entonces se recibe```

Example output main.ts
``` bash
Starting claim analysis...
claim:  si se da lo que recibe cuando se da, entonces se recibe
sub claim:  Si se da lo que recibe cuando se da, entonces se recibe  (uncertain)
claim:  Si se da lo que recibe cuando se da, entonces se recibe
sub claim:  Dar implica necesariamente recibir  (false)
sub claim:  Recibir puede suceder sin dar  (true)
sub claim:  La reciprocidad es automática  (false)
evaluacion_global:  {
  estado: "indefinido",
  criterio: "La afirmación central depende de condiciones contextuales no explícitas; su valor lógico es indeterminado salvo mediación de una estructura de reciprocidad explícita."
}
sub claim:  Dar lo que se recibe causa recibir  (true)
sub claim:  Siempre que das, recibes  (false)
sub claim:  Es posible dar sin recibir nunca  (false)
sub claim:  La acción de dar implica haber recibido antes  (false)
sub claim:  Toda reciprocidad es simétrica  (false)
sub claim:  La recursividad causal puede no cerrar  (uncertain)
claim:  La recursividad causal puede no cerrar
evaluacion_global:  {
  estado: "indefinido",
  criterio: "El análisis revela que la afirmación sólo es verdadera bajo ciertas simetrías o contextos. La posibilidad de dar sin recibir, o de circuitos causales no cerrados, suspende un juicio universal. Paradoja recursiva activa y tensiones no resueltas."
}
sub claim:  Toda recursividad causal necesariamente cierra  (false)
sub claim:  Ninguna recursividad causal puede cerrar  (false)
sub claim:  Existen recursividades causales abiertas  (true)
sub claim:  El cierre de la recursividad causal es predecible  (uncertain)
claim:  El cierre de la recursividad causal es predecible
evaluacion_global:  {
  estado: "indefinido",
  criterio: "El fenómeno depende del sistema específico; existen contraejemplos y paradojas que impiden afirmar universalidad. Paradoja no resuelta y apertura formal constitutiva."
}
sub claim:  La recursividad causal siempre cierra en un estado definido  (false)
sub claim:  Todos los cierres recursivos causales son predecibles  (false)
sub claim:  Algunos cierres recursivos causales son predecibles  (true)
sub claim:  Existe al menos un caso donde el cierre es impredecible  (true)
sub claim:  El cierre de la recursividad causal es universalmente predecible  (false)
sub claim:  La predecibilidad depende del dominio o sistema  (true)
evaluacion_global:  {
  estado: "falso",
  criterio: "Existe evidencia conceptual y empírica de que no todos los cierres de recursividad causal son predecibles; sólo en dominios restringidos, bajo condiciones controladas o con información completa, se puede anticipar el resultado."
}
```