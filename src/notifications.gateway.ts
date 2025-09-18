import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/services/user.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;

    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) {}

    async handleConnection(socket: Socket) {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                socket.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            const user = await this.userService.findById(payload.id);
            if (!user) {
                socket.disconnect();
                return;
            }

            // присоединяем сокет в комнату пользователя
            socket.join(`user_${user.id}`);

            // НЕ делаем socket.join(`project_${user.id}`) — проекты подписываются отдельно
            console.log(`User ${user.id} connected with socket ${socket.id}`);
        } catch (err) {
            socket.disconnect();
        }
    }

    handleDisconnect(socket: Socket) {
        // ничего специального не нужно — socket.io сам очистит комнаты при отключении
    }

    // Отправить конкретному пользователю (дойдёт до всех его подключений)
    sendToUser(userId: string, event: string, data: any) {
        this.server.to(`user_${userId}`).emit(event, data);
    }

    sendToProject(projectId: string, event: string, data: any) {
        this.server.to(`project_${projectId}`).emit(event, data);
    }

    @SubscribeMessage('subscribeToProject')
    handleSubscribeToProject(
        @ConnectedSocket() socket: Socket,
        @MessageBody() projectId: string,
    ) {
        socket.join(`project_${projectId}`);
    }

    @SubscribeMessage('unsubscribeFromProject')
    handleUnsubscribeFromProject(
        @ConnectedSocket() socket: Socket,
        @MessageBody() projectId: string,
    ) {
        socket.leave(`project_${projectId}`);
    }
}
