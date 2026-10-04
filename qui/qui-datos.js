/*
  hAppYpUkIng Lab · qui/qui-datos.js
  Copyright (c) 2024-2026 V0ra (v0raonline)
  Licencia CC BY-NC-SA 4.0 — sin fines comerciales.

  Datos y helpers de dominio del bloque Quimica, compartidos entre todas
  las herramientas de qui/ (tabla periodica, tarjetas, formulador...).

  Lo que vive aqui:
   - Datasets puros: CATS, ELEMENTS, EXTRA, OXID_BASE.
   - Mapas derivados: elMap, NUM_POR_SIMBOLO.
   - Dataset activo mutable: OXID (copia de OXID_BASE que se sobreescribe
     al cargar el YAML del usuario).
   - Helpers de rango / formateo / parseo YAML del modo Oxidacion.

  Lo que NO vive aqui:
   - Nada que dependa del DOM, de un modo activo, de clases CSS o del
     tema. El UI especifico de cada herramienta usa estos datos y los
     monta a su manera.

  Al cargar la pagina, este script restaura silenciosamente el YAML
  guardado en localStorage['hpk-qui-oxid-yaml'] si existe y valida:
  OXID queda listo ANTES de que arranquen los scripts UI, para que las
  celdas de la tabla se pinten con el dataset correcto desde el primer
  frame. Requiere js-yaml cargado antes.
*/

const CATS = {
  'metal-alcalino':       { label: 'Metal alcalino',        color: 'var(--metal-alcalino)' },
  'metal-alcalinoterreo': { label: 'Metal alcalinotérreo',  color: 'var(--metal-alcalinoterreo)' },
  'metal-transicion':     { label: 'Metal de transición',   color: 'var(--metal-transicion)' },
  'metal-postransicion':  { label: 'Metal pos-transición',  color: 'var(--metal-postransicion)' },
  'metaloide':            { label: 'Metaloide',             color: 'var(--metaloide)' },
  'no-metal':             { label: 'No metal',              color: 'var(--no-metal)' },
  'halogeno':             { label: 'Halógeno',              color: 'var(--halogeno)' },
  'gas-noble':            { label: 'Gas noble',             color: 'var(--gas-noble)' },
  'lantanido':            { label: 'Lantánido',             color: 'var(--lantanido)' },
  'actinido':             { label: 'Actínido',              color: 'var(--actinido)' },
};

