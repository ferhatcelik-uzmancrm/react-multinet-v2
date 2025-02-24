interface TokenInfo {
  token: string;
  expiresAt: number;
}

class TokenService {
  private static readonly TOKEN_KEY = "token";
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 dakika
  private static readonly BLACKLIST_KEY = "token_blacklist";

  // Token işlemleri
  static setToken(token: string): void {
    const tokenInfo: TokenInfo = {
      token,
      expiresAt: Date.now() + this.SESSION_TIMEOUT
    };
    sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenInfo));
  }

  static getToken(): string | null {
    const tokenInfo = sessionStorage.getItem(this.TOKEN_KEY);
    if (!tokenInfo) return null;

    const { token, expiresAt } = JSON.parse(tokenInfo);
    if (Date.now() > expiresAt) {
      this.removeToken();
      return null;
    }

    return token;
  }

  static removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  // Blacklist işlemleri
  static addToBlacklist(token: string): void {
    const blacklist = this.getBlacklist();
    blacklist.push(token);
    localStorage.setItem(this.BLACKLIST_KEY, JSON.stringify(blacklist));
  }

  static isBlacklisted(token: string): boolean {
    const blacklist = this.getBlacklist();
    return blacklist.includes(token);
  }

  private static getBlacklist(): string[] {
    const blacklist = localStorage.getItem(this.BLACKLIST_KEY);
    return blacklist ? JSON.parse(blacklist) : [];
  }

  // Session timeout kontrolü
  static checkSessionTimeout(): boolean {
    const tokenInfo = sessionStorage.getItem(this.TOKEN_KEY);
    if (!tokenInfo) return true;

    const { expiresAt } = JSON.parse(tokenInfo);
    return Date.now() > expiresAt;
  }

  // Session süresini uzatma
  static extendSession(): void {
    const tokenInfo = sessionStorage.getItem(this.TOKEN_KEY);
    if (!tokenInfo) return;

    const { token } = JSON.parse(tokenInfo);
    this.setToken(token);
  }

  // Blacklist temizleme (eski token'ları temizle)
  static cleanBlacklist(): void {
    const blacklist = this.getBlacklist();
    const now = Date.now();
    const updatedBlacklist = blacklist.filter(token => {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.exp * 1000 > now;
      } catch {
        return false;
      }
    });
    localStorage.setItem(this.BLACKLIST_KEY, JSON.stringify(updatedBlacklist));
  }
}

export default TokenService; 