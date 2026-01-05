/**
 * DoctorResolver Service
 * 
 * Resolves the Doctor ID for a logged-in user by bridging the gap between
 * UserId (from GetProfile) and DoctorId (required for appointments, patients, etc.)
 * 
 * Features:
 * - Smart caching with userId validation
 * - Automatic cache invalidation on user change
 * - Robust error handling
 * - Cross-device safe
 */

import { authService } from "./auth.service";
import { doctorService } from "./doctor.service";
import { doctorLogger } from "@/lib/utils/logger";

const CACHE_KEY = "doctor_id_cache";

interface DoctorIdCache {
    userId: number;
    doctorId: number;
    timestamp: number;
}

export class DoctorResolver {
    /**
     * Resolves the DoctorId for the currently logged-in user
     * 
     * Strategy:
     * 1. Check if cache exists (fast path)
     * 2. Validate cache with current user if possible
     * 3. If invalid/missing, fetch from API
     * 4. Update cache and return
     * 
     * @returns Promise<number | null> - DoctorId or null if not found
     */
    static async resolve(): Promise<number | null> {
        try {
            // Step 1: Check cache first (fast path)
            const cachedData = this.getCachedData();
            
            // Step 2: Try to get current user profile
            let profile;
            try {
                profile = await authService.getProfile();
            } catch (profileError) {
                doctorLogger.warn("DoctorResolver", "Could not fetch profile:", profileError);
                // Profile alınamadı ama cache varsa, cache'i kullan
                if (cachedData && cachedData.doctorId) {
                    doctorLogger.info("DoctorResolver", "Using cached doctorId despite profile error:", cachedData.doctorId);
                    return cachedData.doctorId;
                }
                return null;
            }

            if (!profile || !profile.id) {
                doctorLogger.warn("DoctorResolver", "No valid profile found");
                // Cache varsa kullan
                if (cachedData && cachedData.doctorId) {
                    doctorLogger.info("DoctorResolver", "Using cached doctorId despite no profile:", cachedData.doctorId);
                    return cachedData.doctorId;
                }
                return null;
            }

            const currentUserId = profile.id;
            doctorLogger.debug("DoctorResolver", "Resolving for userId:", currentUserId);

            // Step 3: Check cache validity with current user
            if (cachedData && cachedData.userId === currentUserId) {
                doctorLogger.debug("DoctorResolver", "Cache hit! DoctorId:", cachedData.doctorId);
                return cachedData.doctorId;
            }

            if (cachedData && cachedData.userId !== currentUserId) {
                doctorLogger.debug("DoctorResolver", "Cache invalid (user mismatch), clearing...");
                this.clear();
            }

            // Step 4: Fetch from API (cache miss or invalid)
            doctorLogger.debug("DoctorResolver", "Cache miss, fetching from API...");
            const doctorId = await this.fetchDoctorId(profile);

            if (doctorId) {
                // Step 5: Update cache
                this.setCachedData({
                    userId: currentUserId,
                    doctorId: doctorId,
                    timestamp: Date.now(),
                });
                doctorLogger.info("DoctorResolver", "Resolved and cached DoctorId:", doctorId);
            } else {
                doctorLogger.warn("DoctorResolver", "Could not resolve DoctorId for user:", currentUserId);
            }

            return doctorId;

        } catch (error) {
            doctorLogger.error("DoctorResolver", "Error during resolution:", error);
            // Son çare olarak cache'i dene
            const cachedData = this.getCachedData();
            if (cachedData && cachedData.doctorId) {
                doctorLogger.info("DoctorResolver", "Returning cached doctorId after error:", cachedData.doctorId);
                return cachedData.doctorId;
            }
            return null;
        }
    }

