import { NotificationPermissionsService, INotificationPermissionsService } from './NotificationPermissionsService';
import { NotificationChannelService, INotificationChannelService } from './NotificationChannelService';

export interface INotificationCoordinator {
  initialize(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
}

class NotificationCoordinator implements INotificationCoordinator {
  private permissionsService: INotificationPermissionsService;
  private channelService: INotificationChannelService;

  constructor() {
    this.permissionsService = new NotificationPermissionsService();
    this.channelService = new NotificationChannelService();
  }

  async initialize(): Promise<boolean> {
    const hasPermissions = await this.permissionsService.requestPermissions();
    if (hasPermissions) {
      await this.channelService.setupDefaultChannel();
    }
    return hasPermissions;
  }

  async requestPermissions(): Promise<boolean> {
    const hasPermissions = await this.permissionsService.requestPermissions();
    if (hasPermissions) {
      await this.channelService.setupDefaultChannel();
    }
    return hasPermissions;
  }
}

export { NotificationCoordinator };