// Full periodic table data
// Format: [number, symbol, name, mass, category, group, period, origin, applications[]]
const ELEMENTS = [
  [1,'H','Hidrógeno','1.008','no-metal',1,1,'El más abundante del universo. Su nombre viene del griego "hydro" (agua) y "genes" (generador) porque al arder produce agua.',['Combustible de cohetes','Pilas de hidrógeno','Síntesis de amoniaco (fertilizantes)','Industria química']],
  [2,'He','Helio','4.003','gas-noble',18,1,'Descubierto primero en el Sol (helios = Sol en griego) antes que en la Tierra. Es el segundo elemento más abundante del universo.',['Globos y dirigibles','Refrigeración de IRM','Soldadura de alta tecnología','Detectores de fugas']],
  [3,'Li','Litio','6.941','metal-alcalino',1,2,'El metal sólido más ligero del mundo. Su nombre viene del griego "lithos" (piedra) porque se encontró en minerales.',['Baterías de teléfonos y coches eléctricos','Medicamento para trastorno bipolar','Vidrios y cerámicas resistentes','Aleaciones aeroespaciales']],
  [4,'Be','Berilio','9.012','metal-alcalinoterreo',2,2,'Extremadamente ligero pero rígido. Su nombre viene del mineral berilo (esmeraldas y aguamarinas son berilo con impurezas).',['Ventanas de rayos X','Componentes aeroespaciales','Resortes de precisión','Equipos de golf y golf profesional']],
  [5,'B','Boro','10.81','metaloide',13,2,'Se encuentra en bórax, un mineral conocido desde la antigüedad en el Tíbet. Es esencial para las plantas.',['Vidrio borosilicato (Pyrex)','Detergentes (bórax)','Antisépticos','Semiconductores y electrónica']],
  [6,'C','Carbono','12.01','no-metal',14,2,'La base de toda la vida. Su versatilidad química permite más de 10 millones de compuestos diferentes.',['Combustibles fósiles','Plásticos y polímeros','Acero (aleación con hierro)','Diamantes y grafeno']],
  [7,'N','Nitrógeno','14.01','no-metal',15,2,'Constituye el 78% del aire. Su nombre viene del griego "nitron" (salitre) y "genes" (generador).',['Fertilizantes agrícolas','Envases de alimentos (conservación)','Fabricación de explosivos','Criogenia (-196°C)']],
  [8,'O','Oxígeno','16.00','no-metal',16,2,'El tercer elemento más abundante del universo. El 21% del aire que respiramos. Esencial para la combustión y la vida.',['Respiración médica y hospitalaria','Acería y metalurgia','Cohetes espaciales','Tratamiento de aguas residuales']],
  [9,'F','Flúor','19.00','halogeno',17,2,'El elemento más electronegativo y reactivo de la tabla periódica. Su nombre viene del latín "fluere" (fluir).',['Pasta de dientes (fluoruro)','Teflón (sartenes antiadherentes)','Refrigerantes (HFCs)','Tratamiento del agua potable']],
  [10,'Ne','Neón','20.18','gas-noble',18,2,'Su nombre viene del griego "neos" (nuevo). Produce esa famosa luz rojo-naranja brillante cuando se electrifica.',['Letreros luminosos (neón)','Láseres','Indicadores de alta tensión','Criogenia']],
  [11,'Na','Sodio','22.99','metal-alcalino',1,3,'Su símbolo Na viene del latín "natrium". Metal tan blando que se puede cortar con un cuchillo. Reacciona violentamente con el agua.',['Sal de cocina (NaCl)','Iluminación de sodio (farolas anaranjadas)','Jabones y detergentes','Conservante alimentario']],
  [12,'Mg','Magnesio','24.31','metal-alcalinoterreo',2,3,'El octavo elemento más abundante de la Tierra. Su nombre viene de Magnesia, una región de Grecia.',['Aleaciones ligeras (coches y aviones)','Suplementos dietéticos','Pirotecnia (luz blanca brillante)','Tratamiento del agua']],
  [13,'Al','Aluminio','26.98','metal-postransicion',13,3,'El metal más abundante de la corteza terrestre. Fue más valioso que el oro hasta que se inventó la electrolisis en 1886.',['Envases (latas, papel aluminio)','Aeronáutica y automoción','Ventanas y fachadas','Líneas eléctricas de alta tensión']],
  [14,'Si','Silicio','28.09','metaloide',14,3,'El segundo elemento más abundante de la corteza terrestre. Su nombre viene del latín "silex" (sílex, pedernal).',['Chips y semiconductores','Paneles solares','Vidrio y cerámica','Siliconas (sellantes, prótesis)']],
  [15,'P','Fósforo','30.97','no-metal',15,3,'Descubierto en 1669 por un alquimista que buscaba oro en la orina humana. Su nombre viene del griego "phosphoros" (portador de luz).',['Fertilizantes agrícolas','Fósforos y encendedores','Detergentes','ADN y huesos (fosfato de calcio)']],
  [16,'S','Azufre','32.06','no-metal',16,3,'Conocido desde la antigüedad como "piedra ardiente". Se menciona en la Biblia. El olor del huevo podrido es sulfuro de hidrógeno.',['Ácido sulfúrico (el químico más producido)','Vulcanización del caucho','Fungicidas agrícolas','Fabricación de papel']],
  [17,'Cl','Cloro','35.45','halogeno',17,3,'Su nombre viene del griego "chloros" (verde amarillento). Gas tóxico pero en forma de cloruro es esencial para la vida.',['Desinfección del agua potable','PVC (tuberías, ventanas)','Blanqueantes (lejía)','Farmacéutica']],
  [18,'Ar','Argón','39.95','gas-noble',18,3,'El tercer gas más abundante en la atmósfera (1%). Su nombre viene del griego "argos" (inactivo, perezoso).',['Bombillas y tubos de luz','Soldadura TIG/MIG (atmósfera inerte)','Conservación de documentos históricos','Doble acristalamiento (ventanas)']],
  [19,'K','Potasio','39.10','metal-alcalino',1,4,'Su símbolo K viene del latín "kalium". Es el séptimo elemento más abundante de la Tierra. Esencial para nervios y músculos.',['Fertilizantes (potasa)','Pólvora y pirotecnia','Sustituto de sal (KCl)','Vidrio especial']],
  [20,'Ca','Calcio','40.08','metal-alcalinoterreo',2,4,'El quinto elemento más abundante de la Tierra. Su nombre viene del latín "calx" (cal). Esencial para huesos y dientes.',['Cemento y construcción (cal)','Suplementos de calcio','Tratamiento del agua','Industria del vidrio']],
  [21,'Sc','Escandio','44.96','metal-transicion',3,4,'Predicho por Mendeleev antes de su descubrimiento. Su nombre viene de Escandinavia.',['Aleaciones de aluminio-escandio (bates de béisbol, bicicletas)','Lámparas de halogenuros metálicos','Investigación aeroespacial']],
  [22,'Ti','Titanio','47.87','metal-transicion',4,4,'Llamado así por los Titanes de la mitología griega. Tan fuerte como el acero pero 45% más ligero.',['Implantes dentales y quirúrgicos','Aeronáutica (aviones, cohetes)','Pigmento blanco (pintura, protector solar)','Joyería y deportes de élite']],
  [23,'V','Vanadio','50.94','metal-transicion',5,4,'Descubierto en México. Su nombre viene de "Vanadís", nombre nórdico de la diosa Freya.',['Aceros especiales (herramientas, cuchillos)','Catalizador en fabricación de ácido sulfúrico','Baterías de flujo vanadio']],
  [24,'Cr','Cromo','52.00','metal-transicion',6,4,'Su nombre viene del griego "chroma" (color) porque sus compuestos son muy coloridos. El que hace brillar el rubí es el cromo.',['Acero inoxidable','Cromado decorativo y anticorrosión','Pigmentos (verde cromo, amarillo cromo)','Cuero curtido']],
  [25,'Mn','Manganeso','54.94','metal-transicion',7,4,'Su nombre viene del latín "magnes" (imán). Esencial para la fotosíntesis en plantas.',['Acero (la mayor producción mundial)','Pilas secas','Fertilizantes y nutrición animal','Colorante del vidrio (violeta)']],
  [26,'Fe','Hierro','55.85','metal-transicion',8,4,'El elemento más abundante de la Tierra (por masa total). Su símbolo Fe viene del latín "ferrum". Base de la civilización.',['Acero para construcción y vehículos','Hemoglobina (transporta oxígeno en sangre)','Maquinaria industrial','Electroimanes']],
  [27,'Co','Cobalto','58.93','metal-transicion',9,4,'Su nombre viene del alemán "Kobold" (duende), porque los mineros creían que los demonios habían contaminado sus minerales.',['Baterías de litio (smartphones y coches)','Pigmento azul (azul cobalto)','Aleaciones para motores de avión','Imanes permanentes']],
  [28,'Ni','Níquel','58.69','metal-transicion',10,4,'Su nombre viene del alemán "Nickel" (diablo de las minas). Los vikingos lo usaban sin saber qué era.',['Acero inoxidable','Monedas','Baterías recargables (Ni-MH)','Recubrimientos anticorrosión']],
  [29,'Cu','Cobre','63.55','metal-transicion',11,4,'Uno de los primeros metales usados por el hombre (edad del cobre, 5000 a.C.). Su símbolo Cu viene del latín "cuprum" (Chipre).',['Cables eléctricos (el mejor conductor práctico)','Tuberías de agua','Monedas','Antiinfecciosos y antifúngicos']],
  [30,'Zn','Zinc','65.38','metal-transicion',12,4,'Conocido en la India desde 1300 a.C. Su nombre podría venir de "Zinke" (púa) por su forma cristalina puntiaguda.',['Galvanizado del acero (anticorrosión)','Pilas secas (zinc-carbono)','Suplementos nutricionales','Protector solar (óxido de zinc)']],
  [31,'Ga','Galio','69.72','metal-postransicion',13,4,'Predicho por Mendeleev. Se derrite en la palma de la mano (29.8°C). Su nombre viene de "Gallia" (Francia).',['LEDs y pantallas OLED','Semiconductores GaAs para móviles','Termómetros de alta precisión','Paneles solares de alta eficiencia']],
  [32,'Ge','Germanio','72.63','metaloide',14,4,'Fue el primer elemento predicho y luego descubierto confirmando la tabla de Mendeleev. Su nombre viene de "Germania" (Alemania).',['Fibras ópticas','Infrarrojo (cámaras térmicas, visión nocturna)','Semiconductores','Catalizadores PET (botellas de plástico)']],
  [33,'As','Arsénico','74.92','metaloide',15,4,'Conocido en la antigüedad como veneno favorito de la realeza. Su nombre viene del griego "arsenikon" (viril, potente).',['Semiconductores de arseniuro de galio','Insecticidas y herbicidas (regulado)','Preservación de madera','Aleaciones para baterías de plomo']],
  [34,'Se','Selenio','78.96','no-metal',16,4,'Su nombre viene de "Selene" (diosa de la Luna en griego). Fue llamado así porque siempre aparecía con telurio (Tierra).',['Fotocopiadoras (fotoconductor)','Vidrio y cerámicas (color rojo-naranja)','Suplemento nutricional antioxidante','Células solares']],
  [35,'Br','Bromo','79.90','halogeno',17,4,'Uno de los dos únicos elementos líquidos a temperatura ambiente. Su nombre viene del griego "bromos" (hedor).',['Retardantes de llama (electrónica, tejidos)','Desinfectantes de piscinas','Fotografía analógica','Agentes sedantes (históricamente)']],
  [36,'Kr','Kriptón','83.80','gas-noble',18,4,'Su nombre viene del griego "kryptos" (oculto), el mismo origen que "cripta". Se descubrió tardíamente por ser tan escaso.',['Lámparas de flash fotográfico','Láseres de kriptón','Iluminación de pistas de aterrizaje','Ventanas de triple cristal']],
  [37,'Rb','Rubidio','85.47','metal-alcalino',1,5,'Su nombre viene del latín "rubidus" (rojo oscuro) por las líneas rojas de su espectro. Fue descubierto con el espectroscopio.',['Relojes atómicos (muy precisos)','Células fotoeléctricas','Investigación en física cuántica','Fireworks (color violeta)']],
  [38,'Sr','Estroncio','87.62','metal-alcalinoterreo',2,5,'Su nombre viene de Strontian, un pueblo de Escocia. El isótopo Sr-90 es un peligroso residuo nuclear.',['Fuegos artificiales (color rojo brillante)','Imanes de ferrita (altavoces, motores)','Tratamiento de osteoporosis','Refinado del azúcar de remolacha']],
  [39,'Y','Itrio','88.91','metal-transicion',3,5,'Nombrado por Ytterby, un pueblo sueco donde se descubrieron varios elementos nuevos.',['LEDs blancos (fósforo de itrio)','Superconductores de alta temperatura','Láseres YAG (cirugía, corte industrial)','Cerámicas de alta temperatura']],
  [40,'Zr','Circonio','91.22','metal-transicion',4,5,'Su nombre viene del árabe "zarkun" (bermellón). La gema circón contiene circonio. Muy resistente a la corrosión.',['Revestimiento de barras de combustible nuclear','Cerámica dental (coronas)','Cuchillos de cerámica','Catalizadores industriales']],
  [41,'Nb','Niobio','92.91','metal-transicion',5,5,'Nombrado por Níobe, hija de Tántalo (su mineral siempre aparecía con tántalo). Es un metal superconductor.',['Acero microaleado (construcción, tuberías)','Imanes superconductores (MRI, LHC)','Joyería hipoalergénica','Turbinas de gas']],
  [42,'Mo','Molibdeno','95.96','metal-transicion',6,5,'Su nombre viene del griego "molybdos" (plomo). Punto de fusión altísimo (2623°C). Esencial para muchas enzimas.',['Acero para herramientas de alta velocidad','Lubricante sólido (disulfuro de molibdeno)','Catalizadores de refinería de petróleo','Fertilizantes (micronutriente)']],
  [43,'Tc','Tecnecio','98.00','metal-transicion',7,5,'El primer elemento sintético de la tabla. Su nombre viene del griego "tekhnetos" (artificial). No existe en la naturaleza.',['Medicina nuclear (diagnóstico por imagen)','Investigación en reactividad de metales']],
  [44,'Ru','Rutenio','101.1','metal-transicion',8,5,'Su nombre viene del latín "Ruthenia" (Rusia). Es uno de los metales del platino. Muy duro y resistente.',['Contactos eléctricos resistentes','Catalizadores para celdas de combustible','Discos duros (capa ultrafina)','Joyería de platino reforzada']],
  [45,'Rh','Rodio','102.9','metal-transicion',9,5,'El metal más caro del mundo. Su nombre viene del griego "rhodon" (rosa) por el color de sus sales.',['Catalizadores de convertidores catalíticos (coches)','Espejos y reflectores de alta precisión','Joyería (chapado en rodio)','Termocoplas de alta temperatura']],
  [46,'Pd','Paladio','106.4','metal-transicion',10,5,'Nombrado por el asteroide Palas. Es el metal del platino más reactivo y tiene afinidad por el hidrógeno.',['Catalizadores de convertidores catalíticos','Electrónica (condensadores multicapa)','Joyería (oro blanco)','Catálisis en síntesis farmacéutica']],
  [47,'Ag','Plata','107.9','metal-transicion',11,5,'Su símbolo Ag viene del latín "argentum". Es el mejor conductor eléctrico y térmico de todos los elementos.',['Joyería y cubertería','Contactos eléctricos y electrónica','Fotografía analógica (haluros de plata)','Antibacteriano (cremas, apósitos)']],
  [48,'Cd','Cadmio','112.4','metal-transicion',12,5,'Su nombre viene del latín "cadmia" (calamina). Es tóxico y cancerígeno, pero tiene propiedades técnicas únicas.',['Baterías recargables Ni-Cd (en retirada)','Pigmentos amarillos y rojos (arte)','Protección anticorrosión de acero','Barras de control en reactores nucleares']],
  [49,'In','Indio','114.8','metal-postransicion',13,5,'Su nombre viene del griego "indikon" (índigo) por sus líneas espectrales de color índigo.',['Pantallas táctiles (ITO - óxido de indio y estaño)','Soldaduras y aleaciones de baja fusión','Semiconductores de alta velocidad','Revestimientos de cojinetes']],
  [50,'Sn','Estaño','118.7','metal-postransicion',14,5,'Su símbolo Sn viene del latín "stannum". Junto con el cobre forma el bronce. Conocido desde hace 5500 años.',['Hojalata (envases de alimentos)','Soldadura electrónica','Vidrio plano (proceso float)','Órganos de iglesias (aleación con plomo)']],
  [51,'Sb','Antimonio','121.8','metaloide',15,5,'Su símbolo Sb viene del latín "stibium". Conocido en el Antiguo Egipto como kohl para los ojos.',['Retardantes de llama (plásticos, textiles)','Aleaciones duras para baterías de plomo','Semiconductores','Munición (aleación con plomo)']],
  [52,'Te','Telurio','127.6','metaloide',16,5,'Su nombre viene del latín "tellus" (Tierra). Es uno de los elementos más escasos de la corteza terrestre.',['Células solares de telururo de cadmio','Aleaciones de acero mecanizable','Discos ópticos (CD regrabables)','Películas termocromáticas']],
  [53,'I','Yodo','126.9','halogeno',17,5,'Su nombre viene del griego "ioeides" (violeta). El cuerpo humano necesita yodo para producir hormonas tiroideas.',['Desinfectante (tintura de yodo, betadine)','Suplemento en sal yodada','Medicina nuclear (contraste y terapia)','Catalizadores en síntesis orgánica']],
  [54,'Xe','Xenón','131.3','gas-noble',18,5,'Su nombre viene del griego "xenos" (extraño). Gas noble que puede formar algunos compuestos, rompiendo el mito de inercia total.',['Faros de xenón (HID) en coches','Propulsor iónico de satélites','Anestesia general (experimental)','Láseres de excímeros (cirugía ocular LASIK)']],
  [55,'Cs','Cesio','132.9','metal-alcalino',1,6,'Su nombre viene del latín "caesius" (azul cielo) por su espectro. Es el metal más electropostivo y reacciona explosivamente con agua.',['Relojes atómicos (el patrón mundial de tiempo)','Células fotoeléctricas','Perforación de pozos petrolíferos','Investigación en física cuántica']],
  [56,'Ba','Bario','137.3','metal-alcalinoterreo',2,6,'Su nombre viene del griego "barys" (pesado) porque su mineral (barita) es muy denso.',['Papilla de bario (radiografía gastrointestinal)','Barita para lodos de perforación petrolífera','Fireworks (color verde)','Vidrios especiales y cerámica']],
  [57,'La','Lantano','138.9','lantanido',3,6,'Da nombre al grupo de los lantánidos. Su nombre viene del griego "lanthanein" (estar oculto, pasar inadvertido).',['Óptica (vidrios de alta refracción)','Catalizadores de refinería de petróleo (FCC)','Electrodos de baterías de hidruro metálico','Vidrio de cámara (lentes)']],
  [58,'Ce','Cerio','140.1','lantanido',4,6,'Nombrado por el asteroide Ceres. Es el lantánido más abundante y más barato.',['Catalizadores de convertidores catalíticos','Vidrios de autolave (descoloran al sol)','Ceración de acero inoxidable','Óxido de cerio para pulir vidrio']],
  [59,'Pr','Praseodimio','140.9','lantanido',5,6,'Su nombre viene del griego "prasios didymos" (gemelo verde). Produce un color verde brillante en vidrios.',['Imanes permanentes NdFeB (con neodimio)','Vidrios de soldar (protegen los ojos)','Fibras ópticas dopadas','Catalizadores']],
  [60,'Nd','Neodimio','144.2','lantanido',6,6,'Su nombre viene del griego "neos didymos" (nuevo gemelo). Sus imanes son los más potentes del mundo.',['Imanes de neodimio (turbinas eólicas, auriculares, motores)','Láseres Nd:YAG (médico e industrial)','Micrófonos y altavoces','Vehículos eléctricos']],
  [61,'Pm','Prometio','145','lantanido',7,6,'Nombrado por Prometeo (que robó el fuego). No existe en la naturaleza: todos sus isótopos son radiactivos.',['Marcapasos (baterías nucleares, descatalogado)','Instrumentos de medición de espesores','Investigación']],
  [62,'Sm','Samario','150.4','lantanido',8,6,'Nombrado por el mineral samarsquita (en honor al coronel Samarski). Fue el primer elemento nombrado por una persona real.',['Imanes Sm-Co para altas temperaturas (turbinas, motores aeroespaciales)','Tratamiento del dolor óseo (radiactivo)','Neutrones en reactores nucleares']],
  [63,'Eu','Europio','152.0','lantanido',9,6,'Nombrado por Europa. Produce fluorescencia roja y azul brillante y se usa como detector de falsificaciones.',['Billetes de euro (fluorescencia anti-falsificación)','Pantallas de televisión (rojo brillante)','LEDs de luz blanca cálida','Investigación cuántica']],
  [64,'Gd','Gadolinio','157.3','lantanido',10,6,'Nombrado por Johann Gadolin, químico finlandés. Tiene propiedades magnéticas extraordinarias a bajas temperaturas.',['Contraste en resonancias magnéticas (MRI)','Barras de control en reactores nucleares','Sensores magnéticos','Pantallas de alta resolución']],
  [65,'Tb','Terbio','158.9','lantanido',11,6,'Nombrado por Ytterby, igual que el itrio. Es uno de los cuatro elementos con ese honor.',['Pantallas de TV y monitores (color verde)','Lámparas de ahorro energético','Aleaciones magnetostrictivas (sonares)','Láseres de estado sólido']],
  [66,'Dy','Disprosio','162.5','lantanido',12,6,'Su nombre viene del griego "dysprositos" (difícil de obtener). Tiene el mayor potencial magnético a temperatura ambiente.',['Imanes de neodimio mejorados para altas temperaturas','Motores de vehículos eléctricos','Dosimetría de radiación nuclear','Láseres']],
  [67,'Ho','Holmio','164.9','lantanido',13,6,'Nombrado por Holmia, nombre latino de Estocolmo. Tiene las propiedades magnéticas más altas de los elementos.',['Imanes para MRI de campo muy alto','Láseres Ho:YAG (cirugía mínimamente invasiva)','Colorante de vidrio y cerámica','Investigación de materiales']],
  [68,'Er','Erbio','167.3','lantanido',14,6,'Otro elemento de Ytterby. Su nombre completo es erbio, por Ytterby.',['Amplificadores de fibra óptica EDFA (internet de banda ancha)','Láseres médicos Er:YAG (dermatología, odontología)','Vidrios rosas y violetas','Metalurgia del vanadio']],
  [69,'Tm','Tulio','168.9','lantanido',15,6,'Nombrado por "Thule", nombre antiguo de Escandinavia. Es el lantánido más raro y caro de los estables.',['Fuentes portátiles de rayos X (diagnóstico médico)','Láseres de estado sólido (2 micrómetros)','Investigación']],
  [70,'Yb','Iterbio','173.0','lantanido',16,6,'El cuarto elemento nombrado por Ytterby. Tiene un isótopo que actúa como el reloj atómico más preciso del mundo.',['Relojes atómicos ópticos (precisión extrema)','Aleaciones de acero inoxidable','Amplificadores de fibra óptica','Investigación cuántica']],
  [71,'Lu','Lutecio','175.0','lantanido',17,6,'Su nombre viene de "Lutetia", nombre latino de París. Último y más denso de los lantánidos.',['Catalizadores de polimerización (plásticos)','PET escáneres (medicina nuclear)','Láseres','Investigación de altas energías']],
  [72,'Hf','Hafnio','178.5','metal-transicion',4,6,'Su nombre viene de "Hafnia", nombre latino de Copenhague. Siempre aparece con el circonio y fue difícil separarlo.',['Barras de control en reactores nucleares','Chips de computadora (dieléctrico de alta-k)','Aleaciones para motores de cohetes','Filamentos de lámpara incandescente']],
  [73,'Ta','Tántalo','180.9','metal-transicion',5,6,'Nombrado por Tántalo (mitología griega). No reacciona con los ácidos del cuerpo, por eso es ideal para implantes.',['Condensadores electrolíticos (smartphones, ordenadores)','Implantes ortopédicos y dentales','Equipos resistentes a ácidos','Cuchillas quirúrgicas']],
  [74,'W','Wolframio','183.8','metal-transicion',6,6,'El único elemento con símbolo W (de Wolfram, nombre alemán). Tiene el punto de fusión más alto de todos los elementos (3422°C).',['Filamentos de bombilla incandescente','Herramientas de corte de carburo de tungsteno','Electrodos de soldadura TIG','Contrapesos y blindaje de radiación']],
  [75,'Re','Renio','186.2','metal-transicion',7,6,'Uno de los últimos elementos estables descubiertos (1925). Su nombre viene del latín "Rhenus" (río Rin).',['Aleaciones de superaleaciones para turbinas de avión','Catalizadores de reformado de gasolina (sin plomo)','Filamentos de espectrometría de masas','Electrodos de alta temperatura']],
  [76,'Os','Osmio','190.2','metal-transicion',8,6,'El elemento más denso de la tabla periódica. Su nombre viene del griego "osme" (olor) por su tetróxido que huele a ozono.',['Aleaciones duras (plumas de pluma estilográfica)','Catalizador en síntesis orgánica','Pigmento para tinción histológica','Rodamientos de alta precisión']],
  [77,'Ir','Iridio','192.2','metal-transicion',9,6,'El segundo elemento más denso. Su nombre viene de Iris (diosa del arco iris) por sus compuestos multicolores.',['Punta de bolígrafos y plumas estilográficas','Electrodos de bujías de alto rendimiento','OLED (emisores fosforescentes)','Crisoles y equipos de alta temperatura']],
  [78,'Pt','Platino','195.1','metal-transicion',10,6,'Su nombre viene del español "platina" (platita). Fue considerado inferior a la plata por los conquistadores españoles.',['Joyería de lujo','Catalizadores de convertidores catalíticos','Electrodos para implantes médicos (marcapasos)','Catálisis en síntesis de ácido nítrico']],
  [79,'Au','Oro','197.0','metal-transicion',11,6,'El primer metal conocido por el hombre. Su símbolo Au viene del latín "aurum". No se oxida ni corroe jamás.',['Joyería y reserva de valor','Contactos eléctricos en electrónica de precisión','Medicina (tratamiento artritis, cáncer)','Revestimiento de viseras espaciales']],
  [80,'Hg','Mercurio','200.6','metal-transicion',12,6,'El único metal líquido a temperatura ambiente. Su símbolo Hg viene del latín "hydrargyrum" (plata líquida).',['Termómetros y barómetros (en retirada por toxicidad)','Lámparas fluorescentes','Amalgamas dentales (en retirada)','Interruptores de mercurio']],
  [81,'Tl','Talio','204.4','metal-postransicion',13,6,'Su nombre viene del griego "thallos" (brote verde) por su espectro. Fue el veneno favorito de Agatha Christie.',['Detectores de infrarrojos','Cristales para óptica de infrarrojos','Tratamiento de tiña (obsoleto)','Investigación médica']],
  [82,'Pb','Plomo','207.2','metal-postransicion',14,6,'Su símbolo Pb viene del latín "plumbum". Conocido desde 7000 a.C. Las tuberías romanas eran de plomo (plumbum → plomero).',['Baterías de ácido-plomo (coches)','Blindaje contra radiación','Munición','Pesas y lastre']],
  [83,'Bi','Bismuto','208.9','metal-postransicion',15,6,'El elemento más pesado con isótopos estables. Su nombre podría venir del árabe "bi ismid" (similar al antimonio).',['Pepto-Bismol (antiácido y antidiarreico)','Aleaciones de baja fusión (fusibles, soldaduras)','Pigmentos cosméticos (labiales)','Sustituto del plomo en munición']],
  [84,'Po','Polonio','209','metaloide',16,6,'Descubierto por Marie Curie y nombrado por su Polonia natal. Intensamente radiactivo.',['Eliminación de electricidad estática en industria','Fuentes de calor en sondas espaciales (pequeñas)','Investigación']],
  [85,'At','Ástato','210','halogeno',17,6,'El elemento natural más escaso de la Tierra (menos de 30g en la corteza terrestre). Su nombre viene del griego "astatos" (inestable).',['Investigación de terapia de cáncer (At-211)','Investigación básica']],
  [86,'Rn','Radón','222','gas-noble',18,6,'Gas radiactivo que se produce naturalmente en el suelo. Es la segunda causa de cáncer de pulmón después del tabaco.',['Detección de terremotos (como indicador)','Radioterapia histórica (obsoleto)','Investigación geológica']],
  [87,'Fr','Francio','223','metal-alcalino',1,7,'El segundo elemento más escaso de la Tierra (solo 20-30g en la corteza). Su nombre viene de Francia.',['Investigación básica en física atómica']],
  [88,'Ra','Radio','226','metal-alcalinoterreo',2,7,'Descubierto por Marie y Pierre Curie en 1898. Su nombre viene del latín "radius" (rayo). Fue usado en pintura luminiscente.',['Radioterapia del cáncer (histórico)','Números luminiscentes de relojes (hasta 1960s)','Investigación nuclear']],
  [89,'Ac','Actinio','227','actinido',3,7,'Primer elemento de los actínidos. Su nombre viene del griego "aktis" (rayo). Intensamente radiactivo.',['Generador de Ac-225 para terapia de cáncer','Investigación nuclear']],
  [90,'Th','Torio','232.0','actinido',4,7,'Nombrado por Thor (dios nórdico). Cuatro veces más abundante que el uranio. Posible combustible nuclear del futuro.',['Mantos de gas (lámparas)','Vidrios de alta refracción para cámaras','Reactores nucleares de torio (investigación)','Electrodos de soldadura TIG']],
  [91,'Pa','Protactinio','231.0','actinido',5,7,'Su nombre viene del griego "protos" (primero) + actinio, porque se desintegra en actinio. Muy raro y costoso.',['Investigación nuclear básica']],
  [92,'U','Uranio','238.0','actinido',6,7,'El elemento más pesado con abundancia natural significativa. Descubierto en 1789 y nombrado por el planeta Urano.',['Combustible de reactores nucleares','Cabezas de proyectiles perforantes (uranio empobrecido)','Vidrio de uranio (fluorescente bajo UV)','Investigación nuclear']],
  [93,'Np','Neptunio','237','actinido',7,7,'Primer elemento transuránico artificial. Nombrado por Neptuno (planeta detrás de Urano, como él está detrás del uranio).',['Detectores de neutrones de alta energía','Investigación nuclear']],
  [94,'Pu','Plutonio','244','actinido',8,7,'Nombrado por Plutón. Es el combustible de las bombas de fisión. Extremadamente tóxico y radiactivo.',['Combustible nuclear (reactores de neutrones rápidos)','Generadores RTG (sondas espaciales Voyager, Curiosity)','Armas nucleares (historia)']],
  [95,'Am','Americio','243','actinido',9,7,'Nombrado por América. Se produce en reactores nucleares. Es el elemento transuránico más "doméstico".',['Detectores de humo (Am-241) — está en tu casa','Medidores de espesor industriales','Investigación']],
  [96,'Cm','Curio','247','actinido',10,7,'Nombrado en honor a Marie y Pierre Curie. Se produce bombardeando plutonio con partículas alfa.',['Generadores RTG en sondas espaciales','Espectrómetros de rayos X en exploración planetaria (Marte)','Investigación']],
  [97,'Bk','Berkelio','247','actinido',11,7,'Nombrado por Berkeley, California, donde fue sintetizado. Solo se han producido nanogramos.',['Investigación de elementos superheavy','Síntesis de elementos más pesados (tennesino)']],
  [98,'Cf','Californio','251','actinido',12,7,'Nombrado por California. Es una de las fuentes de neutrones más intensas por gramo.',['Arranque de reactores nucleares','Tratamiento de tumores de cuello','Detectores de oro y plata en minería']],
  [99,'Es','Einstenio','252','actinido',13,7,'Descubierto en los restos de la primera explosión de bomba de hidrógeno (1952). Nombrado por Albert Einstein.',['Investigación básica','Síntesis de otros elementos transuránico']],
  [100,'Fm','Fermio','257','actinido',14,7,'Descubierto también en la primera explosión termonuclear. Nombrado por Enrico Fermi.',['Solo investigación básica']],
  [101,'Md','Mendelevio','258','actinido',15,7,'Nombrado por Dmitri Mendeléiev, creador de la tabla periódica. Fue el primer elemento en ser sintetizado de uno en uno.',['Solo investigación básica']],
  [102,'No','Nobelio','259','actinido',16,7,'Nombrado por Alfred Nobel. Hubo controversia entre laboratorios de distintos países por su descubrimiento.',['Solo investigación básica']],
  [103,'Lr','Laurencio','266','actinido',17,7,'Nombrado por Ernest Lawrence, inventor del ciclotrón. El último de los actínidos.',['Solo investigación básica']],
  [104,'Rf','Rutherfordio','267','metal-transicion',4,7,'Nombrado por Ernest Rutherford. Primer elemento del período 7 de metales de transición.',['Solo investigación (vidas medias de segundos)']],
  [105,'Db','Dubnio','268','metal-transicion',5,7,'Nombrado por Dubna, ciudad rusa del Instituto Nuclear. Su símbolo viene de "Dubnium".',['Solo investigación']],
  [106,'Sg','Seaborgio','269','metal-transicion',6,7,'Nombrado por Glenn Seaborg, el químico que descubrió más elementos que ninguna otra persona.',['Solo investigación']],
  [107,'Bh','Bohrio','270','metal-transicion',7,7,'Nombrado por Niels Bohr, el físico danés padre de la mecánica cuántica.',['Solo investigación']],
  [108,'Hs','Hassio','277','metal-transicion',8,7,'Nombrado por Hesse (Hassias en latín), estado alemán donde está el GSI, laboratorio que lo sintetizó.',['Solo investigación']],
  [109,'Mt','Meitnerio','278','metal-transicion',9,7,'Nombrado por Lise Meitner, física que co-descubrió la fisión nuclear pero nunca recibió el Nobel.',['Solo investigación']],
  [110,'Ds','Darmstadtio','281','metal-transicion',10,7,'Nombrado por Darmstadt, ciudad alemana del GSI.',['Solo investigación']],
  [111,'Rg','Roentgenio','282','metal-transicion',11,7,'Nombrado por Wilhelm Röntgen, descubridor de los rayos X.',['Solo investigación']],
  [112,'Cn','Copernicio','285','metal-transicion',12,7,'Nombrado por Nicolás Copérnico, astrónomo que demostró que la Tierra gira alrededor del Sol.',['Solo investigación']],
  [113,'Nh','Nihonio','286','metal-postransicion',13,7,'Primer elemento descubierto en Asia (Japón). Su nombre viene de "Nihon" (Japón en japonés).',['Solo investigación']],
  [114,'Fl','Flerovio','289','metal-postransicion',14,7,'Nombrado por el Laboratorio Flerov, a su vez nombrado por el físico Flerov que cofundó el programa nuclear soviético.',['Solo investigación']],
  [115,'Mc','Moscovio','290','metal-postransicion',15,7,'Nombrado por Moscú (región de Moscovia), donde está el laboratorio que lo sintetizó.',['Solo investigación']],
  [116,'Lv','Livermorio','293','metal-postransicion',16,7,'Nombrado por el Laboratorio Nacional Lawrence Livermore (California).',['Solo investigación']],
  [117,'Ts','Teneso','294','halogeno',17,7,'Nombrado por Tennessee, estado donde está el laboratorio Oak Ridge que contribuyó a su síntesis.',['Solo investigación']],
  [118,'Og','Oganesón','294','gas-noble',18,7,'El elemento más pesado conocido. Nombrado por Yuri Oganessian, físico nuclear ruso aún vivo.',['Solo investigación']],
];

