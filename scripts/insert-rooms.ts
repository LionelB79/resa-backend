import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { RoomService } from '@room/room.service';
import { CreateRoomDto } from '@app/room/dtos/create-room.dto';
import { RoomEntity } from '@room/room.entity';
import { DataSource, Repository } from 'typeorm';

const rooms = [
  {
    name: 'Salle #1',
    description: 'Salle #1',
    capacity: 5,
    equipements: [{ name: 'TV' }, { name: 'Retro Projecteur' }],
    createdAt: new Date('2016-12-07T12:39:29.812Z'),
    updatedAt: new Date('2016-12-08T17:31:39.489Z'),
  },
  {
    name: 'Salle #2',
    description: 'Salle #2',
    capacity: 10,
    equipements: [{ name: 'Retro Projecteur' }],
    createdAt: new Date('2016-12-07T12:39:55.384Z'),
    updatedAt: new Date('2016-12-07T13:33:37.184Z'),
  },
  {
    name: 'Salle Okjsdkso',
    description: 'Salle Okjsdkso',
    capacity: 11,
    equipements: [],
    createdAt: new Date('2016-12-07T14:15:55.733Z'),
    updatedAt: new Date('2016-12-09T16:45:19.025Z'),
  },
  {
    name: 'Salle de ouf',
    description: 'Salle de ouf',
    capacity: 10,
    equipements: [{ name: 'TV' }, { name: 'Retro Projecteur' }],
    createdAt: new Date('2016-12-09T16:45:34.419Z'),
    updatedAt: new Date('2016-12-09T16:45:34.419Z'),
  },
  {
    name: 'Salle nulle',
    description: 'Salle nulle',
    capacity: 26,
    equipements: [{ name: 'TV' }, { name: 'Retro Projecteur' }],
    createdAt: new Date('2016-12-09T16:45:49.096Z'),
    updatedAt: new Date('2016-12-09T16:45:49.096Z'),
  },
];

async function seedRooms() {
  const app = await NestFactory.create(AppModule);
  const roomService = app.get(RoomService);
  const dataSource = app.get(DataSource);
  const roomRepository: Repository<RoomEntity> =
    dataSource.getRepository(RoomEntity);

  try {
    // Séquence d'insertion séquentielle pour gérer les contraintes
    for (const roomData of rooms) {
      try {
        // Destructure les données pour la création
        const { createdAt, updatedAt, ...createRoomDto } = roomData;

        // On créé la salle via le service
        const room = await roomService.createRoom(createRoomDto);

        // On met à jour manuellement les dates si nécessaire
        await roomRepository.update(room._id, {
          createdAt,
          updatedAt,
        });

        console.log(`🟢 Salle "${roomData.name}" insérée avec succès`);
      } catch (error) {
        console.warn(
          `🟠 Impossible d'insérer la salle "${roomData.name}": ${error.message}`,
        );
      }
    }

    console.log('✅ INSERT terminé');
  } catch (error) {
    console.error("🔴 Erreur lors dE l'INSERT, error");
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  seedRooms();
}

export default seedRooms;
