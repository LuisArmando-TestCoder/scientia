Segmentar info en listas,

cuando hayan temas agrupables, un padre los lista en su nodo,

y si los padres son agrupables, se repite el proceso.

El top level visual es emergente, y se muestran primero los nodos sin padre.

gmail >> context tree auto

Y eso, de hecho, resolvería uno de los problemas de la integridad de la información porque al eliminar el padre no se eliminarían los hijos, solo se elimina el top level que tenía las referencias de esos hijos y el padre, al eliminarse, hace que en el top level los hijos se vuelvan automáticamente visibles.

es que lo que me impresiona es que las implicaciones de la idea son organización de la información e integridad de la información. Y entonces, cuando uno tenga que estar buscando si hacer o no las agrupaciones, uno solo estaría viendo el top level, no sería un proceso recursivo. Pero el proceso de reagrupación sería automáticamente recursivo, pero el proceso de checking del top level no.

porque yo estoy constantemente revisando todos los hijos, todos los números para ver cuál no tiene padres. Entonces, es un proceso que crece linealmente. Entonces, no es algo que yo prefiera, que el proceso crezca linealmente. Entonces, yo tengo que guardar una lista y que esta lista se actualice según yo vaya eliminando o añadiendo padres. Y la lista es quién no tiene padres. Y entonces, si yo elimino un padre, entonces en la lista se añaden todos los hijos de ese padre. Y si ellos son agrupados, entonces ellos se quitan de la lista y el padre es el que se añade a la lista. Y listo. Entonces, tenemos estas dos fuentes de información. Lo que, de cierta manera, sí, hace el proceso más frágil, pero lo hace computacionalmente muchísimo más eficiente y no lo hace lineal. No lo hace lineal, lo hace... Es hasta cierto punto lineal, pero con un subset mucho más pequeño.

"En este caso, con la optimización que mencionas, la complejidad del proceso de reagrupación se reduce porque ya no necesitas recorrer todos los nodos en cada operación. En lugar de tener una complejidad lineal respecto al número total de nodos, ahora se vuelve más eficiente, ya que solo actualizas esa lista específica de nodos sin padre. En otras palabras, la complejidad se reduce, y en términos de notación Big O, podríamos decir que pasas de un O(n) a un O(k)"

so we have to add two new functionalities, one in the interface and one in the engine's core. So, in the engine's core we have to add a juxtaposition of an abstraction in JSON of the document that is being saved. So, the properties that are going to be in that document have to have standardized names that are going to be inside an additional list where all the possible names of properties are, so that later on the properties can be used to make categorical groupings of the information. And another thing is that searches can be made. So, this chained JSON, if it needs to create a property that doesn't exist, that doesn't have a name inside the list, then the name is created, the name is added to the list, and then that property name is used. And then it also has to have in the interface a series of sortings, of orderings that are reversible. So, there could be a creation date ordering, there could be a modification date ordering, there could be an alphabetic ordering, there could be a numerical ordering, but, I mean, a numerical ordering based on the previous orderings, really. So, I also said that they are reversible, so if you click on the orderings they are reversed, it's that easy. And also, using the juxtaposed nodes, or chained to the documents, then you can make categorizations of the information so that things are searched by country, or that things are searched by name, and that the searches are not exact coincidences, but partial coincidences. And, well, then, yes, add this that I just said to the previous description.

There is one last problem, the insertion of a new content node once the tree is ready, there needs to be a top down reductive search until the right parent is found, if no parent is found from the start, begin at top level, if one is found at a level, see its children and then after insertion, re-run the parent generation


See [[Pseudo code]]