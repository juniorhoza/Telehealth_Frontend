import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  uuid: string;
  email: string;
  full_name: string;
  role: string;
}

interface RegisterData {
  name: string;
  email: string;
  password?: string;
  dob?: string;
  gender?: string;
  heightCm?: string;
  insuranceStatus?: string;
  emergencyName?: string;
  emergencyPhone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void; // Will take data after OTP verify
  signup: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Home.tsx handles the fetch; this saves the successful result.
  const login = (token: string, userData: User) => {
    // CRITICAL: We save to localStorage FIRST so it's available for the Dashboard fetch
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Then update the React state
    setUser(userData);
    console.log("AuthContext: Token and User saved to storage.");
  };

  const signup = async (data: RegisterData) => {
    const response = await fetch(
      "http://127.0.0.1:8000/v1/api/auth/register/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.name.split(" ")[0], // Django User model requires first_name
          last_name: data.name.split(" ").slice(1).join(" "),
          email: data.email,
          password: data.password,
          date_of_birth: data.dob, // Maps to PatientProfile
          gender: data.gender,
          height_cm: data.heightCm,
          insurance_status: data.insuranceStatus, // Matches INSURANCE_STATUS_CHOICES
          emergency_contact_name: data.emergencyName,
          emergency_contact_phone: data.emergencyPhone,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration failed");
    }
    // Backend register view triggers an OTP; user is not logged in yet
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
