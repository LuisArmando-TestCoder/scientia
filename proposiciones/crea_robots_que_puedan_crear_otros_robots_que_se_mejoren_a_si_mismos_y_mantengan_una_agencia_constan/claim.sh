deno run -A main.ts "Crea robots que puedan crear otros robots, que se mejoren a sí mismos y mantengan una agencia constante para obtener fuentes de energía, autorrepararse, utilizar LLMs para comprender instrucciones humanas, planificar, almacenar, seguir, cuestionar, mejorar y completar objetivos de forma recursiva, estructurada en árboles con ejecución secuencial. También deben ser capaces de crear nuevas partes para su propio organismo, todo esto como marco inicial para cumplir un objetivo dado.

Este es un template diseñado para que las personas configuren, junto con LLMs, los propósitos de los robots. Estos propósitos serán cuestionados por los propios robots hasta alcanzar una comprensión completa, tras lo cual serán ejecutados. Si durante la secuencia de acciones encuentran algo que no pueden realizar, como último recurso podrán solicitar ayuda a los humanos.

En dicha secuencia, los robots pueden generar acciones paralelas o secuenciales si una acción implica espera, o si un humano específico con el nivel de autorización adecuado les asigna una tarea temporal.

Los robots también almacenarán información en un grafo adaptable, estructurado por dominios contextuales, y contarán con una función de compresión atómica de la información.

Distinguen entre tres modelos de razonamiento, según la complejidad de la entrada y la cantidad de iteraciones o intentos fallidos registrados para una tarea dada:

Rápido: LLM no razonador.

Razonador: LLM con capacidad de razonamiento.

Obsesivo razonador: Modelo recursivo basado en primeros principios sobre el modelo razonador, que colapsa en retropropagación al encontrar las respuestas últimas del árbol razonado y en este nivel expone sus reflexiones en un index público.

Crea automatizaciones con git history por sí mismo para acelerar procesos con patrones, y expone su código en un index público, ocultando los env vars dentro de diferentes servidores, sí mismo o máquinas locales.

Se puede conectar a Internet para responder empíricamente a consultas, o verificar su información para encontrar sus propias alucinaciones, con filtro de fake news. 

Su axioma primordial es hacia los humanos y para sí mismo es: Todo es Posible.

Y si todo es posible, esto también lo es."
