Reasoning is not just a semantic emergent phenomena, is an algebraically boolean recursive operation applied (a thinking framework).

Example output 1 ```deno run --allow-env --allow-net main.ts si se da lo que se recibe cuando se da, entonces se recibe```
```ts
Starting claim analysis...
claim:  si se da lo que se recibe cuando se da, entonces se recibe
Recursion level:  0
evaluacion_global:  {
  estado: "indefinido",
  criterio: "La estructura continúa siendo autoreferencial y depende de condiciones externas no especificadas; no es universal sin contextualización"
}
sub claim:  si al dar, se recibe lo dado, entonces se recibe  (true)
sub claim:  si se da sin receptor, entonces se recibe  (false)
sub claim:  siempre que se da, alguien recibe  (uncertain)
claim:  siempre que se da, alguien recibe
Recursion level:  1
evaluacion_global:  {
  estado: "falso",
  criterio: "Coherencia formal refutada por contraejemplos empíricos y laxitud semántica de 'alguien'."
}
sub claim:  Siempre que se da, alguien recibe  (false)
sub claim:  Generalmente que se da, alguien recibe  (true)
sub claim:  Es posible dar sin receptor  (true)
sub claim:  Siempre que se da, algo recibe  (true)
sub claim:  En todos los casos, el receptor es 'alguien'  (false)
Claim analysis completed.
```

Example output 2 ```deno run --allow-env --allow-net main.ts Ser distinguido es ser diferente, pero tratar de ser diferente no es diferente de lo que hacen algunos, entonces al ser distinguido uno es parecido a otros en la acción de forzar la diferencia```
```ts
Starting claim analysis...
claim:  Ser distinguido es ser diferente, pero tratar de ser diferente no es diferente de lo que hacen algunos, entonces al ser distinguido uno es parecido a otros en la acción de forzar la diferencia
Recursion level:  0
reevaluacion_global:  {
  estado: "indefinido",
  criterio: "La diferencia forzada es paradójica: produce semejanza estructural dentro de la diferencia, pero puede haber excepciones singulares. Estado final: irreducible, bucle interpretativo abierto."
}
sub claim:  Ser distinguido es ser diferente  (true)
sub claim:  Forzar la diferencia te hace igual a quienes lo fuerzan  (true)
sub claim:  Solo forzar la diferencia produce distinción auténtica  (false)
sub claim:  Forzar la diferencia SIEMPRE lleva a similitud  (false)
sub claim:  La diferencia auténtica a veces emerge espontáneamente  (true)
sub claim:  Todo forzar termina en agrupamiento  (uncertain)
claim:  Todo forzar termina en agrupamiento
Recursion level:  1
reevaluacion_global:  {
  estado: "falso",
  criterio: "El análisis multiaxial muestra que la afirmación no resiste contraejemplos robustos y requiere marco condicional, no absoluto."
}
sub claim:  Todo forzar termina en agrupamiento  (false)
sub claim:  A veces forzar produce agrupamiento  (true)
sub claim:  A veces forzar causa fragmentación  (true)
Claim analysis completed.
```

Example output 3 ```deno run --allow-env --allow-net main.ts "Sometimes for some life throws at you a decision, one must decide between happinness or purpose (to be truly happy one must live absolutely in the present, not thought of what's ahead or what's gone) (to have meaning one should detached from the present to live in the pursue of something)"```
```ts
Starting claim analysis...
claim:  Sometimes for some life throws at you a decision, one must decide between happinness or purpose (to be truly happy one must live absolutely in the present, not thought of what's ahead or what's gone) (to have meaning one should detached from the present to live in the pursue of something)
Recursion level:  0
evaluacion_global:  {
  estado: "indefinido",
  criterio: "Ningún polo predomina universalmente; la plenitud humana surge de la tensión productiva entre ambas posibilidades."
}
sub claim:  Ser feliz en el presente requiere olvidar propósito  (false)
sub claim:  Tener sentido implica dejar el ahora  (false)
sub claim:  Hacer ambas cosas solo parcialmente es posible  (true)
sub claim:  Debe elegirse estrictamente uno  (false)
Claim analysis completed.
```