// Extra data: [shells[], electronegativity (Pauling, null if N/A)]
// shells = electrons per shell K,L,M,N,O,P,Q
const EXTRA = {
  1:  [[1],           2.20],
  2:  [[2],           null],
  3:  [[2,1],         0.98],
  4:  [[2,2],         1.57],
  5:  [[2,3],         2.04],
  6:  [[2,4],         2.55],
  7:  [[2,5],         3.04],
  8:  [[2,6],         3.44],
  9:  [[2,7],         3.98],
  10: [[2,8],         null],
  11: [[2,8,1],       0.93],
  12: [[2,8,2],       1.31],
  13: [[2,8,3],       1.61],
  14: [[2,8,4],       1.90],
  15: [[2,8,5],       2.19],
  16: [[2,8,6],       2.58],
  17: [[2,8,7],       3.16],
  18: [[2,8,8],       null],
  19: [[2,8,8,1],     0.82],
  20: [[2,8,8,2],     1.00],
  21: [[2,8,9,2],     1.36],
  22: [[2,8,10,2],    1.54],
  23: [[2,8,11,2],    1.63],
  24: [[2,8,13,1],    1.66],
  25: [[2,8,13,2],    1.55],
  26: [[2,8,14,2],    1.83],
  27: [[2,8,15,2],    1.88],
  28: [[2,8,16,2],    1.91],
  29: [[2,8,18,1],    1.90],
  30: [[2,8,18,2],    1.65],
  31: [[2,8,18,3],    1.81],
  32: [[2,8,18,4],    2.01],
  33: [[2,8,18,5],    2.18],
  34: [[2,8,18,6],    2.55],
  35: [[2,8,18,7],    2.96],
  36: [[2,8,18,8],    3.00],
  37: [[2,8,18,8,1],  0.82],
  38: [[2,8,18,8,2],  0.95],
  39: [[2,8,18,9,2],  1.22],
  40: [[2,8,18,10,2], 1.33],
  41: [[2,8,18,12,1], 1.6],
  42: [[2,8,18,13,1], 2.16],
  43: [[2,8,18,13,2], 1.9],
  44: [[2,8,18,15,1], 2.2],
  45: [[2,8,18,16,1], 2.28],
  46: [[2,8,18,18,0], 2.20],
  47: [[2,8,18,18,1], 1.93],
  48: [[2,8,18,18,2], 1.69],
  49: [[2,8,18,18,3], 1.78],
  50: [[2,8,18,18,4], 1.96],
  51: [[2,8,18,18,5], 2.05],
  52: [[2,8,18,18,6], 2.1],
  53: [[2,8,18,18,7], 2.66],
  54: [[2,8,18,18,8], 2.6],
  55: [[2,8,18,18,8,1], 0.79],
  56: [[2,8,18,18,8,2], 0.89],
  57: [[2,8,18,18,9,2], 1.10],
  58: [[2,8,18,19,9,2], 1.12],
  59: [[2,8,18,21,8,2], 1.13],
  60: [[2,8,18,22,8,2], 1.14],
  61: [[2,8,18,23,8,2], 1.13],
  62: [[2,8,18,24,8,2], 1.17],
  63: [[2,8,18,25,8,2], 1.20],
  64: [[2,8,18,25,9,2], 1.20],
  65: [[2,8,18,27,8,2], 1.10],
  66: [[2,8,18,28,8,2], 1.22],
  67: [[2,8,18,29,8,2], 1.23],
  68: [[2,8,18,30,8,2], 1.24],
  69: [[2,8,18,31,8,2], 1.25],
  70: [[2,8,18,32,8,2], 1.10],
  71: [[2,8,18,32,9,2], 1.27],
  72: [[2,8,18,32,10,2],1.3],
  73: [[2,8,18,32,11,2],1.5],
  74: [[2,8,18,32,12,2],2.36],
  75: [[2,8,18,32,13,2],1.9],
  76: [[2,8,18,32,14,2],2.2],
  77: [[2,8,18,32,15,2],2.2],
  78: [[2,8,18,32,17,1],2.28],
  79: [[2,8,18,32,18,1],2.54],
  80: [[2,8,18,32,18,2],2.0],
  81: [[2,8,18,32,18,3],1.62],
  82: [[2,8,18,32,18,4],2.33],
  83: [[2,8,18,32,18,5],2.02],
  84: [[2,8,18,32,18,6],2.0],
  85: [[2,8,18,32,18,7],2.2],
  86: [[2,8,18,32,18,8],null],
  87: [[2,8,18,32,18,8,1],0.7],
  88: [[2,8,18,32,18,8,2],0.9],
  89: [[2,8,18,32,18,9,2],1.1],
  90: [[2,8,18,32,18,10,2],1.3],
  91: [[2,8,18,32,20,9,2],1.5],
  92: [[2,8,18,32,21,9,2],1.38],
  93: [[2,8,18,32,22,9,2],1.36],
  94: [[2,8,18,32,24,8,2],1.28],
  95: [[2,8,18,32,25,8,2],1.13],
  96: [[2,8,18,32,25,9,2],1.28],
  97: [[2,8,18,32,26,9,2],1.3],
  98: [[2,8,18,32,28,8,2],1.3],
  99: [[2,8,18,32,29,8,2],1.3],
  100:[[2,8,18,32,30,8,2],1.3],
  101:[[2,8,18,32,31,8,2],1.3],
  102:[[2,8,18,32,32,8,2],1.3],
  103:[[2,8,18,32,32,9,2],1.3],
};
// Default for superheavy elements
for(let i=104;i<=118;i++) EXTRA[i] = [[2,8,18,32,32,10,2], null];

