import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  username: string;
  password: string;
}

class UserService {
  private static readonly USER_STORAGE_KEY = '@user';

  static async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      throw new Error('No se pudo guardar el usuario');
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const storedUser = await AsyncStorage.getItem(this.USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      throw new Error('No se pudo cargar el usuario');
    }
  }

  static async validateLogin(username: string, password: string): Promise<User> {
    const storedUser = await this.getUser();
    
    if (!storedUser) {
      throw new Error('No hay usuario registrado');
    }

    if (storedUser.username === username && storedUser.password === password) {
      return storedUser;
    } else {
      throw new Error('Credenciales incorrectas');
    }
  }

  static async updatePassword(currentPassword: string, newPassword: string, user: User): Promise<User> {
    if (currentPassword !== user.password) {
      throw new Error('La contraseña actual es incorrecta');
    }

    if (newPassword === currentPassword) {
      throw new Error('La nueva contraseña debe ser diferente a la actual');
    }

    const updatedUser = { ...user, password: newPassword };
    await this.saveUser(updatedUser);
    return updatedUser;
  }
}

export default UserService;
