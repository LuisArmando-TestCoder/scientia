Reasoning is not just a semantic emergent phenomena, is an algebraically boolean recursive operation applied (a thinking framework).

```deno run --allow-env --allow-net main.ts si se da lo que recibe cuando se da, entonces se recibe```

Example output main.ts
```ts
Starting claim analysis...
claim:  si se da lo que recibe cuando se da, entonces se recibe
Recursion level:  0
evaluacion_global:  {
  estado: "indefinido",
  criterio: "La proposición sólo se estabiliza al aclarar el contexto y sincronía de los términos; por defecto permanece ambigua/autorreferencial, útil como generador de preguntas más que como verdad absoluta."
}
sub claim:  Donar implica que el otro recibe justo cuando se dona  (uncertain)
claim:  Donar implica que el otro recibe justo cuando se dona
sub claim:  Donar siempre implica recibir  (false)
sub claim:  Donar algunas veces implica recibir  (true)
sub claim:  En sincronicidad perfecta, donar implica recibir  (true)
Recursion level:  1
evaluacion_global:  {
  estado: "falso",
  criterio: "La proposición universal no se sostiene por presencia de excepciones empíricas y lógicas; sólo es verdadera en condiciones particulares"
}
sub claim:  Donar implica que el otro recibe justo cuando se dona  (false)
sub claim:  Donar puede implicar que el otro recibe después  (true)
sub claim:  Donar implica que el otro siempre recibe  (false)
sub claim:  En algunos casos, donar y recibir ocurren simultáneamente  (true)
Claim analysis completed.
```