// ── Estados de oxidacion ─────────────────────────────────────────────────
// Solo los estados usados con frecuencia en libros ESO/bachiller para
// formular. El primero de la lista es el mas comun (lo usa el modo tabla).
// Gases nobles y sinteticos: null. Numeros con signo, sin ceros.
// OXID_BASE es el default inmutable; OXID es la copia activa que se puede
// sobreescribir con el YAML del usuario (modal "Editar oxidacion").
const OXID_BASE = {
  1:  [+1, -1],
  2:  null,
  3:  [+1],
  4:  [+2],
  5:  [+3],
  6:  [+4, +2, -4],
  7:  [-3, +3, +5],
  8:  [-2],
  9:  [-1],
  10: null,
  11: [+1],
  12: [+2],
  13: [+3],
  14: [+4, -4],
  15: [-3, +3, +5],
  16: [-2, +4, +6],
  17: [-1, +1, +3, +5, +7],
  18: null,
  19: [+1],
  20: [+2],
  21: [+3],
  22: [+4, +3, +2],
  23: [+5, +4, +3, +2],
  24: [+3, +6, +2],
  25: [+2, +4, +7],
  26: [+3, +2],
  27: [+2, +3],
  28: [+2, +3],
  29: [+2, +1],
  30: [+2],
  31: [+3],
  32: [+4, +2],
  33: [-3, +3, +5],
  34: [-2, +4, +6],
  35: [-1, +1, +3, +5, +7],
  36: null,
  37: [+1],
  38: [+2],
  39: [+3],
  40: [+4],
  41: [+5, +3],
  42: [+6, +4, +2],
  43: [+7, +4],
  44: [+3, +4, +8],
  45: [+3],
  46: [+2, +4],
  47: [+1],
  48: [+2],
  49: [+3],
  50: [+4, +2],
  51: [-3, +3, +5],
  52: [-2, +4, +6],
  53: [-1, +1, +3, +5, +7],
  54: null,
  55: [+1],
  56: [+2],
  57: [+3],
  58: [+3, +4],
  59: [+3],
  60: [+3],
  61: [+3],
  62: [+3],
  63: [+3, +2],
  64: [+3],
  65: [+3],
  66: [+3],
  67: [+3],
  68: [+3],
  69: [+3],
  70: [+3, +2],
  71: [+3],
  72: [+4],
  73: [+5],
  74: [+6, +4],
  75: [+7, +4],
  76: [+4, +8],
  77: [+3, +4],
  78: [+2, +4],
  79: [+3, +1],
  80: [+2, +1],
  81: [+1, +3],
  82: [+2, +4],
  83: [+3, +5],
  84: [+4, +2, -2],
  85: [-1, +1, +3, +5, +7],
  86: null,
  87: [+1],
  88: [+2],
  89: [+3],
  90: [+4],
  91: [+5],
  92: [+6, +4],
  93: [+5],
  94: [+4],
  95: [+3],
  96: [+3],
  97: [+3],
  98: [+3],
  99: [+3],
  100:[+3],
  101:[+3],
  102:[+3],
  103:[+3],
};
// Sinteticos (>=104): sin dato
for(let i=104;i<=118;i++) OXID_BASE[i] = null;

