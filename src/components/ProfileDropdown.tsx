import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const ProfileDropdown = () => {
  const { patient, logout } = useAuth();
  const navigate = useNavigate();

  if (!patient) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    return `${patient.first_name[0]}${patient.last_name[0]}`.toUpperCase();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-ring rounded-full">
          <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
            <AvatarImage src={patient.profile_picture_url || undefined} alt={`${patient.first_name} ${patient.last_name}`} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={patient.profile_picture_url || undefined} alt={`${patient.first_name} ${patient.last_name}`} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {patient.first_name} {patient.last_name}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">
              ID: {patient.patient_id}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </PopoverContent>
    </Popover>
  );
};
