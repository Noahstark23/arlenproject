export interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

export const biography = {
    name: 'Arlen Siu Bermúdez',
    nickname: 'La Chinita',
    born: '15 de julio de 1955',
    birthPlace: 'Jinotepe, Carazo, Nicaragua',
    died: '1 de agosto de 1975',
    deathPlace: 'El Sauce, León, Nicaragua',
    quote: '"La mujer ya no es espectadora de la historia: hoy es sujeto armado de palabra, fusil y conciencia."',
    summary:
        'Arlen Siu fue una revolucionaria, poeta, cantante y ensayista nicaragüense. Es una de las mártires más reconocidas de la Revolución Sandinista. Con su guitarra, su poesía y su valentía, marcó para siempre la historia de Nicaragua.',
    fullBio: `Arlen Siu Bermúdez, conocida cariñosamente como "La Chinita", fue una destacada revolucionaria nicaragüense nacida el 15 de julio de 1955 en Jinotepe, Carazo. Su padre, Armando Siu Lau, de ascendencia china, había participado en el Ejército Revolucionario Comunista en su país natal antes de emigrar a Nicaragua.

Arlen estudió en la Escuela Normal de Señoritas de Jinotepe y posteriormente Psicología Social en la Universidad Nacional Autónoma de Nicaragua (UNAN). A los 18 años se integró al Frente Sandinista de Liberación Nacional (FSLN).

No solo fue una combatiente comprometida, sino también una artista multifacética: guitarrista, acordeonista, flautista, cantante y compositora. Su música y poesía sirvieron como poderosas herramientas de denuncia contra los crímenes del régimen somocista.

Su obra más célebre, "María Rural", celebra a las mujeres rurales nicaragüenses y denuncia su sufrimiento. También contribuyó al pensamiento marxista y feminista, enfatizando la importancia de los derechos de la mujer y su participación activa en la revolución.

El 1 de agosto de 1975, con apenas 20 años, Arlen cayó en una emboscada de la Guardia Nacional cerca de El Sauce, León, mientras cubría la retirada de sus compañeros. Se convirtió en una de las primeras mártires femeninas de la Revolución Sandinista.`,
};

export const timeline: TimelineEvent[] = [
    {
        year: '1955',
        title: 'Nacimiento',
        description: 'Nace el 15 de julio en Jinotepe, Carazo. Hija de Armando Siu Lau, de ascendencia china, y madre nicaragüense.',
    },
    {
        year: '1960s',
        title: 'Formación Artística',
        description: 'Desarrolla sus talentos como guitarrista, acordeonista, flautista y cantante. Estudia en la Escuela Normal de Señoritas de Jinotepe.',
    },
    {
        year: '1972',
        title: 'Terremoto de Managua',
        description: 'Participa en campañas de ayuda a las víctimas del devastador terremoto que destruyó la capital.',
    },
    {
        year: '1973',
        title: 'Ingreso al FSLN',
        description: 'A los 18 años se integra al Frente Sandinista de Liberación Nacional, comprometida con la lucha contra la dictadura somocista.',
    },
    {
        year: '1974',
        title: 'Activismo y Arte',
        description: 'Compone "María Rural" y otras obras que denuncian los crímenes del régimen. Participa en campañas de alfabetización en comunidades rurales.',
    },
    {
        year: '1975',
        title: 'Sacrificio Heroico',
        description: 'El 1 de agosto cae en combate cerca de El Sauce, León, cubriendo la retirada de sus compañeros. Tenía solo 20 años.',
    },
];

export interface Poem {
    title: string;
    content: string;
}

export const poems: Poem[] = [
    {
        title: 'María Rural',
        content: `María tiene las manos rajadas de la tierra,
y su vientre ha parido más vida que los soles.
Pero nadie la nombra, nadie la celebra:
solo la muerte la sigue, tras cada jornada.`
    },
    {
        title: 'Soy mujer',
        content: `Soy mujer y llevo en mi vientre
las semillas de un mundo distinto.
No me llamen cobarde ni débil.`
    },
    {
        title: 'Mariposa',
        content: `Si tengo alas, no es para huir:
es para volar sobre el miedo,
llevar noticias de esperanza
y sembrar futuro donde hubo fuego
soy la furia de un siglo de gritos.`
    }
];