// Mapas derivados
const elMap = {};
ELEMENTS.forEach(e => elMap[e[0]] = e);

const NUM_POR_SIMBOLO = {};
ELEMENTS.forEach(e => NUM_POR_SIMBOLO[e[1]] = e[0]);

// Dataset activo (mutable). Las herramientas leen SIEMPRE desde OXID,
// nunca desde OXID_BASE: al cargar un YAML propio basta mutar OXID.
function clonarOxid(src) {
  const out = {};
  for (const k in src) out[k] = src[k] == null ? null : [...src[k]];
  return out;
}
let OXID = clonarOxid(OXID_BASE);

// ── YAML del modo Oxidacion ──────────────────────────────────────────────
const OXID_STORAGE_KEY = 'hpk-qui-oxid-yaml';
const OXID_RANGO = [-4, -3, -2, -1, +1, +2, +3, +4, +5, +6, +7, +8];

const OXID_YAML_HEADER = [
  '# Estados de oxidacion por elemento (simbolo: lista).',
  '# El PRIMER valor es el mas comun (determina el color en la tabla).',
  '# Signo + opcional para positivos, - obligatorio para negativos.',
  '# null = sin estado comun (gases nobles, sinteticos).',
  '# Validos entre -4 y +8. Borrar una linea = hereda del default.',
  ''
].join('\n');

// Formateo pedagogico: con minus unicode (U+2212) para la UI.
function fmtEstado(v) { return v > 0 ? '+' + v : String(v).replace('-', '−'); }
// Clave interna con "-" ASCII: la usan los mapas de color y los chips.
function keyEstado(v) { return v > 0 ? '+' + v : String(v); }
// Formateo para el YAML dumpeado al textarea.
function fmtEstadoYaml(v) { return v > 0 ? '+' + v : String(v); }

// Serializa OXID (indexado por numero) a YAML indexado por simbolo.
function oxidADumpYaml(src) {
  const lineas = ['elementos:'];
  for (let n = 1; n <= 118; n++) {
    const sym = elMap[n] ? elMap[n][1] : null;
    if (!sym) continue;
    const estados = src[n];
    const padSym = sym.padEnd(3, ' ');
    if (estados == null) {
      lineas.push(`  ${padSym}: null`);
    } else if (estados.length === 1) {
      lineas.push(`  ${padSym}: ${fmtEstadoYaml(estados[0])}`);
    } else {
      lineas.push(`  ${padSym}: [${estados.map(fmtEstadoYaml).join(', ')}]`);
    }
  }
  return lineas.join('\n');
}

// Quita el ```yaml``` del principio/final si el chatbot lo trae.
function limpiarYamlPegado(txt) {
  return txt
    .replace(/^\s*```(?:yaml|yml)?\s*\n/i, '')
    .replace(/\n```\s*$/i, '')
    .trim();
}

// Parsea y valida un YAML. Devuelve { ok, dict, aciertos, errores, warnings }.
// dict: { numeroAtomico: [estados...] } con solo los simbolos validos.
function parseOxidYaml(txt) {
  const limpio = limpiarYamlPegado(txt);
  if (!limpio) return { ok: false, errores: ['El campo esta vacio.'] };

  let parsed;
  try {
    parsed = jsyaml.load(limpio);
  } catch (e) {
    return { ok: false, errores: ['YAML inviable: ' + e.message] };
  }
  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, errores: ['El YAML no es un diccionario.'] };
  }
  const elementos = parsed.elementos || parsed.elements;
  if (!elementos || typeof elementos !== 'object') {
    return { ok: false, errores: ['Falta la clave "elementos:" con los simbolos.'] };
  }

  const dict = {};
  const aciertos = [];
  const warnings = [];
  for (const sym in elementos) {
    const num = NUM_POR_SIMBOLO[sym];
    if (!num) { warnings.push(`${sym}: simbolo desconocido, ignorado.`); continue; }
    let raw = elementos[sym];
    if (raw == null) { dict[num] = null; aciertos.push(`${sym}: null`); continue; }
    if (typeof raw === 'number' || typeof raw === 'string') raw = [raw];
    if (!Array.isArray(raw)) { warnings.push(`${sym}: valor no es lista ni numero, ignorado.`); continue; }

    const estados = [];
    const malos = [];
    for (const v of raw) {
      const n = typeof v === 'number' ? v : parseInt(String(v).replace(/\s+/g, ''), 10);
      if (!Number.isFinite(n) || !OXID_RANGO.includes(n)) { malos.push(String(v)); continue; }
      if (!estados.includes(n)) estados.push(n);
    }
    if (malos.length) warnings.push(`${sym}: ignorado(s) por fuera de rango -4..+8: ${malos.join(', ')}`);
    if (estados.length === 0 && raw.length > 0) { warnings.push(`${sym}: sin estados validos, ignorado.`); continue; }
    dict[num] = estados.length ? estados : null;
    aciertos.push(`${sym}: ${estados.length ? estados.map(fmtEstadoYaml).join(', ') : 'null'}`);
  }
  if (aciertos.length === 0) {
    return { ok: false, errores: ['Ningun simbolo valido en el YAML.'], warnings };
  }
  return { ok: true, dict, aciertos, warnings };
}

// Cuantos simbolos difieren del BASE en el OXID actual. Lo usan tabla y
// formulador para decidir si pintar el badge "Oxidacion propia cargada".
function contarDiferenciasConBase() {
  let n = 0;
  for (const k in OXID_BASE) {
    const a = OXID[k], b = OXID_BASE[k];
    if (a === b) continue;
    if (a == null || b == null) { n++; continue; }
    if (a.length !== b.length || a.some((v, i) => v !== b[i])) n++;
  }
  return n;
}

// Al cargar la pagina: si hay YAML guardado y valida, mutar OXID. Semantica
// "reset desde BASE + merge": borrar una linea en el YAML equivale a
// restaurar ese elemento al default. Si el YAML esta corrupto, lo borramos
// silenciosamente (no es el momento de molestar al usuario). Si localStorage
// esta bloqueado (modo privado), no pasa nada: OXID se queda como BASE.
(function restaurarYamlGuardado() {
  let guardado = null;
  try { guardado = localStorage.getItem(OXID_STORAGE_KEY); } catch (e) { return; }
  if (!guardado) return;
  const res = parseOxidYaml(guardado);
  if (!res.ok) {
    try { localStorage.removeItem(OXID_STORAGE_KEY); } catch (e) {}
    return;
  }
  OXID = clonarOxid(OXID_BASE);
  for (const num in res.dict) OXID[num] = res.dict[num];
})();

