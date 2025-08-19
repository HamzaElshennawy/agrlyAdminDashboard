import {
    User,
    Apartment,
    Category,
    Transaction,
    ApiResponse,
    LoginRequest,
    LoginResponse,
} from "../types/api";

//const API_BASE_URL = " https://agrly.runasp.net";
const API_BASE_URL = "https://localhost:7202";

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
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await this.request<LoginResponse>(
            "/api/AuthenticateUser/auth",
            {
                method: "POST",
                body: JSON.stringify(credentials),
            }
        );
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
    async getUsers(): Promise<User[]> {
        return this.request<User[]>("/api/Users/getallusers");
    }

    async getUser(id: number): Promise<User> {
        return this.request<User>(`/api/Users/getuser/${id}`);
    }

    async createUser(user: User): Promise<ApiResponse<User>> {
        return this.request<ApiResponse<User>>("/api/Users/adduser", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json-patch+json",
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
            },
            body: JSON.stringify(user),
        });
    }

    async deleteUser(id: number): Promise<ApiResponse<null>> {
        return this.request<ApiResponse<null>>(`/api/Users/deleteuser/${id}`, {
            method: "DELETE",
        });
    }
    async editUser(user: User): Promise<ApiResponse<User>> {
        return this.request<ApiResponse<User>>(`/api/Users/updateuser`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json-patch+json",
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
            },
            body: JSON.stringify(user),
        });
    }

    // Apartments
    async getApartments(): Promise<Apartment[]> {
        return this.request<Apartment[]>("/api/Apartments");
    }

    async getApartment(id: number): Promise<Apartment> {
        return this.request<Apartment>(`/api/Apartments/${id}`);
    }

    async createApartment(
        apartment: Apartment
    ): Promise<ApiResponse<Apartment>> {
        return this.request<ApiResponse<Apartment>>("/api/Apartments", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json-patch+json",
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
            },
            body: JSON.stringify(apartment),
        });
    }

    async updateApartment(
        id: number,
        apartment: Apartment
    ): Promise<ApiResponse<Apartment>> {
        // apartment without aparmenttags

        return this.request<ApiResponse<Apartment>>(`/api/Apartments/${id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json-patch+json",
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
            },
            body: JSON.stringify({
                id: apartment.id,
                ownerId: apartment.ownerId,
                title: apartment.title,
                description: apartment.description,
                location: apartment.location,
                pricePerNight: apartment.pricePerNight,
                bedrooms: apartment.bedrooms,
                maxGuests: apartment.maxGuests,
                squareMeter: apartment.squareMeter,
                amenities: apartment.amenities,
                availabilityStatus: apartment.availabilityStatus,
                minimumStay: apartment.minimumStay,
                addressLine1: apartment.addressLine1,
                addressLine2: apartment.addressLine2,
                city: apartment.city,
                state: apartment.state,
                country: apartment.country,
                postalCode: apartment.postalCode,
                latitude: apartment.latitude,
                longitude: apartment.longitude,
                propertyType: apartment.propertyType,
                instantBook: apartment.instantBook,
                rating: apartment.rating,
                photos: apartment.photos,
            }),
        });
    }

    async deleteApartment(id: number): Promise<ApiResponse<null>> {
        return this.request<ApiResponse<null>>(`/api/Apartments/${id}`, {
            method: "DELETE",
        });
    }

    async searchApartments(
        query: string,
        currentPage = 0
    ): Promise<ApiResponse<Apartment[]>> {
        return this.request<ApiResponse<Apartment[]>>(
            `/api/Apartments/search?query=${query}&currentPage=${currentPage}`
        );
    }

    // Categories
    async getCategories(): Promise<Category[]> {
        return this.request<Category[]>("/api/Apartments/categories");
    }

    async createCategory(category: Category): Promise<ApiResponse<Category>> {
        return this.request<ApiResponse<Category>>(
            "/api/Apartments/categories/add",
            {
                method: "POST",
                body: JSON.stringify(category),
            }
        );
    }

    async deleteCategory(id: number): Promise<ApiResponse<null>> {
        return this.request<ApiResponse<null>>(
            `/api/Apartments/categories/${id}`,
            {
                method: "DELETE",
            }
        );
    }

    async updateCategory(category: Category): Promise<ApiResponse<Category>> {
        return this.request<ApiResponse<Category>>(
            `/api/Apartments/categories/update`,
            {
                method: "PUT",
                body: JSON.stringify(category),
            }
        );
    }

    // Transactions
    async getTransactions(): Promise<Transaction[]> {
        return this.request<Transaction[]>("/api/Transactions");
    }

    async getTransaction(id: number): Promise<Transaction> {
        return this.request<Transaction>(`/api/Transactions/${id}`);
    }

    async createTransaction(
        transaction: Transaction
    ): Promise<ApiResponse<Transaction>> {
        return this.request<ApiResponse<Transaction>>(
            "/api/Transactions/create-transaction",
            {
                method: "POST",
                body: JSON.stringify(transaction),
            }
        );
    }

    // TickerQ
    //async getTimeTickers() {
    //  return this.request<any>("/api/time-tickers");
    //}

    //async getCronTickers() {
    //  return this.request<any>("/api/cron-tickers");
    //}

    //async getTickerHostStatus() {
    //  return this.request<any>("/api/ticker-host/:status");
    //}

    //async startTickerHost() {
    //  return this.request<any>("/api/ticker-host/:start", { method: "POST" });
    //}

    //async stopTickerHost() {
    //  return this.request<any>("/api/ticker-host/:stop", { method: "POST" });
    //}

    //async getTickerStatuses() {
    //  return this.request<any>("/api/ticker/statuses/:get");
    //}

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

        return this.request<ApiResponse<Apartment>>(
            `/api/MediaAssets/upload-apartment-photo?apartmentId=${apartmentId}`,
            config
        );
    }
}

export const apiService = new ApiService();
