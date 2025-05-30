Reasoning is not just a semantic emergent phenomena, is an algebraically boolean recursive operation applied (a thinking framework).

```deno run --allow-env --allow-net main.ts si se da lo que se recibe cuando se da, entonces se recibe```

Example output main.ts
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