// ── Motor de nomenclatura inorganica ─────────────────────────────────────
// Lo usa el formulador. Puro: no depende del DOM. Lee OXID (dataset activo).

// Prefijos griegos para la nomenclatura sistematica IUPAC 2005.
const PREFIJO_GRIEGO = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca', 'undeca', 'dodeca'];
function prefijoGriego(n) {
  return PREFIJO_GRIEGO[n] || String(n) + '-';
}
// "mono" se omite al principio de palabra (nombre_del_elemento) pero se
// mantiene como "monóxido". Esta funcion devuelve "" para n=1 y el prefijo
// completo en el resto; el llamador decide si incluir "mono" u omitir.
function prefijoGriegoSinMono(n) {
  return n <= 1 ? '' : (PREFIJO_GRIEGO[n] || String(n) + '-');
}

// Prefijo griego antes de "óxido": elide la 'a' u 'o' final para evitar
// hiato ("monoóxido" -> "monóxido", "tetraóxido" -> "tetróxido"). Los
// prefijos "di" y "tri" terminan en 'i' y no eliden.
function prefijoOxido(n) {
  const p = prefijoGriego(n);
  if (!p) return 'ó';  // no deberia pasar en oxidos (siempre hay sub>=1)
  if (/[ao]$/.test(p)) return p.slice(0, -1) + 'ó';
  return p + 'ó';
}

// Numeros romanos del 1 al 8 (los estados de oxidacion maximos en ESO/bach).
function romano(n) {
  const R = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  return R[n] || String(n);
}

// Adjetivos tradicionales en espanol para formar "oxido <adjetivo>". El
// mapa es simbolo -> estado -> adjetivo completo (con tildes). Lo que no
// este en esta tabla cae en el fallback "oxido de <nombre>", que es la
// Stock sin numero romano y sirve para elementos de un solo estado o con
// nomenclatura tradicional en desuso.
//
// Para los halogenos (escala de 4) usamos la regla clasica
// hipo-/-oso/-ico/per- directamente escrita, con tildes donde toca.
const ADJ_TRADICIONAL = {
  // Metales con dos (o mas) estados comunes
  'Fe':  { 2: 'ferroso',     3: 'férrico' },
  'Cu':  { 1: 'cuproso',     2: 'cúprico' },
  'Au':  { 1: 'auroso',      3: 'áurico' },
  'Hg':  { 1: 'mercurioso',  2: 'mercúrico' },
  'Pb':  { 2: 'plumboso',    4: 'plúmbico' },
  'Sn':  { 2: 'estannoso',   4: 'estánnico' },
  'Co':  { 2: 'cobaltoso',   3: 'cobáltico' },
  'Ni':  { 2: 'niqueloso',   3: 'niquélico' },
  'Cr':  { 2: 'cromoso',     3: 'crómico',   6: 'crómico' },
  'Mn':  { 2: 'manganoso',   4: 'mangánico', 7: 'permangánico' },

  // Metales con un solo estado comun (usan sufijo -ico sin alternativa)
  'Na':  { 1: 'sódico' },
  'K':   { 1: 'potásico' },
  'Li':  { 1: 'lítico' },
  'Rb':  { 1: 'rubídico' },
  'Cs':  { 1: 'césico' },
  'Ca':  { 2: 'cálcico' },
  'Mg':  { 2: 'magnésico' },
  'Ba':  { 2: 'bárico' },
  'Sr':  { 2: 'estróncico' },
  'Be':  { 2: 'berílico' },
  'Al':  { 3: 'alumínico' },
  'Zn':  { 2: 'cíncico' },
  'Ag':  { 1: 'argéntico' },
  'Cd':  { 2: 'cádmico' },

  // No-metales. En la tradicional clasica estos oxidos se llamaban "anhidrido
  // X-ico" pero los libros modernos los integran como oxidos.
  'Cl':  { 1: 'hipocloroso', 3: 'cloroso',  5: 'clórico',  7: 'perclórico' },
  'Br':  { 1: 'hipobromoso', 3: 'bromoso',  5: 'brómico',  7: 'perbrómico' },
  'I':   { 1: 'hipoyodoso',  3: 'yodoso',   5: 'yódico',   7: 'peryódico' },
  'N':   { 3: 'nitroso',     5: 'nítrico' },
  'S':   { 4: 'sulfuroso',   6: 'sulfúrico' },
  'Se':  { 4: 'selenoso',    6: 'selénico' },
  'Te':  { 4: 'teluroso',    6: 'telúrico' },
  'C':   { 2: 'carbonoso',   4: 'carbónico' },
  'Si':  { 4: 'silícico' },
  'P':   { 3: 'fosforoso',   5: 'fosfórico' },
  'As':  { 3: 'arsenioso',   5: 'arsénico' },
  'Sb':  { 3: 'antimonioso', 5: 'antimónico' },
  'B':   { 3: 'bórico' },
};

// MCD y MCM para equilibrar subindices.
function mcd(a, b) { return b === 0 ? Math.abs(a) : mcd(b, a % b); }
function mcm(a, b) { return Math.abs(a * b) / mcd(a, b); }

// Calcula los subindices equilibrados de un compuesto binario E_a X_b, dado
// el estado de oxidacion positivo de E y el negativo de X. Simplifica al
// minimo (ej: Fe +2, O -2 -> 1,1 no 2,2).
function subindicesEquilibrados(cargaPos, cargaNeg) {
  const absNeg = Math.abs(cargaNeg);
  const m = mcm(cargaPos, absNeg);
  return { sub1: m / cargaPos, sub2: m / absNeg };
}

// Formula con subindices HTML. Para texto plano usa formulaTxt.
function formulaHtml(sym1, s1, sym2, s2) {
  const p1 = s1 > 1 ? `<sub>${s1}</sub>` : '';
  const p2 = s2 > 1 ? `<sub>${s2}</sub>` : '';
  return `${sym1}${p1}${sym2}${p2}`;
}
// Para strings puros usamos subindices Unicode (U+2082..U+2089).
const SUB_UNICODE = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
function toSubUnicode(n) {
  return String(n).split('').map(d => SUB_UNICODE[+d] || d).join('');
}
function formulaTxt(sym1, s1, sym2, s2) {
  return sym1 + (s1 > 1 ? toSubUnicode(s1) : '') + sym2 + (s2 > 1 ? toSubUnicode(s2) : '');
}

// Nomenclatura tradicional para un oxido con E en estado dado. Devuelve
// null si no hay forma tradicional conocida para ese estado concreto.
function nombreTradicionalOxido(sym, estado) {
  const porEstado = ADJ_TRADICIONAL[sym];
  if (!porEstado) {
    // Fallback: forma Stock sin romano (como si tuviera un solo estado).
    const num = NUM_POR_SIMBOLO[sym];
    const name = num ? elMap[num][2].toLowerCase() : sym.toLowerCase();
    return 'óxido de ' + name;
  }
  const adj = porEstado[estado];
  if (!adj) return null;
  return 'óxido ' + adj;
}

// Nomenclatura Stock: "óxido de <nombre>(romano)". El numero romano solo
// aparece si el elemento tiene mas de un estado positivo curado en OXID.
function nombreStockOxido(sym, estado) {
  const num = NUM_POR_SIMBOLO[sym];
  if (!num) return null;
  const name = elMap[num][2].toLowerCase();
  const estados = OXID[num] || [];
  const positivos = estados.filter(e => e > 0);
  const necesitaRomano = positivos.length > 1;
  return necesitaRomano
    ? `óxido de ${name}(${romano(estado)})`
    : `óxido de ${name}`;
}

// Nomenclatura sistematica IUPAC 2005: "<prefijo>óxido de <prefijo><nombre>".
// El prefijo delante de "óxido" elide la vocal final para evitar hiato
// ("monóxido", "pentóxido"). El prefijo del elemento se omite si es 1
// ("dióxido de carbono", no "dióxido de monocarbono").
function nombreSistematicoOxido(sym, subE, subO) {
  const num = NUM_POR_SIMBOLO[sym];
  if (!num) return null;
  const name = elMap[num][2].toLowerCase();
  const prefO = prefijoOxido(subO) + 'xido';
  const prefE = prefijoGriegoSinMono(subE);
  return `${prefO} de ${prefE}${name}`;
}

// ── Canvas atomico estatico (compartido) ────────────────────────────────
// Las herramientas que necesitan dibujar atomos (formulador, posibles
// futuras) usan estas funciones. No se anima: la version animada vive en
// la tabla porque alli es decoracion sin informacion. Aqui es informacion
// pura (cuantos electrones hay en la ultima capa, cuales se mueven) y la
// animacion solo distraeria.
//
// resolverColorCanvas convierte un color CSS (var(--x), hex, color-mix(...))
// en "r,g,b" interrogando al navegador con una sonda. Es la misma estrategia
// que la version animada de la tabla: el contexto 2D no soporta var().
function resolverColorCanvas(valor) {
  const sonda = document.createElement('span');
  sonda.style.cssText = 'display:none';
  sonda.style.color = valor;
  document.body.appendChild(sonda);
  const m = getComputedStyle(sonda).color.match(/[\d.]+/g);
  sonda.remove();
  return m ? `${Math.round(m[0])},${Math.round(m[1])},${Math.round(m[2])}` : '136,136,136';
}

