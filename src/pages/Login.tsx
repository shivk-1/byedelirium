import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [patientId, setPatientId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (patientId.length !== 10) {
      toast.error("Patient ID must be exactly 10 digits");
      return;
    }

    setIsLoading(true);
    const result = await login(patientId, firstName, lastName);
    setIsLoading(false);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-3">ByeDelirium</h1>
          <p className="text-muted-foreground text-lg">Your Personal Health Companion</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Patient Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="patientId">Hospital Unit Number / Patient ID</Label>
              <Input
                id="patientId"
                type="text"
                placeholder="Enter 10-digit ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
