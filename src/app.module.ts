import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from '@room/room.module';
import { RoomEntity } from '@room/room.entity';
import { BookingModule } from '@booking/booking.module';
import { BookingEntity } from '@booking/booking.entity';
import { EquipementsModule } from './equipements/equipements.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/resa',
      useUnifiedTopology: true,
      synchronize: true, // Synchronisation automatique des schémas (!!!! A désactiver en prod !!!!)
      entities: [RoomEntity, BookingEntity],
    }),
    RoomModule,
    BookingModule,
    EquipementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