// Dibuja un atomo estatico (nucleo + capas + electrones) en el canvas, con la
// capa externa resaltada. opts:
//   ctx: contexto 2D
//   cx, cy: centro
//   nucleoR: radio del nucleo (controla el tamano global)
//   num: numero atomico (etiqueta en el nucleo)
//   shells: array [K, L, M, ...] con electrones por capa
//   color: color CSS (var() soportado) para el atomo
//   electronesExternosResaltados: cuantos electrones de la ultima capa
//     resaltar con un halo mas intenso (visualiza "estos van a ceder")
//   huecosExternos: cuantos marcadores de "falta electron" dibujar en la
//     ultima capa (circulos vacios, visualiza "le faltan N para octeto")
function drawAtomoEstatico(opts) {
  const { ctx, cx, cy, nucleoR, num, shells, color, electronesExternosResaltados = 0, huecosExternos = 0 } = opts;
  const rgb = resolverColorCanvas(color);
  const colorReal = `rgb(${rgb})`;

  const activeLayers = shells.map((n, i) => ({ idx: i, count: n })).filter(s => s.count > 0);
  const displayLayers = activeLayers.slice(0, 5);
  const maxR = nucleoR + 42;
  const gap = (maxR - nucleoR - 4) / Math.max(displayLayers.length, 1);
  const radii = displayLayers.map((_, i) => nucleoR + gap * (i + 1));

  // Nucleo con halo
  const glowR = nucleoR + 5;
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
  grd.addColorStop(0, `rgba(${rgb},0.45)`);
  grd.addColorStop(0.5, `rgba(${rgb},0.18)`);
  grd.addColorStop(1, `rgba(${rgb},0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, nucleoR, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${rgb},0.22)`;
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = `rgba(${rgb},0.75)`;
  ctx.stroke();

  // Numero atomico centrado
  ctx.fillStyle = colorReal;
  ctx.font = `bold ${Math.max(8, Math.min(12, nucleoR * 0.75))}px 'DM Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(num), cx, cy);

  // Capas con electrones repartidos. La capa externa tiene posiciones fijas
  // para que los resaltados aparezcan siempre en el lado que mira al otro
  // atomo (angulo 0, derecha; el llamador rota el canvas si quiere).
  const ultimaIdx = displayLayers.length - 1;
  displayLayers.forEach((layer, i) => {
    const r = radii[i];
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb},0.14)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    const count = Math.min(layer.count, 8);
    const esUltima = i === ultimaIdx;
    // En la ultima capa reservamos huecos: pintamos count electrones y
    // huecosExternos marcadores vacios, repartidos en count+huecos posiciones
    // para que se vea la capa "incompleta".
    const posicionesUltima = esUltima ? count + huecosExternos : count;
    for (let j = 0; j < count; j++) {
      const angle = (Math.PI * 2 * j / posicionesUltima);
      const ex = cx + r * Math.cos(angle);
      const ey = cy + r * Math.sin(angle);

      const esResaltado = esUltima && j < electronesExternosResaltados;
      const haloR = esResaltado ? 6 : 4;

      const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, haloR);
      eg.addColorStop(0, `rgba(${rgb},${esResaltado ? 1 : 0.75})`);
      eg.addColorStop(1, `rgba(${rgb},0)`);
      ctx.beginPath();
      ctx.arc(ex, ey, haloR, 0, Math.PI * 2);
      ctx.fillStyle = eg;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ex, ey, esResaltado ? 3 : 2.2, 0, Math.PI * 2);
      ctx.fillStyle = colorReal;
      ctx.fill();
    }
    // Huecos: circulos vacios en las posiciones libres de la ultima capa
    if (esUltima && huecosExternos > 0) {
      for (let j = count; j < posicionesUltima; j++) {
        const angle = (Math.PI * 2 * j / posicionesUltima);
        const ex = cx + r * Math.cos(angle);
        const ey = cy + r * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb},0.7)`;
        ctx.lineWidth = 1.4;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  });
}

// Dibuja una flecha de transferencia de electrones de un atomo al otro.
// Pinta la lista de puntos (electrones viajando) distribuidos a lo largo de
// la flecha. opts:
//   ctx: contexto 2D
//   x1, y1, x2, y2: coordenadas de origen y destino
//   n: numero de electrones a representar (si es grande se muestran los
//      primeros 6 + "..." como texto)
//   color: color de los electrones viajeros
function drawFlechaTransferencia(opts) {
  const { ctx, x1, y1, x2, y2, n, color } = opts;
  const rgb = resolverColorCanvas(color);
  const colorReal = `rgb(${rgb})`;

  // Linea guia tenue
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = `rgba(${rgb},0.25)`;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Punta de flecha
  const dx = x2 - x1, dy = y2 - y1;
  const ang = Math.atan2(dy, dx);
  const headL = 8;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headL * Math.cos(ang - Math.PI / 6), y2 - headL * Math.sin(ang - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headL * Math.cos(ang + Math.PI / 6), y2 - headL * Math.sin(ang + Math.PI / 6));
  ctx.strokeStyle = `rgba(${rgb},0.55)`;
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Electrones viajando: hasta 6 bolitas espaciadas; mas que eso se resume
  // en texto para no apelmazar.
  const maxBolitas = Math.min(n, 6);
  for (let i = 0; i < maxBolitas; i++) {
    const t = 0.2 + 0.6 * (maxBolitas === 1 ? 0.5 : i / (maxBolitas - 1));
    const px = x1 + dx * t;
    const py = y1 + dy * t - 6; // ligera elevacion para evitar la linea
    const eg = ctx.createRadialGradient(px, py, 0, px, py, 5);
    eg.addColorStop(0, `rgba(${rgb},1)`);
    eg.addColorStop(1, `rgba(${rgb},0)`);
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = eg;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = colorReal;
    ctx.fill();
  }

  // Etiqueta "N e-" encima de la flecha
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  ctx.fillStyle = colorReal;
  ctx.font = `600 11px 'DM Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${n} e⁻`, midX, midY - 14);
}

// Lista los oxidos posibles del elemento 'num' segun su OXID actual.
// Devuelve un array con un objeto por estado positivo:
//   { estado, subE, subO, formula, formulaTxt, nombres: {trad, stock, sist} }
// Si el elemento es el propio oxigeno, devuelve [] (no formulamos "oxido de
// oxigeno"). Si no tiene estados positivos (gases nobles, sinteticos, F),
// tambien []. El fluor es un caso especial: su unico estado es -1, no forma
// oxidos (en realidad OF2 existe pero el O ahi es +2, y eso ya no es un
// oxido estandar; lo dejamos fuera del MVP).
function oxidosPosibles(num) {
  if (num === 8) return [];
  const estados = OXID[num];
  if (!estados || !estados.length) return [];
  const positivos = estados.filter(e => e > 0);
  if (!positivos.length) return [];
  const sym = elMap[num][1];
  return positivos.map(estado => {
    const { sub1: subE, sub2: subO } = subindicesEquilibrados(estado, -2);
    return {
      estado,
      subE,
      subO,
      formula: formulaHtml(sym, subE, 'O', subO),
      formulaTxt: formulaTxt(sym, subE, 'O', subO),
      nombres: {
        tradicional: nombreTradicionalOxido(sym, estado),
        stock:       nombreStockOxido(sym, estado),
        sistematico: nombreSistematicoOxido(sym, subE, subO),
      }
    };
  });
}

// ── Hidruros metalicos ──────────────────────────────────────────────────
// Metal (+n) + H (-1)  →  MH_n. El H actua como anion hidruro, siempre -1
// y siempre con subindice = estado del metal. subE es siempre 1: nunca
// aparece mas de un atomo del metal.
//
// Elementos activos: metales con al menos un estado positivo BAJO en OXID.
// Los metaloides (B, Si, Ge, As, Sb, Te) quedan fuera por categoria (no
// cuentan como "metal"). Sn y Pb se excluyen a mano: tienen cat
// "metal-postransicion" pero sus hidruros (SnH4, PbH4) son covalentes y los
// libros los tratan aparte, con los hidracidos o directamente omitidos en
// ESO/bach.
//
// Ademas CAPAMOS a estados <= +3: los hidruros metalicos reales viven en
// estados bajos. CrH6, MnH7, WH6, RuH8... existen en el motor combinatorio
// pero no son hidruros ionicos ni se enseñan como tales. Esto deja W y Mo
// (+6/+4) sin hidruros validos y a Mn/V/Cr/Fe/Co/Ni con solo sus estados
// bajos (+2 y, cuando toca, +3). Hablamos este criterio con V0ra el
// 2026-10-04.
const EXCLUIDOS_HIDRURO = new Set([50, 82]);  // Sn, Pb (postransicion covalentes)
const CATS_METAL = new Set([
  'metal-alcalino', 'metal-alcalinoterreo', 'metal-transicion',
  'metal-postransicion', 'lantanido', 'actinido',
]);
const ESTADO_HIDRURO_MAX = 3;

function formaHidruroMetalico(num) {
  if (num === 1) return false;                    // H + H no es hidruro metalico
  if (EXCLUIDOS_HIDRURO.has(num)) return false;
  const el = elMap[num];
  if (!el) return false;
  const cat = el[4];
  if (!CATS_METAL.has(cat)) return false;
  const estados = OXID[num];
  if (!estados || !estados.length) return false;  // sinteticos sin dataset
  return estados.some(e => e > 0 && e <= ESTADO_HIDRURO_MAX);
}

// Nomenclatura tradicional: "hidruro ferroso / ferrico / sodico ..."
// Mismo adjetivo que en oxidos (es propiedad del elemento, no del anion).
// Si el estado concreto no tiene adjetivo tradicional (ej. +3 del cromo que
// comparte "cromico" con +6, o estados exoticos de transicion), devolvemos
// null y la UI muestra el aviso de "sin nombre tradicional estandar".
function nombreTradicionalHidruro(sym, estado) {
  const porEstado = ADJ_TRADICIONAL[sym];
  if (!porEstado) {
    // Fallback: si no hay adjetivo, usamos "hidruro de <nombre>" (como Stock
    // sin romano). Pasa con lantanidos y actinidos poco cubiertos por los
    // libros tradicionales.
    const num = NUM_POR_SIMBOLO[sym];
    const name = num ? elMap[num][2].toLowerCase() : sym.toLowerCase();
    return 'hidruro de ' + name;
  }
  const adj = porEstado[estado];
  if (!adj) return null;
  return 'hidruro ' + adj;
}

// Nomenclatura Stock: "hidruro de <nombre>(romano)". El romano solo aparece
// si quedan dos o mas estados visibles en esta familia (criterio confirmado
// con V0ra: para hidruros con valencia unica el romano estorba). "Visibles"
// significa que pasan el cap ESTADO_HIDRURO_MAX: Mn tiene +2/+4/+7 en OXID
// pero solo +2 forma hidruro, asi que es "hidruro de manganeso" sin romano.
function nombreStockHidruro(sym, estado) {
  const num = NUM_POR_SIMBOLO[sym];
  if (!num) return null;
  const name = elMap[num][2].toLowerCase();
  const visibles = (OXID[num] || []).filter(e => e > 0 && e <= ESTADO_HIDRURO_MAX);
  const necesitaRomano = visibles.length > 1;
  return necesitaRomano
    ? `hidruro de ${name}(${romano(estado)})`
    : `hidruro de ${name}`;
}

// Nomenclatura sistematica IUPAC 2005. Si subH = 1 el prefijo "mono" se
// omite y queda "hidruro de X" (no "monohidruro de X"). Para subH >= 2 el
// prefijo griego va pegado a "hidruro" sin elision (no hay vocal que choque:
// "dihidruro", "trihidruro", "tetrahidruro"). El nombre del metal nunca
// lleva prefijo porque subE es siempre 1.
function nombreSistematicoHidruro(sym, subH) {
  const num = NUM_POR_SIMBOLO[sym];
  if (!num) return null;
  const name = elMap[num][2].toLowerCase();
  const pref = subH <= 1 ? '' : prefijoGriego(subH);
  return `${pref}hidruro de ${name}`;
}

