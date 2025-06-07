import { UserPersistenceService, IUserPersistenceService } from './UserPersistenceService';
import { UserValidationService, IUserValidationService } from './UserValidationService';
import { UserAuthenticationService, IUserAuthenticationService } from './UserAuthenticationService';

export interface User {
  username: string;
  password: string;
}

class UserService {
  private persistenceService: IUserPersistenceService;
  private validationService: IUserValidationService;
  private authenticationService: IUserAuthenticationService;

  constructor() {
    this.persistenceService = new UserPersistenceService();
    this.validationService = new UserValidationService();
    this.authenticationService = new UserAuthenticationService(
      this.persistenceService,
      this.validationService
    );
  }

  static async saveUser(user: User): Promise<void> {
    const service = new UserService();
    service.validationService.validateUserData(user);
    await service.persistenceService.save(user);
  }

  static async getUser(): Promise<User | null> {
    const service = new UserService();
    return await service.persistenceService.load();
  }

  static async validateLogin(username: string, password: string): Promise<User> {
    const service = new UserService();
    return await service.authenticationService.validateLogin(username, password);
  }

  static async updatePassword(currentPassword: string, newPassword: string, user: User): Promise<User> {
    const service = new UserService();
    return await service.authenticationService.updatePassword(currentPassword, newPassword, user);
  }
}

export default UserService;
