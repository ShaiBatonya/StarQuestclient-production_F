import { BaseApiService } from './base';
import { 
  User, 
  RegisterFormData, 
  VerifyEmailData, 
  ResetPasswordData 
} from '@/types/User';
import { 
  BackendResponse, 
  RegisterResponse, 
  LoginResponse, 
  VerifyEmailResponse, 
  ResetPasswordResponse, 
  CurrentUserResponse 
} from '@/types/Auth';

export class AuthService extends BaseApiService {
  private static instance: AuthService;

  private constructor() {
    super();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user - backend sets JWT cookie automatically
   * Endpoint: POST /auth/login
   * Returns: { status: 'success', data: User }
   */
  public async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  /**
   * Register new user - sends verification email
   * Endpoint: POST /auth/signup
   * Returns: { status: 'success', message: 'Verification email sent to user' }
   */
  public async register(data: RegisterFormData): Promise<RegisterResponse> {
    const response = await this.api.post('/auth/signup', data);
    return response.data;
  }

  /**
   * Verify email with code
   * Endpoint: POST /auth/verifyEmail
   * Returns: { status: 'success', message: 'Email verified successfully.' }
   */
  public async verifyEmail(data: VerifyEmailData): Promise<VerifyEmailResponse> {
    const response = await this.api.post('/auth/verifyEmail', data);
    return response.data;
  }

  /**
   * Reset password using token from email
   * Endpoint: PATCH /auth/resetPassword/:token
   * Returns: { status: 'success', message: 'Password has been reset successfully.' }
   */
  public async resetPassword(token: string, data: ResetPasswordData): Promise<ResetPasswordResponse> {
    const response = await this.api.patch(`/auth/resetPassword/${token}`, data);
    return response.data;
  }

  /**
   * Update current user's password (authenticated)
   * Endpoint: PATCH /auth/updateMyPassword
   * Returns: { status: 'success', data: User }
   */
  public async updatePassword(passwordCurrent: string, password: string, passwordConfirm: string): Promise<LoginResponse> {
    const response = await this.api.patch('/auth/updateMyPassword', { 
      passwordCurrent, 
      password, 
      passwordConfirm 
    });
    return response.data;
  }

  /**
   * Logout user - clears JWT cookie
   * Endpoint: GET /auth/logout
   * Returns: { status: 'success' }
   */
  public async logout(): Promise<BackendResponse> {
    const response = await this.api.get('/auth/logout');
    return response.data;
  }

  /**
   * Get current user profile (session validation)
   * Endpoint: GET /users/me
   * Returns: { status: 'success', data: User }
   */
  public async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  /**
   * Update current user profile
   * Endpoint: PATCH /users/updateMe
   * Returns: { status: 'success', data: User }
   */
  public async updateProfile(data: Partial<User>): Promise<CurrentUserResponse> {
    const response = await this.api.patch('/users/updateMe', data);
    return response.data;
  }

  /**
   * Resend verification email
   * Endpoint: POST /auth/resend-verification
   * Returns: { status: 'success', message: 'Verification email sent successfully' }
   */
  public async resendVerificationEmail(email: string): Promise<BackendResponse<any>> {
    const response = await this.api.post('/auth/resend-verification', { email });
    return response.data;
  }

  /**
   * Accept workspace invitation
   * Endpoint: POST /workspace/accept-invitation/:token
   * Returns: { status: 'success', message: 'Successfully joined workspace', data: { workspaceName: string } }
   */
  public async acceptInvitation(token: string): Promise<BackendResponse<{ workspaceName?: string }>> {
    const response = await this.api.post(`/workspace/accept-invitation/${token}`);
    return response.data;
  }
} 