// ── Sales binarias (metal + no-metal grupo 16 o 17) ─────────────────────
// Mecanicamente simetricas a los oxidos: el metal cede, el no-metal capta.
// La diferencia esta en que el anion no es fijo: el usuario elige F, Cl,
// Br, I, S, Se o Te. El motor reusa el mismo balance de cargas y la raiz
// "uro" del hidracido ("cloruro", "sulfuro"...).
const SAL_ANIONES = ['F', 'Cl', 'Br', 'I', 'S', 'Se', 'Te'];
const SAL_ANIONES_NUM = { F: 9, Cl: 17, Br: 35, I: 53, S: 16, Se: 34, Te: 52 };

// Metal valido = mismo criterio base que hidruros (CATS_METAL + estado
// positivo en OXID), pero SIN excluir Sn/Pb: SnCl2 y PbCl2 si son sales
// clasicas de bach. Tampoco capamos a +3: FeCl3, CrCl3, CrCl6 y MnCl7 estan
// en los libros aunque algunas rayan lo covalente — las dejamos y que la
// pedagogia del profesor haga el resto.
function formaSalBinariaMetal(num) {
  const el = elMap[num];
  if (!el) return false;
  const cat = el[4];
  if (!CATS_METAL.has(cat)) return false;
  const estados = OXID[num];
  if (!estados || !estados.length) return false;
  return estados.some(e => e > 0);
}

// El anion solo cuenta como "valido" si sigue teniendo su estado negativo
// clasico en el OXID activo (el usuario podria habero quitado en el YAML).
function formaSalBinariaAnion(anionSym) {
  const num = SAL_ANIONES_NUM[anionSym];
  if (!num) return false;
  const grupo = elMap[num][5];
  const estadoClave = grupo === 17 ? -1 : -2;
  const estados = OXID[num];
  return !!estados && estados.includes(estadoClave);
}

function nombreTradicionalSal(sym, estado, anionSym) {
  const raiz = RAIZ_HIDRACIDO[anionSym];
  if (!raiz) return null;
  const porEstado = ADJ_TRADICIONAL[sym];
  if (!porEstado) {
    const num = NUM_POR_SIMBOLO[sym];
    const name = num ? elMap[num][2].toLowerCase() : sym.toLowerCase();
    return `${raiz.uro} de ${name}`;
  }
  const adj = porEstado[estado];
  if (!adj) return null;
  return `${raiz.uro} ${adj}`;
}

function nombreStockSal(sym, estado, anionSym) {
  const num = NUM_POR_SIMBOLO[sym];
  const raiz = RAIZ_HIDRACIDO[anionSym];
  if (!num || !raiz) return null;
  const name = elMap[num][2].toLowerCase();
  const positivos = (OXID[num] || []).filter(e => e > 0);
  const necesitaRomano = positivos.length > 1;
  return necesitaRomano
    ? `${raiz.uro} de ${name}(${romano(estado)})`
    : `${raiz.uro} de ${name}`;
}

// Sistematica IUPAC 2005: "<prefijo>uro de <prefijo>metal". El prefijo "mono"
// se omite tanto para el anion como para el metal (NaCl = "cloruro de sodio",
// no "monocloruro de monosodio"). Si el anion termina en vocal ya la lleva
// pegada ("di" + "sulfuro" = "disulfuro"), no hay elision aqui porque los
// prefijos pequeños terminan en 'i' ("di-", "tri-") y los uros empiezan en
// consonante.
function nombreSistematicoSal(sym, subE, anionSym, subAn) {
  const num = NUM_POR_SIMBOLO[sym];
  const raiz = RAIZ_HIDRACIDO[anionSym];
  if (!num || !raiz) return null;
  const name = elMap[num][2].toLowerCase();
  const prefAn = prefijoGriegoSinMono(subAn);
  const prefE  = prefijoGriegoSinMono(subE);
  return `${prefAn}${raiz.uro} de ${prefE}${name}`;
}

function salesBinariasPosibles(numMetal, anionSym) {
  if (!formaSalBinariaMetal(numMetal)) return [];
  if (!formaSalBinariaAnion(anionSym)) return [];
  const anionNum = SAL_ANIONES_NUM[anionSym];
  const grupo = elMap[anionNum][5];
  const estadoAnion = grupo === 17 ? -1 : -2;
  const sym = elMap[numMetal][1];
  const positivos = (OXID[numMetal] || []).filter(e => e > 0);
  return positivos.map(estado => {
    const { sub1: subE, sub2: subAn } = subindicesEquilibrados(estado, estadoAnion);
    return {
      estado,
      subE,
      subAn,
      formula: formulaHtml(sym, subE, anionSym, subAn),
      formulaTxt: formulaTxt(sym, subE, anionSym, subAn),
      nombres: {
        tradicional: nombreTradicionalSal(sym, estado, anionSym),
        stock:       nombreStockSal(sym, estado, anionSym),
        sistematico: nombreSistematicoSal(sym, subE, anionSym, subAn),
      }
    };
  });
}

// ── Hidracidos (H + no-metal grupos 16 y 17) ────────────────────────────
// Aqui los roles se invierten: el H es CATION (+1) y el no-metal es ANION
// (-1 en halogenos, -2 en calcogenos). Nunca hay varios estados por elemento
// (siempre es -1 o -2, segun grupo). Un solo compuesto por elemento. La
// formula convencional escribe H primero porque es menos electronegativo:
// HCl, HBr, H2S, H2Se.
//
// Doble nomenclatura real:
//  - Tradicional ("como acido en disolucion"): acido clorhidrico, sulfhidrico...
//  - Stock ("como gas puro"): cloruro de hidrogeno, sulfuro de hidrogeno...
//  - Sistematica IUPAC 2005: anade "di" al hidrogeno cuando subH=2: sulfuro
//    de dihidrogeno. Esto distingue a la sistematica de la Stock en los
//    hidracidos de grupo 16 (los de grupo 17 coinciden).
//
// At (ácido astatidrico) existe pero su rareza lo deja fuera del alcance ESO.
// O queda fuera: H + O es agua, los libros no lo tratan como hidracido.
const EXCLUIDOS_HIDRACIDO = new Set([1, 8, 85]);  // H, O, At

const RAIZ_HIDRACIDO = {
  'F':  { tradicional: 'fluorhídrico',  uro: 'fluoruro' },
  'Cl': { tradicional: 'clorhídrico',   uro: 'cloruro' },
  'Br': { tradicional: 'bromhídrico',   uro: 'bromuro' },
  'I':  { tradicional: 'yodhídrico',    uro: 'yoduro' },
  'S':  { tradicional: 'sulfhídrico',   uro: 'sulfuro' },
  'Se': { tradicional: 'selenhídrico',  uro: 'seleniuro' },
  'Te': { tradicional: 'telurhídrico',  uro: 'teluriuro' },
};

function formaHidracido(num) {
  if (EXCLUIDOS_HIDRACIDO.has(num)) return false;
  const el = elMap[num];
  if (!el) return false;
  const cat = el[4];
  if (cat !== 'halogeno' && cat !== 'no-metal') return false;
  const grupo = el[5];
  if (grupo !== 16 && grupo !== 17) return false;
  // Y el no-metal debe seguir teniendo su estado -1 o -2 en el OXID activo
  // (podria haberlo quitado en Editar oxidacion).
  const estadoClave = grupo === 17 ? -1 : -2;
  const estados = OXID[num];
  if (!estados || !estados.length) return false;
  return estados.includes(estadoClave);
}

function nombreTradicionalHidracido(sym) {
  const raiz = RAIZ_HIDRACIDO[sym];
  if (!raiz) return null;
  return 'ácido ' + raiz.tradicional;
}

// Stock: "<raiz>uro de hidrogeno", sin prefijo griego aunque haya 2 H
// (en Stock el prefijo lo lleva el anion si tiene valencia variable, no el
// hidrogeno; aqui no hay valencia variable del no-metal).
function nombreStockHidracido(sym) {
  const raiz = RAIZ_HIDRACIDO[sym];
  if (!raiz) return null;
  return raiz.uro + ' de hidrógeno';
}

// Sistematica IUPAC 2005: cuando hay 2 H (grupos 16), el hidrogeno lleva
// prefijo "di". Es la unica diferencia con Stock para hidracidos; para
// grupos 17 (subH=1) ambas coinciden.
function nombreSistematicoHidracido(sym, subH) {
  const raiz = RAIZ_HIDRACIDO[sym];
  if (!raiz) return null;
  const prefH = subH <= 1 ? '' : prefijoGriego(subH);
  return raiz.uro + ' de ' + prefH + 'hidrógeno';
}

function hidracidosPosibles(num) {
  if (!formaHidracido(num)) return [];
  const el = elMap[num];
  const grupo = el[5];
  const sym = el[1];
  const estado = grupo === 17 ? -1 : -2;          // carga del no-metal
  // Balance: 1 no-metal capta |estado| electrones, |estado| H ceden 1 c/u
  const subE = 1, subH = Math.abs(estado);
  return [{
    estado,
    subE,
    subH,
    // Formula: H primero (menos electronegativo), no-metal despues.
    formula: formulaHtml('H', subH, sym, subE),
    formulaTxt: formulaTxt('H', subH, sym, subE),
    nombres: {
      tradicional: nombreTradicionalHidracido(sym),
      stock:       nombreStockHidracido(sym),
      sistematico: nombreSistematicoHidracido(sym, subH),
    }
  }];
}

// Paralelo a oxidosPosibles. Devuelve un array con un objeto por estado
// positivo del metal:
//   { estado, subE (=1), subH, formula, formulaTxt, nombres: {...} }
function hidrurosMetalicosPosibles(num) {
  if (!formaHidruroMetalico(num)) return [];
  // El cap ESTADO_HIDRURO_MAX filtra los estados altos que no forman
  // hidruros reales (CrH6, MnH7, WH6...). Si el metal solo tiene estados
  // altos, formaHidruroMetalico ya lo habra descartado antes de llegar aqui.
  const positivos = (OXID[num] || []).filter(e => e > 0 && e <= ESTADO_HIDRURO_MAX);
  if (!positivos.length) return [];
  const sym = elMap[num][1];
  return positivos.map(estado => {
    // Metal +estado, H -1  →  subE = 1, subH = estado (no hace falta MCM).
    const subE = 1, subH = estado;
    return {
      estado,
      subE,
      subH,
      formula: formulaHtml(sym, subE, 'H', subH),
      formulaTxt: formulaTxt(sym, subE, 'H', subH),
      nombres: {
        tradicional: nombreTradicionalHidruro(sym, estado),
        stock:       nombreStockHidruro(sym, estado),
        sistematico: nombreSistematicoHidruro(sym, subH),
      }
    };
  });
}
