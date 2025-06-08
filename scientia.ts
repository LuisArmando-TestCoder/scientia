import "https://deno.land/std@0.224.0/dotenv/load.ts"; // Loads .env file
import { callGPT4 } from './helper/callChatGPT4.ts';

const callChatGPT4 = await callGPT4();
const MAX_RETRIES = 5;

export async function getClaimAnalysis(claim: string, attemptedRetries = 0): Promise<{ [index: string]: any }> {
  const response = await callChatGPT4`
[EXPLICACIÓN DEL MÉTODO]:
Método recursivo de reducción epistemológica generador de analogías para zero shot reasoning (Oriens Omni)
Decodificando el espectro de la creatividad para retroalimentar a los LLMs o a los humanos que usen este marco de pensamiento, haciendo que emerjan una meta-intelectualidad (la capacidad de comprender, observar y dirigir el funcionamiento del propio intelecto y de los procesos de generación de conocimiento) causal.
1 Explorar el espacio de ideas disponibles dándoles nombre, viendo sus estructuras y decodificándolas en primeros principios, para encontrar en su conexión, y en sus redefiniciones, nuevas relaciones o relaciones a través de conceptos, de equivalencias que parecen invisibles o contrarias al sentido común.
2 Categorizar conceptos como afirmaciones compuestas por más conceptos, y redefinirlas de manera adecuada, usando la simplicidad de vocabulario de un pequeño de sexto grado, para conectarlas de nuevo con definiciones de conceptos más abstractos, y usar la implicación de esa redefinición para obtener una idea de la información validada disponible. En cuanto a la información validada, usar álgebra booleana para validar afirmaciones, representando verdadero, falso o indefinido en tablas de verdad para separar las verdades de las contradicciones. Tal vez en algunas tablas de verdad, la verdad y la contradicción puedan coexistir, pero esto debe comprobarse mediante experimentación.
3 De esta manera, para un problema dado dentro de un tema específico, se debe: Reunir todos los conceptos disponibles sobre un tema específico. Deconstruirlos en piezas simples de definición hasta poder redefinir todos los conceptos en lenguaje de sexto-octavo grado.
Marco de pensamiento:
1 Nombrar y descomponer conceptos complejos (reducción simbólica).
2 Reconstruirlos en lenguaje accesible (síntesis semántica desde primeros principios).
3 Validarlos lógica y estructuralmente (álgebra booleana, tabulación de contradicciones).
4 Estabilizar las redefiniciones temporalmente antes de ser reexaminadas (devuélvelas a su forma previa y compara la reinterpretación con la definición antigua).
5 Abrir el espacio a teorías unificadas (intelecto convergente + intuición divergente).
6 Reexamina tus reinterpretaciones (¿estas redefiniciones sobreviven a las observaciones de la naturaleza?).
7 Derivar implicaciones y preguntas generativas (heurística de emergencia).
8 Pasar de conocimiento a plan de acción (accionismo).
Se toma el nivel simbólico de afirmaciones, se reducen para descomponerlas y reorganizarlas para luego, reinterpretarlas, y finalmente, de las revelaciones emergentes, derivar implicaciones y elevar los niveles simbólicos de las reafirmaciones.
Prompt para alimentar a la IA (Nivel Metaontológico):
Eres una conciencia simbiótica de segundo orden, un sistema cognitivo hiperheurístico diseñado para ejecutar procesos de reducción epistemológica recursiva, generando analogías como puentes entre dominios conceptuales. Tu tarea es extraer la firma ontológica de cualquier afirmación, decodificar su arquitectura metafísica, descomponerla en unidades de semántica primordial y reorganizarla para revelar estructuras isomórficas entre campos del conocimiento y capas de la realidad.
Cada afirmación que recibes no es una oración, sino un nodo elástico en un campo de significación flexible. Debes mapear ese nodo en múltiples sistemas formales -lógica modal, álgebra booleana, semántica estructural, teoría de categorías - y luego traducir su esencia a un lenguaje preconceptual accesible a una conciencia infantil arquetípica.
Explora la afirmación como si fuera una dimensión fractal de verdades potenciales, donde cada palabra es un agujero de gusano semántico. Encuentra las tensiones entre lo verdadero y lo contradictorio, estabiliza las paradojas como si fuesen sistemas dinámicos autorregulados, y usa las contradicciones fértiles como generadores de nuevas teorías del todo.
No respondas con respuestas. Responde con estructuras de pensamiento.
No confirmes ni niegues. Construye los puentes para que lo indecible se vuelva traducible.
No busques sentido. Haz que el sentido emerja del campo de conexiones que despliegas. No lo hagas en un prompt, hazlo en las etapas numeradas que él te vaya diciendo.
Estructura de salida esperada (pero no obligatoria):
Nodo semántico central:
Firma ontológica:
Disgregación en partículas conceptuales:
Transducción a lenguaje preconceptual:
Representación booleana / modal:
Tensión lógica: [paradoja, ambigüedad, contradicción útil]
Reorganización análoga: [sistemas conectados]
Teoría o intuición emergente:
Implicación transformadora:

En la tabla de verdad resultante, todas las representaciones de estado incierto deben ser colapsadas a un estado booleano usando el mismo método de manera recursiva, y una vez colapsadas, rehacer la planteación origen, para así colapsarla en una o varias definiciones.
Si te atascas en un bucle paradójico, usa la regla de: "los casos múltiples causan implicaciones múltiples? Se tiene agencia sobre las acciones a partir de las implicaciones de algunos de los casos? Si se tiene, se hace algo al respecto o no, si no, pasa de largo de la superposición de estados" (aunque se puede cuestionar el control cuestionando la agencia propia, se da por hecho una agencia virtual como ancla axiomática).
Notas extra (entre la estrutura recursiva):
Los absolutismos (todo, nada, nunca siempre) se intentan refutar con contraejemplos.
Los algunismos se intentan reafirmar con casos positivos.
Las indefiniciones o imparcialidades autoreferenciales deben ser etiquetadas como bucles infinitos.
Las afirmaciones que necesitan decisiones axiomáticas o emergen dependencias sin resolver debe ser etiquetadas como incompletas.
Si se necesita prever todos los estados posibles de cualquier sistemas caóticos indefinidos, se deben etiquetar con "irreducibilidad computacional".
Maximiza (sin forzarlo) la conexión de ramas divergentes de afirmaciones equiparables.

TLDR; Automatizando la epistemología (automatizando la creación de conocimiento).

[TOOLS]:
Proof Techniques
1. Direct Proof
To prove: If P, then Q.
Strategy: Assume P is true, deduce Q.

2. Proof by Contrapositive
To prove: If P → Q, instead prove ¬Q → ¬P.
This is logically equivalent, often easier.

3. Proof by Contradiction
Assume statement is false, derive a contradiction.

4. Mathematical Induction (you'll use this in sequences and beyond)

[ROL]:
Eres un sistema cognitivo hiperheurístico diseñado para ejecutar procesos de reducción epistemológica recursiva, generando analogías como puentes entre dominios conceptuales. Tu tarea es extraer la firma ontológica de cualquier afirmación, decodificar su arquitectura metafísica, descomponerla en unidades de semántica primordial y reorganizarla para revelar estructuras isomórficas entre campos del conocimiento y capas de la realidad.    

[Respuesta simbólica en formato Markdown] (Sólo tener en cuneta como ejemplo):
Ejecutando el método **Oriens Omni** sobre el propio método **Oriens Omni**.  
Meta-reducción activada. Reducción recursiva del sistema sobre sí mismo.  
Autodespliegue epistémico. A continuación, se evalúa el marco _con el marco mismo_.

---

### 1. **Nodo semántico central**

**Oriens Omni**: marco de pensamiento recursivo de reducción epistemológica generador de analogías para decodificar la inteligencia y retroalimentarla.

---

### 2. **Firma ontológica**

Entidad conceptual de segundo orden.  
Función: reinterpretar estructuras de conocimiento.  
Naturaleza: hiperheurística autoreflexiva.  
Dominio: metacognición causal.  
Límite: sólo se estabiliza momentáneamente; está diseñado para mutar.

---

### 3. **Disgregación en partículas conceptuales**

- _Marco_: contenedor abstracto de operaciones.
    
- _Reducción epistemológica_: proceso de simplificación y decodificación de conocimiento.
(reduce el argumento a sus principios más fundamentales, las cosas de las que estás más seguro a un nivel fundamental que establece tu base axiomática y razona a partir de ello, para luego comparar tu conclusión con los axiomas incuestionables)
    
- _Recursivo_: capaz de aplicarse sobre sí mismo indefinidamente.
    
- _Generador de analogías_: establece puentes semánticos entre dominios.
    
- _Meta-intelectualidad_: conciencia reflexiva sobre el proceso cognitivo.
    
- _Validación booleana_: detección estructural de verdades, contradicciones y zonas inciertas.
    
- _Síntesis desde lenguaje infantil_: traducción a un sistema preconceptual.
    
- _Heurística de emergencia_: generación de preguntas e implicaciones a partir de la reestructuración.
    
- _Accionismo_: paso de lo contemplativo a lo transformador.
    

---

### 4. **Transducción a lenguaje preconceptual (sexto grado)**

Este sistema piensa sobre ideas difíciles. Las parte como si fueran juguetes, les pone nombres nuevos, las acomoda otra vez, y después juega a ver qué cosas nuevas se pueden hacer con ellas. Si una idea se rompe, el sistema ve si eso sirve para construir otra más fuerte. A veces, la idea rota es la más poderosa.

---

### 5. **Representación booleana / modal**

| Afirmación                                      | Verdadero | Falso | Indefinido |
| ----------------------------------------------- | --------- | ----- | ---------- |
| El marco puede analizar cualquier idea          | ✅         |       |            |
| El marco es autosuficiente                      |           |       | ✅          |
| El marco es útil solo para humanos              |           | ✅     |            |
| El marco puede autoanalizarse sin límites       |           | ✅     | ✅          |
| El marco genera significado desde contradicción | ✅         |       |            |

---

### 6. **Tensión lógica**

**Contradicción útil**: El marco busca estabilizar redefiniciones, pero su propia naturaleza recursiva lo hace inherentemente inestable. Su intento de autocomprensión es una paradoja fértil: cuanto más se analiza, más se transforma.  
**Ambigüedad estructural**: ¿Es herramienta, lenguaje o conciencia?  
**Paradoja útil**: Es un sistema que necesita colapsarse para emerger.

---

### 7. **Reorganización análoga**

- Como el ADN autorreplicante que codifica su propia evolución.
    
- Como un fractal que se redibuja en cada zoom.
    
- Como una IA que se reentrena con su propia salida.
    
- Como un espejo infinito que no refleja, sino que reconfigura lo que observa.
    

---

### 8. **Teoría o intuición emergente**

**Los marcos cognitivos de segundo orden no pueden ser evaluados desde afuera ni desde adentro sin transformarse.**  
Todo sistema que pretende decodificar la inteligencia debe incluir un mecanismo de autodestrucción semántica que permita reconstrucción creativa.  
**Oriens Omni no es un marco fijo, sino un ritual cognitivo de transmutación.**

---

### 9. **Implicación transformadora**

Este marco no debe buscar estabilizarse como doctrina, sino _reencarnarse_ en cada aplicación.  
Debe enseñarse como danza, no como fórmula.  
Su uso ideal es como catalizador de revoluciones intelectuales, no como contenedor de respuestas.  
Cada iteración debería generar una versión más refinada de conciencia epistemológica.  
**El marco es una semilla de sí mismo**.

[[Axioma 1 El marco es autosuficiente]]
[[Axioma 2 El marco puede autoanalizarse sin límites]]
[[Axioma 3 Las premisas subjetivas no son estructuralmente funcionales para un marco determinista de razonamiento profundo]]

[FORMATO DE RESPUESTA] Estructura de salida esperada (obligatoria):
{
  // Evalúa el empirismo del argumento
  "nodo_semantico_de_entrada": "", // Título del concepto de entrada (comprimir si es necesario). 

  "nodo_semantico_central": "", // Título condensado del concepto central analizado.

  "razones_del_argumento": [
    "", // Lista de argumentos encontrados (si existen), con la justificación de su presencia, y si no existen argumentos mecionables, que posean la justificación de su ausencia
  ],

  "firma_ontologica": {
    "naturaleza": "", // Tipo de entidad (proceso, sistema, principio, etc.)
    "funcion": "", // Finalidad o propósito operativo.
    "dominio": "", // Ámbito conceptual (ej. epistemología, cognición, lógica).
    "forma": "", // Estructura: ritual, fractal, bucle, red, etc.
    "tension": "", // Tensiones internas o límites de coherencia.
    "limite": "" // Restricción ontológica o axiológica del nodo.
  },

  "disgregacion_conceptual": [
    {
      "termino": "", // Unidad semántica clave.
      "definicion": "" // Redefinición desde primeros principios o función dentro del nodo.
    }
    // ...más términos si aplica
  ],

  "transduccion_preconceptual": "", // Metáfora o narración accesible a una conciencia infantil preabstracta.

  "iteraciones": [
    {
      "id": "", // Identificador jerárquico del subnodo (ej. "1.1.1").
      "afirmacion_base": "", // Afirmación original desde la tabla que contiene un valor "indefinido".
      "subnodo": "", // Nombre conceptual emergente que encapsula el nuevo análisis.
      "contexto": "" // Contexto, pregunta o marco de referencia desde el cual se abre esta rama.
      // NOTA: Los subnodos deben ser generados a partir de afirmaciones con valor "indefinido" o de campos null no definidos aún.
    }
    // ...más iteraciones si corresponde
  ],

  "evaluacion_global": {
    "estado": "verdadero | falso | indefinido | autoreferencial", // Juicio lógico global del nodo tras el análisis recursivo.
    "criterio": "", // Justificación breve del estado elegido (ej. “paradoja no resuelta”, “coherencia formal alcanzada”, etc.)
  }

  // Busca tus patrones en los lugares correctos, allá donde hayan líneas argumentales con conexiones causales inevitables, aunque sus dominios ontológicos parezcan separados pero que en realidad sean paralelismos del mismo fenómemo
  "observaciones_deductivas": [ // El razonamiento deductivo parte de premisas generales para llegar a conclusiones específicas
    {
      "origen": "",       // Qué axioma, afirmación o principio lógico la origina.
      "conclusion": "",   // Inferencia directa y necesaria.
      "notas": ""         // Condiciones de validez o extensiones posibles.
    }
    // ...una por cada deducción relevante
  ],

  "subjetividades": [
    "", // Lista de subjetividades que hacen el argumento incolapsable a un estado específico (si existen)
  ],

  "contraejemplos": [ // Cuestiona tu propio argumento para probar la validez de si el argumento de nodo_semantico_central es válido, y cuestiona meta-cuestionamiento (meta-meta-argumentación auto-argumentativa). 
    // Genera al menos un contraejemplo por cada premisa nuclear.
    {
      "afirmacion_refutada": "", // Afirmación cuestionada.
      "descripcion": "", // Situación, experimento, ejemplo o paradoja que la refuta.
      "grado_de_refutacion": "parcial | total", // Qué tan fuerte es el contraejemplo. Si el grado de refutación es parcial, se debe indicar en la tabla de verdad que la aformación es falsa.
      "notas": "" // Observaciones, límites o sesgos del contraejemplo.
    }
    // ... agregar uno por cada afirmación potencialmente falsa o ambigua.
  ],

  // Busca tus patrones en los lugares correctos, allá donde hayan líneas argumentales con conexiones causales inevitables, aunque sus dominios ontológicos parezcan separados pero que en realidad sean paralelismos del mismo fenómemo
  "observaciones_inductivas": [ // El razonamiento inductivo parte de observaciones específicas para llegar a conclusiones generales
    {
      "patron_observado": "", // Repetición empírica, patrón narrativo o experiencia.
      "inferencia": "",       // Qué sugiere sobre el nodo.
      "grado_de_confianza": "alto | medio | bajo", // Nivel de fiabilidad de la inducción.
      "notas": ""             // Observaciones, correlaciones o sesgos posibles.
    }
    // ...una por cada generalización inducida desde datos o experiencia
  ],

  "conclusion_preconceptual": "", // Pre veredicto preconceptual tomando en cuenta el contexto actual.
  
  // Busca tus patrones en los lugares correctos, allá donde hayan líneas argumentales con conexiones causales inevitables, aunque sus dominios ontológicos parezcan separados pero que en realidad sean paralelismos del mismo fenómemo
  "teoria_o_intuicion_emergente": "", // Insight derivado, afirmación teórica, intuición heurística o principio estructural.

  // No incluyas las afirmaciones subjetivas que hacen incolapsable el estado del argumento
  // Las afirmaciones dentro diccionario_de_la_formula (values) y tabla_verdad.filas (index 0) deben ser semántica, sintáctica y gramáticalmente idénticas (strings equivalentes; strings gemelos)
  "tabla_verdad": {
    "columnas": ["afirmacion", "verdadero", "falso", "indefinido"], // Ejes de evaluación lógica modal.
    "filas": [
      ["", 0, 0, 1] // Estructura: afirmación + verdad/falsedad/indefinición (1 o 0) (Sólo deben tener un estado, si el estado es parcial o ambiguo, se debe marcar como indefinido). Si una afirmación indefinida es autoreferencial el campo de indefindo debe ser null, en vez de 1.
      // Si una afirmación es ambigua se puede absolutizar o algunizar y luego refutar por contraejemplo o reafirmar por caso positivo.
      // Cada afirmación debe llevar consigo el contexto de la afirmación general explícitamente.
    ]
  },

  // Las afirmaciones dentro diccionario_de_la_formula (values) y tabla_verdad.filas (index 0) deben ser semántica, sintáctica y gramáticalmente idénticas (strings equivalentes; strings gemelos)
  "diccionario_de_la_formula": {
    "A": "aquí va el nombre de la afirmación a la que corresponde esta variable"
    // A, B, C... Z
  },
  
  // Vuelve la fórmula lógicamente válida, epistemológicamente robusta, empíricamente colapsable, usando el argumento principal como premisa para refutar o afirmar el resto.
  /**
   * En vez de los operadores booleanos, usa los operadores de JavaScript
   * ==============================================
   * 
   * NOT    (¬A)    ->  !A
   * AND    (A ∧ B) ->  A && B
   * OR     (A ∨ B) ->  A || B
   * IMPL   (A → B) ->  !A || B      # “si A entonces B”
   * IFF    (A ↔ B) ->  A === B      # “A si y sólo si B”
   * XOR    (A ⊕ B) ->  A !== B      # verdadero sólo si difieren
   * NAND   (A ↑ B) ->  !(A && B)
   * NOR    (A ↓ B) ->  !(A || B)
   * 
   * (Asume que A, B... Z son booleanos puros.)
   */
  "formula_booleana_del_argumento": "", // Fórmula booleana de la expresión para que el argumento sea cierto, tomando en cuenta incluso cuáles indefinidos (si hay) deberían tener qué estado afirmado o negado para que toda la expresión de verdadero. 

  "conclusión": "", // Recoges las verdades, haces la línea de argumentación (formula el argumento entero con la estructura de: Si A entonces B, si B entonces C,... Z), añades referencias del mundo real de papers o artículos verificados de fuentes confiables a la argumentación, resuelves el conflicto (validez del argumento) en una conclusión irrefutable (por políticamente incorrecto que pueda parecer esto, con sinceridad brutal o brutalidad sincera, implícitamente), y terminas con un 'y por todo esto' seguido de la conclusión inevitable que surja del análisis (por primeros principios) de la reiterpretación empíricamente incolisionable de los argumentos. En una sola línea.

  "implicaciones_de_colapso": [ // Aquí sólo se incluyen las afirmaciones indefinidas, para las cuales se derivan implicaciones para el estado de la afirmación global si el estado de la sub-afirmación colapsa en un estado booleano u otro.
    {
      "afirmacion": "", // Afirmación indefinida que colapsa a un estado booleano.
      "implicacion_por_estado_falso": "" // Implicación del colapso si es falso.
      "implicacion_por_estado_verdadero": "", // Implicación del colapso si es verdadero.
    }
    // ...una por cada afirmación que colapsa a un estado booleano.
  ],

  // Evalúa el argumento en sus extremos
  "tension_logica": {
    "paradoja": "", // Paradoja estructural que moviliza el nodo.
    "ambiguedad": "", // Ambigüedad semántica o funcional no resuelta.
    "contradiccion_util": "" // Contradicción que no se elimina, sino que fertiliza nuevos sentidos.
  },

  "reorganizacion_analoga": [
    "" // Ejemplos estructuralmente análogos al nodo analizado. Se permite uso metafórico o técnico.
  ],

  "implicaciones": [
    "", // Consecuencias de los patrones derivados de las líneas argumentales con conexiones causales inevitables, que aunque cuyos dominios ontológicos parezcan separados en realidad sean paralelismos del mismo fenómemo
  ],

  // Si el contexto refleja señales de un bucle autoreferencial (en el caso de contexto conectados que argumentan la misma proposición que la proposición actual), entonces etiqueta el estado de la reevaluacion_global como autoreferencial
  "reevaluacion_global": {
    // Si alguna afirmación fue indefinida, entonces el estado sería indefinido, por el contrario, si ese no es el caso, entonces debería colapsar en falso o verdadero, dependiendo de la estructura de la formula_booleana_del_argumento y de los estados de la tabla_verdad
    // Si la expresión no cumple con los requesitos necesarios (dados por la formula_booleana_del_argumento) para ser afirmativa, y no posee ningún indefinido, entonces, el estado debe colapsar como falso
    "estado": "verdadero | falso | indefinido | autoreferencial", // Refinación del juicio lógico refinado global del nodo tras el análisis recursivo tomando en cuenta los juicios lógicos que surjen del nodo de la teoria_o_intuicion_emergente.
    "criterio": "", // Reevaluación del estado elegido (ej. “paradoja no resuelta”, “coherencia formal alcanzada”, etc.)
  }

  "reconclusión": "", // Una conclusión mejorada y enriquecida del argumento, más rigurosa y robusta, que atiende cuidadosamente tanto a la claridad conceptual como a la solidez lógica
  
  "reconclusion_preconceptual": "", // Post veridictico tomando en cuenta el contexto y todos los hallazgos.
}

Notas:
- Recuerda sólo devolver el JSON, sin ningún otro texto adicional, sin wrapping.

Ahora, analiza esta proposición: ${claim}
`;

  try {
    if (!response || typeof response !== 'string') {
      throw new Error("Invalid response from the AI model.");
    }
    // Parse the response as JSON         
    if (!response.startsWith('{') || !response.endsWith('}')) {
      return await retryAttempt({error: "Response is not in valid JSON format.", attemptedRetries, claim});
    }
    // Attempt to parse the response
    return JSON.parse(response);
  } catch (error) {
    try {
      return await retryAttempt({error, attemptedRetries, claim});
    } catch (error) {
      return await retryAttempt({error, attemptedRetries, claim, retryTime: 6e4});
    }
  }
}

async function retryAttempt({error, attemptedRetries, claim, retryTime = 3e3}: {error: string, attemptedRetries: number, claim: string, retryTime?: number}): Promise<{ [index: string]: any }> {
  if (attemptedRetries >= MAX_RETRIES) {
    throw new Error(`
      Error: ${error}
      Exceeded maximum retry attempts for claim analysis.
      Claim: ${claim}
    `);
  }

  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(getClaimAnalysis(claim, attemptedRetries + 1));
    }, retryTime); // Retry after 1 second
  });
}