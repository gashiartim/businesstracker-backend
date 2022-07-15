import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Server } from "http";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { Alert } from "./entities/alert.entity";
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class AlertGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server | any;

  @SubscribeMessage("alert")
  alertHandler(
    @MessageBody() body: CreateAlertDto | any,
    @ConnectedSocket() client: Socket
  ) {
    client.to(body.sentTo).emit("alert", {
      message: body.message,
      location_name: body.location.name,
    });
  }

  @SubscribeMessage("joinRoom")
  joinRoomHandler(client: Socket, room: string) {
    client.join(room);
    client.emit("joinedRoom", room);
  }

  @SubscribeMessage("leaveRoom")
  leaveRoomHandler(client: Socket, room: string) {
    client.leave(room);
    client.emit("leftRoom", room);
  }

  // @SubscribeMessage("alertUser")
  onAlertSent(data: CreateAlertDto) {
    this.alertHandler({ ...data }, this.server);
  }

  afterInit(server: any) {
    console.log("Init");
  }

  handleConnection(client: any) {
    console.log("Client connected:" + client.id);
  }

  handleDisconnect(client: any) {
    console.log("Client disconnected", client.id);
  }
}