    /**
     * Fetches DoctorId from API using the bridge strategy
     * 
     * Strategy:
     * 1. Search doctors by fullName from profile (if available)
     * 2. If no name, search all doctors
     * 3. For each candidate, get detailed info
     * 4. Match by userId
     * 
     * @param profile - User profile from GetProfile
     * @returns Promise<number | null>
     */
    private static async fetchDoctorId(profile: any): Promise<number | null> {
        try {
            // FIRST: Check if we have it in cache already
            const cachedData = this.getCachedData();
            if (cachedData && cachedData.userId === profile.id) {
                doctorLogger.info("DoctorResolver", "Using cached doctorId from previous successful resolution:", cachedData.doctorId);
                return cachedData.doctorId;
            }

            // Construct full name for search
            const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

            let candidates: any[] = [];

            if (fullName) {
                doctorLogger.debug("DoctorResolver", "Searching doctors with name:", fullName);

                // Search for doctors matching the name
                const searchResult = await doctorService.getDoctors({
                    fullName: fullName,
                    specialization: "", // Empty to match any specialization
                    pageNumber: 1,
                    pageSize: 10, // Limit to 10 candidates
                });

                candidates = searchResult.data || [];
            }
            
            // İsim boş veya isim bazlı aramada sonuç yoksa, tüm doktorları çek
            if (candidates.length === 0) {
                doctorLogger.debug("DoctorResolver", "Name search failed, fetching all doctors to find by userId...");
                
                const allDoctorsResult = await doctorService.getDoctors({
                    fullName: "", // Boş bırak - tüm doktorları getir
                    specialization: "",
                    pageNumber: 1,
                    pageSize: 100, // Daha fazla doktor çek
                });
                
                candidates = allDoctorsResult.data || [];
            }

            doctorLogger.debug("DoctorResolver", `Found ${candidates.length} candidates`);

            if (candidates.length === 0) {
                return null;
            }

            // Check each candidate by fetching detailed info
            for (const candidate of candidates) {
                try {
                    doctorLogger.debug("DoctorResolver", `Checking candidate ID: ${candidate.id}`);

                    const doctorDetails = await doctorService.getDoctorById(candidate.id);

                    // Check if this doctor's userId matches current user
                    if (doctorDetails && doctorDetails.userId === profile.id) {
                        doctorLogger.info("DoctorResolver", "Match found! DoctorId:", doctorDetails.id);
                        return doctorDetails.id;
                    }
                } catch (err) {
                    doctorLogger.warn("DoctorResolver", `Error fetching details for ${candidate.id}:`, err);
                    // Continue to next candidate
                }
            }

            doctorLogger.warn("DoctorResolver", "No matching doctor found among candidates");
            return null;

        } catch (error) {
            doctorLogger.error("DoctorResolver", "Error in fetchDoctorId:", error);
            return null;
        }
    }

    /**
     * Retrieves cached data from localStorage
     */
    private static getCachedData(): DoctorIdCache | null {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const data = JSON.parse(cached) as DoctorIdCache;

            // Optional: Add cache expiration (e.g., 24 hours)
            const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
            if (Date.now() - data.timestamp > MAX_AGE) {
                doctorLogger.debug("DoctorResolver", "Cache expired, clearing...");
                this.clear();
                return null;
            }

            return data;
        } catch (error) {
            doctorLogger.error("DoctorResolver", "Error reading cache:", error);
            return null;
        }
    }

    /**
     * Saves data to cache
     */
    private static setCachedData(data: DoctorIdCache): void {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (error) {
            doctorLogger.error("DoctorResolver", "Error writing cache:", error);
        }
    }

    /**
     * Clears the cache
     * Call this on logout or when you need to force re-resolution
     */
    static clear(): void {
        try {
            localStorage.removeItem(CACHE_KEY);
            doctorLogger.debug("DoctorResolver", "Cache cleared");
        } catch (error) {
            doctorLogger.error("DoctorResolver", "Error clearing cache:", error);
        }
    }

    /**
     * Gets the cached doctorId without making API calls
     * Returns null if cache is invalid or missing
     * 
     * Useful for quick synchronous access when you're sure cache is valid
     */
    static getCachedDoctorId(): number | null {
        const cached = this.getCachedData();
        return cached?.doctorId || null;
    }
}

export const doctorResolver = DoctorResolver;
