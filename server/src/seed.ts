import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function seed() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'ArlenSiu2024!';
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.upsert({
        where: { username },
        update: { passwordHash },
        create: { username, passwordHash },
    });

    console.log(`✅ Admin user created: ${admin.username}`);

    // Create sample content
    const sampleContent = [
        {
            title: 'La Vida de Arlen Siu: Una Heroína Revolucionaria',
            description: 'Podcast que narra la vida y legado de Arlen Siu Bermúdez, desde su nacimiento en Jinotepe hasta su sacrificio heroico.',
            body: 'En este episodio exploramos la vida de Arlen Siu, una mujer que con su guitarra, su poesía y su valentía marcó para siempre la historia de Nicaragua.',
            type: 'PODCAST' as const,
            mediaUrl: null,
            thumbnailUrl: null,
            published: true,
        },
        {
            title: 'María Rural: El Poema que Inmortalizó a las Mujeres Campesinas',
            description: 'Análisis del poema más célebre de Arlen Siu y su impacto en la literatura revolucionaria nicaragüense.',
            body: `"María Rural" es quizás la obra más emblemática de Arlen Siu. Este poema, que luego fue musicalizado, celebra a las mujeres rurales de Nicaragua y denuncia su sufrimiento bajo la dictadura somocista.\n\nEl poema refleja la profunda conexión de Arlen con el pueblo campesino y su convicción de que la revolución debía ser también una lucha por los derechos de las mujeres.\n\nArlen escribió: "La mujer ya no es espectadora de la historia: hoy es sujeto armado de palabra, fusil y conciencia."`,
            type: 'BLOG' as const,
            mediaUrl: null,
            thumbnailUrl: null,
            published: true,
        },
        {
            title: 'El Legado Musical de La Chinita',
            description: 'Video documental sobre las contribuciones artísticas de Arlen Siu como guitarrista, cantante y compositora.',
            body: 'Arlen Siu no solo fue una combatiente revolucionaria, sino también una artista multifacética. Guitarrista, acordeonista, flautista y cantante, utilizó su arte como arma de denuncia contra los crímenes del régimen somocista.',
            type: 'VIDEO' as const,
            mediaUrl: null,
            thumbnailUrl: null,
            published: true,
        },
        {
            title: 'Jinotepe, 1955: Los Orígenes de una Revolución',
            description: 'Narrativa histórica sobre los primeros años de Arlen Siu y la influencia de su familia en su formación revolucionaria.',
            body: `Nacida el 15 de julio de 1955 en Jinotepe, Carazo, Arlen Siu Bermúdez creció en un hogar marcado por la conciencia social. Su padre, Armando Siu Lau, de ascendencia china, había participado en el Ejército Revolucionario Comunista en su país natal antes de emigrar a Nicaragua.\n\nEsta herencia revolucionaria sembró en Arlen las semillas de lo que sería una vocación de lucha y compromiso social que la llevaría a dar su vida por la liberación de su pueblo.`,
            type: 'NARRATIVE' as const,
            mediaUrl: null,
            thumbnailUrl: null,
            published: true,
        },
        {
            title: 'El Último Combate: 1 de Agosto de 1975',
            description: 'Historia del heroico sacrificio de Arlen Siu en El Sauce, León, cubriendo la retirada de sus compañeros.',
            body: `El 1 de agosto de 1975, en las montañas cerca de El Sauce, León, Arlen Siu enfrentó su último combate. Con apenas 20 años, cayó en una emboscada de la Guardia Nacional mientras ayudaba a cubrir la retirada de sus compañeros del FSLN.\n\nSu valentía en ese momento final consolidó su lugar como una de las primeras mártires de la Revolución Sandinista y un emblema eterno de la lucha por la libertad en Nicaragua.`,
            type: 'STORY' as const,
            mediaUrl: null,
            thumbnailUrl: null,
            published: true,
        },
    ];

    for (const item of sampleContent) {
        await prisma.content.create({ data: item });
    }

    console.log(`✅ Created ${sampleContent.length} sample content items`);
    console.log('🎉 Seed complete!');
}

seed()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
