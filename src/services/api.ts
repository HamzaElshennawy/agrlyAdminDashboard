const API_BASE_URL = "http://agrly.runasp.net";

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("authToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(url);

    const config: RequestInit = {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json-patch+json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      console.log(url, config);
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: { username: string; password: string }) {
    const response = await this.request<any>("/api/AuthenticateUser/auth", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    console.log(response);
    if (response.token) {
      this.token = response.token;
      localStorage.setItem("authToken", response.token);
    }

    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  // Users
  async getUsers() {
    return this.request<any>("/api/Users/getallusers");
  }

  async getUser(id: number) {
    return this.request<any>(`/api/Users/getuser/${id}`);
  }

  async createUser(user: any) {
    return this.request<any>("/api/Users/adduser", {
      method: "POST",
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: number) {
    return this.request<any>(`/api/Users/deleteuser/${id}`, {
      method: "DELETE",
    });
  }

  // Apartments
  async getApartments() {
    return this.request<any>("/api/Apartments");
  }

  async getApartment(id: number) {
    return this.request<any>(`/api/Apartments/${id}`);
  }

  async createApartment(apartment: any) {
    return this.request<any>("/api/Apartments", {
      method: "POST",
      body: JSON.stringify(apartment),
    });
  }

  async updateApartment(id: number, apartment: any) {
    return this.request<any>(`/api/Apartments/${id}`, {
      method: "PUT",
      body: JSON.stringify(apartment),
    });
  }

  async deleteApartment(id: number) {
    return this.request<any>(`/api/Apartments/${id}`, {
      method: "DELETE",
    });
  }

  async searchApartments(query: string, currentPage = 0) {
    return this.request<any>(
      `/api/Apartments/search?query=${query}&currentPage=${currentPage}`
    );
  }

  // Categories
  async getCategories() {
    return this.request<any>("/api/Apartments/categories");
  }

  async createCategory(category: any) {
    return this.request<any>("/api/Apartments/categories/add", {
      method: "POST",
      body: JSON.stringify(category),
    });
  }

  // Transactions
  async getTransactions() {
    return this.request<any>("/api/Transactions");
  }

  async getTransaction(id: number) {
    return this.request<any>(`/api/Transactions/${id}`);
  }

  async createTransaction(transaction: any) {
    return this.request<any>("/api/Transactions/create-transaction", {
      method: "POST",
      body: JSON.stringify(transaction),
    });
  }

  // TickerQ
  async getTimeTickers() {
    return this.request<any>("/api/time-tickers");
  }

  async getCronTickers() {
    return this.request<any>("/api/cron-tickers");
  }

  async getTickerHostStatus() {
    return this.request<any>("/api/ticker-host/:status");
  }

  async startTickerHost() {
    return this.request<any>("/api/ticker-host/:start", { method: "POST" });
  }

  async stopTickerHost() {
    return this.request<any>("/api/ticker-host/:stop", { method: "POST" });
  }

  async getTickerStatuses() {
    return this.request<any>("/api/ticker/statuses/:get");
  }

  // Media Assets
  async uploadApartmentPhoto(apartmentId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const config: RequestInit = {
      method: "POST",
      body: formData,
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    };

    return this.request<any>(
      `/api/MediaAssets/upload-apartment-photo?apartmentId=${apartmentId}`,
      config
    );
  }
}

export const apiService = new ApiService();
